import fs from "fs";

class Store {
    constructor(path) {
        this.path = path;
        if(!fs.existsSync(this.path))
            fs.writeFileSync(this.path, "{ }");
        this.data = JSON.parse(fs.readFileSync(this.path).toString());
    }

    set(key, value) {
        let keys = key.split(".");
        let cur = this.data;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!cur.hasOwnProperty(keys[i])) cur[keys[i]] = {};
            if (typeof cur[keys[i]] !== "object") return false;
            cur = cur[keys[i]];
        }
        cur[keys[keys.length - 1]] = value;
        return true;
    }

    get(key) {
        let keys = key.split(".");
        let cur = this.data;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!cur.hasOwnProperty(keys[i])) return null;
            if (typeof cur[keys[i]] !== "object") return null;
            cur = cur[keys[i]];
        }
        return cur[keys[keys.length - 1]];
    }

    exists(key) {
        let keys = key.split(".");
        let cur = this.data;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!cur.hasOwnProperty(keys[i])) return false;
            if (typeof cur[keys[i]] !== "object") return false;
            cur = cur[keys[i]];
        }
        return cur.hasOwnProperty(keys[keys.length - 1]);
    }

    save() {
        fs.writeFile(this.path, JSON.stringify(this.data, null, 2), null);
    }

    initialize() {
        setInterval(this.save, 5000);
    }
}

export default Store;