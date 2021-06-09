class ReactionListener {
    constructor(store) {
        if (this.constructor === ReactionListener) {
            throw new Error("Abstract class cannot be instantiated.");
        }
        this.store = store;
    }

    checkPermission(event) {
        return true;
    }

    checkConditions(event) {
        throw new Error("Abstract function has no implementation.");
    }

    run(event) {
        if (this.checkConditions(event)) {
            if (this.checkPermission(event)) {
                this.execute(event);
                return true;
            }
        }
        return false;
    }

    execute(event) {
        throw new Error("Abstract function has no implementation.");
    }
}

export default ReactionListener;
