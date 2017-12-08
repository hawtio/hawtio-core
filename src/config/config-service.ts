namespace Config {

  export class ConfigService {
    
    private config: {
      branding: {
        logoUrl: string;
        logoAltUrl: string;
        brandUrl: string;
        brandAltUrl: string;
        brandName: string;
      }
    }

    constructor(config) {
      if (angular.isObject(config)) {
        this.config = config;
      } else {
        throw Error('Could not load hawtconfig.json. Expected object but found ' + (config === null ? 'null' : typeof config));
      }
    }

    getBrandLogoUrl() {
      return this.getProperty('branding', 'logoUrl');
    }

    getBrandLogoAltUrl() {
      return this.getProperty('branding', 'logoAltUrl');
    }
    
    getBrandNameUrl() {
      return this.getProperty('branding', 'brandUrl');
    }
    
    getBrandNameAltUrl() {
      return this.getProperty('branding', 'brandAltUrl');
    }
    
    getBrandName() {
      return this.getProperty('branding', 'brandName');
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
