/// <reference path="../preferences.service.ts"/>
/// <reference path="../preferences-registry.ts"/>

namespace Core {

  export function PreferencesHomeController(
    $scope,
    $location: ng.ILocationService,
    preferencesRegistry: PreferencesRegistry,
    preferencesService: PreferencesService,
  ) {
    'ngInject';

    $scope.panels = _.values(preferencesRegistry.getTabs());

    const tabsFromPanels = tabs => tabs.sort(byLabel)
      .filter(panel => panel.isValid)
      .map(panel => new Nav.HawtioTab(panel.label, panel.label));

    $scope.tabs = tabsFromPanels($scope.panels);
    // Deep watch for async isValid attributes that may change depending on plugin runtimes
    $scope.$watch('panels', value => $scope.tabs = tabsFromPanels(value), true);

    // pick the first one as the default
    preferencesService.bindModelToSearchParam($scope, $location, "pref", "pref", $scope.tabs[0].label);

    $scope.setPanel = (tab: Nav.HawtioTab) => {
      $scope.pref = tab.label;
    };

    $scope.close = () => {
      preferencesService.restoreLocation($location);
    };

    $scope.getPrefs = (pref) => {
      const panel = $scope.panels.find(panel => panel.label === pref);
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
      if ("Reset" == a.label) {
        return 1;
      } else if ("Reset" == b.label) {
        return -1;
      }
      return a.label.localeCompare(b.label);
    }

  }

}
