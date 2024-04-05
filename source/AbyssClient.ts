import { SapphireClient } from "@sapphire/framework";
import { APIEmbed, ClientOptions, TextChannel } from "discord.js";

export class AbyssClient extends SapphireClient {
	public constructor(options: ClientOptions) {
		super(options);
	}

	public async send(message: string, channelID: string) {
		if (message.trim().length === 0) { return Promise.resolve(); }
		return await (this.channels.cache.get(channelID) as TextChannel).send(message);
	}

	public async sendEmbed(embed: APIEmbed, channelID: string) {
		return await (this.channels.cache.get(channelID) as TextChannel).send({ "embeds": [embed] });
	}
}