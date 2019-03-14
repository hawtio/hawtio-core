/// <reference path="../../about/about.constants.ts"/>

namespace Nav {

  class HelpDropdownController {
    isOpen = false;

    constructor(private $rootScope: ng.IScope, private $location: ng.ILocationService) {
      'ngInject';
    }

    toggle() {
      this.isOpen = !this.isOpen;
    }

    close() {
      this.isOpen = false;
    }

    onHelpClicked() {
      this.$location.path('/help');
    }

    onAboutClicked() {
      this.$rootScope.$emit(About.SHOW_ABOUT_EVENT);
    }
  }

  export const helpDropdownComponent: angular.IComponentOptions = {
    template: `
      <div class="pf-c-dropdown">
        <button id="helpDropdownMenu" class="pf-c-dropdown__toggle pf-m-plain" ng-click="$ctrl.toggle()"
          ng-blur="$ctrl.close()">
          <i class="pficon pficon-help" aria-hidden="true"></i>
        </button>
        <ul class="pf-c-dropdown__menu pf-m-align-right" ng-show="$ctrl.isOpen">
          <li><a class="pf-c-dropdown__menu-item" href="#" ng-focus="$ctrl.onHelpClicked()">Help</a></li>
          <li><a class="pf-c-dropdown__menu-item" href="#" ng-focus="$ctrl.onAboutClicked()">About</a></li>
        </ul>
      </div>
    `,
    controller: HelpDropdownController
  };

}
