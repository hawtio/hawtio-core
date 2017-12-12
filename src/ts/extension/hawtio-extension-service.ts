namespace HawtioExtensionService {

  export const pluginName = 'hawtio-extension-service';
  export const templatePath = 'plugins/hawtio-extension-service/html';

  export const _module = angular.module(pluginName, []);

  export class HawtioExtension {
    private _registeredExtensions = {};

    constructor() {
    }

    add(extensionPointName: string, fn: any): void {
      if (!this._registeredExtensions[extensionPointName]) {
        this._registeredExtensions[extensionPointName] = [];
      }
      this._registeredExtensions[extensionPointName].push(fn);
    }

    render(extensionPointName: string, element: any, scope: any): void {
      let fns = this._registeredExtensions[extensionPointName];
      if (!fns) {
        return;
      }

      for (let i = 0; i < fns.length; i++) {
        let toAppend = fns[i](scope);
        if (!toAppend) {
          return;
        }
        if (typeof toAppend == "string") {
          toAppend = document.createTextNode(toAppend);
        }
        element.append(toAppend);
      }
    }
  }

  _module.service('HawtioExtension', HawtioExtension);

  function hawtioExtensionDirective(HawtioExtension: HawtioExtension): any {
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

  _module.directive('hawtioExtension', hawtioExtensionDirective);

}
