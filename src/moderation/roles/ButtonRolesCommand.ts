import Command from "../../core/Command.js";
import { Message, MessageEmbed } from "discord.js";

class ButtonRolesCommand extends Command {
    constructor(store, prefix) {
        super(store, prefix, "roles", 1);
    }

    checkPermission(msg) {
        return msg.member.permissions.has("MANAGE_MESSAGES");
    }

    async execute(msg, args) {
        if (args.length === 0) {
            await msg.channel.send(
                new MessageEmbed({
                    color: 0x89023e,
                    description:
                        "Available commands are `roles setup`, `roles reload`, `roles add`, and `roles remove`",
                })
            );
        } else if (args.length === 1) {
            switch (args[0]) {
                case "setup":
                    await msg.channel.send(
                        new MessageEmbed({
                            color: 0x89023e,
                            description:
                                "Usage: `roles setup <channel id> [force]`",
                        })
                    );
                    if (this.store.getServerConfig(msg.guild, "") === null) {
                        await msg.channel.send(
                            new MessageEmbed({
                                color: 0x2f2f2f,
                                description:
                                    "Setting up...",
                            })
                        );
                    } else {

                    }
                    break;
                case "add":
                    await msg.channel.send(
                        new MessageEmbed({
                            color: 0x89023e,
                            description:
                                "Usage: `roles add <category> <display name> <role id>`",
                        })
                    );
                    break;
                case "remove":
                    await msg.channel.send(
                        new MessageEmbed({
                            color: 0x89023e,
                            description: "Usage: `roles remove <display name>`",
                        })
                    );
                    break;
                default:
                    await msg.channel.send(
                        new MessageEmbed({
                            color: 0x89023e,
                            description: `\`${args[0]}\` is not a recognized command`,
                        })
                    );
                    break;
            }
        } else if (args.length === 2) {
            switch (args[0]) {
                case "setup":
                    if (this.store.getServerConfig(msg.guild, "") === null) {
                        await msg.channel.send(
                            new MessageEmbed({
                                color: 0x2f2f2f,
                                description:
                                    "Setting up...",
                            })
                        );
                    } else {
                        await msg.channel.send(
                            new MessageEmbed({
                                color: 0x89023e,
                                description:
                                    `Roles message already exists. You must force the command if you would like to continue.\nUsage: \`roles setup ${args[1]} force\``,
                            })
                        );
                    }
                    break;
                case "add":
                    await msg.channel.send(
                        new MessageEmbed({
                            color: 0x89023e,
                            description:
                                `Usage: \`roles add ${args[1]} <display name> <id>\``,
                        })
                    );
                    break;
                case "remove":
                    if (this.store.getServerConfig(msg.guild, "reactroles.") === null) {
                        await msg.channel.send(
                            new MessageEmbed({
                                color: 0x89023e,
                                description:
                                    `The role \`${args[1]}\` was not found. Make sure you are using a display name, not an ID.`,
                            })
                        );
                    }
                    break;
                default:
                    await msg.channel.send(
                        new MessageEmbed({
                            color: 0x89023e,
                            description: `\`${args[0]}\` is not a recognized command`,
                        })
                    );
                    break;
            }
        } else if (args.length === 3) {

        } else if (args.length === 4) {
            switch(args[0]) {
                case "add":
                    let progressMessage = await msg.channel.send(
                        new MessageEmbed({
                            color: 0x2f2f2f,
                            description:
                                "Adding...",
                        })
                    );
                    let roles = this.store.getServerConfig(msg.guild, "buttonroles.roles") // Dictionary with category: [ [ name, id ] ]
                    for (let category in roles.keys()) {

                    }
            }
        }
    }
}

export default ButtonRolesCommand;
