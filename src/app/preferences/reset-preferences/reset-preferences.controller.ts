namespace Core {

  const SHOW_ALERT = 'showPreferencesResetAlert';
  
  export function ResetPreferencesController($scope, $window: ng.IWindowService) {
    'ngInject';      
    
    $scope.showAlert = !!$window.sessionStorage.getItem(SHOW_ALERT);
    $window.sessionStorage.removeItem(SHOW_ALERT);
    
    $scope.doReset = function() {
      log.info("Resetting preferences");
      $window.localStorage.clear();
      $window.sessionStorage.setItem(SHOW_ALERT, 'true');
      $window.setTimeout(() => {
        $window.location.reload();
      }, 10);
    }

  }

}
