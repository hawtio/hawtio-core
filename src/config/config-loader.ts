/// <reference path="config-service.ts"/>

namespace Config {

  export function configLoader($rootScope: ng.IRootScopeService, $http: ng.IHttpService) {
    'ngInject';
    
    log.info('Loading configuration...');
    
    $http.get('hawtconfig.json')
      .then(response => {
        try {
          log.info('Configuration loaded');
          const configService = new ConfigService(response.data);
          $rootScope.$broadcast(EVENT_LOADED, configService);
        } catch(error) {
          log.error(error);
        }
      })
      .catch(response => {
        log.error('Failed to load configuration');
      });
  }

}
