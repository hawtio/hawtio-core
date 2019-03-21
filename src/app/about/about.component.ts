/// <reference path="about.service.ts"/>
/// <reference path="../config/config.ts"/>

namespace About {

  export class AboutController {
    open = false;

    constructor(private $rootScope: ng.IScope, private aboutService: AboutService) {
      'ngInject';
    }

    $onInit() {
      this.$rootScope.$on(SHOW_ABOUT_EVENT, () => {
        this.open = true;
      });
    }

    get title(): string {
      return this.aboutService.getTitle();
    }

    get productInfo(): Core.AboutProductInfo[] {
      return this.aboutService.getProductInfo();
    }

    get copyright(): string {
      return this.aboutService.getCopyright();
    }

    get imgSrc(): string {
      return this.aboutService.getImgSrc();
    }

    close() {
      this.open = false;
    }
  }

  export const aboutComponent: angular.IComponentOptions = {
    templateUrl: 'about/about.component.html',
    controller: AboutController
  };

}
