import { Command } from "@sapphire/framework";
import { User } from "discord.js";
import { Embeds } from "../Embeds";
import { currencySystem } from "../Main";
import { Util } from "../Util";

export class RemoveCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			"name": "remove",
			"preconditions": ["IsCreditor", "IsValidChannel"],
			"description": "Removes from the balance of the designated user."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(builder => {
			builder.setName(this.name).setDescription(this.description)
				.addStringOption(option => Util.addCurrencyChoices(option).setName("currency").setDescription("The type of currency to remove.").setRequired(true))
				.addIntegerOption(option => option.setName("amount").setDescription("The amount of currency to remove.").setRequired(true).setMinValue(1))
				.addUserOption(option => option.setName("user").setDescription("The user to remove currency from.").setRequired(true))
				.addStringOption(option => option.setName("reason").setDescription("The reason for removing currency.").setRequired(true));
		}, { "idHints": ["1225881894651035728"] });
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const currency: string = interaction.options.getString("currency", true);
		const amount: number = interaction.options.getInteger("amount", true);
		const user: User = interaction.options.getUser("user", true);
		const reason: string = interaction.options.getString("reason", true);
		await currencySystem.remove(currency, interaction.user.id, user.id, amount, reason);
		return interaction.reply({ "embeds": [Embeds.removed(Embeds.currency(currency, amount, "-"), user, reason)] }).then();
	}
}