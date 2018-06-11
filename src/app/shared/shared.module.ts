/// <reference path="loading/loading.component.ts"/>

namespace Shared {

  export const sharedModule = angular
    .module('hawtio-shared', [])
    .component('hawtioLoading', hawtioLoadingComponent)
    .name;

}
