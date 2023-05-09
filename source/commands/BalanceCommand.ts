import { ChatInputCommand, Command } from "@sapphire/framework";
import { ChatInputCommandInteraction, InteractionResponse, User } from "discord.js";
import { Embeds } from "../Embeds";
import { config, currencySystem } from "../Main";

export class BalanceCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "balance",
			// @ts-ignore
			"preconditions": ["IsValidChannel"],
			"description": "Returns the balance of the designated user."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry): void {
		registry.registerChatInputCommand(builder => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption(option => option.setName("user").setDescription("The user to check the balance of.").setRequired(false));
		}, { "idHints": ["1093782140296114308"] });
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Promise<InteractionResponse> {
		await interaction.deferReply();
		let user: User | null = interaction.options.getUser("user", false);
		if (!user) {
			user = interaction.user;
		}
		const fields: { "inline": boolean, "name": string, "value": string }[] = [];
		for (let i = 0; i < config.get().currencies.length; i++) {
			const balance: number = await currencySystem.balance(config.get().currencies[i], user.id);
			fields.push(Embeds.entry(config.get().currencies[i], balance));
		}
		return interaction.editReply({ "embeds": [Embeds.balance(fields, user)] }).then();
	}
}