/// <reference path="humanize/humanize.service.ts"/>

namespace Core {

  export const _module = angular
    .module('hawtio-core', [])
    .service('humanizeService', HumanizeService);
  
  export const coreModule = _module.name;

  export const log: Logging.Logger = Logger.get(coreModule);

}
