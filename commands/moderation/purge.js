import clearCommand from './clear.js';

export default {
  ...clearCommand,
  category: 'Moderation',
  name: 'purge',
  aliases: ['clear']
};
