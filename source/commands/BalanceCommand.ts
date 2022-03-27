import {Args, Command} from "@sapphire/framework";
import type {Message} from "discord.js";
import {Guild, GuildMember} from "discord.js";
import google from "../../config/Google";
import bot from "../../config/Bot";
import {GoogleSpreadsheetRow} from "google-spreadsheet";
import {Spreadsheet} from "../Spreadsheet";
import {DiscordUtil} from "../DiscordUtil";
import permissions from "../../config/Permissions";
import channels from "../../config/Channels"

export class BalanceCommand extends Command {

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "balance",
			aliases: ["b", "bal"],
		});
	}

	public async messageRun(message: Message, args: Args): Promise<Message> {
		let guild: Guild | undefined = this.container.client.guilds.cache.get(bot.guild);
		if (guild === undefined) return message.channel.send("Invalid guild!");

		if (message.member === null) return message.channel.send("Invalid arguments.");
		if (!DiscordUtil.hasAnyRole(message.member, permissions.balance)) return message.channel.send("You do not have the required role to do that!");

		if (!DiscordUtil.fromAnyChannel(message, channels.balance)) return message.channel.send("That command cannot be used in this channel!");

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
				let credits: number | undefined = DiscordUtil.parseNum(rows[i]["Total Credit"]);
				if (credits !== undefined) return credits;
				break;
			}
		}
		return 0;
	}

}