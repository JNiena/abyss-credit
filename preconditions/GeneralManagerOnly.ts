import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import roles from '../roles';

export class GeneralManagerOnlyPrecondition extends Precondition {
  public run(message: Message) {
    return message.member?.roles.cache.has(roles['General Manager'])
      ? this.ok()
      : this.error({ message: 'Only a general manager can use this command!' });
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		GeneralManagerOnly: never;
	}
}