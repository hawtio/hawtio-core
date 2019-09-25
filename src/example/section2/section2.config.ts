/// <reference path="section2.service.ts"/>

namespace Section2 {

  export function configureRoutes($routeProvider: ng.route.IRouteProvider) {
    'ngInject';
    $routeProvider
      .when('/section2', {template: '<section2></section2>'});
  }

  export function configureHelp(helpRegistry: Help.HelpRegistry, $templateCache: ng.ITemplateCacheService) {
    'ngInject';
    const key = 'help/section2.md';
    helpRegistry.addUserDoc('section2', key);
    $templateCache.put(key, '## Section 2\n\nTest documentation for Section 2\n');
  }

  export function configureLayout(mainNavService: Nav.MainNavService, section2Service: Section2Service) {
    'ngInject';
    mainNavService.addItem({
      title: 'Section 2',
      href: '/section2',
      isValid: () => {
        console.log('section2:', section2Service.isValid() ? 'valid' : 'invalid');
        return section2Service.isValid();
      },
      rank: 1
    });
  }

  export function registerInitFunction(initService: Init.InitService, section2Service: Section2Service) {
    'ngInject';
    initService.registerInitFunction(() => {
      return section2Service.init();
    });
  }

}
