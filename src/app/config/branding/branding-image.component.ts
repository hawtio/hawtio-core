/// <reference path="../config-service.ts"/>

namespace Core {

  export class BrandingImageController {

    class: string;
    src: string;
    alt: string;
    srcValue: string;
    altValue: string;

    constructor(private $rootScope: ng.IRootScopeService) {
      'ngInject';
    }

    $onInit() {
      this.$rootScope.$on(EVENT_LOADED, (event, configService: ConfigService) => {
        this.srcValue = configService.getBrandingValue(this.src);
        this.altValue = configService.getBrandingValue(this.alt);
      });
    }
    
  }

  export const brandingImageComponent: angular.IComponentOptions = {
    bindings: {
      class: '@',
      src: '@',
      alt: '@'
    },
    template: '<img class="{{$ctrl.class}}" src="{{$ctrl.srcValue}}" alt="{{$ctrl.altValue}}"/>',
    controller: BrandingImageController
  };

}
