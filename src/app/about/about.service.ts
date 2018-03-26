/// <reference path="../config/config.ts"/>

namespace About {

  export class AboutService {

    private moreProductInfo: Core.AboutProductInfo[] = [];

    constructor(private configManager: Core.ConfigManager) {
      'ngInject';
    }

    getTitle(): string {
      return this.configManager.getAboutValue('title');
    }

    getDescription(): string {
      return this.configManager.getAboutValue('description');
    }

    getProductInfo(): Core.AboutProductInfo[] {
      let productInfo: Core.AboutProductInfo[] = this.configManager.getAboutValue('productInfo') || [];
      return productInfo.concat(this.moreProductInfo);
    }

    addProductInfo(name: string, value: string) {
      this.moreProductInfo.push({name: name, value: value});
    }

  }

}
