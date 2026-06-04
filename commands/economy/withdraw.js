import { EmbedBuilder } from 'discord.js';

export default {
  name: 'withdraw',
  category: 'Economy',
  aliases: ['with'],
  description: 'Withdraws coins from your bank. e.g. !withdraw 100 or !withdraw all',
  async execute(message, args, client) {
    const { data, user } = client.getEconomy(message.guild.id, message.author.id);

    if (!args[0]) {
      return message.reply(`Usage: \`${client.prefix}withdraw <amount | all>\``);
    }

    let amount;
    if (args[0].toLowerCase() === 'all') {
      amount = user.bank;
    } else {
      amount = parseInt(args[0]);
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ Please provide a valid positive amount.');
    }

    if (amount > user.bank) {
      return message.reply(`❌ You only have **${user.bank.toLocaleString()} coins** in your bank. You can't withdraw more than that.`);
    }

    user.bank -= amount;
    user.cash += amount;
    client.saveEconomy(data);

    const embed = new EmbedBuilder()
      .setColor('#E74C3C')
      .setTitle('🏧 Withdrawal Successful!')
      .addFields(
        { name: 'Withdrawn', value: `**${amount.toLocaleString()} coins**`, inline: true },
        { name: '👛 Cash Now', value: `**${user.cash.toLocaleString()} coins**`, inline: true },
        { name: '🏦 Bank Now', value: `**${user.bank.toLocaleString()} coins**`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
