const POPUP_DISMISS_TIME = 5000;


const LogLevel = {
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
};


/**
 * Simple Logger interface with LogLevel support.
 * Outputs either on the JS console or as a popup, depending on the level of the message.
 */
class Logger {
  constructor() {
    this.logLevel = LogLevel.INFO;
    
    // Automatically handle uncaught errors.
    window.onerror = (msg, url, line, col, error) => {
      this.log(LogLevel.ERROR, msg + (error ? '\n\n' + error : ''));
      // Do not catch the error, so that the console still shows it.
      return false;
    }
  }
  
  setLogLevel(level) {
    this.logLevel = level;
  }
  
  log(level, message) {
    if (level >= this.logLevel) {
      if (level >= LogLevel.WARNING) {
        this.showPopup(level, message);
      }
      
      // Always write on the console.
      console.log(message);
    }
  }
  
  showPopup(level, message) {
    if (document.body === null) {
      // Body is not available yet, set up a callback.
      window.addEventListener('load', this.showPopup.bind(this, level, message));
      return;
    }
    
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = message;
    document.body.appendChild(popup);
    window.setTimeout(() => {
      document.body.removeChild(popup);
    }, POPUP_DISMISS_TIME);
  }
}
