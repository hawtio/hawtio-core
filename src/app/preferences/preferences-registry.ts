namespace Core {

  export class PreferencesRegistry {

    private tabs: any = {};

    addTab(label: string, templateUrl: string, isValid: () => boolean = () => true) {
      this.tabs[label] = {
        label: label,
        templateUrl: templateUrl,
        get isValid() { return isValid() },
      };
    }

    getTab(label: string) {
      return this.tabs[label];
    }

    getTabs() {
      return _.clone(this.tabs);
    }
  }
}
