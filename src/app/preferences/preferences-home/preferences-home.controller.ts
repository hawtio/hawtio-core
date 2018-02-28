/// <reference path="../preferences.service.ts"/>
/// <reference path="../preferences-registry.ts"/>
/// <reference path="../../navigation/hawtio-tab.ts"/>

namespace Core {

  export function PreferencesHomeController($scope, $location: ng.ILocationService,
    preferencesRegistry: PreferencesRegistry, preferencesService: PreferencesService) {
    'ngInject';

    var panels = preferencesRegistry.getTabs();
    $scope.tabs = _.keys(panels).sort(byLabel).map(label => new Nav.HawtioTab(label, label));

    // pick the first one as the default
    preferencesService.bindModelToSearchParam($scope, $location, "pref", "pref", $scope.tabs[0].label);

    $scope.setPanel = (tab: Nav.HawtioTab) => {
      $scope.pref = tab.label;
    };

    $scope.close = () => {
      preferencesService.restoreLocation($location);
    };

    $scope.getPrefs = (pref) => {
      var panel = panels[pref];
      if (panel) {
        return panel.templateUrl;
      }
      return undefined;
    };

    $scope.getTab = (pref: string): Nav.HawtioTab => {
      return _.find($scope.tabs, {label: pref});
    };
    
    /**
     * Sort the preference by names (and ensure Reset is last).
     */
    function byLabel(a, b) {
      if ("Reset" == a) {
        return 1;
      } else if ("Reset" == b) {
        return -1;
      }
      return a.localeCompare(b);
    }

  }

}
