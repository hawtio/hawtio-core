namespace Core {

  export class GeneralPreferencesService {

    private static readonly DEFAULT_VERTICAL_NAV_STATE = "show";

    constructor(private $window: ng.IWindowService) {
      'ngInject';
    }

    getDefaultVerticalNavState(): string {
      if (_.isNull(this.$window.localStorage.getItem('defaultVerticalNavState'))) {
        return GeneralPreferencesService.DEFAULT_VERTICAL_NAV_STATE;
      } else {
        return this.$window.localStorage.getItem('defaultVerticalNavState');
      }
    }

    setDefaultVerticalNavState(defaultVerticalNavState: string): void {
      this.$window.localStorage.setItem('defaultVerticalNavState', defaultVerticalNavState);
    }
  }

}
