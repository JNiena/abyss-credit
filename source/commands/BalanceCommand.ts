import {ChatInputCommand, Command} from "@sapphire/framework";
import {ChatInputCommandInteraction, InteractionResponse, User} from "discord.js";
import {CurrencySystem} from "../CurrencySystem";
import {Embeds} from "../Embeds";
import {Spreadsheet} from "../Spreadsheet";
import Config = require("../Config");

export class BalanceCommand extends Command {
	private currencySystem: CurrencySystem;

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "balance",
			// @ts-ignore
			"preconditions": ["IsValidChannel"],
			"description": "Returns the balance of the designated user."
		});
		this.currencySystem = new CurrencySystem(new Spreadsheet(Config.spreadsheet.id, Config.spreadsheet.clientEmail, Config.spreadsheet.privateKey));
	}

	public override registerApplicationCommands(registry: Command.Registry): void {
		registry.registerChatInputCommand(builder => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption(option => option.setName("user").setDescription("The user to check the balance of.").setRequired(false));
		}, {"idHints": ["1093782140296114308"]});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Promise<InteractionResponse> {
		await interaction.deferReply();
		let user: User | null = interaction.options.getUser("user", false);
		if (!user) {
			user = interaction.user;
		}
		const fields: { "inline": boolean, "name": string, "value": string }[] = [];
		for (let i = 0; i < Config.currencies.length; i++) {
			const balance: number = await this.currencySystem.balance(Config.currencies[i], user.id);
			fields.push(Embeds.entry(Config.currencies[i], balance));
		}
		return interaction.editReply({"embeds": [Embeds.balance(fields, user)]}).then();
	}
}