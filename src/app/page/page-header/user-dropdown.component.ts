namespace Page {

  class UserDropdownController {
    isVisible = false;
    fullName: string;

    constructor(private $location: ng.ILocationService, userDetails: Core.AuthService) {
      'ngInject';
      this.fullName = userDetails['fullName'];
    }

    toggleMenu() {
      this.isVisible = !this.isVisible;
    }

    hideMenu() {
      this.isVisible = false;
    }

    onPreferencesClicked() {
      this.$location.path('/preferences');
    }
  }

  export const userDropdownComponent: angular.IComponentOptions = {
    template: `
      <div class="pf-c-dropdown">
        <button class="pf-c-dropdown__toggle pf-m-plain" ng-click="$ctrl.toggleMenu()" ng-blur="$ctrl.hideMenu()">
          {{$ctrl.fullName}} <img class="pf-c-avatar" src="dist/img/img_avatar.svg" alt="Avatar Image">
        </button>
        <ul class="pf-c-dropdown__menu pf-m-align-right" ng-show="$ctrl.isVisible">
          <li><a class="pf-c-dropdown__menu-item" href="#" ng-focus="$ctrl.onPreferencesClicked()">Preferences</a></li>
          <span hawtio-extension name="hawtio-logout"></span>
        </ul>
      </div>
    `,
    controller: UserDropdownController
  };

}
