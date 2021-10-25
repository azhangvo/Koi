import Command from "../core/Command";
import Store from "../core/Store";
import { Message } from "discord.js";
import { createBaseEmbed } from "../util/Messages";
import Constants from "../core/Constants";
import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { Track } from "./Track";

class NowPlayingCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "nowplaying", 0, "np");
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        if (!msg.guildId)
            return;
        let contract = this.store.music_contracts[msg.guildId];

        if (!contract) {
            msg.channel.send(createBaseEmbed("I'm not connected to a voice channel", Constants.red));
            return;
        }

        let current: string;
        if (contract.audioPlayer.state.status === AudioPlayerStatus.Idle)
            current = `Nothing is currently playing!`;
        else {
            const track = (contract.audioPlayer.state.resource as AudioResource<Track>).metadata;
            const timeElapsed = (contract.audioPlayer.state.resource as AudioResource<Track>).playbackDuration / 1000;
            current = `Playing \`${track.title}\` (${Math.floor(timeElapsed / 60)}:${(Math.round(timeElapsed) % 60).toLocaleString("en-US", { minimumIntegerDigits: 2 })}/${Math.floor(parseInt(track.videoDetails.lengthSeconds) / 60)}:${(parseInt(track.videoDetails.lengthSeconds) % 60).toLocaleString("en-US", { minimumIntegerDigits: 2 })})`;
        }
        await msg.channel.send(createBaseEmbed(current, Constants.orange));
    }
}

export default NowPlayingCommand;