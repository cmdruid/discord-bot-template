/** store.js
 * This file configures the persistent storage space.
 **/

/* [ CONFIG ] ====================================== */

const folder = 'data';

/* [ IMPORTS ] ====================================== */

import path from 'path';
import { LocalStorage } from "node-localstorage";

/* [ GLOBALS ] ====================================== */

const fullpath   = path.join(process.cwd(), folder),
      localStore = new LocalStorage(fullpath);

/* [ EXPORTS ] ==================================== */

export default class Store {

  static parse(name) {
    // Parse stored string into a map object, or return new map.
    const rawString = localStore.getItem(name),
          cachedMap = (rawString)
            ? JSON.parse(rawString, Store.decode)
            : new Map();
    return (Store.test(cachedMap))
      ? cachedMap
      : new Map();
  }

  static test(map) {
    // Test if map object is valid.
    if (!map) throw new Error('Map undefined!');
    try {
      const testKey = Math.random();
      map.set('test', testKey);
      return (map.get('test') === testKey)
        ? map.delete('test')
        : false;
    } catch(err) { console.error(err) }
  }

  static encode(key, value) {
    // Convert non-standard javascript objects to json.
    if (value instanceof Map)
      return { type: 'Map', value: [ ...value ] };
    if (value instanceof Date)
      return { type: 'Date', value: value };
    return value;
  }

  static decode(key, value) {
    // Convert non-standard json objects to javascript.
    if (typeof value === 'object' && value !== null) {
      if (value.type === 'Map') return new Map(value.value);
      if (value.type === 'Date') return new Date(value.value);
    }
    return value;
  }

  constructor(name) {
    this.name = name || 'store';
    this.data = Store.parse(this.name);
    return this;
  }

  _commit() {
    // Save any changes in map object to disk.
    try {
      let rawString = JSON.stringify(this.data, Store.encode);
      localStore.setItem(this.name, rawString);
      return true;
    } catch(err) { console.error(err) }
  }

  get(key) {
    return this.data.get(key)
  }

  set(key, val) {
    let res = this.data.set(key, val)
    if (res) this._commit();
    return res;
  }

  delete(key) {
    let res = this.data.delete(key);
    if (res) this._commit();
    return res;
  }

  items() {
    return this.data.items();
  }

  keys() {
    return this.data.keys();
  }

  values() {
    return this.data.values();
  }

  has(key) {
    return this.data.has(key);
  }

  size() {
    return this.data.size;
  }

  [Symbol.iterator]() {
    return this.data[Symbol.iterator]();
  }
}