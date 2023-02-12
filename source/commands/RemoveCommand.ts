import { Args, Command, MessageCommand } from "@sapphire/framework";
import { GuildMember, Message } from "discord.js";
import { CurrencySystem } from "../CurrencySystem";
import { Spreadsheet } from "../Spreadsheet";
import { Util } from "../Util";
import Config = require("../Config");

export class RemoveCommand extends Command {
	private currencySystem: CurrencySystem;

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "remove",
			"aliases": ["remove", "r"],
			// @ts-ignore
			"preconditions": ["IsCreditor", "IsValidChannel"],
			"description": "Removes from the balance of the designated user."
		});
		this.currencySystem = new CurrencySystem(new Spreadsheet(Config.spreadsheet.id, Config.spreadsheet.clientEmail, Config.spreadsheet.privateKey));
	}

	public async messageRun(message: Message, args: Args, context: MessageCommand.RunContext): Promise<void> {
		if (!message.member) {
			return message.channel.send("**That command cannot be executed.**").then();
		}

		const currency: string = await args.pick("enum", { enum: [...Config.currencies, "all"] });
		const member: GuildMember = await args.pick("member");
		const amount: number = await args.pick("number");
		const reason: string = await args.rest("string");

		await this.currencySystem.remove(currency, Util.resolveDiscordName(message.member), Util.resolveDiscordName(member), amount, reason);
		return message.channel.send(`**${amount} ${currency === "all" ? "of all currencies" : currency} has been removed from ${member}.**`).then();
	}
}