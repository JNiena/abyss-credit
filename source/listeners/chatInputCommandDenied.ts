import {type ChatInputCommandDeniedPayload, Events, Identifiers, Listener, type UserError} from "@sapphire/framework";
import {InteractionResponse, Message} from "discord.js";
import {DurationFormatter} from "@sapphire/time-utilities";

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(error: UserError, {interaction}: ChatInputCommandDeniedPayload): Promise<Message> | Promise<InteractionResponse> {
		let message: string = error.message;
		if (error.identifier === Identifiers.PreconditionCooldown) {
			let remaining = new DurationFormatter().format(Reflect.get(Object(error.context), "remaining"));
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