import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'clear',
  category: 'Moderation',
  aliases: ['purge'],
  description: 'Deletes a specified number of messages. e.g. !clear 10',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply("You do not have permission to use this command.");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 99) {
      return message.reply("Please provide a number between 1 and 99 of messages to clear.");
    }

    try {
      // Delete command message + target messages
      const deleted = await message.channel.bulkDelete(amount + 1, true);
      const msg = await message.channel.send(`✅ Cleared **${deleted.size - 1}** message(s).`);
      setTimeout(() => msg.delete().catch(() => {}), 5000);
    } catch (error) {
      console.error('[CLEAR ERROR]', error);
      await message.reply("❌ Failed to clear messages. Note that messages older than 14 days cannot be bulk deleted.");
    }
  }
};
