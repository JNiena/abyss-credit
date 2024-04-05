import { SlashCommandStringOption } from "discord.js";
import { config } from "./Main";

export class Util {
	public static capitalize(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	public static random(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static factorial(number: number) {
		var result: number = number;
		if (number === 0 || number === 1) { return 1; }
		while (number > 1) {
			number--;
			result = result * number;
		}
		return result;
	}

	public static addCurrencyChoices(option: SlashCommandStringOption) {
		for (let i: number = 0; i < config.get().currencies.length; i++) { option.addChoices({ "name": config.get().currencies[i], "value": config.get().currencies[i] }); }
		return option.addChoices({ "name": "all", "value": "all" });
	}

	public static createProgressBar(value: number, maxValue: number, size: number) {
		const percentage: number = Math.min(value / maxValue, 1);
		const progress: number = Math.max(0, Math.round(size * percentage));
		const emptyProgress: number = Math.max(0, size - progress);
		const progressText: string = "▇".repeat(progress);
		const emptyProgressText: string = "—".repeat(emptyProgress);
		const percentageText = Math.round(percentage * 100) + "%";
		return "`[" + progressText + emptyProgressText + "]" + percentageText + "`";
	}

	public static formatRewards(rewards: { "currency": string, "amount": number }[]) {
		let rewardsFormatted: string = "You have earned ";
		if (rewards.length === 1) { rewardsFormatted += `${rewards[0].amount} ${rewards[0].currency}`; }
		else {
			for (let i: number = 0; i < rewards.length - 1; i++) { rewardsFormatted += `${rewards[i].amount} ${rewards[i].currency}, `; }
			rewardsFormatted += `and ${rewards[rewards.length - 1].amount} ${rewards[rewards.length - 1].currency}`;
		}
		return rewardsFormatted;
	}
}