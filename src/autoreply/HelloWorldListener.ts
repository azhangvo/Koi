import Listener from "../core/Listener";
import Store from "../core/Store";
import { Message } from "discord.js";

class HelloWorldListener extends Listener {
    constructor(store: Store) {
        super(store);
    }

    checkConditions(msg: Message): boolean {
        return /^h+e+ll+o+,*\s*$/i.test(msg.content) && this.store.getServerConfig(msg.guild, "listener.hello") === "true";
    }

    async execute(msg: Message) {
        await msg.channel.send("world!");
    }
}

export default HelloWorldListener;
