/** src/register.js
 * Registration of Discord.js event listeners.
 **/


/** [ IMPORTS ] ============================================================ */

import EventEmitter from './events'
import { accessControl } from './access';
import { toDashFormat }  from './lib/utils/string';

/** [ GLOBALS ] ============================================================ */

const VERBOSE = (process.env.NODE_ENV === 'DEBUG');

/** [ EXPORTS ] ============================================================ */

export default async function registerListeners(client, config) {

  const emitter = new EventEmitter(),
        events  = config.required_events,
        intents = config.required_intents;

  // Register interaction listener.
  client.on('interactionCreate', async interaction => {
    if (accessControl(interaction, config)) {
      let eventName = formatEventName(interaction);
      emitter.emit(eventName, interaction);
    } else { interaction.reply({ content: 'Permission denied!', ephemeral: true }); }
  });

  // Register all other configured event listeners.
  registerModuleListeners(client, events, emitter);

  // Print to console list of registered events and intents.
  let selectedEvents  = Object.keys(client._events).map(e => e.green).join(', ');
  console.log('Registering emitter with client events: ', selectedEvents);
  let selectedIntents = intents.map(e => e.green).join(', ');
  console.log('Initializing client with API intents: ', selectedIntents);

  return emitter;
}

/** [ METHODS ] ============================================================ */

function formatEventName(interaction) {
  switch (interaction.type) {
    case 'MESSAGE_COMPONENT':
      return `cmp-${toDashFormat(interaction.customId)}`;
    case 'APPLICATION_COMMAND':
      return `cmd-${toDashFormat(interaction.commandName)}`;
    default:
      return `int-${toDashFormat(interaction.commandName)}`
  }
}

function registerModuleListeners(client, events, emitter) {
  /** Dynamically register event listeners that are imported 
   * from module config.json.
   * */
  const exists = Object.keys(client._events);

  for (let event of events) {
    if (exists.includes(event)) continue;

    client.on(event, (...args) => {
      emitter.emit(event, ...args);
    });
  }
}
