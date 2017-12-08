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

    getBrandingValue(name: string) {
      return this.getValue('branding', name);
    }

    private getValue(group: string, name: string) {
      if (this.config && this.config[group] && this.config[group][name]) {
        return this.config[group][name];
      } else {
        log.warn(`Configuration property "${group}.${name}" not found`);
        return '';
      }
    }

  }

}
