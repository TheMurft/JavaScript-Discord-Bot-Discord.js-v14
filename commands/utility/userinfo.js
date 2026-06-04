import { EmbedBuilder } from 'discord.js';

export default {
  name: 'userinfo',
  category: 'Utility',
  aliases: ['user', 'ui'],
  description: 'Shows user information.',
  async execute(message, args, client) {
    const member = message.mentions.members.first() || message.member;
    const { user } = member;

    const roles = member.roles.cache
      .filter(role => role.name !== '@everyone')
      .map(role => role.toString())
      .join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`${user.username}'s Details`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'Username', value: user.tag, inline: true },
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`, inline: false },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`, inline: false },
        { name: 'Roles', value: roles }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
