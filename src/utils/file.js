import fs from 'fs'
import path from 'path'

export function getFiles(filepath) {
  return fs.readdirSync(path.join(process.cwd(), filepath));
}
