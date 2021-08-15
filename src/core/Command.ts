import { Message } from "discord.js";
import Store from "./Store";

class Command {
    protected store: Store;
    private readonly args: number;
    protected readonly prefix: string;
    private readonly command: string;
    private aliases: string[];

    constructor(
        store: Store,
        prefix: string,
        command: string,
        args: number,
        ...aliases: string[]
    ) {
        if (this.constructor === Command) {
            throw new Error("Abstract class cannot be instantiated.");
        }
        this.store = store;
        this.args = args;
        this.prefix = prefix;
        this.command = command;
        this.aliases = aliases ? aliases : [];
    }

    getPrefix() {
        return this.prefix;
    }

    getCommand() {
        return this.command;
    }

    checkPermission(msg: Message) {
        return true;
    }

    async run(msg: Message) {
        if (
            msg.content
                .toLowerCase()
                .startsWith(this.getPrefix() + this.getCommand() + " ") ||
            msg.content.toLowerCase() === this.getPrefix() + this.getCommand()
        ) {
            if (this.checkPermission(msg)) {
                let args = [];
                if (this.args > 0) {
                    let preprocessed_args = msg.content.split(" ");
                    preprocessed_args.shift();
                    while (
                        args.length < this.args - 1 &&
                        preprocessed_args.length > 0
                    ) {
                        args.push(preprocessed_args[0]);
                        preprocessed_args.shift();
                    }
                    if (
                        preprocessed_args.length > 0 &&
                        args.length < this.args
                    ) {
                        args.push(preprocessed_args.join(" "));
                    }
                }
                await this.execute(msg, args);
                return true;
            }
        }
        return false;
    }

    async execute(msg: Message, args: string[]) {
        throw new Error("Abstract function has no implementation.");
    }
}

export default Command;
