import { Precondition, Result, UserError } from "@sapphire/framework";
import { CommandInteraction, ContextMenuCommandInteraction, GuildMember, Message } from "discord.js";

export class IsCreditor extends Precondition {
	public override async messageRun(message: Message): Promise<Result<unknown, UserError>> {
		return this.hasCreditorRole(message.member);
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<Result<unknown, UserError>> {
		return this.error({ "message": "This precondition does not support interactions." });
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction): Promise<Result<unknown, UserError>> {
		return this.error({ "message": "This precondition does not support interactions." });
	}

	private async hasCreditorRole(member: GuildMember | null): Promise<Result<unknown, UserError>> {
		return member?.roles.cache.some(role => role.name === "Creditor")
			? this.ok()
			: this.error({ "message": "This member does not have the correct role." });
	}
}