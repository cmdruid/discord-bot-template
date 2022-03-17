/** utils/file.js
 * Helper methods for handling files.
 * */


/** [ IMPORTS ] ============================================================ */

import fs     from 'fs'
import path   from 'path'
import crypto from 'crypto'
import { pathToFileURL } from 'url';
import { rejects } from 'assert';

/** [ CONSTANTS ] ========================================================== */

const CWD = process.cwd();

/** [ EXPORTS ] ============================================================ */

export function getFiles(filepath) {
  return fs.readdirSync(pathToFileURL(path.join(process.cwd(), filepath)));
}

export function getHash(data) {
  const isArray  = Array.isArray(data),
        isObject = typeof(data) === 'object';
  if (isArray || isObject) data = JSON.stringify(data);
  return crypto.createHash('md5').update(data).digest('hex');
}

export function checksum(oldHash, data) {
  const newHash = getHash(data);
  return (oldHash && oldHash === newHash);
}

export async function readFromFile(filepath) {
  let fullpath = `${CWD}/${filepath}`
  return new Promise((resolve, reject) => {
    fs.readFile(fullpath, 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') reject(err);
      resolve(data)
    })
  });
}

export async function writeToFile(filepath, data, opts={}) {
  let fullpath = `${CWD}/${filepath}`
  return new Promise((resolve, reject) => {
    fs.writeFile(fullpath, data, opts, err => { 
      if (err && err.code !== 'ENOENT') reject(err);
      resolve(true);
    });
  });
}