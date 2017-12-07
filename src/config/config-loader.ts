/// <reference path="config-service.ts"/>

namespace Config {

  export function configLoader($rootScope: ng.IRootScopeService, $http: ng.IHttpService) {
    'ngInject';
    
    log.info('Loading hawtconfig.json...');
    
    $http.get('hawtconfig.json')
      .then(response => {
        try {
          log.info('hawtconfig.json loaded');
          const configService = new ConfigService(response.data);
          $rootScope.$broadcast(EVENT_LOADED, configService);
        } catch(error) {
          log.error('Failed to load hawtconfig.json', error);
        }
      })
      .catch(response => {
        log.warn('hawtconfig.json not found');
      });
  }

}
