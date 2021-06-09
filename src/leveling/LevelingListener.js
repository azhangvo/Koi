import Listener from "../core/Listener.js";

class LevelingListener extends Listener {
    checkConditions(msg) {
        return true;
    }

    execute(msg) {
        
    }
}

export default LevelingListener;
