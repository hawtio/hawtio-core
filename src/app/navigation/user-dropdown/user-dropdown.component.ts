namespace Nav {

  class UserDropdownController {
    isOpen = false;
    userName: string;

    constructor(private $location: ng.ILocationService, userDetails: Core.AuthService) {
      'ngInject';
      this.userName = userDetails['fullName'];
    }

    toggle() {
      this.isOpen = !this.isOpen;
    }

    close() {
      this.isOpen = false;
    }

    onPreferencesClicked() {
      this.$location.path('/preferences');
    }
  }

  export const userDropdownComponent: angular.IComponentOptions = {
    template: `
      <div class="pf-c-dropdown">
        <button id="userDropdownMenu" class="pf-c-dropdown__toggle pf-m-plain" ng-click="$ctrl.toggle()"
          ng-blur="$ctrl.close()">{{$ctrl.userName}}</button>
        <ul class="pf-c-dropdown__menu pf-m-align-right" ng-show="$ctrl.isOpen">
          <li><a class="pf-c-dropdown__menu-item" href="#" ng-focus="$ctrl.onPreferencesClicked()">Preferences</a></li>
          <span hawtio-extension name="hawtio-logout"></span>
        </ul>
      </div>
    `,
    controller: UserDropdownController
  };

}
