import {
    Interaction,
} from "discord.js";
import Store from "./Store";

class InteractionListener {
    protected store: Store;

    constructor(store: Store) {
        if (this.constructor === InteractionListener) {
            throw new Error("Abstract class cannot be instantiated.");
        }
        this.store = store;
    }

    checkPermission(interaction: Interaction): boolean {
        return true;
    }

    checkConditions(interaction: Interaction): boolean {
        throw new Error("Abstract function has no implementation.");
    }

    run(interaction: Interaction): boolean {
        if (this.checkConditions(interaction)) {
            if (this.checkPermission(interaction)) {
                this.execute(interaction);
                return true;
            }
        }
        return false;
    }

    execute(interaction: Interaction) {
        throw new Error("Abstract function has no implementation.");
    }
}

export default InteractionListener;
