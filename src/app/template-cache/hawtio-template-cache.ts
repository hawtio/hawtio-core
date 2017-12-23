var templateCache;
(function (templateCache) {
  templateCache.pluginName = 'hawtio-template-cache';
  templateCache._module = angular.module(templateCache.pluginName, []);

  templateCache._module.config(['$provide', function($provide) {

    // extend template cache a bit so we can avoid fetching templates from the
    // server
    $provide.decorator('$templateCache', ['$delegate', function($delegate) {
      var log = Logger.get('$templateCache');
      var oldPut = $delegate.put;
      $delegate.watches = {};
      $delegate.put = function(id, template) {
        ////log.debug("Adding template: ", id); //, " with content: ", template);
        /*
        if (!template) {
          //log.debug("Template is undefined, ignoring");
          return;
        }
        */
        oldPut(id, template);
        if (id in $delegate.watches) {
          //log.debug("Found watches for id: ", id);
          $delegate.watches[id].forEach(function(func) {
            func(template);
          });
          //log.debug("Removing watches for id: ", id);
          delete $delegate.watches[id];
        }
      };
      var oldGet = $delegate.get;
      $delegate.get = function(id) {
        var answer = oldGet(id);
        //log.debug("Getting template: ", id); //, " returning: ", answer);
        return answer;
      };
      return $delegate;
    }]);

    // extend templateRequest so we can prevent it from requesting templates, as
    // we have 'em all in $templateCache
    $provide.decorator('$templateRequest', ['$rootScope', '$timeout', '$q', '$templateCache', '$delegate',
        function($rootScope, $timeout, $q, $templateCache, $delegate) {
      var fn = function(url, ignore) {
        var log = Logger.get('$templateRequest');
        //log.debug("request for template at: ", url);
        var answer = $templateCache.get(url);
        var deferred = $q.defer();
        if (!angular.isDefined(answer)) {
          //log.debug("No template in cache for URL: ", url);
          if ('watches' in $templateCache) {
            //log.debug("Adding watch to $templateCache for url: ", url);
            if (!$templateCache.watches[url]) {
              $templateCache.watches[url] = [];
            }
            $templateCache.watches[url].push(function(template) {
                //log.debug("Resolving watch on template: ", url);
                deferred.resolve(template);
            });
            return deferred.promise;
          } else {
            // Guess we'll just let the real templateRequest service handle it
            return $delegate(url, ignore);
          }
        } else {
          //log.debug("Found template for URL: ", url);
          $timeout(function() {
            deferred.resolve(answer);
          }, 1);
          return deferred.promise;
        }
      };
      fn['totalPendingRequests'] = 0;
      return fn;
    }]);
  }]);

})(templateCache || (templateCache = {}));
