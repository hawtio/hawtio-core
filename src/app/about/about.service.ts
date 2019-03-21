/// <reference path="../config/config.ts"/>

namespace About {

  export class AboutService {
    private productInfo: Core.AboutProductInfo[];

    constructor(private configManager: Core.ConfigManager) {
      'ngInject';
      this.productInfo = this.configManager.getAboutValue('productInfo') || [];
      this.productInfo = _.sortBy(this.productInfo, ['name']);
    }

    getTitle(): string {
      return this.configManager.getAboutValue('title');
    }

    getProductInfo(): Core.AboutProductInfo[] {
      return this.productInfo;
    }

    addProductInfo(name: string, value: string) {
      this.productInfo.push({name: name, value: value});
      this.productInfo = _.sortBy(this.productInfo, ['name']);
    }

    getCopyright(): string {
      return this.configManager.getAboutValue('copyright');
    }

    getImgSrc(): string {
      return this.configManager.getAboutValue('imgSrc');
    }
  }

}
