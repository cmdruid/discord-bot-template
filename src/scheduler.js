/** src/scheduler.js
 * Scheduler for fixed and recurring events, using cron syntax.
 **/


/** [ IMPORTS ] ============================================================ */

import schedule from 'node-schedule'
import EventEmitter from './events'
import { emitter } from '../app'

/** [ CONSTANTS ] ========================================================== */

const VERBOSE = (process.env.NODE_ENV === 'DEBUG');

/** [ EXPORTS ] ============================================================ */

export function scheduleEvent(cronString, event, callback, global=false) {
  /* Schedule an event to be emitted using node-schedule,
   * then return the configured emitter as an object.
   */
  const eventEmitter = (global) ? emitter : new EventEmitter(),
        cronEmitter  = () => emitEvent(eventEmitter, event, callback);
  try {
    return {
      job: schedule.scheduleJob(cronString, cronEmitter),
      emitter: eventEmitter
    }
  } catch(err) { console.error(err) };
}

export function validCronString(cronString, restrictRepeat=false) {
  /* Validates the cron string used for scheduling. Includes a 
   * strict option, which limits repeats to a 24hr minimum.
   */
  const regex  = /^(?<m>[\d\*\/]{0,3})\s(?<h>[\d\*\/]{0,3})\s(?<dom>[\d\*\/]{0,3})\s(?<mon>[\d\*\/]{0,3})\s(?<dow>[0-6\*]{1})$/g,
        strict = /^(?<m>[0-5]?[0-9])\s(?<h>[0-1]?[0-9]|2[0-3])\s(?<dom>[\d\*\/]{0,3})\s(?<mon>[\d\*\/]{0,3})\s(?<dow>[0-6\*]{1})$/g;
  return (restrictRepeat) 
    ? strict.test(cronString)
    : regex.test(cronString);
}

function emitEvent(emitter, event, cb) {
  /* Basic function that is passed into the scheduler.
   */
  if (VERBOSE) {
    console.log(`[ ${'CRON'.bgYellow} ] Scheduled event emitted: ${event}`);
  }
  emitter.emit(event, cb);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}