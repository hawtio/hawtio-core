namespace Config {

  export class ConfigService {
    
    private config: {
      brand: {
        logoUrl: string;
        nameUrl: string;
        nameText: string;
      }
    }

    constructor(config) {
      if (angular.isObject(config)) {
        this.config = config;
      } else {
        throw Error('Invalid configuration: ' + config);
      }
    }

    getBrandLogoUrl() {
      return this.getProperty('brand', 'logoUrl');
    }
    
    getBrandNameUrl() {
      return this.getProperty('brand', 'nameUrl');
    }
    
    getBrandNameText() {
      return this.getProperty('brand', 'nameText');
    }
    
    private getProperty(group: string, name: string) {
      if (this.config && this.config[group] && this.config[group][name]) {
        return this.config[group][name];
      } else {
        log.warn(`Configuration property "${group}.${name}" not found`);
        return null;
      }
    }

  }

}
