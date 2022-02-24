namespace Core {
  export function GeneralPreferencesController($scope, generalPreferencesService: GeneralPreferencesService) {
    'ngInject';
    $scope.defaultVerticalNavState = generalPreferencesService.getDefaultVerticalNavState();
    $scope.onToggle = function () {
      generalPreferencesService.setDefaultVerticalNavState($scope.defaultVerticalNavState);
    }
  }
}
