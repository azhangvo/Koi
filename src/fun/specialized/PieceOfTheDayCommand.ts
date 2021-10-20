import Command from "../../core/Command";
import { Message } from "discord.js";
import Store from "../../core/Store";

class PieceOfTheDayCommand extends Command {
    constructor(store: Store, prefix: string) {
        super(store, prefix, "potd", 2);
    }

    checkPermission(msg: Message): boolean {
        return true;
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        if(args.length === 0) {

        }
    }
}

export default PieceOfTheDayCommand