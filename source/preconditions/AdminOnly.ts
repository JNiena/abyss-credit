import {Precondition, PreconditionResult} from "@sapphire/framework";
import type {Message} from "discord.js";
import roles from "../../config/Roles";

export class AdminOnlyPrecondition extends Precondition {

	public run(message: Message): PreconditionResult {
		return message.member?.roles.cache.has(roles.Admin)
			? this.ok()
			: this.error({message: "You must be an admin to use this command."});
	}

}

declare module "@sapphire/framework" {

	interface Preconditions {
		AdminOnly: never;
	}

}