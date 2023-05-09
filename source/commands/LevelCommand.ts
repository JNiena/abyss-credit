import { ChatInputCommand, Command } from "@sapphire/framework";
import { ChatInputCommandInteraction, InteractionResponse, User } from "discord.js";
import { Embeds } from "../Embeds";
import { levelSystem } from "../Main";

export class LevelCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			"name": "level",
			// @ts-ignore
			"preconditions": ["IsValidChannel"],
			"description": "Returns the level of the designated user."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry): void {
		registry.registerChatInputCommand(builder => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption(option => option.setName("user").setDescription("The user to check the level of.").setRequired(false));
		}, { "idHints": ["1103812055074623518"] });
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Promise<InteractionResponse> {
		await interaction.deferReply();
		let user: User | null = interaction.options.getUser("user", false);
		if (!user) {
			user = interaction.user;
		}
		return interaction.editReply({ "embeds": [Embeds.level(user, levelSystem.findXp(user.id), levelSystem.findTotalXp(user.id), levelSystem.findLevel(user.id))] }).then();
	}
}