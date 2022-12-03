import { DiscordBot } from "./DiscordBot";
import { Config } from "./Config";
import { BalanceCommand } from "./commands/BalanceCommand";
import { CreditCommand } from "./commands/CreditCommand";

let config: Config = new Config("config.json");
let discordBot: DiscordBot = new DiscordBot(config);

Object.keys(config.get()["currencies"]).forEach(async key => {
  let aliases: string[] = config.get()["currencies"][key]["aliases"];
  let permissions: string[] = config.get()["currencies"][key]["permissions"];
  let usage: string[] = config.get()["currencies"][key]["usage"];
  discordBot.registerCommand(new CreditCommand(key, aliases, permissions, usage, config.get()["google"]));
});

let balance: any = config.get()["commands"]["balance"];
discordBot.registerCommand(new BalanceCommand(config.get()["currencies"], balance["aliases"], balance["permissions"], balance["usage"], config.get()["google"]))

discordBot.start();