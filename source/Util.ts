import {SlashCommandStringOption} from "discord.js";
import Config = require("./Config");

export class Util {
	public static capitalize(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	public static random(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static addCurrencyChoices(option: SlashCommandStringOption): SlashCommandStringOption {
		for (let i = 0; i < Config.currencies.length; i++) {
			option.addChoices({
				"name": Config.currencies[i],
				"value": Config.currencies[i]
			});
		}
		return option.addChoices({
			"name": "all",
			"value": "all"
		});
	}
}