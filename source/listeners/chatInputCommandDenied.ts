import { type ChatInputCommandDeniedPayload, Events, Listener, type UserError } from "@sapphire/framework";
import { InteractionResponse, Message } from "discord.js";

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload): Promise<Message> | Promise<InteractionResponse> {
		if (interaction.deferred || interaction.replied) {
			return interaction.editReply({
				"content": error.message
			});
		}
		return interaction.reply({
			"content": error.message,
			"ephemeral": true
		});
	}
}