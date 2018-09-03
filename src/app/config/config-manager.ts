/// <reference path="config.ts"/>

namespace Core {

  export class ConfigManager {

    constructor(private config: Config) {
    }

    getBrandingValue(key: string): string {
      if (this.config && this.config.branding && this.config.branding[key]) {
        return this.config.branding[key];
      } else {
        return '';
      }
    }

    getAboutValue(key: string): any {
      if (this.config && this.config.about && this.config.about[key]) {
        return this.config.about[key];
      } else {
        return null;
      }
    }

    isRouteEnabled(path: string): boolean {
      return !this.config || !this.config.disabledRoutes || this.config.disabledRoutes.indexOf(path) === -1;
    }
  }

}
