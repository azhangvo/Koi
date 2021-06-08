import Command from "../core/Command.js";

class SuggestionsCommand extends Command {
    constructor(store, prefix) {
        super(store, prefix, "suggest", 1);
    }

    execute(msg, args) {
        msg.reply("Sorry, but this command is unfinished.")
    }
}

export default SuggestionsCommand;
