/// <reference path="hawtio-core-navigation.ts"/>

namespace Nav {

  export class NavBarController {
    onToggleVerticalNav: Function;
    verticalNavCollapsed = false;
    username: string;

    constructor(
      private userDetails: Core.AuthService,
    ) {
      'ngInject';
      this.username = userDetails['fullName'];
      console.log(userDetails)
    }

    toggleVerticalNav() {
      this.verticalNavCollapsed = !this.verticalNavCollapsed;
      this.onToggleVerticalNav({collapsed: this.verticalNavCollapsed});
    }
  }

  export const navBarComponent: angular.IComponentOptions = {
    bindings: {
      onToggleVerticalNav: '&'
    },
    template: `
      <nav class="navbar navbar-pf-vertical">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" ng-click="$ctrl.toggleVerticalNav()">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>        
          <a href="." class="navbar-brand">
            <hawtio-branding-image class="navbar-brand-name" src="appLogoUrl" alt="appName"></hawtio-branding-image>
          </a>
        </div>
        <nav class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right navbar-iconic">
            <li class="dropdown">
              <a class="dropdown-toggle nav-item-iconic" id="helpDropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span title="Help" class="fa pficon-help"></span>
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" aria-labelledby="helpDropdownMenu">
                <li hawtio-extension name="hawtio-help"></li>
                <li hawtio-extension name="hawtio-about"></li>
              </ul>
            </li>
            <li class="dropdown">
              <a class="dropdown-toggle nav-item-iconic" id="userDropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span class="fa pf-icon pficon-user" aria-hidden="true"></span>
                <span class="username truncate">{{$ctrl.username}}</span> <span class="caret" aria-hidden="true"></span>
              </a>
              <ul class="dropdown-menu" aria-labelledby="userDropdownMenu">
                <li hawtio-extension name="hawtio-preferences"></li>
                <li hawtio-extension name="hawtio-logout"></li>
              </ul>
            </li>
          </ul>
        </nav>
      </nav>
    `,
    controller: NavBarController
  };

  _module.component('navBar', navBarComponent);

}
