/// <reference path="general-preferences.service.ts"/>

namespace Core {
  export function GeneralPreferencesController($scope, generalPreferencesService: GeneralPreferencesService) {
    'ngInject';

    $scope.availableVerticalNavs = {
      availableOptions: [
        "show", "hide"
      ]
    };
    $scope.defaultVerticalNavState = generalPreferencesService.getDefaultVerticalNavState();
    $scope.onToggleChange = defaultVerticalNavState => {
      if (defaultVerticalNavState != null && defaultVerticalNavState != undefined) {
        generalPreferencesService.setDefaultVerticalNavState(defaultVerticalNavState);
      }
    }
  }

}
