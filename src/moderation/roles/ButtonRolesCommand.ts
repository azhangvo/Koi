import Command from "../../core/Command";
import { Message, MessageEmbed } from "discord.js";
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

    async execute(msg: Message, args: string[]) {
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
                                description: "Setting up...",
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
                                description: "Setting up...",
                            })
                        );
                    } else {
                        await msg.channel.send(
                            new MessageEmbed({
                                color: 0x89023e,
                                description: `Roles message already exists. You must force the command if you would like to continue.\nUsage: \`roles setup ${args[1]} force\``,
                            })
                        );
                    }
                    break;
                case "add":
                    await msg.channel.send(
                        new MessageEmbed({
                            color: 0x89023e,
                            description: `Usage: \`roles add ${args[1]} <display name> <id>\``,
                        })
                    );
                    break;
                case "remove":
                    if (
                        this.store.getServerConfig(msg.guild, "reactroles.") ===
                        null
                    ) {
                        await msg.channel.send(
                            new MessageEmbed({
                                color: 0x89023e,
                                description: `The role \`${args[1]}\` was not found. Make sure you are using a display name, not an ID.`,
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
            switch (args[0]) {
                case "add":
                    break;
                default:
                    break;
            }
        } else if (args.length === 4) {
            switch (args[0]) {
                case "add":
                    let progressMessage = await msg.channel.send(
                        new MessageEmbed({
                            color: 0x2f2f2f,
                            description: "Adding...",
                        })
                    );

                    let reconstruction = args[2] + " " + args[3];
                    let split = reconstruction.split(" ");
                    let category = args[1]
                    let id: string = split[split.length - 1];
                    let name: string = "";

                    if (split.length > 2) {
                        if (
                            split[0].startsWith('"') &&
                            split[split.length - 2].endsWith('"')
                        ) {
                            name = split.slice(0, -1).join(" ").slice(1, -1);
                        } else {
                            await progressMessage.edit(
                                new MessageEmbed({
                                    color: Constants.red,
                                    description:
                                        "Something seems to be formatted wrong in your command.",
                                })
                            );
                            return;
                        }
                    } else {
                        name = args[2];
                    }

                    let data = this.store.getServerConfig(
                        msg.guild,
                        "buttonroles.roles"
                    ); // Dictionary with category: [ [ name, id ] ]

                    console.log(Object.keys(data))
                    for (let itr_category in data) {
                        if (!data.hasOwnProperty(itr_category)) continue;
                        let roles: string[][] = data[itr_category];
                        console.log(roles)
                        for (let i in roles) {
                            if (roles[i][0] === name) {
                                await progressMessage.edit(
                                    new MessageEmbed({
                                        color: Constants.red,
                                        description: `The role \`${roles[i][0]}\` seems to already exist and is linked to \`${roles[i][1]}\` in category \`${itr_category}\`.`,
                                    })
                                );
                                return;
                            }
                            if (roles[i][1] === id) {
                                await progressMessage.edit(
                                    new MessageEmbed({
                                        color: Constants.red,
                                        description: `Id \`${roles[i][1]}\` is already assigned to role \`${roles[i][0]}\` in category \`${itr_category}\`.`,
                                    })
                                );
                                return;
                            }
                        }
                    }
                    // if(!data.hasOwnProperty(category)) {
                    //     data[category] = []
                    // }
                    // data[category].push([name, id])
                    // console.log(data)
                    //
                    // await progressMessage.edit(new MessageEmbed({
                    //     color: Constants.black,
                    //     description: `Successfully added ${name} (${id}) to ${category}.`
                    // }))

                    break;
                default:
                    break;
            }
        }
    }
}

export default ButtonRolesCommand;
