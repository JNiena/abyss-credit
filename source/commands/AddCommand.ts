import { Command } from "@sapphire/framework";
import { Embeds } from "../Embeds";
import { currencySystem } from "../Main";
import { Util } from "../Util";
import { User } from "discord.js";

export class AddCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			"name": "add",
			"preconditions": ["IsCreditor", "IsValidChannel"],
			"description": "Adds to the balance of the designated user."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(builder => {
			builder.setName(this.name).setDescription(this.description)
				.addStringOption(option => Util.addCurrencyChoices(option).setName("currency").setDescription("The type of currency to add.").setRequired(true))
				.addIntegerOption(option => option.setName("amount").setDescription("The amount of currency to add.").setRequired(true).setMinValue(1))
				.addUserOption(option => option.setName("user").setDescription("The user to add currency to.").setRequired(true))
				.addStringOption(option => option.setName("reason").setDescription("The reason for adding currency.").setRequired(true).setMinLength(1));
		}, { "idHints": ["1225640309640401039"] });
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const currency: string = interaction.options.getString("currency", true);
		const amount: number = interaction.options.getInteger("amount", true);
		const user: User = interaction.options.getUser("user", true);
		const reason: string = interaction.options.getString("reason", true);
		await currencySystem.add(currency, interaction.user.id, user.id, amount, reason);
		return interaction.reply({ "embeds": [Embeds.added(Embeds.currency(currency, amount, "+"), user, reason)] }).then();
	}
}