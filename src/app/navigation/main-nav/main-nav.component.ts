/// <reference path="../../init/init.service.ts"/>
/// <reference path="main-nav.service.ts"/>

namespace Nav {

  export class MainNavController {
    brandSrc: string;
    username: string;
    items: Nav.MainNavItem[];
    templateUrl: string;
    unregisterRouteChangeListener: Function;
    itemsChecker: ng.IPromise<any>;

    constructor(configManager: Core.ConfigManager, userDetails: Core.AuthService,
      private mainNavService: Nav.MainNavService, private $rootScope: ng.IRootScopeService,
      private $interval: ng.IIntervalService) {
      'ngInject';
      this.brandSrc = configManager.getBrandingValue('appLogoUrl');
      this.username = userDetails['fullName'];
    }

    $onInit() {
      this.loadDataAndSetActiveItem();
     
      this.unregisterRouteChangeListener = this.$rootScope.$on('$routeChangeStart', () => {
        const item = this.mainNavService.findItemByPath();
        this.updateTemplateUrl(item);
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
      return _.find(this.items, item => item['isActive']);
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
      if (!activeItem) {
        activeItem = this.mainNavService.findItemByPath() || this.items[0];
      }
      this.updateTemplateUrl(activeItem);
      this.mainNavService.changeRouteIfRequired();
    }

    updateTemplateUrl = (item: Nav.MainNavItem) => {
      if (item) {
        this.templateUrl = item.templateUrl;
        this.mainNavService.activateItem(item);
      } else {
        this.templateUrl = DEFAULT_TEMPLATE_URL;
        this.mainNavService.clearActiveItem();
      }
    }
  }

  export const mainNavComponent: angular.IComponentOptions = {
    template: `
      <div id="main">
        <pf-vertical-navigation brand-src="{{$ctrl.brandSrc}}" hidden-icons="true" items="$ctrl.items"
                                item-click-callback="$ctrl.updateTemplateUrl" update-active-items-on-click="true"
                                ignore-mobile="true">
          <ul class="nav navbar-nav navbar-right navbar-iconic">
            <li class="dropdown">
              <a class="dropdown-toggle nav-item-iconic" id="helpDropdownMenu" data-toggle="dropdown"
                 aria-haspopup="true" aria-expanded="true">
                <span title="Help" class="fa pficon-help"></span>
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" aria-labelledby="helpDropdownMenu">
                <li hawtio-extension name="hawtio-help"></li>
                <li hawtio-extension name="hawtio-about"></li>
              </ul>
            </li>
            <li class="dropdown">
              <a class="dropdown-toggle nav-item-iconic" id="userDropdownMenu" data-toggle="dropdown"
                 aria-haspopup="true" aria-expanded="true">
                <span class="fa pf-icon pficon-user" aria-hidden="true"></span>
                <span class="username truncate">{{$ctrl.username}}</span> <span class="caret" aria-hidden="true"></span>
              </a>
              <ul class="dropdown-menu" aria-labelledby="userDropdownMenu">
                <li hawtio-extension name="hawtio-preferences"></li>
                <li hawtio-extension name="hawtio-logout"></li>
              </ul>
            </li>
          </ul>
        </pf-vertical-navigation>
        <div class="container-fluid container-pf-nav-pf-vertical">
          <ng-include src="$ctrl.templateUrl"></ng-include>
        </div>
      </div>
    `,
    controller: MainNavController
  };

}
