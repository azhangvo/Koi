import Store from "./Store";
import { Message } from "discord.js";

class Listener {
    protected store: Store;

    constructor(store: Store) {
        if (this.constructor === Listener) {
            throw new Error("Abstract class cannot be instantiated.");
        }
        this.store = store;
    }

    checkPermission(msg: Message) {
        return true;
    }

    checkConditions(msg: Message): boolean {
        throw new Error("Abstract function has no implementation.");
    }

    async run(msg: Message) {
        if (this.checkConditions(msg)) {
            if (this.checkPermission(msg)) {
                await this.execute(msg);
                return true;
            }
        }
        return false;
    }

    async execute(msg: Message) {
        throw new Error("Abstract function has no implementation.");
    }
}

export default Listener;
