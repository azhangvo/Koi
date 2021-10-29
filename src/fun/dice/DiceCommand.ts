import Command from "../../core/Command";
import { Message } from "discord.js";
import { createBaseEmbed } from "../../util/Messages";
import Store from "../../core/Store";
import Constants from "../../core/Constants";

class DiceCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "dice", 1);
    }

    checkPermission(msg: Message) {
        return !msg.author.bot;
    }

    async execute(msg: Message, args: string[]) {
        if (args.length === 0) {
            var rand = Math.floor(Math.random() * 6) + 1;
            await msg.channel.send(createBaseEmbed("You rolled a " + rand, Constants.black));
        } else if (args.length === 1 && args[0] === "help"){
            await msg.channel.send(createBaseEmbed(`Available commands are:
\`-dice\` - roll a 6-sided dice
\`-dice <sides>\` - roll a dice with a specific amount of sides
\`-dice <stuff>\` - choose randomly from a list of comma separated stuff
\`-dice <min> <max>\` - choose randomly between numbers in a range
\`-dice help\` - show this help message`, Constants.black));
        } else if (args.length === 1 && !isNaN(parseFloat(args[0]))){
            var rand = Math.floor(Math.random() * parseFloat(args[0])) + 1;
            await msg.channel.send(createBaseEmbed("You rolled a " + rand, Constants.black));
        } else if (args.length === 2 && !isNaN(parseFloat(args[0])) && !isNaN(parseFloat(args[1]))){
            var a = parseFloat(args[0]);
            var b = parseFloat(args[1]);
            var min = Math.min(a, b);
            var max = Math.max(a, b);
            var rand = Math.ceil(Math.random() * (max - min + 1) + (min - 1))
            await msg.channel.send(createBaseEmbed("You rolled a " + rand, Constants.black));
        } else if (args.length === 1 && args[0].split(",").length > 1){
            var rand = Math.floor(Math.random() * args[0].split(",").length);
            var list = args[0].split(",");
            list.forEach((e, i, a) => {
              a[i] = e.trim()
            })
            await msg.channel.send(createBaseEmbed("You rolled " + list[rand], Constants.black));
        } else {
            await msg.channel.send(createBaseEmbed(`Command not recognized. Available commands are:
\`-dice\` - roll a 6-sided dice
\`-dice <sides>\` - roll a dice with a specific amount of sides
\`-dice <stuff>\` - choose randomly from a list of comma separated stuff
\`-dice <min> <max>\` - choose randomly between numbers in a range
\`-dice help\` - show this help message`, 0x89023e));
        }
    }
}

export default DiceCommand;
