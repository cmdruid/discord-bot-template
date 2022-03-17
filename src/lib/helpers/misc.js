/** helpers/misc.js
 * Miscellaneous helper methods for handling Discord.js objects.
 * */


/** [ EXPORTS ] ================================= */

export function isFlake(string) {
  return string.search(/^[\d]+$/) !== -1;
}

export function printJson(obj, syntax='json') {
  return `\n\`\`\`${syntax}\n${JSON.stringify(obj, null, 2)}\n\`\`\`\n`;
}

export function searchCache(cache, string, key='name') {
  if (isFlake(string)) return cache.get(string);
  return cache.find(item => item[key] === string);
}