import fs from "fs";

const config = JSON.parse(fs.readFileSync("./config.json").toString()); // Message Tau#0001 for more information

import Discord from "discord.js";

const client = new Discord.Client();

import EventHandler from "./src/core/EventHandler.js";
import SuggestionsCommand from "./src/suggestions/SuggestionsCommand.js";
import HelloWorldListener from "./src/autoreply/HelloWorldListener.js";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const handler = new EventHandler(client, {}, "-");

handler.registerCommand(SuggestionsCommand);
handler.registerListener(HelloWorldListener);

handler.initialize();

client.login(config["token"]);
