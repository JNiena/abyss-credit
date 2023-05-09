import { SapphireClient } from "@sapphire/framework";
import { ClientOptions, TextChannel } from "discord.js";

export class DiscordClient extends SapphireClient {
	public constructor(options: ClientOptions) {
		super(options);
	}

	public async send(channelID: string, message: string): Promise<void> {
		if (message.trim().length === 0) {
			return Promise.resolve();
		}
		await (this.channels.cache.get(channelID) as TextChannel).send(message);
	}

	public async sendEmbed(channelID: string, embed: any): Promise<void> {
		await (this.channels.cache.get(channelID) as TextChannel).send({ "embeds": [embed] });
	}
}