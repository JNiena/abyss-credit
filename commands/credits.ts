import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import credentials from '../credentials';
import { GoogleSpreadsheet } from "google-spreadsheet";

export class CreditsCommand extends Command {

  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'credits',
      preconditions: ['AdminOnly', 'KingOnly']
    });
  }

  public async messageRun(message: Message, args: Args) {
    const subCmd = await args.pick('string');
    const targetUser = await args.pick('string');
    const targetUserID = targetUser.slice(3, -1);
    const amt = await args.pick('string');
    const amtInt = parseInt(amt);
    
    const { client } = this.container;
    const guild = await client.guilds.cache.get('866073594610057216');
    
    if (amtInt <= 0 || /^\d+$/.test(amt) == false) return message.channel.send('Invalid command arguments!');
    if (guild && !guild.members.cache.get(targetUserID)) return message.channel.send('This user does not exist in the guild!');
    if (!guild) return message.channel.send("This guild does not exist!");
    
    const user = await guild.members.cache.get(targetUserID);
    const messageUser = await guild.members.cache.get(message.author.id);

    const doc = new GoogleSpreadsheet(credentials.spreadsheet_id);

    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    // const currentAmt: number = await storage.get(targetUserID);

    const date = new Date();

    if (subCmd == 'add') {
      if (user && messageUser) {
        const addedRow = await sheet.addRow({
          "Awarded By": messageUser.nickname ? messageUser.nickname : message.author.username,
          "Awarded To": user.nickname ? user.nickname : user.user.username,
          "Credit Amount": amt,
          "Time": date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        });
      }
      return message.channel.send(`${amt} credits have been added to ${targetUser}`);
    }
    else if (subCmd == 'remove') {
      if (user && messageUser) {
        const addedRow = await sheet.addRow({
          "Awarded By": messageUser.nickname ? messageUser.nickname : message.author.username,
          "Awarded To": user.nickname ? user.nickname : user.user.username,
          "Credit Amount": "-"+amt,
          "Time": date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        });
      }
      return message.channel.send(`${amt} credits have been removed from ${targetUser}`);
    }
  }
}