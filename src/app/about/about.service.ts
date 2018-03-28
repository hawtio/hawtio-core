/// <reference path="../config/config.ts"/>

namespace About {

  export class AboutService {

    private moreProductInfo = [];

    constructor(private configManager: Core.ConfigManager) {
      'ngInject';
    }

    getTitle(): string {
      return this.configManager.getAboutValue('title');
    }

    getProductInfo(): Core.AboutProductInfo[] {
      let productInfo = [];
      productInfo = productInfo.concat(this.configManager.getAboutValue('productInfo') || []);
      productInfo = this.moreProductInfo;
      productInfo = _.sortBy(productInfo, ['label']);
      return productInfo;
    }
    
    addProductInfo(name: string, value: string) {
      this.moreProductInfo.push({name: name, value: value});
    }
    
    getAdditionalInfo(): string {
      return this.configManager.getAboutValue('additionalInfo');
    }

    getCopyright(): string {
      return this.configManager.getAboutValue('copyright');
    }

    getImgSrc(): string {
      return this.configManager.getAboutValue('imgSrc');
    }
  }

}
