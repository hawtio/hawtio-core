/// <reference path="hawtio-core-navigation.ts"/>

namespace Nav {

  export class VerticalNavController {
    showSecondaryNav = false;

    onHover(item) {
      if (item.tabs && item.tabs.length > 0) {
        item.isHover = true;
        this.showSecondaryNav = true;
      }
    }

    onUnHover(item) {
      if (this.showSecondaryNav) {
        item.isHover = false;
        this.showSecondaryNav = false;
      }
    }
  }

  export const verticalNavComponent: angular.IComponentOptions = {
    bindings: {
      collapsed: '<'
    },
    template: `
      <div class="nav-pf-vertical nav-pf-vertical-with-sub-menus hidden-icons-pf nav-hawtio-vertical"
           ng-class="{'hover-secondary-nav-pf': $ctrl.showSecondaryNav, collapsed: $ctrl.collapsed}">
        <ul class="list-group" hawtio-main-nav></ul>
      </div>
    `,
    controller: VerticalNavController
  };

  _module.component('verticalNav', verticalNavComponent);

}
