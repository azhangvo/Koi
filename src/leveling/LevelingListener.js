import Listener from "../core/Listener.ts";

class LevelingListener extends Listener {
    checkConditions(msg) {
        return true;
    }

    execute(msg) {
        
    }
}

export default LevelingListener;
