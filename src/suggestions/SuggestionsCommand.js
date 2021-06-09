import Command from "../core/Command.js";
import { MessageEmbed } from "discord.js";

class SuggestionsCommand extends Command {
    constructor(store, prefix) {
        super(store, prefix, "suggest", 1);
    }

    execute(msg, args) {
        msg.channel.send("Creating your suggestion")

        const embed = new MessageEmbed();
        embed.setColor(0xffffff);
        embed.setAuthor(msg.author.tag, msg.author.avatarURL())
        embed.setTitle(`${msg.author.username}'s suggestion`)
        embed.setDescription(`${args[0]} ([link](${msg.url}))`)
        embed.setFooter(`Suggest with ${this.prefix}suggest`);

        const suggestions_channel = msg.guild.channels.resolve(
            this.store.getServerConfig(msg.guild, "channels.suggestions")
        );
        suggestions_channel.send(embed).then((msg) => {
            msg.react("✅");
            msg.react("❌")
        });
    }
}

export default SuggestionsCommand;
