/** load/modules.js
 * Methods for loading custom modules from modules path.
 **/


/** [ IMPORTS ] ============================================================ */

import fs                from 'fs'
import { union }         from '../lib/utils/array'
import { getFiles }      from '../lib/utils/file'
import { mergeCommands } from './commands'
import { pathToFileURL } from 'url'

/** [ CONSTANTS ] ========================================================== */

const MODULES_DIR = 'modules',
      SUBMOD_DIR  = 'submodules',
      NAME_SPACES = [ 'default', 'globalSchema' ],
      VERBOSE     = (process.env.NODE_ENV === 'DEBUG');

/** [ EXPORTS ] ============================================================ */

export async function loadModules() {

  const modulePath  = `${process.cwd()}/${MODULES_DIR}`,
        mainConfig  = { commands: new Array() },
        modsLoaded  = new Array(),
        moduleFiles = getFiles(MODULES_DIR),
        timeString  = `Finished loading ${moduleFiles.length} modules`;

  console.time(timeString);

  for (let file of moduleFiles) {

    // Set a timer for each module.
    if (VERBOSE) console.time(`${file} loaded`);

    // Ignore hidden modules (starting with '.').
    if (file.startsWith('.')) continue;

    let filepath = `${modulePath}/${file}`;

    // Main script for loading modules. Do not use async here, 
    // or we will get a very bad crash.
    let indexFile = pathToFileURL(`${filepath}/index.js`);
    if (fs.existsSync(indexFile)) {
      try {
        import(indexFile);
        modsLoaded.push(file);
      } catch(err) { console.error(`Failed to load ${file} module, skipping...\n${err}`) }
    }

    // Import params in config.json (if present).
    let configFile = pathToFileURL(`${filepath}/config.json`)
    if (fs.existsSync(configFile)) {
      await importModule(configFile)
        .then(moduleConfig => parseConfig(moduleConfig, mainConfig, file))
        .catch(err => console.error(`Failed to load ${file}/config.json, skipping...\n${err}`));
    }

    // Import params in commands.json (if present).
    let commandFile = pathToFileURL(`${filepath}/commands.json`)
    if (fs.existsSync(commandFile)) {
      await importModule(commandFile)
        .then(commandConfig => mergeCommands(commandConfig, mainConfig.commands))
        .catch(err => console.error(`Failed to load ${file}/commands.json, skipping...\n${err}`));
    }
    // Close our per-module timer.
    if (VERBOSE) console.timeEnd(`${file} loaded`);
  }

  // Set development environment within the global config.
  mainConfig.env = process.env.NODE_ENV || 'DEVELOPMENT';
  console.log('Module environment set to:', ` ${mainConfig.env} `.bgMagenta);

  // We finished loading our modules.
  console.log(`Modules loaded: ${modsLoaded.map(e => e.blue).join(', ')}`);
  console.timeEnd(timeString);

  // If verbose, dump the config to console.
  if (VERBOSE) console.log(mainConfig);

  return mainConfig;
}


/** [ METHODS ] ============================================================ */

async function importModule(filepath) {
  /** Import module into memory. */
  const opt = {}
  if (filepath.pathname.endsWith('.json')) {
    opt.assert = { type: "json" }
  }
  return import(filepath, opt)
  .then(mod => mod.default);
}

function parseConfig(moduleConfig, mainConfig, modName) {
  /** Parse the module config, for both global, 
   * and name-spaced configuration data. 
   * */

  for (let key of Object.keys(moduleConfig)) {
    let mainCfg = mainConfig[key],
        modCfg  = moduleConfig[key];

    if (NAME_SPACES.includes(key)) {
      if (!(mainCfg instanceof Map)) mainCfg = new Map();
      mainConfig[key] = mainCfg.set(modName, modCfg);
      continue;
    }
    
    mainConfig[key] = mergeConfig(mainCfg, modCfg);
  }
}

function mergeConfig(a, b) {
  /** Merge each module config into the main config file. */
  if (!Array.isArray(a)) {
    a = new Array();
  }
  if (!Array.isArray(b)) {
    if (!a.includes(b)) a.push(b)  
  } else { a = union(a, b); }
  return a;
}
