namespace Core {
  export class GeneralPreferencesService {
    private static readonly DEFAULT_VERTICAL_NAV_STATE = "show";
    constructor(private $window: ng.IWindowService) {
      'ngInject';
    }
    getDefaultVerticalNavState(): string {
      if (this.$window.localStorage.getItem('defaultVerticalNavState') !== null) {
        return this.$window.localStorage.getItem('defaultVerticalNavState');
      } else {
        return GeneralPreferencesService.DEFAULT_VERTICAL_NAV_STATE;
      }
    }
    setDefaultVerticalNavState(defaultVerticalNavState: string): void {

      this.$window.localStorage.setItem('defaultVerticalNavState', defaultVerticalNavState);
    }

  }
}

