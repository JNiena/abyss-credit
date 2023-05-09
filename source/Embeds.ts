import { APIEmbed, APIEmbedField, User } from "discord.js";
import { config } from "./Main";
import { Util } from "./Util";

export class Embeds {
	public static readonly green: number = 2817792;
	public static readonly red: number = 16711680;
	public static readonly neutral: number = 7803166;

	public static template(title: string, fields: APIEmbedField[], color: number, user: User): APIEmbed {
		return {
			"title": title,
			"color": color,
			"fields": fields,
			"footer": {
				"text": `User: ${user.username}`
			},
			"thumbnail": {
				"url": user.displayAvatarURL()
			}
		};
	}

	public static level(user: User, xp: number, totalXp: number, level: number): APIEmbed {
		return this.template("Level" + level, [{
			"name": "Progress",
			"value": `\`${xp}/${totalXp}\`\n\`${Util.createProgressBar(xp, totalXp, 15)}\``,
			"inline": true
		}], this.neutral, user);
	}

	public static added(fields: APIEmbedField[], currency: string, amount: number, user: User, reason: string): APIEmbed {
		return this.template("Added", [...fields, {
			"name": "Reason",
			"value": reason,
			"inline": false
		}], this.neutral, user);
	}

	public static removed(fields: APIEmbedField[], currency: string, amount: number, user: User, reason: string): APIEmbed {
		return this.template("Removed", [...fields, {
			"name": "Reason",
			"value": reason,
			"inline": false
		}], this.neutral, user);
	}

	public static balance(fields: APIEmbedField[], user: User): APIEmbed {
		return this.template("Balance", fields, this.neutral, user);
	}

	public static daily(fields: APIEmbedField[], user: User): APIEmbed {
		return this.template("Daily Rewards", fields, this.neutral, user);
	}

	public static currency(currency: string, amount: number, symbol: string): APIEmbedField[] {
		let fields: APIEmbedField[] = [];
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

	public static entry(currency: string, amount: number, symbol: string = ""): APIEmbedField {
		return {
			"name": Util.capitalize(currency),
			"value": `[${symbol}${amount.toString()}](https://localhost)`,
			"inline": true
		};
	}
}