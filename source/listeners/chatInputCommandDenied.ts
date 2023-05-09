import { type ChatInputCommandDeniedPayload, Events, Identifiers, Listener, type UserError } from "@sapphire/framework";
import { DurationFormatter } from "@sapphire/time-utilities";
import { InteractionResponse, Message } from "discord.js";

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload): Promise<Message> | Promise<InteractionResponse> {
		let message: string = error.message;
		if (error.identifier === Identifiers.PreconditionCooldown) {
			const remaining = new DurationFormatter().format(Reflect.get(Object(error.context), "remaining"));
			message = `This command is still on a cooldown! Try again in ${remaining}.`;
		}
		if (interaction.deferred || interaction.replied) {
			return interaction.editReply({
				"content": message
			});
		}
		return interaction.reply({
			"content": message,
			"ephemeral": true
		});
	}
}