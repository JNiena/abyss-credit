import { Args, Command, MessageCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { CurrencySystem } from "../CurrencySystem";
import { Spreadsheet } from "../Spreadsheet";
import { Util } from "../Util";
import Config = require("../Config");

export class DailyCommand extends Command {
	private currencySystem: CurrencySystem;
	private disallowedUsers: Map<string, number>;

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "daily",
			"aliases": ["daily"],
			// @ts-ignore
			"preconditions": ["IsValidChannel"],
			"description": "Adds 1-3 credits to the user daily."
		});
		this.currencySystem = new CurrencySystem(new Spreadsheet(Config.spreadsheet.id, Config.spreadsheet.clientEmail, Config.spreadsheet.privateKey));
		this.disallowedUsers = new Map<string, number>();
	}

	public async messageRun(message: Message, args: Args, context: MessageCommand.RunContext): Promise<void> {
		if (!message.member) {
			return message.channel.send("**That command cannot be executed.**").then();
		}

		let time: number | undefined = this.disallowedUsers.get(message.author.id);
		if (time && new Date().getTime() - time < 86_400_000) {
			return message.channel.send("**You've already claimed your daily rewards!**").then();
		}
		this.disallowedUsers.set(message.author.id, new Date().getTime());

		let reply: string = "Daily rewards received:\n";
		for (let i = 0; i < Config.currencies.length; i++) {
			const currency: string = Config.currencies[i];
			const amount: number = Math.floor(Math.random() * 3) + 1;
			await this.currencySystem.add(currency, "Daily", Util.resolveDiscordName(message.member), amount, "Daily");
			reply += `${Util.uppercaseFirst(currency)}: ${amount}\n`;
		}

		return message.channel.send(`**${reply}**`).then();
	}
}