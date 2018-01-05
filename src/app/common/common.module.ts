/// <reference path="humanize/humanize.service.ts"/>

namespace Core {

  export const commonModule = angular
    .module('hawtio-common', [])
    .service('humanizeService', HumanizeService)
    .name;

}
