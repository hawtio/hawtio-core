/// <reference path="about/about.service.ts"/>

namespace App {

  export function configureAboutPage(aboutService: About.AboutService) {
    'ngInject';
    aboutService.addProductInfo('hawtio-core', 'PACKAGE_VERSION_PLACEHOLDER');
  }

}