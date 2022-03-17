import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import roles from '../roles';

export class ProjectManagerOnlyPrecondition extends Precondition {
  public run(message: Message) {
    return message.member?.roles.cache.has(roles['Project Manager'])
      ? this.ok()
      : this.error({ message: 'Only a project manager can use this command!' });
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ProjectManagerOnly: never;
	}
}