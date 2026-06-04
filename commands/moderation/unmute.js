import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'unmute',
  category: 'Moderation',
  description: 'Unmutes (removes timeout) a member in the server.',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("Please mention a valid member to unmute.");
    }

    if (!target.isCommunicationDisabled()) {
      return message.reply("This member is not muted/timed out.");
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await target.timeout(null, reason);
      client.logModeration('UNMUTE', target, message.author, reason);
      await message.reply(`✅ **${target.user.tag}** has been unmuted.`);
    } catch (error) {
      console.error('[UNMUTE ERROR]', error);
      await message.reply("❌ Failed to unmute user.");
    }
  }
};
