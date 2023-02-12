import { Args, Command, MessageCommand } from "@sapphire/framework";
import { GuildMember, Message } from "discord.js";
import { CurrencySystem } from "../CurrencySystem";
import { Spreadsheet } from "../Spreadsheet";
import { Util } from "../Util";
import Config = require("../Config");

export class BalanceCommand extends Command {
	private currencySystem: CurrencySystem;

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "balance",
			"aliases": ["balance", "bal", "b"],
			// @ts-ignore
			"preconditions": ["IsValidChannel"],
			"description": "Returns the balance of the designated user."
		});
		this.currencySystem = new CurrencySystem(new Spreadsheet(Config.spreadsheet.id, Config.spreadsheet.clientEmail, Config.spreadsheet.privateKey));
	}

	public async messageRun(message: Message, args: Args, context: MessageCommand.RunContext): Promise<void> {
		const member: GuildMember | null = await args.pick("member").catch(() => message.member);
		if (!member) {
			return message.channel.send("**That command cannot be executed.**").then();
		}

		let reply: string = "";
		for (let i = 0; i < Config.currencies.length; i++) {
			const currency: string = Config.currencies[i];
			const balance: number = await this.currencySystem.balance(currency, Util.resolveDiscordName(member));
			reply += `${Util.uppercaseFirst(currency)}: ${balance}\n`;
		}

		return message.channel.send(`**${reply}**`).then();
	}
}