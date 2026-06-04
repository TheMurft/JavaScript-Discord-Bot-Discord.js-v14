import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'unban',
  category: 'Moderation',
  description: 'Unbans a user from the server using their ID.',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply("You do not have permission to use this command.");
    }
    
    const targetId = args[0];
    if (!targetId) {
      return message.reply("Please provide a valid user ID to unban.");
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      const unbannedUser = await message.guild.members.unban(targetId, reason);
      client.logModeration('UNBAN', unbannedUser || { id: targetId, tag: `ID: ${targetId}` }, message.author, reason);
      await message.reply(`✅ User **${unbannedUser ? unbannedUser.tag : targetId}** has been unbanned.`);
    } catch (error) {
      console.error('[UNBAN ERROR]', error);
      await message.reply("❌ Failed to unban user. Make sure the ID is correct and they are banned.");
    }
  }
};
