import { MessageReaction, User, PartialUser } from "discord.js";
import Store from "./Store";

class ReactionListener {
    protected store: Store;

    constructor(store: Store) {
        if (this.constructor === ReactionListener) {
            throw new Error("Abstract class cannot be instantiated.");
        }
        this.store = store;
    }

    checkPermission(event: {
        reaction: MessageReaction;
        user: User | PartialUser;
        type: string;
    }): boolean {
        return true;
    }

    checkConditions(event: {
        reaction: MessageReaction;
        user: User | PartialUser;
        type: string;
    }): boolean {
        throw new Error("Abstract function has no implementation.");
    }

    run(event: {
        reaction: MessageReaction;
        user: User | PartialUser;
        type: string;
    }): boolean {
        if (this.checkConditions(event)) {
            if (this.checkPermission(event)) {
                this.execute(event);
                return true;
            }
        }
        return false;
    }

    execute(event: {
        reaction: MessageReaction;
        user: User | PartialUser;
        type: string;
    }) {
        throw new Error("Abstract function has no implementation.");
    }
}

export default ReactionListener;
