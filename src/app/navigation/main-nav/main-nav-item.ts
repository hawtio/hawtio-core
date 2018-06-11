namespace Nav {

  /**
   * This interface must include the mandatory fields of pfVerticalNavigation 'items' parameter
   * https://www.patternfly.org/angular-patternfly/#/api/patternfly.navigation.component:pfVerticalNavigation%20-%20Basic
   */
  export interface IMainNavItem {
    title: string;
    href: string;
    template?: string;
    isValid?: () => boolean;
    rank?: number;
  }

  export class MainNavItem implements IMainNavItem {
    title: string;
    href: string;
    template = '<div ng-view></div>';
    isValid = () => true;
    rank = 0;

    constructor(item: IMainNavItem) {
      _.assign(this, item);
    }

    get templateUrl(): string {
      return this.href + '.html';
    }
  }

}
