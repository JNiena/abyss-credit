import { Command } from "@sapphire/framework";
import { APIEmbedField, User } from "discord.js";
import { Embeds } from "../Embeds";
import { config, currencySystem } from "../Main";

export class BalanceCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			"name": "balance",
			"preconditions": ["IsValidChannel"],
			"description": "Returns the balance of the designated user."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(builder => {
			builder.setName(this.name).setDescription(this.description)
				.addUserOption(option => option.setName("user").setDescription("The user to check the balance of.").setRequired(false));
		}, { "idHints": ["1225640301927071806"] });
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		let user: User = interaction.options.getUser("user", false) ?? interaction.user;
		const fields: APIEmbedField[] = [];
		for (let i = 0; i < config.get().currencies.length; i++) {
			const balance: number = await currencySystem.balance(config.get().currencies[i], user.id);
			fields.push(Embeds.entry(config.get().currencies[i], balance));
		}
		return interaction.reply({ "embeds": [Embeds.balance(fields, user)] }).then();
	}
}