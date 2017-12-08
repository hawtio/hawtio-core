/// <reference path="config-service.ts"/>

namespace Config {

  export function configLoader($rootScope: ng.IRootScopeService, $http: ng.IHttpService) {
    'ngInject';
    
    log.info('Loading hawtconfig.json...');
    
    $http.get('hawtconfig.json')
      .then(response => {
        try {
          const configService = new ConfigService(response.data);
          $rootScope.$broadcast(EVENT_LOADED, configService);
          log.info('hawtconfig.json loaded');
        } catch(error) {
          log.warn(error.message);
          log.debug('hawtconfig.json:\n' + response.data);
        }
      })
      .catch(response => {
        log.warn('hawtconfig.json not found');
      });
  }

}
