import Command from "../../core/Command";
import {
    DMChannel,
    Message,
    MessageEmbed,
    TextChannel,
    ThreadChannel,
} from "discord.js";
import Store from "../../core/Store";

class PurgeCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "purge", 1, "delete");
    }

    checkPermission(msg: Message): boolean {
        if (msg.member == null) return false;
        return msg.member.permissions.has("MANAGE_MESSAGES");
    }

    async execute(msg: Message, args: string[]) {
        let delete_promise = msg.delete();

        let purge_amount = parseInt(args[0]);
        if (isNaN(purge_amount) || purge_amount <= 0) {
            let reply = await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        description: `\`${args[0]}\` is not a valid input`,
                    }),
                ],
            });
            setTimeout(() => reply.delete(), 5000);
        } else {
            await delete_promise;

            purge_amount = Math.min(purge_amount, 50);
            if (
                msg.channel instanceof TextChannel ||
                msg.channel instanceof ThreadChannel
            ) {
                await msg.channel.bulkDelete(purge_amount);
                let reply = await msg.channel.send({
                    embeds: [
                        new MessageEmbed({
                            description: `Purged ${purge_amount} messages.`,
                            color: 0x2f2f2f,
                        }),
                    ],
                });
                setTimeout(() => reply.delete(), 5000);
            }
        }
    }
}

export default PurgeCommand;
