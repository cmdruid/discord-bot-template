/* =================================================== *\
|| Main application logic for the Discord App.         ||
\* =================================================== */

/** [ IMPORTS ] ============================================================ */

import colors      from 'colors'
import { Client }  from 'discord.js'
import router      from './src/api'
import registerListeners from './src/register'
import { loadCommands } from './src/load/commands'
import { loadModules }  from './src/load/modules'

/** [ CONSTANTS ] ========================================================== */

const apiToken = process.env.DISCORD_API_TOKEN,
      perms    = process.env.PERMISSIONS || '261993005047',
      scope    = process.env.SCOPE       || 'applications.commands%20bot',
      oauthurl = 'https://discord.com/oauth2/authorize?',
      authlink = (id) => oauthurl + `client_id=${id}&permissions=${perms}&scope=${scope}`,
      timeStr  = `Client initialized / authenticated`;

/** [ EXPORTS ] ============================================================ */

export const config  = await loadModules();
export const client  = new Client({ intents: config.required_intents });
export const emitter = await registerListeners(client, config);

/** [ LISTENERS ] ========================================================== */

client.on("ready", async () => {
  // End the timer for client login.
  console.timeEnd(timeStr);
  // Handle any changes to our command manifest.
  loadCommands(config.commands, apiToken, client);
  // Pass ready event to global emitter.
  emitter.emit('ready', client); 
  // We are online!
  console.log('Beep-boop. Robot online!');
  console.info(`Use the following link to invite this bot onto your server:\n${authlink(client.user.id)}`);
});

/** [ MAIN ] =============================================================== */

// The DISCORD_API_TOKEN env variable must be set to a valid token.
if (!apiToken) throw Error('No API token is set!');
// Measure the time it takes for client to login.
console.time(timeStr);
// Start client login.
client.login(apiToken);
// Start (optional) web server.
router.listen(4000);