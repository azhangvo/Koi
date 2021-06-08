class EventHandler {
    constructor(client, store, prefix) {
        this.client = client;
        this.store = store;
        this.prefix = prefix;
        this.commands = [];
        this.listeners = [];
    }

    registerCommand(CommandClass) {
        this.commands.push(new CommandClass(this.store, this.prefix));
    }

    registerListener(ListenerClass) {
        this.listeners.push(new ListenerClass(this.store));
    }

    initialize() {
        let commands = this.commands;
        let listeners = this.listeners;
        this.client.on("message", (msg) => {
            for(let i = 0; i < commands.length; i++) {
                if(commands[i].run(msg)) {
                    return;
                }
            }
            for(let i = 0; i < listeners.length; i++) {
                if(listeners[i].run(msg)) {
                    return;
                }
            }
        })
    }
}

export default EventHandler;