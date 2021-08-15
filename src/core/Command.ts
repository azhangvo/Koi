class Command {
    constructor(store, prefix, command, args, ...aliases) {
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

    checkPermission(msg) {
        return true;
    }

    async run(msg) {
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

    async execute(msg, args) {
        throw new Error("Abstract function has no implementation.");
    }
}

export default Command;
