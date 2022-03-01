///<reference path = "../../page/page.component.ts"/>
namespace Core {
  export class GeneralPreferencesService {
    private static readonly DEFAULT_VERTICAL_NAV_STATE = Page.VerticalNavState.Show;
    constructor(private $window: ng.IWindowService) {
      'ngInject';
    }
    getDefaultVerticalNavState(): Page.VerticalNavState {
      if (_.isNull(this.$window.localStorage.getItem('defaultVerticalNavState'))) {
        return GeneralPreferencesService.DEFAULT_VERTICAL_NAV_STATE;

      } else {
        return parseInt(this.$window.localStorage.getItem('defaultVerticalNavState'));

      }
    }
    setDefaultVerticalNavState(defaultVerticalNavState: Page.VerticalNavState): void {
      this.$window.localStorage.setItem('defaultVerticalNavState', defaultVerticalNavState.toString());
    }

  }
}
