"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceCommand = void 0;
const framework_1 = require("@sapphire/framework");
const Google_1 = __importDefault(require("../../config/Google"));
const Bot_1 = __importDefault(require("../../config/Bot"));
const Spreadsheet_1 = require("../Spreadsheet");
const DiscordUtil_1 = require("../DiscordUtil");
const Permissions_1 = __importDefault(require("../../config/Permissions"));
const Channels_1 = __importDefault(require("../../config/Channels"));
class BalanceCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "balance",
            aliases: ["b", "bal"],
        });
    }
    async messageRun(message, args) {
        let guild = this.container.client.guilds.cache.get(Bot_1.default.guild);
        if (guild === undefined)
            return message.channel.send("Invalid guild!");
        if (message.member === null)
            return message.channel.send("Invalid arguments.");
        if (!DiscordUtil_1.DiscordUtil.hasAnyRole(message.member, Permissions_1.default.balance))
            return message.channel.send("You do not have the required role to do that!");
        if (!DiscordUtil_1.DiscordUtil.fromAnyChannel(message, Channels_1.default.balance))
            return message.channel.send("That command cannot be used in this channel!");
        let targetUser = await args.pick("string").catch(() => message.author.id);
        if (targetUser !== message.author.id)
            targetUser = targetUser.slice(3, -1);
        let rows = await Spreadsheet_1.Spreadsheet.getRows(Google_1.default.spreadsheet_id, Google_1.default.client_email, Google_1.default.private_key).then();
        let member = DiscordUtil_1.DiscordUtil.getMember(guild, targetUser);
        if (member === undefined)
            return message.channel.send("Invalid user!");
        return message.channel.send(`This user has ${this.getCredits(rows, DiscordUtil_1.DiscordUtil.getName(member))} credits`);
    }
    getCredits(rows, user) {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]["Player Name"] === user) {
                let credits = DiscordUtil_1.DiscordUtil.parseNum(rows[i]["Total Credit"]);
                if (credits !== undefined)
                    return credits;
                break;
            }
        }
        return 0;
    }
}
exports.BalanceCommand = BalanceCommand;
