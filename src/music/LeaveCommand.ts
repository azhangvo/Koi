import Command from "../core/Command";
import Store from "../core/Store";
import { Message, Permissions } from "discord.js";
import { createBaseEmbed } from "../util/Messages";
import Constants from "../core/Constants";

class LeaveCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "leave", 0);
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
            msg.channel.send(createBaseEmbed("You must be in the voice channel to pause", Constants.red));
            return;
        }

        if (msg.member.voice.channel.members.size > 1) {
            if (msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                contract.voiceConnection.destroy();
                delete this.store.music_contracts[msg.guildId];
                msg.channel.send(createBaseEmbed("Forcefully left voice channel", Constants.black));
                return;
            }
            msg.channel.send(createBaseEmbed("Cannot leave channel as there are multiple users in the channel", Constants.red));
            return;
        }

        contract.voiceConnection.destroy();
        delete this.store.music_contracts[msg.guildId];
        msg.channel.send(createBaseEmbed("Left voice channel", Constants.black));
    }
}

export default LeaveCommand;