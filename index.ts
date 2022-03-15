import { FileCreditSystem } from './source/FileCreditSystem';
import { PersistentData } from './source/PersistentData';
import { SapphireClient } from '@sapphire/framework';
import botconfig from './botconfig';

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'], defaultPrefix: botconfig.prefix});

let config: PersistentData = new PersistentData("filesystemconfig.ts");
let system: FileCreditSystem = new FileCreditSystem(config);

client.once('ready', () => {
	console.log('Ready!');
});

client.login(botconfig.token);