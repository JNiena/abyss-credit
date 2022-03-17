import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import roles from '../roles';

export class OwnerOnlyPrecondition extends Precondition {
  public run(message: Message) {
    return message.member?.roles.cache.has(roles.King)
      ? this.ok()
      : this.error({ message: 'Only a king can use this command!' });
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		KingOnly: never;
	}
}