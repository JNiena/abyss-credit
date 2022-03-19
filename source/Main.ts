import {SapphireClient} from "@sapphire/framework";
import bot from "../config/Bot";

let client = new SapphireClient({intents: ["GUILDS", "GUILD_MESSAGES"], defaultPrefix: bot.prefix});
client.login(bot.token).then();