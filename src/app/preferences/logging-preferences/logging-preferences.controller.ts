/// <reference path="logging-preferences.service.ts"/>

namespace Core {

  export function LoggingPreferencesController($scope, loggingPreferencesService: LoggingPreferencesService) {
    'ngInject';

    // Initialize tooltips
    (<any>$('[data-toggle="tooltip"]')).tooltip();
    
    $scope.logBuffer = loggingPreferencesService.getLogBuffer();
    $scope.logLevel = loggingPreferencesService.getGlobalLogLevel();
    $scope.childLoggers = loggingPreferencesService.getChildLoggers();
    $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
    $scope.availableLogLevels = [Logger.OFF, Logger.ERROR, Logger.WARN, Logger.INFO, Logger.DEBUG];

    $scope.onLogBufferChange = logBuffer => {
      if (logBuffer) {
        loggingPreferencesService.setLogBuffer(logBuffer);
      }
    }

    $scope.onLogLevelChange = logLevel => {
      loggingPreferencesService.setGlobalLogLevel(logLevel);
      loggingPreferencesService.reconfigureLoggers();
    }

    $scope.addChildLogger = childLogger => {
      loggingPreferencesService.addChildLogger(childLogger);
      $scope.childLoggers = loggingPreferencesService.getChildLoggers();
      $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
    }

    $scope.removeChildLogger = childLogger => {
      loggingPreferencesService.removeChildLogger(childLogger);
      $scope.childLoggers = loggingPreferencesService.getChildLoggers();
      $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
    };
    
    $scope.onChildLoggersChange = childLoggers => {
      loggingPreferencesService.setChildLoggers(childLoggers);
      loggingPreferencesService.reconfigureLoggers();
    }
  }

}
