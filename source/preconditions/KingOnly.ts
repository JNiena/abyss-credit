import {Precondition, PreconditionResult} from "@sapphire/framework";
import type {Message} from "discord.js";
import roles from "../../config/Roles";

export class KingOnlyPrecondition extends Precondition {

	public run(message: Message): PreconditionResult {
		return message.member?.roles.cache.has(roles.King)
			? this.ok()
			: this.error({message: "You must be a king to use this command."});
	}

}

declare module "@sapphire/framework" {

	interface Preconditions {
		KingOnly: never;
	}

}