import {Args, Command} from "@sapphire/framework";
import type {Message} from "discord.js";
import {Guild, GuildMember} from "discord.js";
import google from "../../config/Google";
import {Spreadsheet} from "../Spreadsheet";
import {Timestamp} from "../Timestamp";
import bot from "../../config/Bot";
import {DiscordUtil} from "../DiscordUtil";
import {GoogleSpreadsheetWorksheet} from "google-spreadsheet";
import permissions from "../../config/Permissions";

export class CreditsCommand extends Command {

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "credits",
			aliases: ["c", "credit"]
		});
	}

	public async messageRun(message: Message, args: Args): Promise<Message> {
		let guild: Guild | undefined = this.container.client.guilds.cache.get(bot.guild);
		if (guild === undefined) return message.channel.send("Invalid guild!");

		if (message.member === null) return message.channel.send("Invalid arguments.");
		if (!DiscordUtil.hasAnyRole(message.member, permissions.credits)) return message.channel.send("You do not have the required role to do that!");

		let subCommand: string = await args.pick("string");

		let targetUser: string = await args.pick("string").catch(() => message.author.id);
		if (targetUser !== message.author.id) targetUser = targetUser.slice(3, -1);

		let receiver: GuildMember | undefined = DiscordUtil.getMember(guild, targetUser);
		let giver: GuildMember | undefined = DiscordUtil.getMember(guild, message.author.id);
		if (receiver == undefined || giver == undefined) return message.channel.send("Invalid arguments!");

		let amount: number | undefined = DiscordUtil.parseNum(await args.pick("string"));
		if (amount === undefined || amount <= 0) return message.channel.send("Invalid arguments.");

		let creditAmount: string = "";
		let reply: string = "";
		if (subCommand === "add") {
			creditAmount = "+" + amount;
			reply = `${amount} credits have been added to ${DiscordUtil.getName(receiver)}`;
		}
		else if (subCommand === "remove") {
			creditAmount = "-" + amount;
			reply = `${amount} credits have been removed from ${DiscordUtil.getName(receiver)}`;
		}
		else return message.channel.send("Invalid arguments.");

		let sheet: GoogleSpreadsheetWorksheet = await Spreadsheet.getSheet(google.spreadsheet_id, google.client_email, google.private_key);
		await sheet.addRow({
			"Awarded By": DiscordUtil.getName(giver),
			"Awarded To": DiscordUtil.getName(receiver),
			"Credit Amount": creditAmount,
			"Time": Timestamp.now()
		});
		return message.channel.send(reply);
	}

}