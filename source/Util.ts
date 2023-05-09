import { SlashCommandStringOption } from "discord.js";
import { config } from "./Main";

export class Util {
	public static capitalize(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	public static random(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static factorial(number: number): number {
		return (number != 1) ? number * this.factorial(number - 1) : 1;
	}

	public static addCurrencyChoices(option: SlashCommandStringOption): SlashCommandStringOption {
		for (let i: number = 0; i < config.get().currencies.length; i++) {
			option.addChoices({
				"name": config.get().currencies[i],
				"value": config.get().currencies[i]
			});
		}
		return option.addChoices({
			"name": "all",
			"value": "all"
		});
	}

	public static createProgressBar(value: number, maxValue: number, size: number): string {
		const percentage: number = value / maxValue;
		const progress: number = Math.round(size * percentage);
		const emptyProgress: number = size - progress;
		const progressText: string = "▇".repeat(progress);
		const emptyProgressText: string = "—".repeat(emptyProgress);
		const percentageText = Math.round(percentage * 100) + "%";
		return "`[" + progressText + emptyProgressText + "]" + percentageText + "`";
	}

	public static formatRewards(rewards: { "currency": string, "amount": number }[]): string {
		let rewardsFormatted: string = "You have earned ";
		if (rewards.length === 1) {
			rewardsFormatted += `${rewards[0].amount} ${rewards[0].currency}`;
		}
		else {
			for (let i: number = 0; i < rewards.length - 1; i++) {
				rewardsFormatted += `${rewards[i].amount} ${rewards[i].currency}, `;
			}
			rewardsFormatted += `and ${rewards[rewards.length - 1].amount} ${rewards[rewards.length - 1].currency}`;
		}
		return rewardsFormatted;
	}
}