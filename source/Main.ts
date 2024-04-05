import { LogLevel } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import { Config } from "./Config";
import { CurrencySystem } from "./CurrencySystem";
import { LevelSystem } from "./LevelSystem";
import { Spreadsheet } from "./Spreadsheet";
import { AbyssClient } from "./AbyssClient";

const config: Config = new Config("config.json");

const levelSystem: LevelSystem = new LevelSystem();
const currencySystem: CurrencySystem = new CurrencySystem(new Spreadsheet(config.get().spreadsheet.id, config.get().spreadsheet.clientEmail, config.get().spreadsheet.privateKey));

const discordBot: AbyssClient = new AbyssClient({
	"intents": [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	"loadMessageCommandListeners": true,
	"loadDefaultErrorListeners": true,
	"logger": { "level": LogLevel.Debug }
});

discordBot.login(config.get()["token"]).then();

export { config, levelSystem, currencySystem, discordBot as discordClient };