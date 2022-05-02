import {Command} from "discord-akairo";
import {Message} from "discord.js";
import {Config} from "../Config";
import {DiscordUtil} from "../DiscordUtil";
import {Spreadsheet} from "../Spreadsheet";
import {GoogleSpreadsheetRow} from "google-spreadsheet";

export class BalanceCommand extends Command {

	private config: Config;

	public constructor(config: Config) {
		super("balance", {
			"aliases": ["balance", "bal", "b"],
			"args": [
				{
					"id": "member",
					"type": "member",
					"default": message => message.member
				}
			]
		});
		this.config = config;
	}

	public async exec(message: Message, args: any): Promise<any> {
		if (!DiscordUtil.hasAnyRole(message.member, this.config.get()["commands"]["balance"]["permissions"])) return message.channel.send("You do not have the required role to do that.");
		if (!DiscordUtil.fromAnyChannel(message, this.config.get()["commands"]["balance"]["usage"])) {
			return message.channel.send(`That command cannot be used in this channel.\nTry the following channels: ${DiscordUtil.parseChannelNames(this.config.get()["commands"]["balance"]["usage"])}`);
		}
		if (args.member === undefined) return message.channel.send("That is an invalid user.");
		let rows: GoogleSpreadsheetRow[] = await Spreadsheet.getRows(this.config.get()["google"]["spreadsheetID"], this.config.get()["google"]["clientEmail"], this.config.get()["google"]["privateKey"]);
		return message.channel.send(`That user has ${this.getCredits(rows, DiscordUtil.getName(args.member))} credits.`);
	}

	private getCredits(rows: GoogleSpreadsheetRow[], user: string): number {
		for (let i = 0; i < rows.length; i++) {
			if (rows[i]["Player Name"] === user) {
				let credits: number | undefined = DiscordUtil.parseNum(rows[i]["Total Credit"]);
				if (credits !== undefined) return credits;
				break;
			}
		}
		return 0;
	}

}