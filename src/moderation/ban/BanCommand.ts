import Command from "../../core/Command";
import { Message, MessageEmbed } from "discord.js";
import Store from "../../core/Store";
import Constants from "../../core/Constants";

class BanCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "ban", 1);
    }

    checkPermission(msg: Message) {
        if(msg.member == null) {
            return false
        }
        return msg.member.permissions.has("MANAGE_GUILD", true);
    }

    async execute(msg: Message, args: string | any[]) {
        if (args.length === 0) {
            await msg.channel.send(
                new MessageEmbed({
                    color: 0x89023e,
                    description: "Usage: \`ban <id>\`"
                })
            );
        }

        if(msg.guild == null) {
            return
        }

        let user = msg.guild.members.resolve(args[0]);
        if (user) {
            msg.guild.members
                .ban(user)
                .then(() => {
                    if(user) {
                        msg.channel.send(
                            new MessageEmbed({
                                color: Constants.black,
                                description: `Banned! Goodbye ${user.toString()}`,
                            })
                        );
                    } else {
                        msg.channel.send(
                            new MessageEmbed({
                                color: Constants.red,
                                description: "Something went wrong..."
                            })
                        )
                    }
                })
                .catch(() => {
                    msg.channel.send(
                        new MessageEmbed({
                            color: Constants.red,
                            description: "No permission to ban",
                        })
                    );
                });
        }
    }
}

export default BanCommand;
