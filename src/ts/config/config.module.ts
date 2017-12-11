/// <reference path="config-loader.ts"/>

namespace Config {

  export const log = Logger.get('hawtio-config');
  export const EVENT_LOADED = 'hawtio-config-loaded';
  
  export const configModule = angular
    .module('hawtio-config', [])
    .run(configLoader)
    .name;

}
