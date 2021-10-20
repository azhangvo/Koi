import { getInfo, MoreVideoDetails } from "ytdl-core";
import yts from 'yt-search';
import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import { raw as ytdl } from 'youtube-dl-exec';

/**
 * This is the data required to create a Track object
 */
export interface TrackData {
    url: string;
    title: string;
    videoDetails: MoreVideoDetails;
    onStart: (t: Track) => void;
    onFinish: (t: Track) => void;
    onError: (error: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
export class Track implements TrackData {
    public readonly url: string;
    public readonly title: string;
    public readonly videoDetails: MoreVideoDetails;
    public readonly onStart: (t: Track) => void;
    public readonly onFinish: (t: Track) => void;
    public readonly onError: (error: Error) => void;

    private constructor({ url, title, videoDetails, onStart, onFinish, onError }: TrackData) {
        this.url = url;
        this.title = title;
        this.videoDetails = videoDetails;
        this.onStart = onStart;
        this.onFinish = onFinish;
        this.onError = onError;
    }

    /**
     * Creates an AudioResource from this Track.
     */
    public createAudioResource(): Promise<AudioResource<Track>> {
        return new Promise((resolve, reject) => {
            const process = ytdl(
                this.url,
                {
                    o: '-',
                    q: '',
                    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                    r: '100K',
                },
                { stdio: ['ignore', 'pipe', 'ignore'] },
            );
            if (!process.stdout) {
                reject(new Error('No stdout'));
                return;
            }
            const stream = process.stdout;
            const onError = (error: Error) => {
                if (!process.killed) process.kill();
                stream.resume();
                reject(error);
            };
            process
                .once('spawn', () => {
                    demuxProbe(stream)
                        .then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
                        .catch(onError);
                })
                .catch(onError);
        });
    }

    public static async search(search: string, methods: Pick<Track, 'onStart' | 'onFinish' | 'onError'>): Promise<Track> {
        const videos = await yts(search)
        const result = videos.videos[0]

        return await Track.from(result.url, methods)
    }

    /**
     * Creates a Track from a video URL and lifecycle callback methods.
     *
     * @param url The URL of the video
     * @param methods Lifecycle callbacks
     * @returns The created Track
     */
    public static async from(url: string, methods: Pick<Track, 'onStart' | 'onFinish' | 'onError'>): Promise<Track> {
        const info = await getInfo(url);

        // The methods are wrapped so that we can ensure that they are only called once.
        const wrappedMethods = {
            onStart(t: Track) {
                wrappedMethods.onStart = noop;
                methods.onStart(t);
            },
            onFinish(t: Track) {
                wrappedMethods.onFinish = noop;
                methods.onFinish(t);
            },
            onError(error: Error) {
                wrappedMethods.onError = noop;
                methods.onError(error);
            },
        };

        return new Track({
            title: info.videoDetails.title,
            url,
            videoDetails: info.videoDetails,
            ...wrappedMethods,
        });
    }
}