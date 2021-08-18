import InteractionListener from "../../core/InteractionListener";
import Store from "../../core/Store";
import {
    ButtonInteraction,
    GuildMember,
    Interaction,
    MessageEmbed,
} from "discord.js";
import Constants from "../../core/Constants";

class ButtonRolesInteractionListener extends InteractionListener {
    constructor(store: Store) {
        super(store);
    }

    checkConditions(interaction: Interaction): boolean {
        return (
            interaction.isButton() &&
            interaction.customId.startsWith("buttonrole-")
        );
    }

    execute(interaction: Interaction) {
        if (!interaction.isButton()) return false;
        let roleId = interaction.customId.slice("buttonrole-".length);
        let role = interaction.guild?.roles.resolve(roleId);
        if (!role) return false;

        let member = interaction.member;
        if (!member || !(member instanceof GuildMember)) return false;

        let status: String;
        if (member.roles.cache.has(roleId)) {
            member.roles.remove([role]);
            status = "Removed";
        } else {
            member.roles.add([role]);
            status = "Added";
        }

        interaction.reply({
            embeds: [
                new MessageEmbed({
                    color: Constants.white,
                    description: `${status} ${role.name}`,
                }),
            ],
            ephemeral: true,
        });
    }
}

export default ButtonRolesInteractionListener;
