import {ChatInputCommand, Command} from "@sapphire/framework";
import {ChatInputCommandInteraction, InteractionResponse, User} from "discord.js";
import {CurrencySystem} from "../CurrencySystem";
import {Embeds} from "../Embeds";
import {Spreadsheet} from "../Spreadsheet";
import {Util} from "../Util";
import Config = require("../Config");

export class RemoveCommand extends Command {
	private currencySystem: CurrencySystem;

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "remove",
			// @ts-ignore
			"preconditions": ["IsCreditor", "IsValidChannel"],
			"description": "Removes from the balance of the designated user."
		});
		this.currencySystem = new CurrencySystem(new Spreadsheet(Config.spreadsheet.id, Config.spreadsheet.clientEmail, Config.spreadsheet.privateKey));
	}

	public override registerApplicationCommands(registry: Command.Registry): void {
		registry.registerChatInputCommand(builder => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption(option => Util.addCurrencyChoices(option).setName("currency").setDescription("The type of currency to remove.").setRequired(true))
				.addIntegerOption(option => option.setName("amount").setDescription("The amount of currency to remove.").setRequired(true).setMinValue(1))
				.addUserOption(option => option.setName("user").setDescription("The user to remove currency from.").setRequired(true))
				.addStringOption(option => option.setName("reason").setDescription("The reason for removing currency.").setRequired(true));
		}, {"idHints": ["1093782137724993547"]});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Promise<InteractionResponse> {
		await interaction.deferReply();
		const currency: string = interaction.options.getString("currency", true);
		const amount: number = interaction.options.getInteger("amount", true);
		const user: User = interaction.options.getUser("user", true);
		const reason: string = interaction.options.getString("reason", true);
		await this.currencySystem.remove(currency, interaction.user.id, user.id, amount, reason);
		return interaction.editReply({"embeds": [Embeds.removed(Embeds.currency(currency, amount), currency, amount, user, reason)]}).then();
	}
}