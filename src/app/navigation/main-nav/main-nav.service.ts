/// <reference path="main-nav-item.ts"/>

namespace Nav {

  export class MainNavService {
    private defaultTemplateUrl = '/defaultTemplateUrl.html';
    private items: MainNavItem[] = [];

    constructor(private $templateCache: ng.ITemplateCacheService) {
      'ngInject';
      $templateCache.put(this.defaultTemplateUrl, '<div ng-view></div>');
    }

    addItem(item: IMainNavItem) {
      const mainNavItem = new MainNavItem(item);
      this.$templateCache.put(mainNavItem.templateUrl, mainNavItem.template);
      this.items.push(mainNavItem);
    }

    getValidItems(): MainNavItem[] {
      return this.items
        .filter(item => item.isValid())
        .sort((a, b) => a.rank !== b.rank ? b.rank - a.rank : a.title.localeCompare(b.title));
    }

    getTemplateUrlByPath(path: string): string {
      const mainNavItem = _.find(this.items, item => _.startsWith(path, item.href));
      return mainNavItem ? mainNavItem.templateUrl : this.defaultTemplateUrl;
    }

    setActiveItem(navigationItems: Nav.MainNavItem[], $location: ng.ILocationService) {
      if (navigationItems.length > 0) {
        const path = $location.path();
        if (path === '/') {
          this.activateFirstNavItem(navigationItems, $location);
        } else {
          this.activateNavItemBasedOnPath(navigationItems, path);
        }
      }
    }
    
    private activateFirstNavItem(navigationItems: Nav.MainNavItem[], $location: ng.ILocationService) {
      const activeItem = navigationItems[0];
      activeItem['isActive'] = true;
      $location.path(activeItem.href);
    }

    private activateNavItemBasedOnPath(navigationItems: Nav.MainNavItem[], path: string) {
      const activeItem = _.find(navigationItems, item => _.startsWith(path, item.href));
      if (activeItem) {
        activeItem['isActive'] = true;
      }
    }

  }

}
