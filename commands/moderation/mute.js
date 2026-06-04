import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'mute',
  category: 'Moderation',
  description: 'Mutes (timeouts) a member in the server. e.g. !mute @user 10m [reason]',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("Please mention a valid member to mute.");
    }

    if (!target.moderatable) {
      return message.reply("I cannot mute this member. They might have a higher role or permissions than me.");
    }

    // Default duration is 10 minutes
    let durationMs = 10 * 60 * 1000;
    let durationLabel = '10 minutes';
    let reasonIndex = 1;

    const timeArg = args[1];
    if (timeArg) {
      const match = timeArg.match(/^(\d+)([mhd])$/);
      if (match) {
        const amount = parseInt(match[1]);
        const unit = match[2];
        reasonIndex = 2;

        if (unit === 'm') {
          durationMs = amount * 60 * 1000;
          durationLabel = `${amount} minute(s)`;
        } else if (unit === 'h') {
          durationMs = amount * 60 * 60 * 1000;
          durationLabel = `${amount} hour(s)`;
        } else if (unit === 'd') {
          durationMs = amount * 24 * 60 * 60 * 1000;
          durationLabel = `${amount} day(s)`;
        }
      }
    }

    const reason = args.slice(reasonIndex).join(' ') || 'No reason provided';

    try {
      await target.timeout(durationMs, reason);
      client.logModeration('MUTE', target, message.author, reason);
      await message.reply(`✅ **${target.user.tag}** has been muted for **${durationLabel}**.\n**Reason:** ${reason}`);
    } catch (error) {
      console.error('[MUTE ERROR]', error);
      await message.reply("❌ Failed to mute user.");
    }
  }
};
