import { EmbedBuilder } from 'discord.js';

const DAILY_AMOUNT = 200;
const COOLDOWN_MS  = 24 * 60 * 60 * 1000; // 24 hours

export default {
  name: 'daily',
  category: 'Economy',
  description: 'Claim your daily reward of 200 coins (24h cooldown).',
  async execute(message, args, client) {
    const { data, user } = client.getEconomy(message.guild.id, message.author.id);

    const now = Date.now();
    if (user.last_daily) {
      const elapsed = now - new Date(user.last_daily).getTime();
      if (elapsed < COOLDOWN_MS) {
        const remaining = COOLDOWN_MS - elapsed;
        const hours   = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        return message.reply(`⏳ You already claimed your daily reward! Come back in **${hours}h ${minutes}m**.`);
      }
    }

    user.cash += DAILY_AMOUNT;
    user.last_daily = new Date(now).toISOString();
    client.saveEconomy(data);

    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle('💰 Daily Reward Claimed!')
      .setDescription(`You received **${DAILY_AMOUNT.toLocaleString()} coins**!\nNew balance: **${user.cash.toLocaleString()} coins** in hand.`)
      .setFooter({ text: 'Come back in 24 hours for another reward!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
