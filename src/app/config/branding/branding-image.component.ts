/// <reference path="../config-manager.ts"/>

namespace Core {

  export class BrandingImageController {

    class: string;
    src: string;
    alt: string;
    srcValue: string;
    altValue: string;

    constructor(private configManager: ConfigManager) {
      'ngInject';
    }

    $onInit() {
      this.srcValue = this.configManager.getBrandingValue(this.src);
      this.altValue = this.configManager.getBrandingValue(this.alt);
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
