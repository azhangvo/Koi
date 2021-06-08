import Listener from "../core/Listener.js";

class HelloWorldListener extends Listener {
    constructor(store) {
        super(store);
    }

    checkConditions(msg) {
        if (/^h+e+ll+o+,*\s*$/i.test(msg.content)) {
            msg.channel.send("world!");
        }
    }
}

export default HelloWorldListener;
