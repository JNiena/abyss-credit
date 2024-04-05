import { Command } from "@sapphire/framework";
import { User } from "discord.js";
import { Embeds } from "../Embeds";
import { levelSystem } from "../Main";

export class LevelCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
			"name": "level",
			"preconditions": ["IsValidChannel"],
			"description": "Returns the level of the designated user."
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(builder => {
			builder.setName(this.name).setDescription(this.description)
				.addUserOption(option => option.setName("user").setDescription("The user to check the level of.").setRequired(false));
		}, { "idHints": ["1225640301247332352"] });
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		let user: User | null = interaction.options.getUser("user", false) ?? interaction.user;
		return interaction.reply({ "embeds": [Embeds.level(user, levelSystem.findXp(user.id), levelSystem.findTotalXp(user.id), levelSystem.findLevel(user.id))] }).then();
	}
}