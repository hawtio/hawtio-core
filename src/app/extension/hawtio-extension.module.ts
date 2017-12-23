/// <reference path="hawtio-extension.service.ts"/>
/// <reference path="hawtio-extension.directive.ts"/>

namespace Core {

  export const hawtioExtensionModule = angular
    .module('hawtio-extension-service', [])
    .service('HawtioExtension', HawtioExtensionService)
    .directive('hawtioExtension', hawtioExtensionDirective)
    .name;

}
