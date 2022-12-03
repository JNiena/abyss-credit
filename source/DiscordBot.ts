import { Config } from "./Config";
import { AkairoClient, Command, CommandHandler } from "discord-akairo";
import { TextChannel } from "discord.js";

export class DiscordBot extends AkairoClient {

	private commandHandler: CommandHandler;

	public constructor(config: Config) {
		super();
		this.commandHandler = new CommandHandler(this, { "prefix": config.get()["prefix"] });
		this.token = config.get()["token"];
	}

	public start(): void {
		if (this.token !== null) {
			this.login(this.token).then();
		}
	}

	public stop(): void {
		this.destroy();
	}

	public registerCommand(command: Command): void {
		this.commandHandler.register(command);
	}

	public async send(message: string, channelID: string): Promise<any> {
		if (message.trim().length === 0) {
			return Promise.resolve();
		}
		await (this.channels.cache.get(channelID) as TextChannel).send(message);
	}

}