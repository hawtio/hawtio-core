/// <reference path="main-nav-item.ts"/>

namespace Nav {

  export class MainNavService {
    private allItems: MainNavItem[] = [];

    constructor(private $location: ng.ILocationService, private $templateCache: ng.ITemplateCacheService,
      private configManager: Core.ConfigManager) {
      'ngInject';
      $templateCache.put(DEFAULT_TEMPLATE_URL, DEFAULT_TEMPLATE);
    }

    addItem(props: MainNavItemProps): void {
      const mainNavItem = new MainNavItem(props);
      if (this.isMainNavItemEnabled(mainNavItem)) {
        this.allItems.push(mainNavItem);
        this.$templateCache.put(mainNavItem.templateUrl, mainNavItem.template);
      }
    }

    private isMainNavItemEnabled(mainNavItem: MainNavItem): boolean {
      return (mainNavItem.basePath && this.configManager.isRouteEnabled(mainNavItem.basePath)) ||
        (mainNavItem.href && this.configManager.isRouteEnabled(mainNavItem.href));
    }

    getValidItems(): MainNavItem[] {
      return this.allItems
        .filter(item => item.isValid())
        .sort((a, b) => a.rank !== b.rank ? b.rank - a.rank : a.title.localeCompare(b.title));
    }

    getActiveItem(): Nav.MainNavItem {
      const items = this.getValidItems();
      return <Nav.MainNavItem>_.find(items, item => item['isActive']);
    }

    activateItem(item: Nav.MainNavItem) {
      this.clearActiveItem();
      item['isActive'] = true;
    }

    clearActiveItem(): void {
      this.allItems.forEach(item => item['isActive'] = false);
    }

    changeRouteIfRequired(): void {
      const activeItem = this.getActiveItem();
      if (activeItem && activeItem.href) {
        this.$location.path(activeItem.href);
      }
    }

    findItemByPath(): Nav.MainNavItem {
      const items = this.getValidItems();
      return this.getItemThatMatcheslocation(items);
    }

    isMainNavPath(): boolean {
      return this.getItemThatMatcheslocation(this.allItems) !== undefined;
    }

    private getItemThatMatcheslocation(items: MainNavItem[]): MainNavItem {
      return _.find(items, item => _.startsWith(this.$location.path(), item.href || item.basePath));
    }

    isRootPath(): boolean {
      return this.$location.path() === '/';
    }

  }

}
