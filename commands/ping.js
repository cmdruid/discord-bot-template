import { events } from '../app'

events.on('cmd-ping', async interaction => {
  await interaction.reply('Pong!');
  console.log(interaction);
});