/// <reference path="../extension/hawtio-extension.ts"/>
/// <reference path="../help/help-registry.ts"/>
/// <reference path="preferences.service.ts"/>

namespace Core {

  export function configureRoutes($routeProvider: ng.route.IRouteProvider) {
    'ngInject';
    $routeProvider.when('/preferences', {
      templateUrl: 'preferences/preferences-home/preferences-home.html',
      reloadOnSearch: false
    });
  }

  export function configureMenu(HawtioExtension: HawtioExtension, $compile: ng.ICompileService) {
    'ngInject';
    HawtioExtension.add('hawtio-preferences', $scope => {
      let template = '<a ng-href="preferences">Preferences</a>';
      return $compile(template)($scope);
    });
  }

  export function savePreviousLocationWhenOpeningPreferences($rootScope: ng.IScope,
    preferencesService: PreferencesService) {
    'ngInject';
    $rootScope.$on("$locationChangeSuccess", function (event, newUrl, oldUrl) {
      if (newUrl.indexOf('/preferences') !== -1 && oldUrl.indexOf('/preferences') === -1) {
        const baseUrl = newUrl.substring(0, newUrl.indexOf('/preferences'));
        const url = oldUrl.substring(baseUrl.length);
        preferencesService.saveLocationUrl(url);
      }
    });
  }

  export function configureDocumentation(helpRegistry: Help.HelpRegistry) {
    'ngInject';
    helpRegistry.addUserDoc('preferences', 'preferences/help.md');
  }

  export function configurePreferencesPages(preferencesRegistry: PreferencesRegistry) {
    'ngInject';
    preferencesRegistry.addTab("Console Logs", 'preferences/logging-preferences/logging-preferences.html');
    preferencesRegistry.addTab("Reset", 'preferences/reset-preferences/reset-preferences.html');
    preferencesRegistry.addTab("General", 'preferences/general-preferences/general-preferences.html');
  }

}
