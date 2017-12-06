/// <reference path="../config/config-service.ts"/>

namespace Branding {

  export class BrandLogoController {

    private src: string;

    constructor($rootScope: ng.IRootScopeService) {
      'ngInject';
      $rootScope.$on(Config.EVENT_LOADED, (event, configService: Config.ConfigService) => {
        this.src = configService.getBrandLogoUrl();
      });
    }

  }

  export const brandLogoComponent: angular.IComponentOptions = {
    template: `<img class="navbar-brand-icon" src="{{$ctrl.src}}" alt=""/>`,
    controller: BrandLogoController
  };

}
