/// <reference path="../config-service.ts"/>

namespace Core {

  export class BrandingTextController {

    key: string;
    value: string;
    
    constructor(private $rootScope: ng.IRootScopeService) {
      'ngInject';
    }

    $onInit() {
      this.$rootScope.$on(EVENT_LOADED, (event, configService: ConfigService) => {
        this.value = configService.getBrandingValue(this.key);
      });
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
