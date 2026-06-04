export default {
  name: 'ping',
  category: 'Utility',
  description: 'Shows bot and API latency.',
  async execute(message, args, client) {
    const msg = await message.reply('Pinging...');
    const latency = msg.createdTimestamp - message.createdTimestamp;
    await msg.edit(`Pong! 🏓\nBot Latency: \`${latency}ms\`\nAPI Latency: \`${Math.round(client.ws.ping)}ms\``);
  }
};
