/** src/error.js
 * Templates for custom error handling.
 **/

/** [ EXPORTS ] ============================================================ */

export class ModuleError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}