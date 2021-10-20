import Command from "../../core/Command";
import { Message, MessageEmbed } from "discord.js";
import Store from "../../core/Store";
import Constants from "../../core/Constants";
import fetch from "node-fetch";

class AnimeCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "anime", 1);
    }

    checkPermission(msg: Message) {
        return !msg.author.bot;
    }

    async execute(msg: Message, args: string[]) {
        if (args.length === 0) {
            await msg.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: Constants.red,
                        description: "Available commands are `anime random`",
                    }),
                ],
            });
        } else if (args.length === 1) {
            switch (args[0]) {
                case "random": {
                    let req = fetch(
                        "https://www.randomanime.org/api/custom-list/get-id/",
                        {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            },
                            body: JSON.stringify({
                                lang: "any",
                                listInfo: {
                                    base: "genres",
                                    excludedGenres: [],
                                    includedGenres: ["0"],
                                },
                                single: true,
                            }),
                        }
                    );

                    let progressMessage = await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.orange,
                                description:
                                    "Your random anime is...",
                            }),
                        ],
                    });

                    let resp = await req;

                    if (!resp.ok) {
                        console.log("Anime fetch responded with failed okay")
                        console.log(resp.statusText)
                        progressMessage.edit({
                            embeds: [
                                new MessageEmbed({
                                    color: Constants.red,
                                    description:
                                        "Something went wrong. Please don't spam this command and contact the owner of this bot.",
                                }),
                            ],
                        });
                        return;
                    }

                    let data = await resp.json()
                    if(!data.response) {
                        console.log("Anime fetch responded with false response parameter")
                        progressMessage.edit({
                            embeds: [
                                new MessageEmbed({
                                    color: Constants.red,
                                    description:
                                        "Something went wrong. Please don't spam this command and contact the owner of this bot.",
                                }),
                            ],
                        });
                        return;
                    }


                    await progressMessage.edit({
                        embeds: [
                            new MessageEmbed({
                                color: Constants.white,
                                description:
                                    `Your random anime is ${data.result}`,
                            }),
                        ],
                    });
                    return;
                }
                default: {
                    await msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: 0x89023e,
                                description:
                                    "Command not recognized. Available commands are `anime random`",
                            }),
                        ],
                    });
                    return;
                }
            }
        }
    }
}

export default AnimeCommand;
