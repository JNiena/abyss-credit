import { ChatInputCommand, Command } from "@sapphire/framework";
import { ChatInputCommandInteraction, InteractionResponse, User } from "discord.js";
import { Embeds } from "../Embeds";
import { currencySystem } from "../Main";
import { Util } from "../Util";

export class AddCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "add",
			// @ts-ignore
			"preconditions": ["IsCreditor", "IsValidChannel"],
			"description": "Adds to the balance of the designated user."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry): void {
		registry.registerChatInputCommand(builder => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption(option => Util.addCurrencyChoices(option).setName("currency").setDescription("The type of currency to add.").setRequired(true))
				.addIntegerOption(option => option.setName("amount").setDescription("The amount of currency to add.").setRequired(true).setMinValue(1))
				.addUserOption(option => option.setName("user").setDescription("The user to add currency to.").setRequired(true))
				.addStringOption(option => option.setName("reason").setDescription("The reason for adding currency.").setRequired(true).setMinLength(1));
		}, { "idHints": ["1093782220554129408"] });
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Promise<InteractionResponse> {
		await interaction.deferReply();
		const currency: string = interaction.options.getString("currency", true);
		const amount: number = interaction.options.getInteger("amount", true);
		const user: User = interaction.options.getUser("user", true);
		const reason: string = interaction.options.getString("reason", true);
		await currencySystem.add(currency, interaction.user.id, user.id, amount, reason);
		return interaction.editReply({ "embeds": [Embeds.added(Embeds.currency(currency, amount, "+"), currency, amount, user, reason)] }).then();
	}
}