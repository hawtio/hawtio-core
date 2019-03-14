/// <reference path="example.config.ts"/>
/// <reference path="section1/section1.module.ts"/>
/// <reference path="section2/section2.module.ts"/>
/// <reference path="section3/section3.module.ts"/>

namespace Example {

  export const exampleModule = angular.module('example', [
    Section1.module,
    Section2.module,
    Section3.module
  ])
  .run(addContextSelector)
  .run(addHeaderTools)
  .name;

  hawtioPluginLoader.addModule(exampleModule);
}
