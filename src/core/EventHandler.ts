import {
    Client,
    Constructable,
    Interaction,
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";
import Store from "./Store";
import Command from "./Command";
import Listener from "./Listener";
import ReactionListener from "./ReactionListener";
import InteractionListener from "./InteractionListener";

class EventHandler {
    private client: Client;
    private readonly store: Store;
    private readonly prefix: string;
    private commands: Command[];
    private listeners: Listener[];
    private reaction_listeners: ReactionListener[];
    private interaction_listeners: InteractionListener[];

    constructor(client: Client, store: Store, prefix: string) {
        this.client = client;
        this.store = store;
        this.prefix = prefix;
        this.commands = [];
        this.listeners = [];
        this.reaction_listeners = [];
        this.interaction_listeners = [];
    }

    registerCommand(CommandClass: Constructable<Command>) {
        this.commands.push(new CommandClass(this.store, this.prefix));
    }

    registerListener(ListenerClass: Constructable<Listener>) {
        this.listeners.push(new ListenerClass(this.store));
    }

    registerReactionListener(ReactionListenerClass: Constructable<ReactionListener>) {
        this.reaction_listeners.push(new ReactionListenerClass(this.store));
    }

    registerInteractionListener(InteractionListenerClass: Constructable<InteractionListener>) {
        this.interaction_listeners.push(new InteractionListenerClass(this.store));
    }

    initialize() {
        let commands = this.commands;
        let listeners = this.listeners;
        let reaction_listeners = this.reaction_listeners;
        this.client.on("message", async (msg) => {
            if (msg.author.bot) return;

            for (let i = 0; i < commands.length; i++) {
                if (await commands[i].run(msg)) {
                    return;
                }
            }
            for (let i = 0; i < listeners.length; i++) {
                if (await listeners[i].run(msg)) {
                    return;
                }
            }
        });

        this.client.on("messageReactionAdd", async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser ) => {
            if (reaction.partial) {
                // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error(
                        "Something went wrong when fetching the message: ",
                        error
                    );
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
                    console.error(
                        "Something went wrong when fetching the message: ",
                        error
                    );
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

        this.client.on("interactionCreate", async (interaction: Interaction) => {
            for (let i = 0; i < this.interaction_listeners.length; i++) {
                if (this.interaction_listeners[i].run(interaction)) {
                    return;
                }
            }
        });
    }
}

export default EventHandler;
