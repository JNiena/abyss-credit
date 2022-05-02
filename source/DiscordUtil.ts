import {GuildMember, Message} from "discord.js";

export class DiscordUtil {

	public static getName(member: GuildMember): string {
		return member.nickname ? member.nickname : member.user.username;
	}

	public static hasAnyRole(member: GuildMember, roles: string[]): boolean {
		for (let i = 0; i < roles.length; i++) {
			if (member?.roles.cache.has(roles[i])) {
				return true;
			}
		}
		return false;
	}

	public static fromAnyChannel(message: Message, channels: string[]): boolean {
		for (let i = 0; i < channels.length; i++) {
			if (message.channel.id === channels[i]) {
				return true;
			}
		}
		return false;
	}

	public static parseChannelNames(channels: string[], minus: number = 0): string {
		let names: string = "";
		for (let i = 0; i < channels.length - minus; i++) {
			 names += `<#${channels[i]}> `;
		}
		return names.slice(0, -1) + ".";
	}

	public static parseNum(number: string): number | undefined {
		number = number.replace(/,/g, "");
		if (!/^\d+$/.test(number)) return undefined;
		return Number.parseInt(number);
	}

}