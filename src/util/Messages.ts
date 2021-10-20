import { ColorResolvable, MessageEmbed } from "discord.js";

export function createBaseEmbed(message: string, color: ColorResolvable) {
    return {
        embeds: [
            new MessageEmbed({
                description: message,
                color: color,
            }),
        ],
    }
}