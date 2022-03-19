"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordUtil = void 0;
class DiscordUtil {
    static getName(member) {
        return member.nickname ? member.nickname : member.user.username;
    }
    static getID(member) {
        return member.id;
    }
    static getMember(guild, memberID) {
        return guild.members.cache.get(memberID);
    }
    static hasAnyRole(member, roles) {
        for (let i = 0; i < roles.length; i++) {
            if (member?.roles.cache.has(roles[i])) {
                return true;
            }
        }
        return false;
    }
    static parseNum(number) {
        if (!/^\d+$/.test(number))
            return undefined;
        return Number.parseInt(number);
    }
}
exports.DiscordUtil = DiscordUtil;
