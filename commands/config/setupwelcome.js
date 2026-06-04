import fs from 'fs';
import path from 'path';
import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'setupwelcome',
  category: 'Config',
  description: 'Configure welcome and goodbye channels. e.g. !setupwelcome #welcome #goodbye',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("You do not have permission to use this command. Administrator permission is required.");
    }

    const welcomeArg = args[0];
    const goodbyeArg = args[1];

    if (!welcomeArg || !goodbyeArg) {
      return message.reply(`Usage: \`${client.prefix}setupwelcome <#welcome-channel> <#goodbye-channel>\``);
    }

    // Extract ID from channel mentions or use raw ID
    const welcomeId = welcomeArg.replace(/[<#>]/g, '');
    const goodbyeId = goodbyeArg.replace(/[<#>]/g, '');

    const welcomeChannel = message.guild.channels.cache.get(welcomeId);
    const goodbyeChannel = message.guild.channels.cache.get(goodbyeId);

    if (!welcomeChannel || !goodbyeChannel) {
      return message.reply("Please mention valid text channels or provide valid channel IDs.");
    }

    const dbPath = path.join(process.cwd(), 'database.json');
    try {
      let data = {};
      if (fs.existsSync(dbPath)) {
        data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
      }
      if (!data.guilds) data.guilds = {};
      if (!data.guilds[message.guild.id]) data.guilds[message.guild.id] = {};

      data.guilds[message.guild.id].welcome_channel = welcomeId;
      data.guilds[message.guild.id].goodbye_channel = goodbyeId;

      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');

      await message.reply(`✅ Welcome and Goodbye channels configured successfully!\n**Welcome:** ${welcomeChannel}\n**Goodbye:** ${goodbyeChannel}`);
    } catch (error) {
      console.error('[SETUPWELCOME ERROR]', error);
      await message.reply("❌ Failed to update database configuration.");
    }
  }
};
