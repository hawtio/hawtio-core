/// <reference path="../../navigation/main-nav/main-nav-item.ts"/>
/// <reference path="../../navigation/main-nav/main-nav.service.ts"/>

namespace Page {

  export const DEFAULT_TEMPLATE = '<div ng-view></div>';
  export const DEFAULT_TEMPLATE_URL = '/defaultTemplateUrl.html';

  class PageSidebarController {
    items: Nav.MainNavItem[];
    activeItem: Nav.MainNavItem;
    templateUrl: string;
    unregisterRouteChangeListener: Function;
    itemsChecker: ng.IPromise<any>;
    onTemplateChange: ({ templateUrl: string }) => void;

    constructor(private mainNavService: Nav.MainNavService, private $rootScope: ng.IRootScopeService,
      private $interval: ng.IIntervalService) {
      'ngInject';
    }

    $onInit() {
      this.loadDataAndSetActiveItem();

      this.unregisterRouteChangeListener = this.$rootScope.$on('$routeChangeStart', () => {
        const item = this.mainNavService.findItemByPath();
        this.updateView(item);
      });

      this.itemsChecker = this.$interval(() => {
        const items = this.mainNavService.getValidItems();
        if (items.length !== this.items.length) {
          const previousActiveItem = this.getActiveItem();
          if (previousActiveItem) {
            this.loadDataAndSetActiveItem();
          } else {
            this.loadData();
          }
        }
      }, 10000);
    }

    getActiveItem(): Nav.MainNavItem {
      return <Nav.MainNavItem>_.find(this.items, item => item['isActive']);
    }

    $onDestroy() {
      this.unregisterRouteChangeListener();
      this.$interval.cancel(this.itemsChecker);
    }

    loadData() {
      this.items = this.mainNavService.getValidItems();
    }

    loadDataAndSetActiveItem() {
      this.items = this.mainNavService.getValidItems();
      let activeItem = this.mainNavService.getActiveItem();
      if (!activeItem && (this.mainNavService.isRootPath() || this.mainNavService.isMainNavPath())) {
        activeItem = this.mainNavService.findItemByPath() || this.items[0];
      }
      this.updateView(activeItem);
    }

    updateView = (item: Nav.MainNavItem) => {
      if (item) {
        this.templateUrl = item.templateUrl;
        this.mainNavService.activateItem(item);
      } else {
        this.templateUrl = DEFAULT_TEMPLATE_URL;
        this.mainNavService.clearActiveItem();
      }
      this.onTemplateChange({ templateUrl: this.templateUrl });
      this.mainNavService.changeRouteIfRequired();
      this.activeItem = item;
    }
  }

  export const pageSidebarComponent: angular.IComponentOptions = {
    bindings: {
      onTemplateChange: '&'
    },
    template: `
      <nav class="pf-c-nav">
        <ul class="pf-c-nav__list">
          <li class="pf-c-nav__item" ng-repeat="item in $ctrl.items">
            <a href="#" class="pf-c-nav__link" ng-class="{'pf-m-current': item === $ctrl.activeItem}"
              ng-click="$ctrl.updateView(item)">
              {{item.title}}
            </a>
          </li>
        </ul>
      </nav>
    `,
    controller: PageSidebarController
  };

}
