namespace Core {

  export class LoggingPreferencesService {

    private static DEFAULT_LOG_BUFFER_SIZE = 100;
    private static DEFAULT_GLOBAL_LOG_LEVEL = Logger.INFO;

    constructor(private $window: ng.IWindowService) {
      'ngInject';
    }

    getLogBuffer(): number {
      if (window.localStorage.getItem('logBuffer') !== null) {
        return parseInt(this.$window.localStorage.getItem('logBuffer'), 10);
      } else {
        return LoggingPreferencesService.DEFAULT_LOG_BUFFER_SIZE;
      }
    }

    setLogBuffer(logBuffer: number): void {
      this.$window.localStorage.setItem('logBuffer', logBuffer.toString());
    }

    getGlobalLogLevel(): Logging.LogLevel {
      if (this.$window.localStorage.getItem('logLevel') !== null) {
        return JSON.parse(this.$window.localStorage.getItem('logLevel'));
      } else {
        return LoggingPreferencesService.DEFAULT_GLOBAL_LOG_LEVEL;
      }
    }

    setGlobalLogLevel(logLevel: Logging.LogLevel): void {
      this.$window.localStorage.setItem('logLevel', JSON.stringify(logLevel));
    }
    
    getChildLoggers(): Logging.ChildLogger[] {
      if (this.$window.localStorage.getItem('childLoggers') !== null) {
        return JSON.parse(this.$window.localStorage.getItem('childLoggers'));
      } else {
        return [];
      }
    }

    getAvailableChildLoggers(): Logging.ChildLogger[] {
      const allChildLoggers = _.values(Logger['loggers']).map(obj => obj['context']);
      const childLoggers = this.getChildLoggers();
      const availableChildLoggers = allChildLoggers.filter(childLogger => !childLoggers.some(c => c.name === childLogger.name));
      return _.sortBy(availableChildLoggers, 'name');
    };

    addChildLogger(childLogger: Logging.ChildLogger): void {
      const childLoggers = this.getChildLoggers();
      childLoggers.push(childLogger);
      this.setChildLoggers(childLoggers);
    }  

    removeChildLogger(childLogger: Logging.ChildLogger): void {
      const childLoggers = this.getChildLoggers();
      _.remove(childLoggers, c => c.name === childLogger.name);
      this.setChildLoggers(childLoggers);
      Logger.get(childLogger.name).setLevel(this.getGlobalLogLevel());
    }  
    
    setChildLoggers(childLoggers: Logging.ChildLogger[]): void {
      this.$window.localStorage.setItem('childLoggers', JSON.stringify(childLoggers));
    }

    reconfigureLoggers(): void {
      Logger.setLevel(this.getGlobalLogLevel());
      this.getChildLoggers().forEach(childLogger => {
        Logger.get(childLogger.name).setLevel(childLogger.filterLevel);
      });
    }

  }

}
