/** load.js
 * File for loader functions.
 * */

/* [ IMPORTS ] ======================================== */

import { REST }     from '@discordjs/rest'
import { Routes }   from 'discord-api-types/v9'
import { getFiles } from './utils/file'

/* [ EXPORTS ] ======================================== */

export async function updateCommandCfg (commands, apiToken, client) {
  /** Update the Discord 'Commands' API with JSON list of commands. */
  const clientId = client.application.id,
        guilds   = client.guilds.cache.values(),
        rest     = new REST({ version: '9' }).setToken(apiToken);

  for (const guild of await guilds) {
    try {
      console.log('Refresing commands for guildId: ', guild.id);
      await rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands });
      console.log('Commands refreshed!');
    } catch (e) { console.error(e) }
  }
}

export async function loadCommands(path) {
  /** Load the command logic in the 'commands' path. */
  for (let file of getFiles(path)) {
    await import(`${process.cwd()}/${path}/${file}`)
  }
}