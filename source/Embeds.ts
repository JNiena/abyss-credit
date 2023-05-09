import { APIEmbed, User } from "discord.js";
import { config } from "./Main";
import { Util } from "./Util";

export class Embeds {
	public static level(user: User, xp: number, totalXp: number, level: number): APIEmbed {
		return {
			"title": "Level " + level,
			"color": 7803166,
			"fields": [
				{
					"inline": true,
					"name": "Progress",
					"value": `\`${xp}/${totalXp}\`\n\`${Util.createProgressBar(xp, totalXp, 15)}\``
				}
			],
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.displayAvatarURL()
			}
		};
	}

	public static daily(fields: any, user: User): APIEmbed {
		return {
			"title": "Daily Rewards",
			"color": 7803166,
			"fields": fields,
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.displayAvatarURL()
			}
		};
	}

	public static balance(fields: any, user: User): APIEmbed {
		return {
			"title": "Balance",
			"color": 7803166,
			"fields": fields,
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.displayAvatarURL()
			}
		};
	}

	public static added(fields: any, currency: string, amount: number, user: User, reason: string): APIEmbed {
		return {
			"title": "Added",
			"color": 7803166,
			"fields": [...fields, {
				"inline": false,
				"name": "Reason",
				"value": reason
			}],
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.displayAvatarURL()
			}
		};
	}

	public static removed(fields: any, currency: string, amount: number, user: User, reason: string): APIEmbed {
		return {
			"title": "Removed",
			"color": 7803166,
			"fields": [...fields, {
				"inline": false,
				"name": "Reason",
				"value": reason
			}],
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.displayAvatarURL()
			}
		};
	}

	public static currency(currency: string, amount: number, symbol: string): { "inline": boolean, "name": string, "value": string }[] {
		let fields: { "inline": boolean, "name": string, "value": string }[] = [];
		if (currency === "all") {
			for (let i = 0; i < config.get().currencies.length; i++) {
				fields.push(this.entry(config.get().currencies[i], amount, symbol));
			}
		}
		else {
			fields.push(this.entry(currency, amount));
		}
		return fields;
	}

	public static entry(currency: string, amount: number, symbol: string = ""): { "inline": boolean, "name": string, "value": string } {
		return {
			"inline": true,
			"name": Util.capitalize(currency),
			"value": `[${symbol}${amount.toString()}](https://localhost)`
		};
	}
}