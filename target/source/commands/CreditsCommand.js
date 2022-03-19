"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsCommand = void 0;
const framework_1 = require("@sapphire/framework");
const Google_1 = __importDefault(require("../../config/Google"));
const Spreadsheet_1 = require("../Spreadsheet");
const Timestamp_1 = require("../Timestamp");
const Bot_1 = __importDefault(require("../../config/Bot"));
const DiscordUtil_1 = require("../DiscordUtil");
const Permissions_1 = __importDefault(require("../../config/Permissions"));
class CreditsCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "credits",
            aliases: ["c", "credit"]
        });
    }
    async messageRun(message, args) {
        let guild = this.container.client.guilds.cache.get(Bot_1.default.guild);
        if (guild === undefined)
            return message.channel.send("Invalid guild!");
        if (message.member === null)
            return message.channel.send("Invalid arguments.");
        if (!DiscordUtil_1.DiscordUtil.hasAnyRole(message.member, Permissions_1.default.credits))
            return message.channel.send("You do not have the required role to do that!");
        let subCommand = await args.pick("string");
        let targetUser = await args.pick("string").catch(() => message.author.id);
        if (targetUser !== message.author.id)
            targetUser = targetUser.slice(3, -1);
        let receiver = DiscordUtil_1.DiscordUtil.getMember(guild, targetUser);
        let giver = DiscordUtil_1.DiscordUtil.getMember(guild, message.author.id);
        if (receiver == undefined || giver == undefined)
            return message.channel.send("Invalid arguments!");
        let amount = DiscordUtil_1.DiscordUtil.parseNum(await args.pick("string"));
        if (amount === undefined || amount <= 0)
            return message.channel.send("Invalid arguments.");
        let creditAmount = "";
        let reply = "";
        if (subCommand === "add") {
            creditAmount = "+" + amount;
            reply = `${amount} credits have been added to ${DiscordUtil_1.DiscordUtil.getName(receiver)}`;
        }
        else if (subCommand === "remove") {
            creditAmount = "-" + amount;
            reply = `${amount} credits have been removed from ${DiscordUtil_1.DiscordUtil.getName(receiver)}`;
        }
        else
            return message.channel.send("Invalid arguments.");
        let sheet = await Spreadsheet_1.Spreadsheet.getSheet(Google_1.default.spreadsheet_id, Google_1.default.client_email, Google_1.default.private_key);
        await sheet.addRow({
            "Awarded By": DiscordUtil_1.DiscordUtil.getName(giver),
            "Awarded To": DiscordUtil_1.DiscordUtil.getName(receiver),
            "Credit Amount": creditAmount,
            "Time": Timestamp_1.Timestamp.now()
        });
        return message.channel.send(reply);
    }
}
exports.CreditsCommand = CreditsCommand;
