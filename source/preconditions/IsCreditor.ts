import { Precondition } from "@sapphire/framework";
import { CommandInteraction, ContextMenuCommandInteraction, GuildMemberRoleManager, Message } from "discord.js";

export class IsCreditor extends Precondition {
	public override async messageRun(_message: Message) {
		return this.error({ "message": "This precondition is not supported." });
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		return this.hasCreditorRole(interaction.member?.roles);
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return this.hasCreditorRole(interaction.member?.roles);
	}

	private async hasCreditorRole(roles: GuildMemberRoleManager | string[] | null | undefined) {
		const message: string = "You need the creditor role to assign currencies.";
		if (!roles || !(roles instanceof GuildMemberRoleManager)) { return this.error({ "message": message }); }
		return roles.member.roles.cache.some(role => role.name === "Creditor") ? this.ok() : this.error({ "message": message });
	}
}

declare module "@sapphire/framework" {
	interface Preconditions {
		IsCreditor: never;
	}
}

export default undefined;