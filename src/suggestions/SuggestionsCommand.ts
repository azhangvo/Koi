import Command from "../core/Command";
import { Message, MessageEmbed, TextChannel } from "discord.js";

class SuggestionsCommand extends Command {
    constructor(store: any, prefix: any) {
        super(store, prefix, "suggest", 1);
    }

    async execute(msg: Message, args: string[]) {
        if (!msg.guild || !msg.author) return;
        const suggestions_channel = msg.guild.channels.resolve(
            this.store.getServerConfig(msg.guild, "channels.suggestions")
        );

        if (
            suggestions_channel === null ||
            !(suggestions_channel instanceof TextChannel)
        ) {
            const reply_embed = new MessageEmbed();
            reply_embed.setColor(0x89023e);
            reply_embed.setDescription(
                "The suggestions channel for this server is not set or invalid. Notify a server owner or admin if this is an issue."
            );

            msg.channel.send({ embeds: [reply_embed] });
            return;
        }

        const reply_embed = new MessageEmbed();
        reply_embed.setColor(0xef8354);
        reply_embed.setDescription("Creating your suggestion...");

        let reply = msg.channel.send({ embeds: [reply_embed] });
        const embed = new MessageEmbed();
        embed.setColor(0xeeeeee);
        embed.setAuthor(msg.author.tag, msg.author.avatarURL() || "", msg.url);
        embed.setTitle(`${msg.author.username}'s suggestion`);
        embed.setDescription(`${args[0]}`); // ([link](${msg.url}))
        embed.setFooter(
            `Suggest with ${this.prefix}suggest | Seven votes are required to pass a suggestion`
        );

        embed.addField("Voting", `0 ✅ \`0.000\` | 0 ❌ \`0.000\``);

        suggestions_channel
            .send({
                embeds: [embed],
            })
            .then((suggestion: Message) => {
                suggestion.react("✅").then(() => {
                    suggestion.react("❌").then(() => {
                        reply.then((reply) => {
                            reply_embed.setDescription(
                                `Created your [suggestion](${suggestion.url})`
                            );
                            reply
                                .edit({ embeds: [reply_embed] })
                                .catch(console.log);
                        });
                    });
                });
            });
    }
}

export default SuggestionsCommand;
