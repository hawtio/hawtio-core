/// <reference path="../extension/hawtio-extension.ts"/>
/// <reference path="../help/help-registry.ts"/>
/// <reference path="preferences.service.ts"/>

namespace Core {

  export function configureRoutes($routeProvider) {
    'ngInject';
    $routeProvider.when('/preferences', { 
      templateUrl: 'preferences/preferences-home/preferences-home.html', 
      reloadOnSearch: false 
    });
  }

  export function addItemToUserMenu(HawtioExtension: HawtioExtension, $templateCache: ng.ITemplateCacheService,
    $compile: ng.ICompileService) {
    'ngInject';
    HawtioExtension.add('hawtio-user', $scope => {
      let template = '<li><a ng-href="preferences">Preferences</a></li>';
      return $compile(template)($scope);
    });
  }

  export function savePreviousLocationWhenOpeningPreferences($rootScope: ng.IScope, preferencesService: PreferencesService) {
    'ngInject';
    $rootScope.$on("$locationChangeSuccess", function (event, newUrl, oldUrl) {
      if (newUrl.indexOf('/preferences') !== -1 && oldUrl.indexOf('/preferences') === -1) {
        const baseUrl = newUrl.substring(0, newUrl.indexOf('/preferences'));
        const url = oldUrl.substring(baseUrl.length);
        preferencesService.saveLocationUrl(url);
      }
    });  
  }

  export function addHelpDocumentation(helpRegistry: HelpRegistry) {
    'ngInject';
    helpRegistry.addUserDoc('preferences', 'preferences/help.md');
  }

  export function addPreferencesPages(preferencesRegistry: PreferencesRegistry) {
    'ngInject';
    preferencesRegistry.addTab("Console Logging", 'preferences/logging-preferences/logging-preferences.html');
    preferencesRegistry.addTab("Reset", 'preferences/reset-preferences/reset-preferences.html');
  }

}
