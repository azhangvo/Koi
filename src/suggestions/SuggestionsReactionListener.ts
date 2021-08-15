import ReactionListener from "../core/ReactionListener";
import { MessageEmbed, MessageReaction, PartialUser, User } from "discord.js";
import Store from "../core/Store";

class SuggestionsReactionListener extends ReactionListener {
    constructor(store: Store) {
        super(store);
    }

    checkConditions(event: {
        reaction: MessageReaction;
        user: User | PartialUser;
        type: string;
    }) {
        if (!event.user || event.user.bot) return false;
        let { reaction } = event;
        let msg = reaction.message;
        if (msg.author.id !== this.store.get("info.userid")) {
            return false;
        }
        if (msg.embeds.length !== 1) return false;
        if (msg.embeds[0].title === null) return false;
        return msg.embeds[0].title.includes("'s suggestion");
    }

    execute(event: {
        reaction: MessageReaction;
        user: User | PartialUser;
        type: string;
    }) {
        try {
            let { reaction } = event;
            let msg = reaction.message;
            let old_embed = msg.embeds[0];

            const embed = new MessageEmbed();
            embed.setColor(0xeeeeee);
            if (old_embed.author)
                embed.setAuthor(
                    old_embed.author.name,
                    old_embed.author.iconURL,
                    old_embed.author.url
                );
            embed.setTitle(old_embed.title);
            embed.setDescription(old_embed.description);
            if (old_embed.footer) embed.setFooter(old_embed.footer.text);

            let positive_votes = (msg.reactions.resolve("✅")?.count || 1) - 1;
            let negative_votes = (msg.reactions.resolve("❌")?.count || 1) - 1;
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
                if (!msg.guild) return;
                let owner =
                    msg.guild.members.resolve(msg.guild.ownerID) ||
                    msg.guild.owner;

                if (!owner) {
                    msg.guild.fetch().then(() => {
                        if (!msg.guild) return;
                        owner =
                            msg.guild.members.resolve(msg.guild.ownerID) ||
                            msg.guild.owner;
                        if (owner) msg.channel.send(owner.toString());
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
