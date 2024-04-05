import { Command } from "@sapphire/framework";
import { APIEmbedField } from "discord.js";
import { Embeds } from "../Embeds";
import { config, currencySystem } from "../Main";

export class DailyCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			"name": "daily",
			"preconditions": ["IsValidChannel"],
			"cooldownDelay": 86_400_000,
			"description": "Rewards up to three credits and gold every day."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(builder => {
			builder.setName(this.name).setDescription(this.description)
		}, { "idHints": ["1225881898577035306"] });
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const fields: APIEmbedField[] = [];
		for (let i: number = 0; i < config.get().currencies.length; i++) {
			const amount: number = Math.floor(Math.random() * 3) + 1;
			await currencySystem.add(config.get().currencies[i], "Daily", interaction.user.id, amount, "Daily");
			fields.push(Embeds.entry(config.get().currencies[i], amount, "+"));
		}
		return interaction.reply({ "embeds": [Embeds.daily(fields, interaction.user)] }).then();
	}
}