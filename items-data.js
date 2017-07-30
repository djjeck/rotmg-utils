class ItemsData {
  constructor(storage) {
    this.storage = storage;
  }
  
  getQuantity(key) {
    return this.storage.readNumber(key);
  }
  
  writeQuantity(key, value) {
    this.storage.writeNumber(key, value);
  }
  
  getEnough(key, defaultValue) {
    return this.storage.readNumber(key, defaultValue);
  }
  
  writeEnough(key, value) {
    this.storage.writeNumber(key, value);
  }
  
  getLogLevel() {
    return this.storage.readString('log-level', 'INFO')
  }
  
  getUseGoogleAnalytics() {
    return this.storage.readBoolean('use-google-analytics', true);
  }
  
  getUseGoogleLogin() {
    return this.storage.readBoolean('experimental_use-google-login', false);
  }
  
  importData(data) {
    // TODO Make sure the file actually is a cache dump.
    this.storage.importCache(data);
  }
  
  exportData() {
    return this.storage.dumpCache();
  }
  
  clear() {
    this.storage.clear();
  }
}
