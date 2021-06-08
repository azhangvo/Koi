import fs from "fs";

const config = JSON.parse(fs.readFileSync("./config.json").toString()); // Message Tau#0001 for more information

import Discord from "discord.js";

const client = new Discord.Client();

import EventHandler from "./src/core/EventHandler.js";
import SuggestionsCommand from "./src/suggestions/SuggestionsCommand.js";
import HelloWorldListener from "./src/autoreply/HelloWorldListener.js";
import Store from "./src/core/Store.js";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const store = new Store("./store.json");
const handler = new EventHandler(client, store, "-");

handler.registerCommand(SuggestionsCommand);
handler.registerListener(HelloWorldListener);

handler.initialize();

store.initialize();

client.login(config["token"]);
