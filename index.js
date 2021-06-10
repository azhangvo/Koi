import fs from "fs";

const config = JSON.parse(fs.readFileSync("./config.json").toString()); // Message Tau#0001 for more information

import Discord from "discord.js";

const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

import EventHandler from "./src/core/EventHandler.js";
import SuggestionsCommand from "./src/suggestions/SuggestionsCommand.js";
import HelloWorldListener from "./src/autoreply/HelloWorldListener.js";
import ServerConfigCommand from "./src/config/ServerConfigCommand.js";

import Store from "./src/core/Store.js";
import path from "path";
import SuggestionsReactionListener from "./src/suggestions/SuggestionsReactionListener.js";
import BanCommand from "./src/moderation/ban/BanCommand.js";
import PurgeCommand from "./src/moderation/purge/PurgeCommand.js";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const store = new Store(path.resolve("./store.json"));

let prefix = store.get("prefix");
const handler = new EventHandler(client, store, prefix);

handler.registerCommand(SuggestionsCommand);
handler.registerCommand(ServerConfigCommand);
handler.registerCommand(BanCommand);
handler.registerCommand(PurgeCommand);
handler.registerListener(HelloWorldListener);
handler.registerReactionListener(SuggestionsReactionListener);

handler.initialize();

store.initialize();

client.login(config["token"]).then(() => {
    store.set("info.userid", client.user.id);
});
