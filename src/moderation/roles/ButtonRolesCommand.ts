import Command from "../../core/Command";
import {
    DiscordAPIError,
    GuildChannel,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    TextChannel,
    ThreadChannel,
} from "discord.js";
import Store from "../../core/Store";
import Constants from "../../core/Constants";

class ButtonRolesCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "roles", 4);
    }

    checkPermission(msg: Message) {
        if (msg.member) {
            return msg.member.permissions.has("MANAGE_GUILD");
        }
        return false;
    }

    generateButtonsMessage(
        category: string,
        options: string[][]
    ): { embeds: MessageEmbed[]; components: MessageActionRow[] } {
        let embed = new MessageEmbed()
            .setTitle(category)
            .setDescription(
                `\`${options.map((pair) => pair[0]).join("`, `")}\``
            )
            .setColor(Constants.white)
            .setAuthor(
                this.store
                    .get("info.usertag")
                    .split("#")
                    .slice(0, -1)
                    .join("#"),
                this.store.get("info.usericon")
            )
            .setFooter(`Koi Button Roles | ${category} category`);

        let components: MessageActionRow[] = [];
        let i = 0;
        let num_options = options.length;
        for (let j = 0; j < 5; j++) {
            if (i >= num_options) break;
            let row: MessageActionRow = new MessageActionRow();
            for (let k = 0; k < 5; k++) {
                if (i >= num_options) break;
                let button: MessageButton = new MessageButton()
                    .setCustomId(`buttonrole-${options[i][1]}`)
                    .setLabel(`Toggle ${options[i][0]}`)
                    .setStyle("PRIMARY");
                row.addComponents(button);
                i++;
            }
            components.push(row);
        }

        return { embeds: [embed], components };
    }

    async execute(msg: Message, args: string[]) {
        if (args.length === 0) {
            await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: 0x89023e,
                        description:
                            "Available commands are `roles setup`, `roles reload`, `roles add`, and `roles remove`",
                    }),
                ],
            });
        } else if (args.length === 1) {
            switch (args[0]) {
                case "setup":
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description:
                                    "Usage: `roles setup <channel id> [force]`",
                            }),
                        ],
                    });
                    break;
                case "add":
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description:
                                    "Usage: `roles add <category> <display name> <role id>`",
                            }),
                        ],
                    });
                    return;
                case "remove":
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description:
                                    "Usage: `roles remove <display name>`",
                            }),
                        ],
                    });
                    return;
                case "reload": {
                    let stored_channel_id: string = this.store.getServerConfig(
                        msg.guild,
                        "buttonroles.channel"
                    );
                    try {
                        await msg.guild?.channels.fetch(stored_channel_id);
                    } catch (e) {
                        if (!(e instanceof DiscordAPIError)) {
                            throw e;
                        }
                    }
                    let channel:
                        | ThreadChannel
                        | GuildChannel
                        | null
                        | undefined =
                        msg.guild?.channels.resolve(stored_channel_id);

                    if (!channel) {
                        await msg.channel.send({
                            embeds: [
                                new MessageEmbed({
                                    color: Constants.red,
                                    description: `Channel is either not set or cannot be found by the bot. Use \`roles setup <channel id>\` to setup for the first time.`,
                                }),
                            ],
                        });
                        return;
                    }
                    if (!(channel instanceof TextChannel)) {
                        await msg.channel.send({
                            embeds: [
                                new MessageEmbed({
                                    color: Constants.red,
                                    description: `Channel \`${stored_channel_id}\` is not a text channel. How did this happen?`,
                                }),
                            ],
                        });
                        return;
                    }

                    let progressMessage = await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.orange,
                                description: "Reloading role buttons...",
                            }),
                        ],
                    });

                    let data = this.store.getServerConfig(
                        msg.guild,
                        "buttonroles.messages"
                    );

                    let roles_data = this.store.getServerConfig(
                        msg.guild,
                        "buttonroles.roles"
                    );

                    for (let category in data) {
                        if (!data.hasOwnProperty(category)) continue;
                        if (!roles_data.hasOwnProperty(category)) continue;
                        let messages: string[] = data[category];
                        for (let i = 0; i < messages.length; i++) {
                            if (i != 0) continue; // Since multiple messages are not currently supported for a single category
                            let message: string = messages[i];
                            try {
                                await channel.messages.fetch(message);
                            } catch (e) {
                                if (!(e instanceof DiscordAPIError)) throw e;
                            }
                            let oldMessage = channel.messages.resolve(message)
                            if (oldMessage) {
                                await oldMessage.edit(this.generateButtonsMessage(category, roles_data[category]))
                            } else {
                                let sentMessage = await channel.send(this.generateButtonsMessage(category, roles_data[category]))
                                data[category] = [sentMessage.id];
                            }
                        }
                    }

                    progressMessage.edit({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.black,
                                description: `Finished reloading up roles in #${channel.name}. Enjoy!`,
                            }),
                        ],
                    });
                    return;
                }
                default:
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description: `\`${args[0]}\` is not a recognized command`,
                            }),
                        ],
                    });
                    return;
            }
        } else if (args.length === 2) {
            switch (args[0]) {
                case "setup": {
                    await this.setup(msg, args[1], false);

                    return;
                }
                case "add": {
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description: `Usage: \`roles add ${args[1]} <display name> <id>\``,
                            }),
                        ],
                    });
                    return;
                }
                case "remove": {
                    let name = args.slice(1).join(" ");
                    await this.remove(msg, name);
                    return;
                }
                default: {
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description: `\`${args[0]}\` is not a recognized command`,
                            }),
                        ],
                    });
                    return;
                }
            }
        } else if (args.length === 3) {
            switch (args[0]) {
                case "add":
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description: `Usage: \`roles add ${args[1]} ${args[2]} <id>\``,
                            }),
                        ],
                    });
                    return;
                case "setup":
                    if (args[2] === "force")
                        await this.setup(msg, args[1], true);

                    return;
                default:
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.red,
                                description: `Unrecognized command`,
                            }),
                        ],
                    });
                    return;
            }
        } else if (args.length === 4) {
            switch (args[0]) {
                case "add":
                    let progressMessage = await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.black,
                                description: "Adding...",
                            }),
                        ],
                    });

                    let reconstruction = args[2] + " " + args[3];
                    let split = reconstruction.split(" ");
                    let category = args[1];
                    let id: string = split[split.length - 1];
                    let name: string = "";

                    if (split.length > 2) {
                        if (
                            split[0].startsWith('"') &&
                            split[split.length - 2].endsWith('"')
                        ) {
                            name = split.slice(0, -1).join(" ").slice(1, -1);
                        } else {
                            await progressMessage.edit({
                                embeds: [
                                    new MessageEmbed({
                                        color: Constants.red,
                                        description:
                                            "Something seems to be formatted wrong in your command.",
                                    }),
                                ],
                            });
                            return;
                        }
                    } else {
                        name = args[2];
                    }

                    if (!msg.guild?.roles.resolve(id)) {
                        await progressMessage.edit({
                            embeds: [
                                new MessageEmbed({
                                    color: Constants.red,
                                    description: `The id ${id} doesn't appear to correspond with a valid role.`,
                                }),
                            ],
                        });
                        return;
                    }

                    let data = this.store.getServerConfig(
                        msg.guild,
                        "buttonroles.roles"
                    ); // Dictionary with category: [ [ name, id ] ]

                    for (let itr_category in data) {
                        if (!data.hasOwnProperty(itr_category)) continue;
                        let roles: string[][] = data[itr_category];
                        for (let i in roles) {
                            if (roles[i][0] === name) {
                                await progressMessage.edit({
                                    embeds: [
                                        new MessageEmbed({
                                            color: Constants.red,
                                            description: `The role \`${roles[i][0]}\` seems to already exist and is linked to \`${roles[i][1]}\` in category \`${itr_category}\`.`,
                                        }),
                                    ],
                                });
                                return;
                            }
                            if (roles[i][1] === id) {
                                await progressMessage.edit({
                                    embeds: [
                                        new MessageEmbed({
                                            color: Constants.red,
                                            description: `Id \`${roles[i][1]}\` is already assigned to role \`${roles[i][0]}\` in category \`${itr_category}\`.`,
                                        }),
                                    ],
                                });
                                return;
                            }
                        }
                    }
                    if (!data.hasOwnProperty(category)) {
                        data[category] = [];
                    }
                    data[category].push([name, id]);

                    await progressMessage.edit({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.black,
                                description: `Successfully added \`${name} (${id})\` to \`${category}\`.`,
                            }),
                        ],
                    });
                    break;
                case "remove": {
                    let name = args.slice(1).join(" ");
                    await this.remove(msg, name);
                    return;
                }
                default:
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: 0x89023e,
                                description: `Unrecognized command`,
                            }),
                        ],
                    });
                    break;
            }
        }
    }

    async remove(msg: Message, name: string) {
        let data = this.store.getServerConfig(msg.guild, "buttonroles.roles");

        for (let itr_category in data) {
            if (!data.hasOwnProperty(itr_category)) continue;
            let roles: string[][] = data[itr_category];
            for (let i = 0; i < roles.length; i++) {
                if (roles[i][0] === name) {
                    roles.splice(i, 1);
                    if (data[itr_category].length === 0)
                        delete data[itr_category];
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.black,
                                description: `The role \`${name}\` was removed from \`${itr_category}\`.`,
                            }),
                        ],
                    });
                    return;
                }
            }
        }

        await msg.channel.send({
            embeds: [
                new MessageEmbed({
                    color: 0x89023e,
                    description: `The role \`${name}\` was not found. Make sure you are using a display name, not an ID.`,
                }),
            ],
        });
    }

    async setup(msg: Message, channel_id: string, force: boolean) {
        let stored_channel_id: string = this.store.getServerConfig(
            msg.guild,
            "buttonroles.channel"
        );
        try {
            await msg.guild?.channels.fetch(stored_channel_id);
        } catch (e) {
            if (!(e instanceof DiscordAPIError)) {
                throw e;
            }
        }
        let channel: ThreadChannel | GuildChannel | null | undefined =
            msg.guild?.channels.resolve(stored_channel_id);

        if (channel && stored_channel_id !== channel_id && !force) {
            await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: Constants.red,
                        description: `Channel is already set to ${stored_channel_id} which still exists, and the force flag was not set. You must force the command or delete channel if you would like to continue.\nUsage: \`roles setup ${channel_id} force\``,
                    }),
                ],
            });
            return;
        }

        channel = msg.guild?.channels.resolve(channel_id);
        if (!channel || !(channel instanceof TextChannel)) {
            await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: Constants.red,
                        description: `Channel \`${channel_id}\` does not exist or channel is not a text channel.`,
                    }),
                ],
            });
            return;
        }

        let data = this.store.getServerConfig(
            msg.guild,
            "buttonroles.messages"
        );

        let message_exists: boolean = false;
        for (let category in data) {
            if (!data.hasOwnProperty(category)) continue;
            let messages: string[] = data[category];
            for (let i in messages) {
                let message: string = messages[i];
                try {
                    if (await channel.messages.fetch(message)) {
                        message_exists = true;
                        break;
                    }
                } catch (e) {
                    if (!(e instanceof DiscordAPIError)) {
                        throw e;
                    }
                }
            }
        }
        if (message_exists && !force) {
            msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: Constants.red,
                        description: `One or more previous buttons already exists. You must force the command or delete previous messages if you would like to continue.\nUsage: \`roles setup ${channel_id} force\``,
                    }),
                ],
            });
            return;
        }

        let progressMessage = await msg.channel.send({
            embeds: [
                new MessageEmbed({
                    color: Constants.orange,
                    description: "Setting up...",
                }),
            ],
        });

        if (
            !this.store.setServerConfig(
                msg.guild,
                "buttonroles.channel",
                channel_id
            )
        ) {
            await progressMessage.edit({
                embeds: [
                    new MessageEmbed({
                        color: Constants.red,
                        description:
                            "Something went wrong while saving configuration. Please contact the maintainer of this bot.",
                    }),
                ],
            });
            return;
        }

        let roles_data = this.store.getServerConfig(
            msg.guild,
            "buttonroles.roles"
        );
        for (let category in roles_data) {
            if (!roles_data.hasOwnProperty(category)) continue;
            let sentMessage = await channel.send(
                this.generateButtonsMessage(category, roles_data[category])
            );
            data[category] = [sentMessage.id];
        }

        progressMessage.edit({
            embeds: [
                new MessageEmbed({
                    color: Constants.black,
                    description: `Finished setting up roles in #${channel.name}. Enjoy!`,
                }),
            ],
        });
    }
}

export default ButtonRolesCommand;
