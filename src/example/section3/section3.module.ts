/// <reference path="section3.component.ts"/>
/// <reference path="section3.config.ts"/>
/// <reference path="section3.service.ts"/>

namespace Section3 {

  export const module = angular.module('example-section3', [])
    .config(configureRoutes)
    .run(configureHelp)
    .run(configureLayout)
    .run(registerInitFunction)
    .component('section3', section3omponent)
    .service('section3Service', Section3Service)
    .name;

}
