"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const Bot_1 = __importDefault(require("../config/Bot"));
let client = new framework_1.SapphireClient({ intents: ["GUILDS", "GUILD_MESSAGES"], defaultPrefix: Bot_1.default.prefix });
client.login(Bot_1.default.token).then();
