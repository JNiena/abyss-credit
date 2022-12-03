import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { DiscordUtil } from "../DiscordUtil";
import { Spreadsheet } from "../Spreadsheet";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Timestamp } from "../Timestamp";

export class CreditCommand extends Command {

	private name: string;
	private permissions: string[];
	private usage: string[];
	private credentials: any;

	public constructor(name: string, aliases: string[], permissions: string[], usage: string[], credentials: any) {
		super(name, {
			"aliases": aliases,
			"args": [
				{
					"id": "subCommand",
					"type": ["add", "remove"],
				},
				{
					"id": "receiver",
					"type": "member",
				},
				{
					"id": "amount",
					"type": "number",
				}
			]
		});
		this.name = name;
		this.permissions = permissions;
		this.usage = usage;
		this.credentials = credentials;
	}

	public async exec(message: Message, args: any): Promise<any> {
		if (message.member === null) {
			return;
		}
		if (!DiscordUtil.hasAnyRole(message.member, this.permissions)) {
			return message.channel.send("You do not have the required role to do that.");
		}
		if (!DiscordUtil.fromAnyChannel(message, this.usage)) {
			return message.channel.send(`That command cannot be used in this channel.\nTry the following channels: ${DiscordUtil.parseChannelNames(this.usage)}`);
		}
		if (args.subCommand === undefined || args.subCommand !== "add" && args.subCommand !== "remove") {
			return message.channel.send("That is an invalid subcommand.");
		}
		if (args.receiver === undefined) {
			return message.channel.send("That is an invalid user.");
		}
		if (args.amount === undefined || args.amount <= 0) {
			return message.channel.send("That is an invalid amount.");
		}
		let reply: string;
		args.subCommand === "add"
			? reply = `${args.amount} ${this.name} have been added to ${DiscordUtil.getName(args.receiver)}.`
			: reply = `${args.amount} ${this.name} have been removed from ${DiscordUtil.getName(args.receiver)}.`;
		let sheet: GoogleSpreadsheetWorksheet = await Spreadsheet.getSheet(this.credentials["spreadsheetID"], DiscordUtil.uppercaseFirst(this.name), this.credentials["clientEmail"], this.credentials["privateKey"]);
		await sheet.addRow({
			"Awarded By": DiscordUtil.getName(message.member),
			"Awarded To": DiscordUtil.getName(args.receiver),
			"Amount": (args.subCommand === "add" ? "+" : "-") + args.amount,
			"Time": Timestamp.now()
		});
		return message.channel.send(reply);
	}

}