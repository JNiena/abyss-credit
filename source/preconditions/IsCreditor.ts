import {Precondition, Result, UserError} from "@sapphire/framework";
import {CommandInteraction, ContextMenuCommandInteraction, GuildMemberRoleManager, Message} from "discord.js";

export class IsCreditor extends Precondition {
    public override async messageRun(message: Message): Promise<Result<unknown, UserError>> {
        return this.error({"message": "This precondition is not supported."});
    }

    public override async chatInputRun(interaction: CommandInteraction): Promise<Result<unknown, UserError>> {
        return this.hasCreditorRole(interaction.member?.roles);
    }

    public override async contextMenuRun(interaction: ContextMenuCommandInteraction): Promise<Result<unknown, UserError>> {
        return this.hasCreditorRole(interaction.member?.roles);
    }

    private async hasCreditorRole(roles: GuildMemberRoleManager | string[] | null | undefined): Promise<Result<unknown, UserError>> {
        const message: string = "You need the creditor role to assign currencies.";
        if (!roles || !(roles instanceof GuildMemberRoleManager)) {
            return this.error({"message": message});
        }
        return roles.member.roles.cache.some(role => role.name === "Creditor")
            ? this.ok()
            : this.error({"message": message});
    }
}