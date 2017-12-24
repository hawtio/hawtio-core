/// <reference path="hawtio-extension.ts"/>

namespace Core {

  export function hawtioExtensionDirective(HawtioExtension: HawtioExtension): any {
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
