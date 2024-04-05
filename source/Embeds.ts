import { APIEmbedField, User } from "discord.js";
import { config } from "./Main";
import { Util } from "./Util";

export class Embeds {
	public static readonly green: number = 2817792;
	public static readonly red: number = 16711680;
	public static readonly neutral: number = 7803166;

	public static template(title: string, fields: APIEmbedField[], color: number, user: User) {
		return { "title": title, "color": color, "fields": fields, "footer": { "text": `User: ${user.username}` }, "thumbnail": { "url": user.displayAvatarURL() } };
	}

	public static level(user: User, xp: number, totalXp: number, level: number) {
		return this.template("Level " + level, [{ "name": "Progress", "value": `\`${xp}/${totalXp}\`\n\`${Util.createProgressBar(xp, totalXp, 15)}\``, "inline": true }], this.neutral, user);
	}

	public static levelUp(user: User, level: number, rewards: { "currency": string, "amount": number }[]) {
		return this.template("Level Up", [{ "name": "Info", "value": `Congratulations on leveling up to **level ${level}**!\n${Util.formatRewards(rewards)}!`, "inline": false }], this.neutral, user);
	}

	public static added(fields: APIEmbedField[], user: User, reason: string) {
		return this.template("Added", [...fields, { "name": "Reason", "value": reason, "inline": false }], this.neutral, user);
	}

	public static removed(fields: APIEmbedField[], user: User, reason: string) {
		return this.template("Removed", [...fields, { "name": "Reason", "value": reason, "inline": false }], this.neutral, user);
	}

	public static balance(fields: APIEmbedField[], user: User) {
		return this.template("Balance", fields, this.neutral, user);
	}

	public static daily(fields: APIEmbedField[], user: User) {
		return this.template("Daily Rewards", fields, this.neutral, user);
	}

	public static currency(currency: string, amount: number, symbol: string) {
		let fields: APIEmbedField[] = [];
		if (currency === "all") { for (let i: number = 0; i < config.get().currencies.length; i++) { fields.push(this.entry(config.get().currencies[i], amount, symbol)); } }
		else { fields.push(this.entry(currency, amount)); }
		return fields;
	}

	public static entry(currency: string, amount: number, symbol: string = "") {
		return { "name": Util.capitalize(currency), "value": `[${symbol}${amount.toString()}](https://localhost)`, "inline": true };
	}
}