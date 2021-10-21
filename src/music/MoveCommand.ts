import ParsedCommand from "../core/ParsedCommand";
import Store from "../core/Store";
import { Namespace } from "argparse";
import { Message, MessageEmbed } from "discord.js";
import { createBaseEmbed } from "../util/Messages";
import Constants from "../core/Constants";
import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { Track } from "./Track";

class MoveCommand extends ParsedCommand {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "move", 2, "m");
        this.parser.add_argument("song", { type: "int", nargs: 1 });
        this.parser.add_argument("position", { type: "int", nargs: "?", default: 1 });
    }

    async execute_parsed(msg: Message, parsed_args: Namespace): Promise<boolean> {
        if (!msg.guildId)
            return true;
        let contract = this.store.music_contracts[msg.guildId];

        if (!contract) {
            msg.channel.send(createBaseEmbed("I'm not connected to a voice channel", Constants.red));
            return true;
        }

        if (msg.member?.voice.channel?.id !== contract.voiceConnection.joinConfig.channelId) {
            msg.channel.send(createBaseEmbed("You must be in the voice channel to move songs", Constants.red));
            return true;
        }

        let song = parsed_args["song"];
        if (song <= 0) {
            msg.channel.send(createBaseEmbed("That's not a valid song number", Constants.red));
            return true;
        }

        let position = parsed_args["position"];
        if (position <= 0) {
            msg.channel.send(createBaseEmbed("That's not a valid positionnumber", Constants.red));
            return true;
        }

        song = Math.min(song, contract.queue.length);
        position = Math.min(position, contract.queue.length);

        if(song === position) {
            msg.channel.send(createBaseEmbed("No change made", Constants.red));
            return true;
        }

        const track = contract.queue[song - 1];

        contract.queue.splice(song - 1, 1);

        contract.queue.splice(position - 1, 0, track);

        await msg.channel.send(createBaseEmbed(`Moved \`${track.title}\` to position **${position}**`, Constants.orange));

        // TODO: Add an undo interaction button

        return true;
    }
}

export default MoveCommand;