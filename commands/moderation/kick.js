import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'kick',
  category: 'Moderation',
  description: 'Kicks a member from the server.',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply("You do not have permission to use this command.");
    }
    
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("Please mention a valid member to kick.");
    }

    if (!target.kickable) {
      return message.reply("I cannot kick this member. They might have a higher role or permissions than me.");
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await target.kick(reason);
    client.logModeration('KICK', target, message.author, reason);
    
    await message.reply(`✅ **${target.user.tag}** has been kicked.\n**Reason:** ${reason}`);
  }
};
