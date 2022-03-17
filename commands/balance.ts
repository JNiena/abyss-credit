import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import credentials from '../credentials';
import { GoogleSpreadsheet } from "google-spreadsheet";

export class BalanceCommand extends Command {

  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'balance'
    });
  }

  public async messageRun(message: Message, args: Args) {
    const targetUser = await args.pick('string').catch(() => message.author.id);

    const { client } = this.container;
    const guild = await client.guilds.cache.get('866073594610057216');

    const doc = new GoogleSpreadsheet(credentials.spreadsheet_id);

    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    if (!guild) return message.channel.send("This guild does not exist!");

    if (targetUser == message.author.id) {
      const user = guild.members.cache.get(targetUser);

      if (user) {
        const username = user.nickname ? user.nickname : user.user.username;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]["Player Name"] == username) {
            return message.channel.send(`This user has ${rows[i]["Total Credit"]} credits`);
          }
        }  
      }
    }
    else {
      const targetUserID = targetUser.slice(3, -1);

      if (guild && !guild.members.cache.get(targetUserID)) return message.channel.send('This user does not exist in the guild!');
      
      const user = guild.members.cache.get(targetUserID);

      if (user) {
        const username = user.nickname ? user.nickname : user.user.username;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]["Player Name"] == username) {
            return message.channel.send(`This user has ${rows[i]["Total Credit"]} credits`);
          }
        }  
      }
    }
    return message.channel.send('This user does not exist in the credit system!');
  }
}