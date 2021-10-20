import Command from "../core/Command";
import Store from "../core/Store";
import { Message, MessageEmbed } from "discord.js";
import Constants from "../core/Constants";

class ServerConfigCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "config", 2, "sc", "serverconfig");
    }

    checkPermission(msg: Message) {
        if (!msg.member) return false;
        return msg.member.permissions.has("MANAGE_GUILD", true);
    }

    async execute(msg: Message, args: string[]) {
        if (!msg.guild) return;

        if(args.length !== 2) {
            await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: Constants.red,
                        description: `This command requires two arguments, the option to set, and the value to set it to. The current options are \`channels.suggestions\`.`,
                    }),
                ],
            });
            return
        }

        if (this.store.setServerConfig(msg.guild, args[0], args[1])) {
            await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: Constants.black,
                        description: `Successfully set ${args[0]} to ${args[1]}`,
                    }),
                ],
            });
        } else {
            await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: Constants.red,
                        description: `Failed to set ${args[0]} to ${args[1]}. Perhaps check your spelling?`,
                    }),
                ],
            });
        }
    }
}

export default ServerConfigCommand;
