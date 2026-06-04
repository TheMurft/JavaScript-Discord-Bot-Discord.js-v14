import { EmbedBuilder } from 'discord.js';

const ROB_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutos
const SUCCESS_CHANCE = 0.5;

export default {
  name: 'rob',
  category: 'Economy',
  description: "Attempt to rob a user's cash (50% success chance). e.g. !rob @user", // Comillas dobles corregidas
  async execute(message, args, client) {
    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a valid user to rob.');
    if (target.id === message.author.id) return message.reply("❌ You can't rob yourself!");
    if (target.user.bot) return message.reply("❌ You can't rob bots!");

    // Extraemos "data" (toda la base de datos de la guild) y "user" (el ladrón)
    const { data, user: robber } = client.getEconomy(message.guild.id, message.author.id);

    // Accedemos de forma segura a la economía de la guild dentro del mismo archivo de "data"
    const guildEconomy = data.guilds?.[message.guild.id]?.economy || data[message.guild.id] || data;

    // Si la víctima no existe en la base de datos, la inicializamos
    if (!guildEconomy[target.id]) {
      guildEconomy[target.id] = { cash: 0, bank: 0, last_daily: null, last_work: null };
    }
    const victim = guildEconomy[target.id];

    // Cooldown check
    const now = Date.now();
    if (robber.last_rob) {
      const elapsed = now - new Date(robber.last_rob).getTime();
      if (elapsed < ROB_COOLDOWN_MS) {
        const remaining = Math.ceil((ROB_COOLDOWN_MS - elapsed) / 60000);
        return message.reply(`⏳ You need to lay low! Try again in **${remaining} minute(s)**.`);
      }
    }

    // Verificar si la víctima tiene dinero en mano (cash)
    if (!victim.cash || victim.cash <= 0) {
      return message.reply(`❌ **${target.user.username}** doesn't have any cash to steal!`);
    }

    // Guardar cooldown
    robber.last_rob = new Date(now).toISOString();

    if (Math.random() < SUCCESS_CHANCE) {
      // ÉXITO: Robar entre 10% y 40% del cash de la víctima
      const pct = (Math.random() * 0.3 + 0.1);
      const stolen = Math.max(1, Math.floor(victim.cash * pct));

      victim.cash -= stolen;
      robber.cash = (robber.cash || 0) + stolen;

      // Guardamos la misma "data" global que usa tu comando withdraw
      client.saveEconomy(data);

      const embed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle('🦹 Robbery Successful!')
        .setDescription(`You stole **${stolen.toLocaleString()} coins** from **${target.user.username}**!`)
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } else {
      // FRACASO: El ladrón paga una multa del 10% al 25% de SU propio cash a la víctima
      const robberCash = robber.cash || 0;
      const fine = Math.max(1, Math.floor(robberCash * (Math.random() * 0.15 + 0.1)));
      const actualFine = Math.min(fine, robberCash);

      robber.cash -= actualFine;
      victim.cash += actualFine;

      // Guardamos la misma "data" global
      client.saveEconomy(data);

      const embed = new EmbedBuilder()
        .setColor('#E74C3C')
        .setTitle('🚔 Caught in the Act!')
        .setDescription(`You were caught robbing **${target.user.username}** and paid a fine of **${actualFine.toLocaleString()} coins**!`)
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }
  }
};