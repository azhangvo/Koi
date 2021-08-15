import Command from "../core/Command.ts";

class ServerConfigCommand extends Command {
    constructor(store, prefix) {
        super(store, prefix, "config", 2, "sc", "serverconfig");
    }

    checkPermission(msg) {
        return msg.member.permissions.has("MANAGE_GUILD", true);
    }

    execute(msg, args) {
        if (this.store.setServerConfig(msg.guild, args[0], args[1])) {
            msg.channel.send(`Successfully set ${args[0]} to ${args[1]}`);
        } else {
            msg.channel.send(
                `Failed to set ${args[0]} to ${args[1]}. Perhaps check your spelling?`
            );
        }
    }
}

export default ServerConfigCommand;
