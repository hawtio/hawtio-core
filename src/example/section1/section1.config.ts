/// <reference path="section1.service.ts"/>

namespace Section1 {

  export function configureRoutes($routeProvider: ng.route.IRouteProvider) {
    'ngInject';
    $routeProvider
      .when('/section1', {redirectTo: '/section1/page1'})
      .when('/section1/page1', {template: '<section1-page1></section1-page1>'})
      .when('/section1/page2', {template: '<section1-page2></section1-page2>'})
  }

  export function configureHelp(helpRegistry, $templateCache: ng.ITemplateCacheService) {
    'ngInject';
    const key = 'help/section1.md';
    helpRegistry.addUserDoc('section1', key);
    $templateCache.put(key, '## Section 1\n\nTest documentation for Section 1\n');
  }
  
  export function configureLayout(mainNavService: Nav.MainNavService, section1Service: Section1Service) {
    'ngInject';
    mainNavService.addItem({
      title: 'Section 1',
      href: '/section1',
      template: '<section1-layout></section1-layout>',
      isValid: () => {
        console.log('section1: ' + (section1Service.isValid() ? 'valid' : 'invalid'));
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
