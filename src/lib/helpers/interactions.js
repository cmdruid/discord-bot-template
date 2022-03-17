/** helpers/interactions.js
 * Helper methods for handling Discord.js interaction objects.
 * */


/** [ IMPORTS ] ================================= */

import { printJson } from "./misc";

/** [ GLOBALS ] ================================= */

const VERBOSE = (process.env.NODE_ENV === 'DEBUG');

/** [ EXPORTS ] ================================= */

export function reply(interaction, string) {
  return interaction.reply({ content: string, ephemeral: true });
}

export function replyError(interaction, string, err, verbose=false) {
  if (verbose) string += ` Error: ${printJson(err)}`
  console.log(err);
  return reply(interaction, string);
};
