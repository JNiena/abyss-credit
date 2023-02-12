import { GuildMember } from "discord.js";

export class Util {
	public static uppercaseFirst(string: string): string {
		return string.charAt(0).toUpperCase() + string.substring(1);
	}

	public static resolveDiscordName(member: GuildMember): string {
		return member.nickname ? member.nickname : member.user.username;
	}
}