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
}