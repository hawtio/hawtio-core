/// <reference path="section3.service.ts"/>

namespace Section3 {

  export function configureRoutes($routeProvider: ng.route.IRouteProvider) {
    'ngInject';
    $routeProvider
      .when('/section3', {template: '<section3></section3>'});
  }

  export function configureHelp(helpRegistry: Help.HelpRegistry, $templateCache: ng.ITemplateCacheService) {
    'ngInject';
    const key = 'help/section3.md';
    helpRegistry.addUserDoc('section3', key);
    $templateCache.put(key, '## Section 3\n\nTest documentation for Section 3\n');
  }

  export function configureLayout(mainNavService: Nav.MainNavService, section3Service: Section3Service) {
    'ngInject';
    mainNavService.addItem({
      title: 'Section 3',
      href: '/section3',
      isValid: () => {
        console.log('section3:', section3Service.isValid() ? 'valid' : 'invalid');
        return section3Service.isValid();
      }
    });
  }

  export function registerInitFunction(initService: Init.InitService, section3Service: Section3Service) {
    'ngInject';
    initService.registerInitFunction(() => {
      return section3Service.init();
    });
  }

}
