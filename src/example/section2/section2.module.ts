/// <reference path="section2.component.ts"/>
/// <reference path="section2.config.ts"/>
/// <reference path="section2.service.ts"/>

namespace Section2 {

  export const module = angular.module('example-section2', [])
    .config(configureRoutes)
    .run(configureHelp)
    .run(configureLayout)
    .run(registerInitFunction)
    .component('section2', section2omponent)
    .service('section2Service', Section2Service)
    .name;

}
