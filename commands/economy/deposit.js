import { EmbedBuilder } from 'discord.js';

export default {
  name: 'deposit',
  category: 'Economy',
  aliases: ['dep'],
  description: 'Deposits coins into your bank. e.g. !deposit 100 or !deposit all',
  async execute(message, args, client) {
    const { data, user } = client.getEconomy(message.guild.id, message.author.id);

    if (!args[0]) {
      return message.reply(`Usage: \`${client.prefix}deposit <amount | all>\``);
    }

    let amount;
    if (args[0].toLowerCase() === 'all') {
      amount = user.cash;
    } else {
      amount = parseInt(args[0]);
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ Please provide a valid positive amount.');
    }

    if (amount > user.cash) {
      return message.reply(`❌ You only have **${user.cash.toLocaleString()} coins** in hand. You can't deposit more than that.`);
    }

    user.cash -= amount;
    user.bank += amount;
    client.saveEconomy(data);

    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle('🏦 Deposit Successful!')
      .addFields(
        { name: 'Deposited', value: `**${amount.toLocaleString()} coins**`, inline: true },
        { name: '👛 Cash Now', value: `**${user.cash.toLocaleString()} coins**`, inline: true },
        { name: '🏦 Bank Now', value: `**${user.bank.toLocaleString()} coins**`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
