/// <reference path="hawtio-extension.service.ts"/>

namespace Core {

  export function hawtioExtensionDirective(HawtioExtension: HawtioExtensionService): any {
    'ngInject';
    return {
      restrict: 'EA',
      link: (scope, element, attrs) => {
        if (attrs.name) {
          HawtioExtension.render(attrs.name, element, scope);
        }
      }
    };
  }

}
