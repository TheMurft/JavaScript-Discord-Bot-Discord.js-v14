import { EmbedBuilder } from 'discord.js';

export default {
  name: 'avatar',
  category: 'Utility',
  aliases: ['av'],
  description: "Shows user's avatar.",
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const avatarUrl = user.displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`${user.username}'s Avatar`)
      .setImage(avatarUrl)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
