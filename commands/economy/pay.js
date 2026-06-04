import { EmbedBuilder } from 'discord.js';

export default {
  name: 'pay',
  category: 'Economy',
  aliases: ['give'],
  description: 'Transfer coins to another user. e.g. !pay @user 100',
  async execute(message, args, client) {
    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a valid user.');
    if (target.id === message.author.id) return message.reply("❌ You can't pay yourself!");
    if (target.user.bot) return message.reply("❌ You can't pay bots!");

    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) {
      return message.reply(`Usage: \`${client.prefix}pay @user <amount>\``);
    }

    const { data, user: sender } = client.getEconomy(message.guild.id, message.author.id);
    const economy = data.guilds[message.guild.id].economy;
    if (!economy[target.id]) economy[target.id] = { cash: 0, bank: 0, last_daily: null, last_work: null };
    const receiver = economy[target.id];

    if (amount > sender.cash) {
      return message.reply(`❌ You only have **${sender.cash.toLocaleString()} coins** in hand.`);
    }

    sender.cash   -= amount;
    receiver.cash += amount;
    client.saveEconomy(data);

    const embed = new EmbedBuilder()
      .setColor('#9B59B6')
      .setTitle('💸 Payment Sent!')
      .setDescription(`**${message.author.username}** sent **${amount.toLocaleString()} coins** to **${target.user.username}**!`)
      .addFields(
        { name: `${message.author.username}'s Cash`, value: `**${sender.cash.toLocaleString()} coins**`, inline: true },
        { name: `${target.user.username}'s Cash`, value: `**${receiver.cash.toLocaleString()} coins**`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
