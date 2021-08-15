import Command from "../../core/Command.ts";
import { MessageEmbed } from "discord.js";

class BanCommand extends Command {
    constructor(store, prefix) {
        super(store, prefix, "ban", 1);
    }

    checkPermission(msg) {
        return msg.member.permissions.has("MANAGE_GUILD", true);
    }

    execute(msg, args) {
        if (args.length === 0) {
           msg.channel.send(new MessageEmbed({
               color: 0x89023e
           }))
        }

        let user = msg.guild.members.resolve(args[0]);
        if (user) {
            msg.guild.members.ban(user).then(() => {
                msg.channel.send(
                    new MessageEmbed({
                        color: 0x2F2F2F,
                        description: `Banned! Goodbye ${user.toString()}`,
                    })
                );
            }).catch(() => {
                msg.channel.send(
                    new MessageEmbed({
                        color: 0x89023e,
                        description: "No permission to ban",
                    })
                );
            });
        }
    }
}

export default BanCommand;
