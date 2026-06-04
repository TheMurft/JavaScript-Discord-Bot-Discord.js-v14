import { EmbedBuilder } from 'discord.js';

const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
const JOBS = [
  { title: 'Software Developer', min: 80, max: 150 },
  { title: 'Chef',               min: 50, max: 100 },
  { title: 'Streamer',           min: 40, max: 120 },
  { title: 'Delivery Driver',    min: 30, max: 90  },
  { title: 'Freelancer',         min: 60, max: 140 },
  { title: 'Miner',              min: 50, max: 130 },
];

export default {
  name: 'work',
  category: 'Economy',
  description: 'Work and earn coins (1h cooldown).',
  async execute(message, args, client) {
    const { data, user } = client.getEconomy(message.guild.id, message.author.id);

    const now = Date.now();
    if (user.last_work) {
      const elapsed = now - new Date(user.last_work).getTime();
      if (elapsed < COOLDOWN_MS) {
        const remaining = COOLDOWN_MS - elapsed;
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return message.reply(`⏳ You're still recovering from your last shift! Come back in **${minutes}m ${seconds}s**.`);
      }
    }

    const job    = JOBS[Math.floor(Math.random() * JOBS.length)];
    const earned = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

    user.cash += earned;
    user.last_work = new Date(now).toISOString();
    client.saveEconomy(data);

    const embed = new EmbedBuilder()
      .setColor('#3498DB')
      .setTitle('💼 Work Shift Complete!')
      .setDescription(`You worked as a **${job.title}** and earned **${earned.toLocaleString()} coins**!\nNew balance: **${user.cash.toLocaleString()} coins** in hand.`)
      .setFooter({ text: 'You can work again in 1 hour.' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
