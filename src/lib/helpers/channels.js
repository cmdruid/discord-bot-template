/** helpers/channels.js
 * Helper methods for handling Discord.js channel objects.
 * */


/** [ IMPORTS ] ================================= */

import { client }         from '../../../app'
import { searchCache }    from './misc';
import { hasContentTags } from './messages';

/** [ EXPORTS ] ================================= */

export function getGuildChannel(guildId, channelString, categoryString) {
  /** Fetches channel object from guild, and optionally checks the parent (category). 
   */
  const guild = client.guilds.cache.get(guildId),
        cache = guild.channels.cache;
  let channel, category;
  // If categoryString specified, fetch guild category.
  if (categoryString) category = getGuildCategory(guildId, categoryStr);
  // Fetch the channel object from cache.
  channel = searchCache(cache, channelString);
  if (!channel) {
    // If we can't find a channel, throw an error!
    throw new Error(`Channel not found in guildId ${guildId.blue}!`);
  } else if (category && channel.parent.id !== category.id ) {
    // If category specified, and doesn't include channel, throw an error!
    throw new Error(`Channel not found under category, in guildId ${guildId.blue}!`);
  } else { return channel; }
}

export function getGuildCategory(guildId, categoryString) {
  /** Fetches category object from guild. 
   */
  const guild = client.guilds.cache.get(guildId),
        cache = guild.channels.cache,
        category = searchCache(cache, categoryString);
  if (!category) {
    // If we can't find a category, throw an error!
    throw new Error(`Category not found in guildId ${guildId.blue}!`);
  } else { return category; }
}

export function postToChannel(guildId, channel, message) {
  /** Post a message object to the specified channel. 
   */
  const sendChannel = getGuildChannel(guildId, channel);
  if (!sendChannel?.send) {
    // If we don't get a sendable channel, throw an error!
    throw new Error(`Channel is not sendable for guild ${guildId.blue}!`);
  } else { return sendChannel.send(message); }
}

export async function getTagsInChannel(channel, tags, limit) {
  /** Returns a collection of messages from the channel, 
   * which include one of the tags in array.
   */
  if (!Array.isArray(tags)) tags = [ tags ];
  return channel.messages.fetch({ limit })
  .then(msg => msg.filter(m => hasContentTags(m, tags)));
}
