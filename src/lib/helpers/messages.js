/** handlers/messages.js
 * Helper methods for handling Discord.js message objects.
 * */


/** [ IMPORTS ] ================================= */

import { getGuildChannel } from './channels';
import { getMembership } from './guilds';

/** [ CONSTANTS ] ================================= */

const URL_REGEX = /https?:\/\/[\S]+/g, 
      DOM_REGEX = /https?:\/\/([\w\.]+)/g;

/** [ EXPORTS ] ================================= */

export function getContentTypes(message) {
  /** Parse message for content, return array of content types found. */
  const types = new Array(),
        files = [ ...message.attachments.values() ];
  if (message.content?.search(URL_REGEX) !== -1) types.push('url');
  files.map(f => {
    let type = f.contentType;
    if (!types.includes(type)) types.push(type.split('/')[0])
  });
  return types;
}

export function hasContentType(message, types) {
  /** Check if message content types are allowed. */
  const contentTypes = getContentTypes(message);
  if (!Array.isArray(types)) types = [ types ];
  for (let type of types) {
    if (contentTypes.includes(type)) return true;
  }
  return false;
}

export function hasContentTags(message, tags) {
  const contentTags = getContentTags(message);
  for (let tag of contentTags) {
    if (tags.includes(tag)) return true;
  }
  return false;
}

export function getContentUrl(message) {
  const regex   = URL_REGEX,
        matches = [ ...message.content.matchAll(regex) ];
  return matches.map(e => e[0]);
}

export function getContentTitleUrl(message) {
  const matchURL = [ ...message.content.matchAll(URL_REGEX) ],
        matchTLD = [ ...message.content.match(DOM_REGEX) ];
  if (!matchURL[0]) return;
  let url    = matchURL[0][0],
      domain = matchTLD[0],
      title  = message.content.slice(matchURL[0].index + url.length);
  return { title, url, domain }
}

export function getContentTags(message) {
  const regex   = /--\w+/g,
        matches = [ ...message.content.matchAll(regex) ];
  return matches.map(e => e[0].slice(2));
}

export function getChannelTags(message) {
  const regex   = /#\w+/g,
        matches = [ ...message.content.matchAll(regex) ];
  return matches.map(e => e[0]);
}

export function getMentionTags(message) {
  const regex   = /@\w+/g,
        matches = [ ...message.content.matchAll(regex) ];
  return matches.map(e => e[0]);
}

export function createJsonFile(obj, name='file') {
  if (typeof(obj) !== 'string') {
    obj = JSON.stringify(obj, null, 2)
  }
  return { name: `${name}.json`, attachment: Buffer.from(obj) }
}

export async function getMessageById(guildId, channelId, messageId) {
  const channel = getGuildChannel(guildId, channelId);
  return channel.messages.fetch(messageId);
}

export function messageToEmbed(message, showAvatar=false) {
  const { guildId, channelId, author, content, attachments } = message;

  const member      = getMembership(guildId, author.id),
        baseUrl     = 'https://discord.com/channels',
        postUrl     = `${baseUrl}/${guildId}/${channelId}/${message.id}`,
        footerStr   = `*[Posted](${postUrl}) by <@${author.id}> in <#${channelId}>*`,
        description = `${content}\n---\n${footerStr}`,
        attachment  = attachments.values().next().value,
        embedMsg    = { color: member.displayColor, description: description };
        
  if (showAvatar) embedMsg.author = {
    name: member.displayName,
    icon_url: member.user.displayAvatarURL()
  }
  
  if (attachment) {
    if (attachment.height) {
      embedMsg.thumbnail = { url: attachment.url };
    } else {
      let fileUrl = `[*${attachment.name}*](${attachment.url})`;
      embedMsg.description += `\n\n:paperclip: ${fileUrl}`;
    }
  }

  return embedMsg;
}
