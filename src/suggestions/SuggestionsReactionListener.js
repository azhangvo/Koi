import ReactionListener from "../core/ReactionListener.js";
import { MessageEmbed } from "discord.js";

class SuggestionsReactionListener extends ReactionListener {
    constructor(store) {
        super(store);
    }

    checkConditions(event) {
        if (event.user.bot) return false;
        let { reaction } = event;
        let msg = reaction.message;
        if (msg.author.id !== this.store.get("info.userid")) {
            return false;
        }
        if (msg.embeds.length !== 1) return false;
        if (msg.embeds[0].title === null) return false;
        return msg.embeds[0].title.includes("'s suggestion");
    }

    execute(event) {
        try {
            let { reaction } = event;
            let msg = reaction.message;
            let old_embed = msg.embeds[0];

            const embed = new MessageEmbed();
            embed.setColor(0xeeeeee);
            embed.setAuthor(
                old_embed.author.name,
                old_embed.author.iconURL,
                old_embed.author.url
            );
            embed.setTitle(old_embed.title);
            embed.setDescription(old_embed.description);
            embed.setFooter(old_embed.footer.text);

            let positive_votes = msg.reactions.resolve("✅").count - 1;
            let negative_votes = msg.reactions.resolve("❌").count - 1;
            let total_votes = positive_votes + negative_votes || 1;

            let title =
                positive_votes >= 7
                    ? "Voting concluded"
                    : old_embed.fields[0].name;

            embed.addField(
                title,
                `${positive_votes} ✅ \`${(
                    positive_votes / total_votes
                ).toFixed(3)}\` | ${negative_votes} ❌ \`${(
                    negative_votes / total_votes
                ).toFixed(3)}\``
            );

            reaction.message.edit({ embed });

            if (positive_votes >= 7 && old_embed.fields[0].name === "Voting") {
                let owner =
                    msg.guild.members.resolve(msg.guild.ownerID) ||
                    msg.guild.owner;

                if (!owner) {
                    msg.guild.fetch().then(() => {
                        owner = msg.guild.members.resolve(msg.guild.ownerID) ||
                            msg.guild.owner;
                        msg.channel.send(owner.toString());
                    });
                } else {
                    msg.channel.send(owner.toString());
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export default SuggestionsReactionListener;
