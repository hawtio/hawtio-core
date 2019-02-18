namespace Page {

  class HelpDropdownController {
    isVisible = false;

    constructor(private $rootScope: ng.IScope) {
      'ngInject';
    }

    toggleMenu() {
      this.isVisible = !this.isVisible;
    }

    hideMenu() {
      this.isVisible = false;
    }

    onAboutClicked() {
      this.$rootScope.$emit('about-link-clicked');
    }
  }

  export const helpDropdownComponent: angular.IComponentOptions = {
    template: `
      <div class="pf-c-dropdown">
        <button class="pf-c-dropdown__toggle pf-m-plain" ng-click="$ctrl.toggleMenu()" ng-blur="$ctrl.hideMenu()">
          <i class="pf-icon pf-icon-help"></i>
        </button>
        <ul class="pf-c-dropdown__menu pf-m-align-right" ng-show="$ctrl.isVisible">
          <li hawtio-extension name="hawtio-help"></li>
          <li>
            <a class="pf-c-dropdown__menu-item" href="#" ng-focus="$ctrl.onAboutClicked()">About</a>
          </li>
        </ul>
      </div>
    `,
    controller: HelpDropdownController
  };

}
