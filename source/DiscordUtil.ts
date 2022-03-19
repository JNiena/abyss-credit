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

	public static hasAnyRole(member: GuildMember, roles: string[]): boolean {
		for (let i = 0; i < roles.length; i++) {
			if (member?.roles.cache.has(roles[i])) {
				return true;
			}
		}
		return false;
	}

	public static parseNum(number: string): number | undefined {
		number = number.replace(/,/g, "");
		if (!/^\d+$/.test(number)) return undefined;
		return Number.parseInt(number);
	}

}