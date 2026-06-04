import { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX || '!';

if (!token || token === 'TU_DISCORD_TOKEN_AQUI') {
  console.error('ERROR: Please configure a valid Discord Bot Token in the .env file.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
client.aliases = new Collection();
client.prefix = prefix;

// ─── Moderation Logger ────────────────────────────────────────────────────────
client.logModeration = (action, target, moderator, reason) => {
  const dbPath = path.join(__dirname, 'database.json');
  let data = {};
  if (fs.existsSync(dbPath)) {
    try { data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}'); } catch { data = {}; }
  }
  if (!data.moderation_logs) data.moderation_logs = [];
  data.moderation_logs.push({
    timestamp: new Date().toISOString(),
    action,
    target: { id: target.id, tag: target.tag || (target.user ? target.user.tag : 'Unknown') },
    moderator: { id: moderator.id, tag: moderator.tag },
    reason: reason || 'No reason provided'
  });
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// ─── Economy DB Helpers ───────────────────────────────────────────────────────
client.getEconomy = (guildId, userId) => {
  const dbPath = path.join(__dirname, 'database.json');
  let data = {};
  if (fs.existsSync(dbPath)) {
    try { data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}'); } catch { data = {}; }
  }
  if (!data.guilds) data.guilds = {};
  if (!data.guilds[guildId]) data.guilds[guildId] = {};
  if (!data.guilds[guildId].economy) data.guilds[guildId].economy = {};
  if (!data.guilds[guildId].economy[userId]) {
    data.guilds[guildId].economy[userId] = {};
  }
  const user = data.guilds[guildId].economy[userId];
  if (user.cash === undefined) user.cash = 0;
  if (user.bank === undefined) user.bank = 0;
  if (user.last_daily === undefined) user.last_daily = null;
  if (user.last_work === undefined) user.last_work = null;
  return { data, user };
};

client.saveEconomy = (data) => {
  const dbPath = path.join(__dirname, 'database.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// ─── Recursive Command Loader ─────────────────────────────────────────────────
const commandsPath = path.join(__dirname, 'commands');
const categoryFolders = fs.readdirSync(commandsPath).filter(f =>
  fs.statSync(path.join(commandsPath, f)).isDirectory()
);

for (const folder of categoryFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    try {
      const { default: command } = await import(fileUrl);
      if ('name' in command && 'execute' in command) {
        // Inject the folder name as category if not set
        if (!command.category) command.category = folder.charAt(0).toUpperCase() + folder.slice(1);
        client.commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
          for (const alias of command.aliases) client.aliases.set(alias, command.name);
        }
        console.log(`[LOG] [${command.category}] Loaded: ${command.name}`);
      } else {
        console.warn(`[WARNING] ${folder}/${file} is missing "name" or "execute".`);
      }
    } catch (error) {
      console.error(`[ERROR] Failed to load ${folder}/${file}:`, error);
    }
  }
}

// ─── Ready ────────────────────────────────────────────────────────────────────
client.once('ready', () => {
  console.log(`[LOG] Bot is online as ${client.user.tag}`);
  console.log(`[LOG] Prefix: "${client.prefix}" | Commands loaded: ${client.commands.size}`);
});

// Helper to format welcome/goodbye placeholders
const formatWelcomeMsg = (template, member) => {
  return template
    .replace(/{user}/g, member.toString())
    .replace(/{server}/g, member.guild.name)
    .replace(/{count}/g, member.guild.memberCount.toString());
};

// ─── Welcome ──────────────────────────────────────────────────────────────────
client.on('guildMemberAdd', async member => {
  const dbPath = path.join(__dirname, 'database.json');
  if (!fs.existsSync(dbPath)) return;
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
    const cfg = data.guilds?.[member.guild.id];
    if (cfg?.welcome_channel) {
      const channel = member.guild.channels.cache.get(cfg.welcome_channel);
      if (channel) {
        const rawTemplate = cfg.welcome_message || `Welcome to the server, {user}! We now have **{count}** members.`;
        const description = formatWelcomeMsg(rawTemplate, member);

        const embed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle('Welcome!')
          .setDescription(description)
          .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
          .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(console.error);
      }
    }
  } catch (e) { console.error('[WELCOME ERROR]', e); }
});

// ─── Goodbye ──────────────────────────────────────────────────────────────────
client.on('guildMemberRemove', async member => {
  const dbPath = path.join(__dirname, 'database.json');
  if (!fs.existsSync(dbPath)) return;
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
    const cfg = data.guilds?.[member.guild.id];
    if (cfg?.goodbye_channel) {
      const channel = member.guild.channels.cache.get(cfg.goodbye_channel);
      if (channel) {
        const rawTemplate = cfg.goodbye_message || `**{user}** has left the server. We now have **{count}** members.`;
        const description = formatWelcomeMsg(rawTemplate, member);

        const embed = new EmbedBuilder()
          .setColor('#ED4245')
          .setTitle('Goodbye!')
          .setDescription(description)
          .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
          .setTimestamp();
        await channel.send({ embeds: [embed] }).catch(console.error);
      }
    }
  } catch (e) { console.error('[GOODBYE ERROR]', e); }
});

// ─── Ticket Buttons ───────────────────────────────────────────────────────────
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  const { customId, guild, member, user } = interaction;
  const dbPath = path.join(__dirname, 'database.json');

  if (customId === 'create_ticket') {
    await interaction.deferReply({ ephemeral: true });
    try {
      if (!fs.existsSync(dbPath)) return interaction.editReply({ content: 'Database not found.' });
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
      const config = data.guilds?.[guild.id]?.ticket_config;
      if (!config) return interaction.editReply({ content: 'Ticket system is not configured.' });

      const existing = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
      if (existing) return interaction.editReply({ content: `You already have a ticket open: ${existing}` });

      const channel = await guild.channels.create({
        name: `ticket-${user.username}`,
        parent: config.category_id || null,
        permissionOverwrites: [
          { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
          { id: user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
          { id: client.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'] }
        ]
      });

      const innerEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(config.inner_title || 'Ticket Support')
        .setDescription(config.inner_desc || 'Staff will be with you shortly.')
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
      );

      await channel.send({ content: `${member}, welcome to your ticket!`, embeds: [innerEmbed], components: [row] });
      await interaction.editReply({ content: `Your ticket has been created: ${channel}` });
    } catch (e) {
      console.error('[TICKET CREATE ERROR]', e);
      await interaction.editReply({ content: '❌ Failed to create ticket. Check my permissions and role hierarchy.' });
    }
  }

  if (customId === 'close_ticket') {
    await interaction.reply({ content: '🔒 Closing this ticket in **5 seconds**...' });
    setTimeout(() => interaction.channel.delete().catch(console.error), 5000);
  }
});

// ─── Message Commands ─────────────────────────────────────────────────────────
client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(client.prefix)) return;
  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (!command) return;
  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(`[ERROR] "${commandName}":`, error);
    message.reply('There was an error executing that command!').catch(console.error);
  }
});

client.login(token);
