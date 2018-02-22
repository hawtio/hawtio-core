namespace Help {

  export function configureRoutes($routeProvider) {
    'ngInject';
    $routeProvider.when('/help', { template: '<help></help>' });
  }

  export function configureDocumentation(helpRegistry: HelpRegistry, $templateCache) {
    'ngInject';
    helpRegistry.addUserDoc('index', 'help/help.md');
    
    // These docs live in the main hawtio project
    helpRegistry.addSubTopic('index', 'faq', 'plugins/help/doc/FAQ.md', () => {
      return $templateCache.get('plugins/help/doc/FAQ.md') !== undefined;
    });
    helpRegistry.addSubTopic('index', 'changes', 'plugins/help/doc/CHANGES.md', () => {
      return $templateCache.get('plugins/help/doc/CHANGES.md') !== undefined;
    });
  }

  export function configureMenu(HawtioExtension: Core.HawtioExtension, $compile: ng.ICompileService) {
    'ngInject';
    HawtioExtension.add('hawtio-help', $scope => {
      let template = '<a ng-href="help">Help</a>';
      return $compile(template)($scope);
    });
  }
  
}
