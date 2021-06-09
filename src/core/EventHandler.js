class EventHandler {
    constructor(client, store, prefix) {
        this.client = client;
        this.store = store;
        this.prefix = prefix;
        this.commands = [];
        this.listeners = [];
        this.reaction_listeners = [];
    }

    registerCommand(CommandClass) {
        this.commands.push(new CommandClass(this.store, this.prefix));
    }

    registerListener(ListenerClass) {
        this.listeners.push(new ListenerClass(this.store));
    }

    registerReactionListener(ReactionListenerClass) {
        this.reaction_listeners.push(new ReactionListenerClass(this.store));
    }

    initialize() {
        let commands = this.commands;
        let listeners = this.listeners;
        let reaction_listeners = this.reaction_listeners;
        this.client.on("message", (msg) => {
            if (msg.author.bot) return;

            for (let i = 0; i < commands.length; i++) {
                if (commands[i].run(msg)) {
                    return;
                }
            }
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i].run(msg)) {
                    return;
                }
            }
        });

        this.client.on("messageReactionAdd", async (reaction, user) => {
            if (reaction.partial) {
                // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    // Return as `reaction.message.author` may be undefined/null
                    return;
                }
            }

            let event = { reaction, user, type: "messageReactionAdd" };

            for (let i = 0; i < reaction_listeners.length; i++) {
                if (reaction_listeners[i].run(event)) {
                    return;
                }
            }
        });

        this.client.on("messageReactionRemove", async (reaction, user) => {
            if (reaction.partial) {
                // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    // Return as `reaction.message.author` may be undefined/null
                    return;
                }
            }

            let event = { reaction, user, type: "messageReactionRemove" };

            for (let i = 0; i < reaction_listeners.length; i++) {
                if (reaction_listeners[i].run(event)) {
                    return;
                }
            }
        });
    }
}

export default EventHandler;
