namespace Core {

  export function HelpConfig($routeProvider, $provide) {
    'ngInject';

    $routeProvider.when('/help', { template: '<help></help>' });
  }

  export function HelpRun(helpRegistry, viewRegistry, layoutFull, $templateCache) {
    'ngInject';

    viewRegistry['help'] = layoutFull;

    helpRegistry.addUserDoc('index', 'help/help.md');

    // These docs live in the main hawtio project
    helpRegistry.addSubTopic('index', 'faq', 'plugins/help/doc/FAQ.md', () => {
      return $templateCache.get('plugins/help/doc/FAQ.md') !== undefined;
    });
    helpRegistry.addSubTopic('index', 'changes', 'plugins/help/doc/CHANGES.md', () => {
      return $templateCache.get('plugins/help/doc/CHANGES.md') !== undefined;
    });
  }

}
