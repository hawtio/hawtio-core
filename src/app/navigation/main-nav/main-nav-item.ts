namespace Nav {

  export const DEFAULT_TEMPLATE = '<div ng-view></div>';
  export const DEFAULT_TEMPLATE_URL = '/defaultTemplateUrl.html';

  export interface MainNavItemProps {
    /** Name to be displayed on the menu */
    title: string;
    /** Route path to navigate to on click. pfVerticalNavigation invokes $location.path(href) internally. */
    href?: string;
    /** Base path of hawtioTabs route paths. Should be used instead of 'href' when the template has second level navigation. */
    basePath?: string;
    /** HTML template that should be rendered when the item is clicked. */
    template?: string;
    /** Function that checks whether the item should be added to the menu. */
    isValid?: () => boolean;
    /** Affects the position of the item in the menu. Items with higher ranks are shown on the top. */
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
      if (item.href && item.basePath) {
        throw new Error("Must specify 'href' or 'basePath', not both.");
      }
      _.assign(this, item);
    }

    get templateUrl(): string {
      return _.kebabCase(this.title) + '.html';
    }
  }

}
