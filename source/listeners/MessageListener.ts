import { Listener } from "@sapphire/framework";
import { Message } from "discord.js";
import { levelSystem } from "../Main";
import { Util } from "../Util";

export class MessageListener extends Listener {
	private periods: Map<string, { earned: number, started: boolean }>;

	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: "messageCreate"
		});
		this.periods = new Map<string, { earned: number, started: boolean }>();
	}

	public run(message: Message): void {
		const id: string = message.author.id;
		const xp: { earned: number, started: boolean } | undefined = this.periods.get(id);
		let add: number = Util.random(1, 3);
		if (!xp || !xp.started) {
			this.startPeriod(id, add);
			return;
		}
		if (xp.earned >= 10) {
			return;
		}
		if (xp.earned + add > 10) {
			add = 10 - xp.earned;
		}
		this.periods.set(id, { earned: xp.earned + add, started: xp.started });
		levelSystem.persistXp(id, add);
	}

	private startPeriod(id: string, add: number): void {
		this.periods.set(id, { earned: add, started: true });
		levelSystem.persistXp(id, add);
		setTimeout(() => {
			this.periods.set(id, { earned: 0, started: false });
		}, 60_000);
	}
}