import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'ban',
  category: 'Moderation',
  description: 'Bans a member from the server.',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply("You do not have permission to use this command.");
    }
    
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("Please mention a valid member to ban.");
    }

    if (!target.bannable) {
      return message.reply("I cannot ban this member. They might have a higher role or permissions than me.");
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await target.ban({ reason });
    client.logModeration('BAN', target, message.author, reason);
    
    await message.reply(`✅ **${target.user.tag}** has been banned.\n**Reason:** ${reason}`);
  }
};
