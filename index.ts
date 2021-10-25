import fs from "fs";
import Discord, { Intents } from "discord.js";
import EventHandler from "./src/core/EventHandler";
import SuggestionsCommand from "./src/suggestions/SuggestionsCommand";
import HelloWorldListener from "./src/autoreply/HelloWorldListener";
import ServerConfigCommand from "./src/config/ServerConfigCommand";

import Store from "./src/core/Store";
import path from "path";
import SuggestionsReactionListener from "./src/suggestions/SuggestionsReactionListener";
import BanCommand from "./src/moderation/ban/BanCommand";
import PurgeCommand from "./src/moderation/purge/PurgeCommand";
import ButtonRolesCommand from "./src/moderation/roles/ButtonRolesCommand";
import ButtonRolesInteractionListener from "./src/moderation/roles/ButtonRolesInteractionListener";
import AnimeCommand from "./src/fun/anime/AnimeCommand";
import PlayCommand from "./src/music/PlayCommand";
import PauseCommand from "./src/music/PauseCommand";
import SkipCommand from "./src/music/SkipCommand";
import QueueCommand from "./src/music/QueueCommand";
import LeaveCommand from "./src/music/LeaveCommand";
import ResumeCommand from "./src/music/ResumeCommand";
import RemoveCommand from "./src/music/RemoveCommand";
import MoveCommand from "./src/music/MoveCommand";
import NowPlayingCommand from "./src/music/NowPlayingCommand";

const config = JSON.parse(fs.readFileSync("./config.json").toString()); // Message Tau#0001 for more information

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    allowedMentions: { parse: ["users"] },
});

client.on("ready", () => {
    if (client.user != null) {
        console.log(`Logged in as ${client.user.tag}!`);
    } else {
        console.log("Client User is null! Please terminate this instance.");
    }
});

const store = new Store(path.resolve("./store.json"));

let prefix: string = store.get("prefix");
const handler: EventHandler = new EventHandler(client, store, prefix);

handler.registerCommand(AnimeCommand);

handler.registerCommand(SuggestionsCommand);
handler.registerCommand(ServerConfigCommand);
handler.registerCommand(BanCommand);
handler.registerCommand(PurgeCommand);
handler.registerCommand(ButtonRolesCommand);

handler.registerCommand(PlayCommand);
handler.registerCommand(PauseCommand);
handler.registerCommand(ResumeCommand);
handler.registerCommand(LeaveCommand);
handler.registerCommand(SkipCommand);
handler.registerCommand(QueueCommand);
handler.registerCommand(RemoveCommand);
handler.registerCommand(MoveCommand);
handler.registerCommand(NowPlayingCommand);

handler.registerListener(HelloWorldListener);
handler.registerReactionListener(SuggestionsReactionListener);
handler.registerInteractionListener(ButtonRolesInteractionListener);

handler.initialize();

store.initialize();

client.login(config["token"]).then(() => {
    if (client.user != null) {
        store.set("info.userid", client.user.id);
        store.set("info.usertag", client.user.tag);
        store.set("info.usericon", client.user.avatarURL());
    } else {
        console.log(
            "UserID is null! Please terminate this instance and try again",
        );
    }
});
