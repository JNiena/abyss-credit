import { DiscordBot } from "./DiscordBot";
import { Config } from "./Config";
import { BalanceCommand } from "./commands/BalanceCommand";
import { CreditCommand } from "./commands/CreditCommand";

let config: Config = new Config("config.json");
let discordBot: DiscordBot = new DiscordBot(config);
discordBot.registerCommand(new BalanceCommand(config));
discordBot.registerCommand(new CreditCommand(config))
discordBot.start();