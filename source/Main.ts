import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import Config = require("./Config");

const client: SapphireClient = new SapphireClient({
	"intents": [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	"loadMessageCommandListeners": true,
	"defaultPrefix": "!"
});

client.login(Config.token).then();