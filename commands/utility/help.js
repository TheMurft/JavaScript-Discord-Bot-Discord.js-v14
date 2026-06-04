import { EmbedBuilder } from 'discord.js';

const CATEGORY_ICONS = {
  Utility:      '🔧',
  Moderation:   '🛡️',
  Config:       '⚙️',
  Economy:      '💰'
};

export default {
  name: 'help',
  category: 'Utility',
  description: 'Shows all commands grouped by category.',
  async execute(message, args, client) {
    // Group commands by category
    const categories = {};
    client.commands.forEach(cmd => {
      const cat = cmd.category || 'Other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    });

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📖 Command Help')
      .setDescription(`Prefix: \`${client.prefix}\` — Use \`${client.prefix}help\` to see this menu.`)
      .setFooter({ text: 'Created by themurft • discord.gg/6C5t995jC6' })
      .setTimestamp();

    // Add one field per category
    for (const [categoryName, commands] of Object.entries(categories).sort()) {
      const icon = CATEGORY_ICONS[categoryName] || '📁';
      const commandList = commands
        .map(cmd => `\`${client.prefix}${cmd.name}\` — ${cmd.description || 'No description.'}`)
        .join('\n');
      embed.addFields({ name: `${icon} ${categoryName}`, value: commandList, inline: false });
    }

    await message.reply({ embeds: [embed] });
  }
};
