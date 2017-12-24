/// <reference path="hawtio-extension.ts"/>
/// <reference path="hawtio-extension.directive.ts"/>

namespace Core {

  export const hawtioExtensionModule = angular
    .module('hawtio-extension-service', [])
    .service('HawtioExtension', HawtioExtension)
    .directive('hawtioExtension', hawtioExtensionDirective)
    .name;

}
