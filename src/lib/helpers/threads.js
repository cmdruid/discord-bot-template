/** helpers/threads
 * Helper methods for Discord thread objects.
 * */

/** [ IMPORTS ] ================================= */

import { getMessageById } from "./messages";

/** [ EXPORTS ] ================================= */

export async function getMessageThread(guildId, channelId, messageId) {
  const message = await getMessageById(guildId, channelId, messageId);
  return (message.hasThread)
    ? message.thread
    : null;
}

export function getThreadUrl(guildId, threadId) {
  return `https://discord.com/channels/${guildId}/${threadId}`
}
