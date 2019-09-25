/// <reference path="section1.service.ts"/>

namespace Section1 {

  export function configureRoutes($routeProvider: ng.route.IRouteProvider) {
    'ngInject';
    $routeProvider
      .when('/section1/page1', { template: '<section1-page1></section1-page1>' })
      .when('/section1/page2', { template: '<section1-page2></section1-page2>' })
      .when('/section1/page2/details', { template: '<section1-page2-details></section1-page2-details>' });
  }

  export function configureHelp(helpRegistry: Help.HelpRegistry, $templateCache: ng.ITemplateCacheService) {
    'ngInject';
    const key = 'help/section1.md';
    helpRegistry.addUserDoc('section1', key);
    $templateCache.put(key, '## Section 1\n\nTest documentation for Section 1\n');
  }

  export function configureLayout(mainNavService: Nav.MainNavService, section1Service: Section1Service) {
    'ngInject';
    mainNavService.addItem({
      title: 'Section 1',
      basePath: '/section1',
      template: '<section1></section1>',
      isValid: () => {
        console.log('section1:', section1Service.isValid() ? 'valid' : 'invalid');
        return section1Service.isValid();
      }
    });
  }

  export function registerInitFunction(initService: Init.InitService, section1Service: Section1Service) {
    'ngInject';
    initService.registerInitFunction(() => {
      return section1Service.init();
    });
  }

}
