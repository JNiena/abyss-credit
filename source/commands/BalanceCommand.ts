import {Args, Command} from "@sapphire/framework";
import type {Message} from "discord.js";
import {Guild, GuildMember} from "discord.js";
import google from "../../config/Google";
import bot from "../../config/Bot";
import {GoogleSpreadsheetRow} from "google-spreadsheet";
import {Spreadsheet} from "../Spreadsheet";
import {DiscordUtil} from "../DiscordUtil";

export class BalanceCommand extends Command {

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "balance",
			aliases: ["b"]
		});
	}

	public async messageRun(message: Message, args: Args): Promise<Message> {
		let guild: Guild | undefined = this.container.client.guilds.cache.get(bot.guild);
		if (guild === undefined) return message.channel.send("Invalid guild!");

		let targetUser: string = await args.pick("string").catch(() => message.author.id);
		if (targetUser !== message.author.id) targetUser = targetUser.slice(3, -1);

		let rows: GoogleSpreadsheetRow[] = await Spreadsheet.getRows(google.spreadsheet_id, google.client_email, google.private_key).then();
		let member: GuildMember | undefined = DiscordUtil.getMember(guild, targetUser);
		if (member === undefined) return message.channel.send("Invalid user!");

		return message.channel.send(`This user has ${this.getCredits(rows, DiscordUtil.getName(member))} credits`);
	}

	private getCredits(rows: GoogleSpreadsheetRow[], user: string): number {
		for (let i = 0; i < rows.length; i++) {
			if (rows[i]["Player Name"] === user) {
				return Number.parseInt(rows[i]["Total Credit"]);
			}
		}
		return 0;
	}

}