namespace Nav {

  export class AppLauncherController {
    items: AppLauncherItem[];
    isOpen = false;

    toggle() {
      this.isOpen = !this.isOpen;
    }

    close() {
      this.isOpen = false;
    }
  }

  export const appLauncherComponent: ng.IComponentOptions = {
    bindings: {
      items: '<',
      onChange: '&',
    },
    template: `
      <div class="pf-c-app-launcher">
        <button id="app-launcher" class="pf-c-app-launcher__toggle" ng-click="$ctrl.toggle()"
          ng-blur="$ctrl.close()">
          <i class="fa fa-th" aria-hidden="true"></i>
        </button>
        <ul class="pf-c-app-launcher__menu" aria-labelledby="app-launcher" ng-show="$ctrl.isOpen">
          <li ng-repeat="item in $ctrl.items">
            <a class="pf-c-app-launcher__menu-item" href="#" ng-focus="$ctrl.onChange({item})">{{item.label}}</a>
          </li>
        </ul>
      </div>
    `,
    controller: AppLauncherController
  };

}
