import { PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default {
  name: 'setwelcomemsg',
  category: 'Config',
  description: 'Set a custom welcome message template. e.g. !setwelcomemsg Welcome {user} to {server}!',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("You do not have permission to use this command. Administrator permission is required.");
    }

    const template = args.join(' ');
    if (!template) {
      return message.reply(`Usage: \`${client.prefix}setwelcomemsg <message template>\`\nPlaceholders: \`{user}\` (mention user), \`{server}\` (server name), \`{count}\` (member count).`);
    }

    const dbPath = path.join(process.cwd(), 'database.json');
    try {
      let data = {};
      if (fs.existsSync(dbPath)) {
        data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
      }
      if (!data.guilds) data.guilds = {};
      if (!data.guilds[message.guild.id]) data.guilds[message.guild.id] = {};

      data.guilds[message.guild.id].welcome_message = template;

      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');

      await message.reply(`✅ Welcome message template updated to:\n\`\`\`\n${template}\n\`\`\``);
    } catch (e) {
      console.error(e);
      await message.reply("❌ Failed to update welcome message configuration.");
    }
  }
};
