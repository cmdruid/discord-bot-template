
/** app.js
 * Main application logic for Discord Bot.
 */

/* [ GLOBALS ] ====================================== */

const apiToken = process.env.DISCORD_API_TOKEN,
      perms    = process.env.PERMISSIONS || '2147601472',
      scope    = process.env.SCOPE       || 'applications.commands%20bot',
      oauthurl = 'https://discord.com/oauth2/authorize?',
      authlink = (id) => oauthurl + `client_id=${id}&permissions=${perms}&scope=${scope}`;

let refreshCommands = false; // If true, will re-upload commands.json to Discord API on client load.

/* [ IMPORTS ] ====================================== */

import { Client }   from 'discord.js'
import commands     from './config/commands.json'
import Store        from './src/store'
import EventEmitter from './src/events'
import { loadCommands, updateCommandCfg } from './src/load'

/* [ EXPORTS ] ====================================== */

export const client = new Client({ intents: [ "GUILDS", "GUILD_MESSAGES" ] }),
             events = new EventEmitter(),
             store  = new Store();

/* [ LISTENERS ] ====================================== */

client.on("ready", async () => {
  events.emit('ready', client);
  console.log('Bot loaded');
  console.info(`Use ${authlink(client.user.id)} to invite bot to your server.`);
  if (refreshCommands) updateCommandCfg(commands, apiToken, client);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    let eventName = `cmd-${interaction.commandName}`;
    events.emit(eventName, interaction);
  }
});

/* [ MAIN LOGIC ] ====================================== */

if (!apiToken) throw Error('No API token is set!');

loadCommands('commands');
client.login(apiToken);