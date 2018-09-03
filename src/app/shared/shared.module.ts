/// <reference path="loading/loading.component.ts"/>
/// <reference path="action-bar/action-bar.component.ts"/>

namespace Shared {

  export const sharedModule = angular
    .module('hawtio-shared', [])
    .component('hawtioActionBar', hawtioActionBarComponent)
    .component('hawtioLoading', hawtioLoadingComponent)
    .name;

}
