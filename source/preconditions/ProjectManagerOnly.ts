import {Precondition, PreconditionResult} from "@sapphire/framework";
import type {Message} from "discord.js";
import roles from "../../config/Roles";

export class ProjectManagerOnlyPrecondition extends Precondition {

	public run(message: Message): PreconditionResult {
		return message.member?.roles.cache.has(roles["Project Manager"])
			? this.ok()
			: this.error({message: "You must be a project manager to use this command."});
	}

}

declare module "@sapphire/framework" {

	interface Preconditions {
		ProjectManagerOnly: never;
	}

}