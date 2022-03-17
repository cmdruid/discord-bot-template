/** modules/ping
 * Basic implementation of a command!
 * */


/** [ IMPORTS ] ============================================================ */

import { emitter } from '../../app'

/** [ EVENTS ] ============================================================= */

emitter.on('cmd-ping', async interaction => {
  await interaction.reply({ content: 'Pong!', ephemeral: true });
  console.log(interaction);
});