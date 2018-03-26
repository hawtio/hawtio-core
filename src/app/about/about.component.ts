/// <reference path="about.service.ts"/>
/// <reference path="../config/config.ts"/>

namespace About {

  export class AboutController {
    flags: { open: boolean };
    title: string;
    description: string;
    productInfo: Core.AboutProductInfo[];

    constructor(private aboutService: AboutService) {
      'ngInject';
    }
    
    $onInit() {
      this.title = this.aboutService.getTitle();
      this.description = this.aboutService.getDescription();
      this.productInfo = this.aboutService.getProductInfo();
    }

    onClose() {
      this.flags.open = false;
    }
  }

  export const aboutComponent: angular.IComponentOptions = {
    bindings: {
      flags: '<'
    },
    template: `
      <pf-about-modal is-open="$ctrl.flags.open" on-close="$ctrl.onClose()" title="$ctrl.title"
          additional-info="$ctrl.description" product-info="$ctrl.productInfo"></pf-about-modal>
    `,
    controller: AboutController
  };

}
