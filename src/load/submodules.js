/** load/submodules.js
 * Methods for loading sub-modules within a given module.
 **/

/** [ IMPORTS ] ============================================================ */

import fs                from 'fs'
import { getFiles }      from '../lib/utils/file'
import { pathToFileURL } from 'url'

/** [ CONSTANTS ] ========================================================== */

const MODULES_DIR = 'modules',
      SUBMOD_DIR  = 'submodules';

/** [ EXPORTS ] ============================================================ */

export async function loadSubmodules(modName, ...args) {
  const relpath  = `${MODULES_DIR}/${modName}/${SUBMOD_DIR}`,
        fullpath = `${process.cwd()}/${relpath}`,
        subFiles = getFiles(relpath),
        timerStr = `[ ${modName.green} ] Loaded ${subFiles.length} submodules`;
  console.time(timerStr);
  for (let file of subFiles) {
    // Ignore hidden modules (starting with '.').
    if (file.startsWith('.')) continue;
    // Conver to FileUrl for cross-platform compatibility.
    let fileUrl = pathToFileURL(`${fullpath}/${file}`);
    // Do not use await here, or we will get a very bad crash.
    if (fs.existsSync(fileUrl)) {
      importModule(fileUrl)
        .then(defaultFn => defaultFn(...args))
        .catch(err => console.error(`Failed to load ${file} submodule, skipping...`, err));
    }
  }
  console.timeEnd(timerStr);
}