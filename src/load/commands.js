/** load/commands.js
 * Loader for Discordjs slash and interaction commands.
 **/

/** [ IMPORTS ] ============================================================ */

import { REST }   from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { getHash, checksum, readFromFile, writeToFile } from '../lib/utils/file'

/** [ EXPORTS ] ============================================================ */

export async function loadCommands(commands, apiToken, client) {
  /** Update the Discord API with JSON config of commands. */

  const clientId = client.application.id,
        guilds   = client.guilds.cache.keys(),
        rest     = new REST({ version: '9' }).setToken(apiToken);

  try {
    let hashOk = await checkExistingHash(commands);
    if (!hashOk) {
      console.log('Command checksum failed! Updating command list for guilds...');
      for (let guildId of guilds) {
        let timestamp = `[ ${guildId.blue} ] Commands update`;
        console.time(timestamp);
        try {
          await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
          console.timeEnd(timestamp);
        } catch (e) { console.error(e) }
      }
    }
  } catch (err) { console.error(err) }
}

export function mergeCommands(command, config) {
  /** Merge each command config into the main config file. */
  if (Array.isArray(command)) {
    command.map(e => config.push(e));
  } else { config.push(command) }
}

export async function checkExistingHash(commands) {
  const filepath = 'data',
        filename = 'commands.md5',
        fullpath = `${filepath}/${filename}`;

  let prevHash = await readFromFile(fullpath, true);

  if (!prevHash || !checksum(prevHash, commands)) {
    let newHash = getHash(commands);
    await writeToFile(fullpath, newHash);
    return false;
  }

  return true;
}