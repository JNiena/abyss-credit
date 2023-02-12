import { Precondition, Result, UserError } from "@sapphire/framework";
import { CommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";
import Config = require("../Config");

export class IsValidChannel extends Precondition {
	public override async messageRun(message: Message): Promise<Result<unknown, UserError>> {
		return this.isValidChannel(message.channel.id);
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<Result<unknown, UserError>> {
		return this.error({ "message": "This precondition does not support interactions." });
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction): Promise<Result<unknown, UserError>> {
		return this.error({ "message": "This precondition does not support interactions." });
	}

	private async isValidChannel(channelId: string): Promise<Result<unknown, UserError>> {
		return Config.channels.includes(channelId)
			? this.ok()
			: this.error({ "message": "That command cannot be used in this channel." });
	}
}