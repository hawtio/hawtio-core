namespace Shared {

  export class HawtioLoadingController {
    loading = true;
    show = false;

    constructor(private $timeout: ng.ITimeoutService) {
      'ngInject';
    }

    $onInit() {
      this.$timeout(() => this.show = true, 1000);
    }

  }

  export const hawtioLoadingComponent: angular.IComponentOptions = {
    transclude: true,
    bindings: {
      loading: '<'
    },
    template: `
      <div ng-if="$ctrl.loading">
        <div class="loading-centered" ng-show="$ctrl.show">
          <div class="spinner spinner-lg"></div>
          <div class="loading-label">Loading...</div>
        </div>
      </div>
      <div class="loading-content" ng-if="!$ctrl.loading" ng-transclude></div>
    `,
    controller: HawtioLoadingController
  };

}
