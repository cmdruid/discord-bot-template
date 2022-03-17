/** helpers/guilds.js
 * Helper methods for handling Discord.js message objects.
 * */


/** [ IMPORTS ] ================================= */

import Store      from '../store'
import { client } from '../../app'

/** [ EXPORTS ] ================================= */

export async function getMembership(guildId, userId) {
  const guild = client.guilds.cache.get(guildId);
  return guild.members.fetch(userId);
}

export async function getMemberRoles(guildId, userId) {
  const member = await getMembership(guildId, userId),
        roles  = [ ...member.roles.cache.values() ];
  return roles.map(e => { return { id: e.id, name: e.name } });
}
  
export async function isAllowedRole(guildId, userId, allowedRoles) {
  for (let role of await getMemberRoles(guildId, userId)) {
    if (allowedRoles?.includes(role.name)) return true;
  }
  return false;
}

export function getGuildStore(guildId, name) {
  return new Store(`guilds/${guildId}/${name}`);
}

export function getCustomEmoji(name) {
  if (/[^\u0000-\u00ff]/.test(name)) return name;
  let cache = client.emojis.cache.find(e => e.name === name);
  return (cache) ? cache : name;
}

