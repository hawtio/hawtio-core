namespace Core {

  const pluginName = 'hawtio-core-template-cache';
  const log: Logging.Logger = Logger.get(pluginName);

  export const templateCacheModule = angular
    .module(pluginName, [])
    .config(templateCacheConfig)
    .name;

  function templateCacheConfig($provide): void {
    'ngInject';

    // extend template cache a bit so we can avoid fetching templates from the
    // server
    $provide.decorator('$templateCache', ['$delegate', function ($delegate) {
      let oldPut = $delegate.put;
      $delegate.watches = {};
      $delegate.put = function (id, template) {
        log.debug("Adding template:", id); //, " with content: ", template);
        oldPut(id, template);
        if (id in $delegate.watches) {
          log.debug("Found watches for id:", id);
          $delegate.watches[id].forEach(function (func) {
            func(template);
          });
          log.debug("Removing watches for id:", id);
          delete $delegate.watches[id];
        }
      };
      let oldGet = $delegate.get;
      $delegate.get = function (id) {
        let answer = oldGet(id);
        log.debug("Getting template:", id); //, " returning: ", answer);
        return answer;
      };
      return $delegate;
    }]);

    // extend templateRequest so we can prevent it from requesting templates, as
    // we have 'em all in $templateCache
    $provide.decorator('$templateRequest', ['$rootScope', '$timeout', '$q', '$templateCache', '$delegate',
      function ($rootScope, $timeout, $q, $templateCache, $delegate) {
        let fn = function (url, ignore) {
          log.debug("request for template at:", url);
          let answer = $templateCache.get(url);
          let deferred = $q.defer();
          if (!angular.isDefined(answer)) {
            log.debug("No template in cache for URL:", url);
            if ('watches' in $templateCache) {
              log.debug("Adding watch to $templateCache for url:", url);
              if (!$templateCache.watches[url]) {
                $templateCache.watches[url] = [];
              }
              $templateCache.watches[url].push(function (template) {
                log.debug("Resolving watch on template:", url);
                deferred.resolve(template);
              });
              return deferred.promise;
            } else {
              // Guess we'll just let the real templateRequest service handle it
              return $delegate(url, ignore);
            }
          } else {
            log.debug("Found template for URL:", url);
            $timeout(function () {
              deferred.resolve(answer);
            }, 1);
            return deferred.promise;
          }
        };
        fn['totalPendingRequests'] = 0;
        return fn;
      }]);
  }

}
