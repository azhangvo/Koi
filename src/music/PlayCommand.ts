import Command from "../core/Command";
import Store from "../core/Store";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import { ArgumentParser, Namespace } from "argparse";
import Constants from "../core/Constants";
import ytdl from "ytdl-core";
import {
    AudioPlayerStatus,
    AudioResource,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from "@discordjs/voice";
import GuildContract from "./GuildContract";
import { Track } from "./Track";
import ParsedCommand from "../core/ParsedCommand";
import { createBaseEmbed } from "../util/Messages";
import { escapeMarkdown } from "../util/Inputs";

class PlayCommand extends ParsedCommand {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "play", 1, "p");
        this.parser.add_argument("song", { type: "str", nargs: "+" });
        this.parser.add_argument("-p", "--position", { type: "int" });
    }

    async execute_parsed(msg: Message, parsed_args: Namespace): Promise<boolean> {
        if (!msg.member || !msg.guildId) return true;
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) {
            msg.channel.send(createBaseEmbed("You need to be in a voice channel to play music", Constants.red));
            return true;
        }
        const permissions = voiceChannel.permissionsFor(msg.member);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            msg.channel.send(createBaseEmbed("I need the permissions to join and speak in your voice channel", Constants.red));
            return true;
        }

        let song_name = parsed_args["song"].join(" ");

        if (song_name === "")
            return false;

        let contract = this.store.music_contracts[msg.guildId];

        if (!contract) {
            if (msg.member.voice.channel) {
                const channel = msg.member.voice.channel;
                contract = new GuildContract(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    }),
                );
                contract.voiceConnection.on("error", console.warn);
                this.store.music_contracts[msg.guildId] = contract;
            }
        }

        // If there is no subscription, tell the user they need to join a channel.
        if (!contract) {
            await msg.channel.send(createBaseEmbed("Join a voice channel and then try that again!", Constants.red));
            return true;
        }

        // Make sure the connection is ready before processing the user's request
        try {
            await entersState(contract.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
        } catch (error) {
            console.warn(error);
            await msg.channel.send(createBaseEmbed("Failed to join voice channel within 20 seconds, please try again later!", Constants.red));
            return true;
        }

        let search_message = msg.channel.send(createBaseEmbed(`Searching for \`${escapeMarkdown(song_name)}\``, Constants.orange));
        try {
            // Attempt to create a Track from the user's video search
            const track = await Track.search(parsed_args["song"].join(" "), {
                onStart(t: Track) {
                    msg.channel.send(createBaseEmbed(`Now playing \`${escapeMarkdown(t.title)}\``, Constants.orange));
                },
                onFinish(t: Track) {
                    // msg.channel.send(createBaseEmbed(`Now finished ${t.title}`, Constants.orange));
                    // interaction.followUp({ content: 'Now finished!', ephemeral: true }).catch(console.warn);
                },
                onError(error) {
                    msg.channel.send(`Error while playing.`);
                    console.warn(error);
                    // interaction.followUp({ content: `Error: ${error.message}`, ephemeral: true }).catch(console.warn);
                },
            });
            // Enqueue the track and reply a success message to the user
            contract.enqueue(track);
            await (await search_message).edit(createBaseEmbed(`Queuing \`${escapeMarkdown(track.title)}\``, Constants.orange));
        } catch (error) {
            console.warn(error);
            await (await search_message).edit(createBaseEmbed(`Failed to play \`${escapeMarkdown(song_name)}\`. Please try again later.`, Constants.orange));
        }
        return true;
    }
}

export default PlayCommand;
