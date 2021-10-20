import Command from "./Command";
import { ArgumentParser, Namespace } from "argparse";
import Store from "./Store";
import { Message, MessageEmbed } from "discord.js";
import Constants from "./Constants";

class DiscordJSArgumentParser extends ArgumentParser {
    // @ts-ignore
    private debug: Boolean;
    // @ts-ignore
    private prog: string;

    constructor(props: any) {
        super(props);
    }

    error(message: string) {
        /*
         *  error(message: string)
         *
         *  Prints a usage message incorporating the message to stderr and
         *  exits.
         *
         *  If you override this in a subclass, it should not return -- it
         *  should either exit or raise an exception.
         */

        // LEGACY (v1 compatibility), debug mode
        if (this.debug) throw new Error(message);

        this.exit(2, `${this.format_usage()}\n${this.prog}: error: ${message}\n`);
    }

    exit(status: number = 0, message: string = "") {
        throw new Error(message);
    }
}

class ParsedCommand extends Command {
    protected parser: ArgumentParser;

    constructor(
        store: Store,
        prefix: string,
        command: string,
        args: number,
        ...aliases: string[]) {
        super(store, prefix, command, args, ...aliases);
        this.parser = new DiscordJSArgumentParser({
            prog: `${prefix}${command}`,
            exit_on_error: false,
        });
    }

    async run(msg: Message) {
        let prefix: string = this.getPrefix();
        let msgLowerCase = msg.content.toLowerCase();
        let willRun: boolean = msgLowerCase.startsWith(prefix + this.getCommand() + " ") || msgLowerCase === prefix + this.getCommand();
        for (let idx in this.aliases) {
            let alias: string = this.aliases[idx];
            willRun = willRun || (msgLowerCase.startsWith(prefix + alias + " ") || msgLowerCase === (prefix + alias));
        }

        if (willRun) {
            if (this.checkPermission(msg)) {
                let parsed_args: Namespace;
                try {
                    parsed_args = this.parser.parse_args(msg.content.split(" ").slice(1));
                    if (!(await this.execute_parsed(msg, parsed_args))) {
                        msg.channel.send({
                            embeds: [
                                new MessageEmbed({
                                    description: this.parser.format_help(),
                                    color: Constants.red,
                                }),
                            ],
                        });
                        return false;
                    }
                } catch (e) {
                    msg.channel.send({
                        embeds: [
                            new MessageEmbed({
                                description: String(e) === "Error" ? this.parser.format_help() : String(e),
                                color: Constants.red,
                            }),
                        ],
                    });
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    async execute_parsed(msg: Message, parsed_args: Namespace): Promise<boolean> {
        throw new Error("Abstract function has no implementation.");
    }
}

export default ParsedCommand;