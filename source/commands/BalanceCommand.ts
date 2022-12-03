import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { DiscordUtil } from "../DiscordUtil";
import { Spreadsheet } from "../Spreadsheet";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import console from "console";

export class BalanceCommand extends Command {

	private currencies: any;
	private permissions: string[];
	private usage: string[];
	private credentials: any;

	public constructor(currencies: any, aliases: string[], permissions: string[], usage: string[], credentials: any) {
		super("balance", {
			"aliases": aliases,
			"args": [
				{
					"id": "member",
					"type": "member",
					"default": (message: { member: any; }) => message.member
				}
			]
		});
		this.currencies = currencies;
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
		if (args.member === undefined) {
			return message.channel.send("That is an invalid user.");
		}
		let currencies: [string, GoogleSpreadsheetRow[]][] = await this.getCurrencies();
		let formattedMessage: string = "";
		for (let i = 0; i < currencies.length; i++) {
			let balance: number = this.getBalance(currencies[i][1], DiscordUtil.getName(args.member));
			let currency: string = currencies[i][0];
			formattedMessage += `${DiscordUtil.uppercaseFirst(currency)}: ${balance}\n`;
		}
		return message.channel.send(formattedMessage);
	}

	private getBalance(rows: GoogleSpreadsheetRow[], user: string): number {
		for (let i = 0; i < rows.length; i++) {
			if (rows[i]["Name"] === user) {
				let balance: number | undefined = DiscordUtil.parseNum(rows[i]["Total"]);
				if (balance !== undefined) {
					return balance;
				}
				break;
			}
		}
		return 0;
	}

	private async getCurrencies(): Promise<[string, GoogleSpreadsheetRow[]][]> {
		let sheets: [string, GoogleSpreadsheetRow[]][] = [];
		let keys: string[] = Object.keys(this.currencies);
		for (let i = 0; i < keys.length; i++) {
			let sheet: GoogleSpreadsheetRow[] = await Spreadsheet.getRows(this.credentials["spreadsheetID"], DiscordUtil.uppercaseFirst(keys[i]), this.credentials["clientEmail"], this.credentials["privateKey"]);
			sheets.push([keys[i], sheet]);
		}
		return sheets;
	}

}