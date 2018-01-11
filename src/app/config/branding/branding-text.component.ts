/// <reference path="../config-manager.ts"/>

namespace Core {

  export class BrandingTextController {

    key: string;
    value: string;
    
    constructor(private configManager: ConfigManager) {
      'ngInject';
    }

    $onInit() {
      this.value = this.configManager.getBrandingValue(this.key);
    }
    
  }

  export const brandingTextComponent: angular.IComponentOptions = {
    bindings: {
      key: '@'
    },
    template: '{{$ctrl.value}}',
    controller: BrandingTextController
  };

}
