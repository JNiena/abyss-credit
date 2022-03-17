import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import roles from '../roles';

export class OwnerOnlyPrecondition extends Precondition {
  public run(message: Message) {
    return message.member?.roles.cache.has(roles.Admin)
      ? this.ok()
      : this.error({ message: 'Only an admin can use this command!' });
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		AdminOnly: never;
	}
}