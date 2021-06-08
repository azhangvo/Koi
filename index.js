const config = require("./config.json") // Message Tau#0001 for more information

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
  if(/f+u+(?:c*k+|c+k*) m+e+/g.test(msg.content)) {
    msg.reply("I think I'll pass...");
  }
  if(msg.content === "fuck me") {
    msg.reply("I think I'll pass...");
  }
});

client.login(config['token']);
