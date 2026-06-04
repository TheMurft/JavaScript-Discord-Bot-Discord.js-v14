import fs from 'fs';
import path from 'path';
import { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  name: 'setupticket',
  category: 'Config',
  description: 'Interactive setup wizard for the ticket system.',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("You do not have permission to use this command. Administrator permission is required.");
    }

    const config = {};
    let step = 1;

    await message.reply("Welcome to the **Ticket System Setup Wizard**! Let's configure it step-by-step.\n\n**Step 1:** Mention the channel where the ticket panel should be sent (or provide the Channel ID):");

    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 300000 }); // 5 minutes total

    collector.on('collect', async m => {
      const content = m.content.trim();

      if (step === 1) {
        const channelId = content.replace(/[<#>]/g, '');
        const targetChannel = message.guild.channels.cache.get(channelId);
        if (!targetChannel || !targetChannel.isTextBased()) {
          return m.reply("❌ Invalid text channel. Please mention a valid text channel or provide its ID again:");
        }
        config.panel_channel_id = channelId;
        step = 2;
        await m.reply("**Step 2:** Provide the Category ID where ticket channels will be created (type `none` for no category):");
      } 
      else if (step === 2) {
        if (content.toLowerCase() === 'none') {
          config.category_id = null;
        } else {
          const category = message.guild.channels.cache.get(content);
          if (!category || category.type !== 4) { // Category type is 4
            return m.reply("❌ Invalid Category ID. Please provide a valid Category ID or type `none`:");
          }
          config.category_id = content;
        }
        step = 3;
        await m.reply("**Step 3:** Enter the **Title** for the outer ticket panel (e.g., `📩 Support Tickets`):");
      } 
      else if (step === 3) {
        config.outer_title = content;
        step = 4;
        await m.reply("**Step 4:** Enter the **Description** for the outer ticket panel:");
      } 
      else if (step === 4) {
        config.outer_desc = content;
        step = 5;
        await m.reply("**Step 5:** Enter the text to display on the **Button** (e.g., `Create Ticket`):");
      } 
      else if (step === 5) {
        config.button_text = content;
        step = 6;
        await m.reply("**Step 6:** Enter the **Title** for the inner ticket message (displayed inside the ticket channel):");
      } 
      else if (step === 6) {
        config.inner_title = content;
        step = 7;
        await m.reply("**Step 7:** Enter the **Description** for the inner ticket message:");
      } 
      else if (step === 7) {
        config.inner_desc = content;
        collector.stop('completed');
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'completed') {
        const dbPath = path.join(process.cwd(), 'database.json');
        try {
          let data = {};
          if (fs.existsSync(dbPath)) {
            data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
          }
          if (!data.guilds) data.guilds = {};
          if (!data.guilds[message.guild.id]) data.guilds[message.guild.id] = {};

          data.guilds[message.guild.id].ticket_config = config;

          fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');

          // Send outer panel
          const targetChannel = message.guild.channels.cache.get(config.panel_channel_id);
          const outerEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(config.outer_title)
            .setDescription(config.outer_desc)
            .setTimestamp();

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('create_ticket')
              .setLabel(config.button_text)
              .setStyle(ButtonStyle.Primary)
              .setEmoji('📩')
          );

          await targetChannel.send({ embeds: [outerEmbed], components: [row] });

          await message.channel.send(`✅ **Ticket system setup completed!**\nThe ticket panel has been sent to ${targetChannel}.`);
        } catch (error) {
          console.error('[TICKET SETUP ERROR]', error);
          await message.channel.send("❌ An error occurred while saving the configuration.");
        }
      } else {
        await message.channel.send("❌ Ticket setup wizard timed out or was cancelled.");
      }
    });
  }
};
