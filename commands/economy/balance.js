import { EmbedBuilder } from 'discord.js';

export default {
  name: 'balance',
  category: 'Economy',
  aliases: ['bal', 'money'],
  description: 'Shows your cash and bank balance.',
  async execute(message, args, client) {
    const target = message.mentions.members.first() || message.member;
    const { data, user } = client.getEconomy(message.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor('#F1C40F')
      .setTitle(`💰 ${target.user.username}'s Balance`)
      .addFields(
        { name: '👛 Cash', value: `**${user.cash.toLocaleString()}** coins`, inline: true },
        { name: '🏦 Bank', value: `**${user.bank.toLocaleString()}** coins`, inline: true },
        { name: '📊 Net Worth', value: `**${(user.cash + user.bank).toLocaleString()}** coins`, inline: true }
      )
      .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
