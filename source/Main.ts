import {LogLevel, SapphireClient} from "@sapphire/framework";
import {GatewayIntentBits} from "discord.js";
import {Config} from "./Config";

const config: Config = new Config("config.json");
const users: Config = new Config("users.json");

const client: SapphireClient = new SapphireClient({
    "intents": [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    "loadMessageCommandListeners": true,
    "loadDefaultErrorListeners": true,
    "logger": {"level": LogLevel.Debug}
});

client.login(config.get()["token"]).then();

export {
    config,
    users
}