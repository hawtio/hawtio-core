/// <reference path="../config/config-service.ts"/>

namespace Branding {

  export class BrandNameController {

    private src: string;
    private alt: string;
    
    constructor($rootScope: ng.IRootScopeService) {
      'ngInject';
      $rootScope.$on(Config.EVENT_LOADED, (event, configService: Config.ConfigService) => {
        this.src = configService.getBrandNameAltUrl();
        this.alt = configService.getBrandName();
      });
    }

  }

  export const brandNameComponent: angular.IComponentOptions = {
    template: `<img class="navbar-brand-name" src="{{$ctrl.src}}" alt="{{$ctrl.alt}}" />`,
    controller: BrandNameController
  };

}
