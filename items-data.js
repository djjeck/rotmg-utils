class ItemsData {
  constructor(storage, logger) {
    this.storage = storage;
    this.logger = logger;
  }
  
  getQuantity(key) {
    return this.storage.readNumber(key);
  }
  
  writeQuantity(key, value) {
    this.storage.writeNumber(key, value);
    this.exportToServer();
  }
  
  getEnough(key, defaultValue) {
    return this.storage.readNumber(key, defaultValue);
  }
  
  writeEnough(key, value) {
    this.storage.writeNumber(key, value);
    this.exportToServer();
  }
  
  getLogLevel() {
    return this.storage.readString('log-level', 'INFO')
  }
  
  getUseGoogleAnalytics() {
    return this.storage.readBoolean('use-google-analytics', true);
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
  
  setLoginToken(idToken) {
    this.googleIdToken = idToken;
    return this.importFromServer();
  }
  
  importFromServer() {
    if (!this.googleIdToken) {
      return Promise.resolve();
    }
    
    return this.readFromServer({
      idToken: this.googleIdToken,
      key: 'tinkerer-items',
    }).then(text => {
      this.logger.log(LogLevel.DEBUG, `Got data from server: ${text}`);
      this.importData(text);
      this.logger.log(LogLevel.INFO, 'Imported data from the cloud');
    });
  }
  
  exportToServer() {
    if (!this.googleIdToken) {
      return;
    }
    
    this.writeToServer({
      idToken: this.googleIdToken,
      key: 'tinkerer-items',
      data: JSON.stringify(this.exportData()),
    }).then(text => {
      this.logger.log(LogLevel.INFO, 'Exported data into the cloud');
    });
  }
  
  readFromServer(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        } else {
          const error = `Error ${xhr.status}\n${xhr.responseText}`;
          // TODO move logging outside of this class.
          this.logger.log(LogLevel.ERROR, error);
          reject(error);
        }
      });
      xhr.addEventListener('error', () => {
        const error = 'Network error, could not load';
        // TODO move logging outside of this class.
        this.logger.log(LogLevel.ERROR, error);
        reject(error);
      });
      const params = [];
      for (const key in data) {
        const value = data[key];
        params.push(`${key}=${value}`);
      }
      
      xhr.open('GET', 'read_data.php?' + params.join('&'));
      xhr.send();
    });
  }
  
  writeToServer(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        } else {
          const error = `Error ${xhr.status}\n${xhr.responseText}`;
          this.logger.log(LogLevel.ERROR, error);
          reject(error);
        }
      });
      xhr.addEventListener('error', () => {
        const error = 'Network error, could not save';
        // TODO move logging outside of this class.
        this.logger.log(LogLevel.ERROR, error);
        reject(error);
      });
      
      xhr.open('POST', 'write_data.php');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      const params = [];
      for (const key in data) {
        const value = data[key];
        params.push(`${key}=${value}`);
      }
      xhr.send(params.join('&'));
    });
  }
}
