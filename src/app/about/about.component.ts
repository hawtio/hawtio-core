/// <reference path="about.service.ts"/>
/// <reference path="../config/config.ts"/>

namespace About {

  export class AboutController {
    open = false;
    title: string;
    productInfo: Core.AboutProductInfo[];
    additionalInfo: string;
    copyright: string;
    imgSrc: string;

    constructor(private $rootScope: ng.IScope, private aboutService: AboutService) {
      'ngInject';
    }

    $onInit() {
      this.title = this.aboutService.getTitle();
      this.productInfo = this.aboutService.getProductInfo();
      this.additionalInfo = this.aboutService.getAdditionalInfo();
      this.copyright = this.aboutService.getCopyright();
      this.imgSrc = this.aboutService.getImgSrc();
      this.$rootScope.$on('about-link-clicked', () => {
        this.open = true;
      });
    }

    onClose() {
      this.open = false;
    }
  }

  export const aboutComponent: angular.IComponentOptions = {
    template: `
      <pf-about-modal is-open="$ctrl.open" on-close="$ctrl.onClose()" title="$ctrl.title"
        product-info="$ctrl.productInfo" additional-info="$ctrl.additionalInfo" copyright="$ctrl.copyright"
        img-src="$ctrl.imgSrc">
      </pf-about-modal>
    `,
    controller: AboutController
  };

}
