/// <reference path="../../init/init.service.ts"/>
/// <reference path="main-nav.service.ts"/>

namespace Nav {

  export class MainNavController {
    navigationItems: Nav.MainNavItem[];
    brandSrc: string;
    templateUrl: string;
    username: string;

    constructor(
      configManager: Core.ConfigManager,
      private mainNavService: Nav.MainNavService,
      private $location: ng.ILocationService,
      private userDetails: Core.AuthService,
    ) {
      'ngInject';
      this.brandSrc = configManager.getBrandingValue('appLogoUrl');
      this.username = userDetails['fullName'];
    }

    $onInit() {
      this.navigationItems = this.mainNavService.getValidItems();
      this.mainNavService.setActiveItem(this.navigationItems, this.$location);
    }

    loadContent() {
      const path = this.$location.path();
      this.templateUrl = this.mainNavService.getTemplateUrlByPath(path);
    }
  }

  export const mainNavComponent: angular.IComponentOptions = {
    template: `
      <div id="main">
        <pf-vertical-navigation brand-src="{{$ctrl.brandSrc}}" hidden-icons="true" items="$ctrl.navigationItems"
                                item-click-callback="$ctrl.loadContent()" ignore-mobile="true">
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
