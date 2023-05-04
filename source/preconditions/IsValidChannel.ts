import {Precondition, Result, UserError} from "@sapphire/framework";
import {CommandInteraction, ContextMenuCommandInteraction, Message} from "discord.js";
import {config} from "../Main";

export class IsValidChannel extends Precondition {
    public override async messageRun(message: Message): Promise<Result<unknown, UserError>> {
        return this.error({"message": "This precondition is not supported."});
    }

    public override async chatInputRun(interaction: CommandInteraction): Promise<Result<unknown, UserError>> {
        return this.isValidChannel(interaction.channelId);
    }

    public override async contextMenuRun(interaction: ContextMenuCommandInteraction): Promise<Result<unknown, UserError>> {
        return this.isValidChannel(interaction.channelId);
    }

    private async isValidChannel(channelId: string): Promise<Result<unknown, UserError>> {
        return config.get().channels.includes(channelId)
            ? this.ok()
            : this.error({"message": "You cannot use that command in this channel."});
    }
}