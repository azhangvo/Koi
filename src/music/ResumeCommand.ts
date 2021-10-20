import Command from "../core/Command";
import Store from "../core/Store";
import { Message } from "discord.js";
import { createBaseEmbed } from "../util/Messages";
import Constants from "../core/Constants";
import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";

class ResumeCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "resume", 0);
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        if (!msg.guildId)
            return;
        let contract = this.store.music_contracts[msg.guildId];

        if (!contract) {
            msg.channel.send(createBaseEmbed("I'm not connected to a voice channel", Constants.red));
            return;
        }

        if (msg.member?.voice.channel?.id !== contract.voiceConnection.joinConfig.channelId) {
            msg.channel.send(createBaseEmbed("You must be in the voice channel to resume", Constants.red));
            return;
        }

        if (contract.audioPlayer.state.status === AudioPlayerStatus.Idle) {
            msg.channel.send(createBaseEmbed("Nothing to resume", Constants.red));
            return;
        }

        msg.channel.send(createBaseEmbed(`Resumed playing ${contract.playing?.title}`, Constants.orange));
        contract.audioPlayer.unpause();
    }
}

export default ResumeCommand;