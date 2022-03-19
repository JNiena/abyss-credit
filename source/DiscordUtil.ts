import {Guild, GuildMember} from "discord.js";

export class DiscordUtil {

	public static getName(member: GuildMember): string {
		return member.nickname ? member.nickname : member.user.username;
	}

	public static getID(member: GuildMember): string {
		return member.id;
	}

	public static getMember(guild: Guild, memberID: string): GuildMember | undefined {
		return guild.members.cache.get(memberID);
	}

	public static parseNum(number: string): number | undefined {
		if (!/^\d+$/.test(number)) return undefined;
		return Number.parseInt(number);
	}

}