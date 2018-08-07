namespace Core {

  const SHOW_ALERT = 'showPreferencesResetAlert';

  export function ResetPreferencesController($scope, $window: ng.IWindowService) {
    'ngInject';

    $scope.showAlert = !!$window.sessionStorage.getItem(SHOW_ALERT);
    $window.sessionStorage.removeItem(SHOW_ALERT);

    $scope.doReset = function () {
      log.info('Resetting preferences');
      // Backup the storage K/V pairs that are not actual preferences.
      // Ideally, the preferences would be better organised under structured keys
      // that would be provided to the preferences registry, so that a local storage
      // complete clear operation and restore of hard-coded K/V pairs could be avoided.
      const jvmConnect = $window.localStorage.getItem('jvmConnect');
      const osAuthCreds = $window.localStorage.getItem('osAuthCreds');

      $window.localStorage.clear();

      $window.localStorage.setItem('jvmConnect', jvmConnect);
      $window.localStorage.setItem('osAuthCreds', osAuthCreds);

      $window.sessionStorage.setItem(SHOW_ALERT, 'true');
      $window.setTimeout(() => {
        $window.location.reload();
      }, 10);
    }
  }
}
