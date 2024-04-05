import { Precondition } from "@sapphire/framework";
import { CommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";
import { config } from "../Main";

export class IsValidChannel extends Precondition {
	public override async messageRun(_message: Message) {
		return this.error({ "message": "This precondition is not supported." });
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		return this.isValidChannel(interaction.channelId);
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return this.isValidChannel(interaction.channelId);
	}

	private async isValidChannel(channelId: string) {
		return config.get().channels.includes(channelId) ? this.ok() : this.error({ "message": "You cannot use that command in this channel." });
	}
}

declare module "@sapphire/framework" {
	interface Preconditions {
		IsValidChannel: never;
	}
}

export default undefined;