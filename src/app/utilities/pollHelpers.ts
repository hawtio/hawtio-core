/// <reference path="baseHelpers.ts"/>

namespace PollHelpers {

  var log:Logging.Logger = Logger.get("PollHelpers");
  
  export function setupPolling($scope, updateFunction:(next:() => void) => void, period = 2000, $timeout?:ng.ITimeoutService, jolokia?:Jolokia.IJolokia) {
    if ($scope.$hasPoller) {
      log.debug("scope already has polling set up, ignoring subsequent polling request");
      return;
    }
    $scope.$hasPoller = true;
    if (!$timeout) {
      $timeout = <ng.ITimeoutService> HawtioCore.injector.get('$timeout');
    }
    if (!jolokia) {
      try {
        jolokia = <Jolokia.IJolokia> HawtioCore.injector.get('jolokia');
      } catch (err) {
        // no jolokia service
      }
    }
    var promise:ng.IPromise<any> = undefined;
    var name = $scope.name || 'anonymous scope';

    var refreshFunction = () => {
      // log.debug("polling for scope: ", name);
      updateFunction(() => {
        var keepPollingFn = $scope.$keepPolling;
        if (!angular.isFunction(keepPollingFn)) {
          keepPollingFn = () => {
            if (!jolokia) {
              return true;
            }
            return jolokia.isRunning();
          }
        }
        if (keepPollingFn() && $scope.$hasPoller) {
          promise = $timeout(refreshFunction, period);
        }
      });
    };

    if ($scope.$on) {
      $scope.$on('$destroy', () => {
        log.debug("scope", name, " being destroyed, cancelling polling");
        delete $scope.$hasPoller;
        $timeout.cancel(promise); 
      });

      $scope.$on('$routeChangeStart', () => {
        log.debug("route changing, cancelling polling for scope: ", name);
        delete $scope.$hasPoller;
        $timeout.cancel(promise);
      });
    }

    return refreshFunction;

  }

}
