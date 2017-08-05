/**
 * An abstraction on the ES6 localStorage API.
 * Also provides caching, and importing/exporting.
 */
class Storage {
  constructor() {
    this.cache = {};
    // Load the value into the cache.
    this.readString('last-modified', );
    
    // Assuming there is only one instance of Storage.
    window.manualOverride = (key, value) => {
      this.writeString(key, value);
      return `Set the flag "${key}" with value "${value}"`;
    };
    
    this.migrateLegacyKeys();
  }
  
  migrateLegacyKeys() {
    // TODO remove this when all uses have been deleted from clients.
    localStorage.removeItem('experimental_use-google-login');
    if (this.cache['experimental_use-google-login']) {
      delete this.cache['experimental_use-google-login'];
    }

    localStorage.removeItem('enough-t8-undefineds');
    if (this.cache['enough-t8-undefineds']) {
      delete this.cache['enough-t8-undefineds'];
    }
    
    // TODO remove this when all uses have been migrated from clients.
    const enoughArmorsLegacy = localStorage.getItem('enough-armors');
    if (enoughArmorsLegacy !== null) {
      localStorage.removeItem('enough-armors');
      delete this.cache['enough-armors'];
      this.writeNumber('enough-t7-armors', enoughArmorsLegacy);
      this.writeNumber('enough-t8-armors', enoughArmorsLegacy);
      this.writeNumber('enough-t9-armors', enoughArmorsLegacy);
    }
    const enoughWeaponsLegacy = localStorage.getItem('enough-weapons');
    if (enoughWeaponsLegacy !== null) {
      localStorage.removeItem('enough-weapons');
      delete this.cache['enough-weapons'];
      this.writeNumber('enough-t7-weapons', enoughWeaponsLegacy);
      this.writeNumber('enough-t8-weapons', enoughWeaponsLegacy);
      this.writeNumber('enough-t9-weapons', enoughWeaponsLegacy);
    }
  }
  
  readBoolean(key, defaultValue = false) {
    const stringValue = this.readString(key, defaultValue);
    return stringValue === 'true';
  }
  
  writeBoolean(key, value) {
    this.writeString(key, value);
  }
  
  readNumber(key, defaultValue = 0) {
    const stringValue = this.readString(key, defaultValue);
    return parseFloat(stringValue);
  }
  
  writeNumber(key, value) {
    this.writeString(key, value);
  }
  
  readString(key, defaultValue = '') {
    defaultValue += '';
    
    if (key in this.cache) {
      logger.log(LogLevel.DEBUG, `reading ${key} -> ${this.cache[key]} (cached)`);
      return this.cache[key];
    }
    const value = localStorage.getItem(key);
    if (value === null) {
      logger.log(LogLevel.DEBUG, `setting default for ${key} <- ${defaultValue}`);
      this.writeString(key, defaultValue);
      return defaultValue;
    }
    this.cache[key] = value;
    logger.log(LogLevel.DEBUG, `reading ${key} -> ${value}`);
    return value;          
  }
  
  writeString(key, value) {
    value += '';
    
    // Do not store the default value of these special flags into the storage.
    // This reduces the discoverability of the flags, for example from the
    // exported files. 
    if (
      (key.startsWith('experimental_') && value == false) ||
      (key == 'log-level' && value == 'INFO') ||
      // This flag is really only meant for excluding myself (djjeck)
      // from Google Analytics.
      // If you're reading this comment and found out about the flag,
      // feel free to enable it, in order to use this tool without
      // leaving a trace. Just remember that the more users in
      // Google Analytics I see, the happier I am.
      (key == 'use-google-analytics' && value == 'true')
    ) {
      localStorage.removeItem(key);
      return;
    }
    
    logger.log(LogLevel.DEBUG, `writing ${key} <- ${value}`);
    this.cache[key] = value;
    localStorage.setItem(key, value);
    localStorage.setItem('last-modified', new Date().toISOString());
  }
  
  clear() {
    localStorage.clear();
    this.cache = {};
  }
  
  dumpCache() {
    // Clone cache.
    return Object.assign({}, this.cache);
  }
  
  importCache(json) {
    this.cache = JSON.parse(json);
    // Assuming no values need to be deleted.
    for (const key in this.cache) {
      if (!key.startsWith('_')) { // Skip "comment" values.
        this.writeString(key, this.cache[key]);
      }
    }
    
    this.migrateLegacyKeys();
  }
}
