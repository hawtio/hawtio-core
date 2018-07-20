namespace Core {

  export class PreferencesRegistry {

    private tabs: any = {};

    constructor(private $rootScope: ng.IRootScopeService) {
      'ngInject';
    }

    addTab(label: string, templateUrl: string, isValid: () => boolean = undefined) {
      if (!isValid) {
        isValid = () => { return true; };
      }
      this.tabs[label] = {
        label: label,
        templateUrl: templateUrl,
        get isValid() { return isValid() },
      };
      this.$rootScope.$broadcast('HawtioPreferencesTabAdded');
    }

    getTab(label: string) {
      return this.tabs[label];
    }

    getTabs() {
      var answer = {};
      angular.forEach(this.tabs, (value, key) => answer[key] = value);
      return answer;
    }

  }

}
