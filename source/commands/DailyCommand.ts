import { ChatInputCommand, Command } from "@sapphire/framework";
import { APIEmbedField, ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Embeds } from "../Embeds";
import { config, currencySystem } from "../Main";

export class DailyCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "daily",
			// @ts-ignore
			"preconditions": ["IsValidChannel"],
			"cooldownDelay": 86_400_000,
			"description": "Rewards up to three credits and gold every day."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry): void {
		registry.registerChatInputCommand(builder => {
			builder
				.setName(this.name)
				.setDescription(this.description);
		}, { "idHints": ["1093782138891014205"] });
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Promise<InteractionResponse> {
		await interaction.deferReply();
		const fields: APIEmbedField[] = [];
		for (let i: number = 0; i < config.get().currencies.length; i++) {
			const amount: number = Math.floor(Math.random() * 3) + 1;
			await currencySystem.add(config.get().currencies[i], "Daily", interaction.user.id, amount, "Daily");
			fields.push(Embeds.entry(config.get().currencies[i], amount, "+"));
		}
		return interaction.editReply({ "embeds": [Embeds.daily(fields, interaction.user)] }).then();
	}
}