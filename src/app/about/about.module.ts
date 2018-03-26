/// <reference path="about.component.ts"/>
/// <reference path="about.config.ts"/>
/// <reference path="about.service.ts"/>

namespace About {

  export const aboutModule = angular
    .module('hawtio-about', [])
    .run(configureMenu)
    .component('about', aboutComponent)
    .service('aboutService', AboutService)
    .name;

}
