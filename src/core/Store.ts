import { Guild } from "discord.js";
import fs from "fs";
import GuildContract from "../music/GuildContract";

class Store {
    static default_store = { prefix: "ඞ" };
    static default_server_config = {
        channels: { suggestions: undefined },
        buttonroles: { channel: "", messages: {}, roles: {} },
        listener: { hello: "false" }
    };
    private readonly path: string;
    private data: any;
    private instance_data: any;

    music_contracts: {[key: string]: GuildContract} = {}

    constructor(path: string) {
        this.path = path;
        if (!fs.existsSync(this.path))
            fs.writeFileSync(
                this.path,
                JSON.stringify(Store.default_store, null, 2)
            );
        this.data = JSON.parse(fs.readFileSync(this.path).toString());
    }

    _set(key: string, value: any, json: any) {
        let keys: string[] = key.split(".");
        let cur = json;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!cur.hasOwnProperty(keys[i])) cur[keys[i]] = {};
            if (typeof cur[keys[i]] !== "object") return false;
            cur = cur[keys[i]];
        }
        cur[keys[keys.length - 1]] = value;
        return true;
    }

    set(key: string, value: any) {
        this._set(key, value, this.data)
    }

    instance_set(key: string, value: any) {
        this._set(key, value, this.instance_data)
    }

    _get(key: string, json: any) {
        let cur = json;
        let keys = key.split(".");
        for (let i = 0; i < keys.length - 1; i++) {
            if (!cur.hasOwnProperty(keys[i])) return null;
            if (typeof cur[keys[i]] !== "object") return null;
            cur = cur[keys[i]];
        }
        return cur[keys[keys.length - 1]];
    }

    get(key: string) {
        return this._get(key, this.data);
    }

    instance_get(key: string) {
        return this._get(key, this.instance_data);
    }

    getServerConfig(guild: Guild | null, key: any) {
        if (guild == null) {
            return null;
        }
        let guild_key = `guilds.${guild.id}`;
        if (!this.exists(`${guild_key}.${key}`)) {
            if (!this._exists(key, Store.default_server_config)) {
                return null;
            }
            this.set(
                `${guild_key}.${key}`,
                this._get(key, JSON.parse(JSON.stringify(Store.default_server_config)))
            );
        }
        return this.get(`${guild_key}.${key}`);
    }

    setServerConfig(guild: Guild | null, key: any, value: any) {
        if (guild == null) {
            return false;
        }
        let guild_key = `guilds.${guild.id}`;
        if (!this._exists(key, Store.default_server_config)) {
            return false;
        }
        this.set(`${guild_key}.${key}`, value);
        return true;
    }

    _exists(key: string, json: any) {
        let cur = json;
        let keys = key.split(".");
        for (let i = 0; i < keys.length - 1; i++) {
            if (!cur.hasOwnProperty(keys[i])) return false;
            if (typeof cur[keys[i]] !== "object") return false;
            cur = cur[keys[i]];
        }
        return cur.hasOwnProperty(keys[keys.length - 1]);
    }

    exists(key: string) {
        return this._exists(key, this.data);
    }

    save() {
        fs.writeFile(this.path, JSON.stringify(this.data, null, 2), () => {});
    }

    initialize() {
        setInterval(this.save.bind(this), 5000);
    }
}

export default Store;
