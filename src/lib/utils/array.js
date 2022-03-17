/** utils/array.js
 * Utility methods for handling arrays.
 * */

/** [ EXPORTS ] ============================================================ */

export function enforceArray(arr) {
  if (!(arr && Array.isArray(arr))) {
    return new Array();
  }
  return arr;
}

export function union(arr1, arr2) {
  for (let elem of arr2) {
    if (!arr1.includes(elem)) arr1.push(elem);
  }
  return arr1
}