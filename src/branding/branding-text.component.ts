/// <reference path="../config/config-service.ts"/>

namespace Branding {

  export class BrandingTextController {

    key: string;
    value: string;
    
    constructor(private $rootScope: ng.IRootScopeService) {
      'ngInject';
    }

    $onInit() {
      this.$rootScope.$on(Config.EVENT_LOADED, (event, configService: Config.ConfigService) => {
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
