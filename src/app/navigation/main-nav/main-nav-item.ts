namespace Nav {

  export const DEFAULT_TEMPLATE = '<div ng-view></div>';
  export const DEFAULT_TEMPLATE_URL = '/defaultTemplateUrl.html';

  /**
   * This interface must include the mandatory fields of pfVerticalNavigation 'items' parameter
   * https://www.patternfly.org/angular-patternfly/#/api/patternfly.navigation.component:pfVerticalNavigation%20-%20Basic
   */
  export interface MainNavItemProps {
    title: string;
    href?: string;
    basePath?: string;
    template?: string;
    isValid?: () => boolean;
    rank?: number;
  }

  export class MainNavItem implements MainNavItemProps {
    title: string;
    href: string;
    basePath: string;
    template = DEFAULT_TEMPLATE;
    isValid = () => true;
    rank = 0;

    constructor(item: MainNavItemProps) {
      _.assign(this, item);
    }

    get templateUrl(): string {
      return _.kebabCase(this.title) + '.html';
    }
  }

}
