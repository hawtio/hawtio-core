/// <reference path="config.ts"/>

namespace Core {

  export class ConfigManager {

    constructor(private _config: Config) {
    }

    get config(): Config {
      return this._config;
    }

    set config(value: Config) {
      this._config = value;
    }

    get branding(): Branding {
      return this._config.branding;
    }

    get login(): Login {
      return this._config.login;
    }

    getBrandingValue(key: string): string {
      if (this._config && this._config.branding && this._config.branding[key]) {
        return this._config.branding[key];
      } else {
        return '';
      }
    }

    getAboutValue(key: string): any {
      if (this._config && this._config.about && this._config.about[key]) {
        return this._config.about[key];
      } else {
        return null;
      }
    }

    isRouteEnabled(path: string): boolean {
      return !this._config || !this._config.disabledRoutes || this._config.disabledRoutes.indexOf(path) === -1;
    }
  }

}
