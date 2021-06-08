class Listener {
    constructor(store) {
        if (this.constructor === Listener) {
            throw new Error("Abstract class cannot be instantiated.");
        }
        this.store = store;
    }

    checkPermission(msg) {
        return true;
    }

    checkConditions(msg) {
        throw new Error("Abstract function has no implementation.");
    }

    run(msg) {
        if (this.checkConditions(msg)) {
            if (this.checkPermission(msg)) {
                this.execute(msg);
                return true;
            }
        }
        return false;
    }

    execute(msg) {
        throw new Error("Abstract function has no implementation.");
    }
}

export default Listener;
