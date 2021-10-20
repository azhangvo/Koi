import ParsedCommand from "../core/ParsedCommand";
import Store from "../core/Store";
import { Namespace } from "argparse";
import { Message, MessageEmbed } from "discord.js";
import { createBaseEmbed } from "../util/Messages";
import Constants from "../core/Constants";
import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { Track } from "./Track";

class QueueCommand extends ParsedCommand {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "queue", 1, "q");
        this.parser.add_argument("page", { type: "int", nargs: "?", default: 1 });
    }

    async execute_parsed(msg: Message, parsed_args: Namespace): Promise<boolean> {
        if (!msg.guildId)
            return true;
        let contract = this.store.music_contracts[msg.guildId];

        if (!contract) {
            msg.channel.send(createBaseEmbed("I'm not connected to a voice channel", Constants.red));
            return true;
        }

        let page = parsed_args["page"];
        if (page <= 0) {
            msg.channel.send(createBaseEmbed("That's not a valid page number", Constants.red));
            return true;
        }

        const queue = contract.queue;
        if (page * 10 > queue.length) {
            page = Math.floor(queue.length / 10) + 1;
        }

        const current =
            contract.audioPlayer.state.status === AudioPlayerStatus.Idle
                ? `Nothing is currently playing!`
                : `Playing \`${(contract.audioPlayer.state.resource as AudioResource<Track>).metadata.title}\``;

        const queue_display = queue
            .slice((page - 1) * 10, page * 10)
            .map((track, index) => `${index + 1 + (page - 1) * 10}) \`${track.title}\` - (${Math.floor(parseInt(track.videoDetails.lengthSeconds) / 60)}:${(parseInt(track.videoDetails.lengthSeconds) % 60).toLocaleString("en-US", { minimumIntegerDigits: 2 })})`)
            .join("\n");

        await msg.channel.send({
            embeds: [new MessageEmbed({
                description: `${current}\n\n${queue_display}`,
                color: Constants.orange,
                footer: { text: `Queue | Page ${page}/${Math.floor(queue.length / 10) + 1}` },
            })],
        });

        return true;
    }
}

export default QueueCommand;