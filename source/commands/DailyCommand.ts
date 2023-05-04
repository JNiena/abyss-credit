import {ChatInputCommand, Command} from "@sapphire/framework";
import {ChatInputCommandInteraction, InteractionResponse} from "discord.js";
import {CurrencySystem} from "../CurrencySystem";
import {Embeds} from "../Embeds";
import {Spreadsheet} from "../Spreadsheet";
import {config} from "../Main";

export class DailyCommand extends Command {
    private currencySystem: CurrencySystem;

    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            "name": "daily",
            // @ts-ignore
            "preconditions": ["IsValidChannel"],
            "cooldownDelay": 86_400_000,
            "description": "Rewards up to three credits and gold every day."
        });
        this.currencySystem = new CurrencySystem(new Spreadsheet(config.get().spreadsheet.id, config.get().spreadsheet.clientEmail, config.get().spreadsheet.privateKey));
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand(builder => {
            builder
                .setName(this.name)
                .setDescription(this.description);
        }, {"idHints": ["1093782138891014205"]});
    }

    public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext): Promise<InteractionResponse> {
        await interaction.deferReply();
        const fields: { "inline": boolean, "name": string, "value": string }[] = [];
        for (let i = 0; i < config.get().currencies.length; i++) {
            const amount: number = Math.floor(Math.random() * 3) + 1;
            await this.currencySystem.add(config.get().currencies[i], "Daily", interaction.user.id, amount, "Daily");
            fields.push(Embeds.entry(config.get().currencies[i], amount, "+"));
        }
        return interaction.editReply({"embeds": [Embeds.daily(fields, interaction.user)]}).then();
    }
}