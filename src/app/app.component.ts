namespace App {

  export class AppController {
    verticalNavCollapsed = false;

    toggleVerticalNav(collapsed) {
      this.verticalNavCollapsed = collapsed;
    }
  }

  export const appComponent: angular.IComponentOptions = {
    template: `
      <nav-bar on-toggle-vertical-nav="$ctrl.toggleVerticalNav(collapsed)"></nav-bar>
      <vertical-nav collapsed="$ctrl.verticalNavCollapsed"></vertical-nav>
      <div id="main" class="container-fluid container-pf-nav-pf-vertical hidden-icons-pf ng-cloak container-hawtio-nav-hawtio-vertical"
          ng-class="{'collapsed-nav': $ctrl.verticalNavCollapsed}"
          ng-controller="HawtioNav.ViewController"
          ng-include src="viewPartial">
      </div>
    `,
    controller: AppController
  };

}
