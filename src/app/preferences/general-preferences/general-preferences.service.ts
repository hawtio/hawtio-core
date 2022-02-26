namespace Core {
  export enum state {
    show = "show",
    hide = "hide"
  }
  export class GeneralPreferencesService {
    private static readonly DEFAULT_VERTICAL_NAV_STATE = state["show"];
    constructor(private $window: ng.IWindowService) {
      'ngInject';
    }
    getDefaultVerticalNavState(): state {
      if (this.$window.localStorage.getItem('defaultVerticalNavState') != null) {
        return (<any>state)[this.$window.localStorage.getItem('defaultVerticalNavState')];
      } else {
        return GeneralPreferencesService.DEFAULT_VERTICAL_NAV_STATE;
      }
    }
    setDefaultVerticalNavState(defaultVerticalNavState: state): void {
      this.$window.localStorage.setItem('defaultVerticalNavState', defaultVerticalNavState);
    }

  }
}

