/// <reference path="section1-page1.component.ts"/>
/// <reference path="section1-page2.component.ts"/>
/// <reference path="section1.component.ts"/>
/// <reference path="section1.config.ts"/>
/// <reference path="section1.service.ts"/>

namespace Section1 {

  export const module = angular.module('example-section1', [])
    .config(configureRoutes)
    .run(configureHelp)
    .run(configureLayout)
    .run(registerInitFunction)
    .component('section1', section1Component)
    .component('section1Page1', section1Page1Component)
    .component('section1Page2', section1Page2Component)
    .service('section1Service', Section1Service)
    .name;

}
