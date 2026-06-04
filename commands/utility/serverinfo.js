import { EmbedBuilder } from 'discord.js';

export default {
  name: 'serverinfo',
  category: 'Utility',
  aliases: ['server', 'si'],
  description: 'Shows server information.',
  async execute(message, args, client) {
    const { guild } = message;
    if (!guild) return message.reply('This command can only be used in a server.');

    // Fetch the owner of the server
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`${guild.name} Server Details`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Server Name', value: guild.name, inline: true },
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: `${owner.user.tag} (${owner.id})`, inline: true },
        { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F> (<t:${Math.floor(guild.createdTimestamp / 1000)}:R>)`, inline: false },
        { name: 'Roles Count', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Channels Count', value: `${guild.channels.cache.size}`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
