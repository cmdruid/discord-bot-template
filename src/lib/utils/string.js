/** utils/string.js
 * Helper methods for handling strings.
 * */

/** [ EXPORTS ] ============================================================ */

export function toCamelCase(str) {
  return str.replace(/-./g, c => c. substring(1).toUpperCase());
}

export function toDashFormat(str) {
  if (str) {
    return str.replaceAll(' ', '-').toLowerCase();
  }
  else {
    console.log('toDashFormat: ', str)
    return str
  }
}