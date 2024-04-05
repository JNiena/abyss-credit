import { User } from "discord.js";
import { Config } from "./Config";
import { Embeds } from "./Embeds";
import { config, currencySystem, discordClient } from "./Main";
import { Util } from "./Util";

export class LevelSystem {
	private users: Config;

	public constructor() {
		this.users = new Config("levels.json");
	}

	public findXp(id: string) {
		const xp: number = this.users.get()[id];
		if (xp) { return xp; }
		return 0;
	}

	public findTotalXp(id: string) {
		return Math.ceil(330 * Math.log10(Util.factorial(this.findLevel(id) + 2)));
	}

	public findLevel(id: string) {
		const xp: number = this.findXp(id);
		for (let level: number = 100; level >= 41; level--) { if (xp >= Math.ceil(40_000 * Math.pow(4, level - 41))) { return level; } }
		for (let level: number = 40; level >= 0; level--) { if (xp >= Math.ceil(330 * Math.log10(Util.factorial(level + 1)))) { return level; } }
		return 0;
	}

	public persistXp(id: string, amount: number) {
		const previousLevel: number = this.findLevel(id);
		if (!this.users.get()[id]) { this.users.get()[id] = amount; }
		this.users.get()[id] += amount;
		this.users.save();
		const newLevel: number = this.findLevel(id);
		if (previousLevel === newLevel - 1) { this.levelUp(id, newLevel); }
	}

	private levelUp(id: string, level: number) {
		const rewards: any = config.get().leveling.rewards;
		const user: User = (discordClient.users.cache.get(id) as User);
		for (let i: number = 0; i < rewards.length; i++) { currencySystem.add(rewards[i].currency, "Level Up", id, rewards[i].amount, "Level Up").then(); }
		discordClient.sendEmbed(Embeds.levelUp(user, level, rewards), config.get().leveling.channel).then();
	}
}