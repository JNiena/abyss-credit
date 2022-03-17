import { SapphireClient } from '@sapphire/framework';
import botconfig from './botconfig';
import credentials from './credentials';

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'], defaultPrefix: botconfig.prefix});

client.once('ready', () => {
	console.log('Ready!');
});

client.login(botconfig.token);