import { SapphireClient } from "@sapphire/framework";
import { TextChannel, User } from "discord.js";
import { Util } from "./Util";
import Config = require("./Config");

export class Embeds {
	public static async send(client: SapphireClient, channelID: string, embed: any): Promise<void> {
		await (client.channels.cache.get(channelID) as TextChannel).send({ "embeds": [embed] });
	}

	public static daily(fields: any, user: User): any {
		return {
			"title": "Daily Rewards",
			"color": 7803166,
			"fields": fields,
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.avatarURL() + ""
			}
		};
	}

	public static balance(fields: any, user: User): any {
		return {
			"title": "Balance",
			"color": 7803166,
			"fields": fields,
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.avatarURL() + ""
			}
		};
	}

	public static added(fields: any, currency: string, amount: number, user: User, reason: string): any {
		return {
			"title": "Added",
			"color": 7803166,
			"fields": [...fields, { "inline": false, "name": "Reason", "value": reason }],
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.avatarURL() + ""
			}
		};
	}

	public static removed(fields: any, currency: string, amount: number, user: User, reason: string): any {
		return {
			"title": "Removed",
			"color": 7803166,
			"fields": [...fields, { "inline": false, "name": "Reason", "value": reason }],
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.avatarURL() + ""
			}
		};
	}

	public static currency(currency: string, amount: number): any {
		let fields: { "inline": boolean, "name": string, "value": string }[] = [];
		if (currency === "all") {
			for (let i = 0; i < Config.currencies.length; i++) {
				fields.push({ "inline": true, "name": Util.capitalize(Config.currencies[i]), "value": `[+${amount.toString()}](https://localhost)` });
			}
		} else {
			fields.push({ "inline": true, "name": Util.capitalize(currency), "value": `[+${amount.toString()}](https://localhost)` });
		}
		return fields;
	}
}