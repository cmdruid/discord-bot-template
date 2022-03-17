/** src/access.js
 * Basic access control for events and modules.
 **/

/** [ IMPORTS ] ============================================================ */

import { toDashFormat } from './lib/utils/string';

/** [ CONSTANTS ] ========================================================== */

const VERBOSE = (process.env.NODE_ENV === 'DEBUG');

/** [ EXPORTS ] ============================================================ */

export function accessControl(interaction, config) {
  /* Check for allowed access to command, based on rules
   * defined in the module configs.
   */
  const { access_control: accessControl } = config;
  const { commandName, guild, user } = interaction;
        
  const cmdName     = toDashFormat(commandName),
        accessRules = accessControl.find(e => e.command === cmdName),
        superUsers  = process.env.SUPER_USERS?.split(','),
        guildOwner  = (guild.ownerId === user.id);

  // If verbose, print the command name and rules to console.
  if (VERBOSE) console.log(cmdName, accessRules);

  // If user is owner or superuser, grant access.
  if (guildOwner || superUsers?.includes(user.id)) return true;

  // If there are no rules set, return false.
  if (!accessRules) return false;

  return checkRules(accessRules, user);
}

function checkRules(interaction, accessRules) {
  /* Check if a user has been given access through 
   * their membership or role.
   */
  const { users, roles } = accessRules || {};
  const { user, member } = interaction || {};
  const memberRoles = member.roles.cache;

  if (Array.isArray(users)) {
    const { id, username, discriminator } = user;
    if (users.includes(id)) return true;
    if (users.includes(`${username}#${discriminator}`)) return true;
  }

  if (Array.isArray(roles)) {
    for (let role of roles) {
      if (memberRoles.find(e => e.name === role)) {
        return true;
      }
    }
  }

  return false;
}