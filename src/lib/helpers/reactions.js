/** handlers/reactions.js
 * Helper methods for handling Discord.js reactions.
 * */

import { ThreadChannel } from "discord.js";


/** [ EXPORTS ] ================================= */

export async function removeReaction(message, reaction) {
  const cache = message.reactions.cache,
        react = cache.find(r => r.emoji.name === reaction)
  return react.remove();
}

export async function applyUserReactions(userId, reactions, message) {
  /** Apply specified user's reactions to another post.
   */
  for (let react of reactions.cache.values()) {
    let users = await react.users.fetch();
    for (let user of await users.values()) {
      try { 
        // Try/catch and continue in case the
        // emojis don't exist (nitro users).
        if (userId && userId === user.id) {
          await message.react(react.emoji);
        }
      } catch(err) { continue }
    }
  }
}