namespace Nav {

  export class HawtioTabsLayoutController {
    tabs: HawtioTab[];

    constructor(private $location: ng.ILocationService) {
      'ngInject';
    }

    goto(tab: Nav.HawtioTab) {
      this.$location.path(tab.path);
    }
  }

  export const hawtioTabsLayoutComponent: angular.IComponentOptions = {
    bindings: {
      tabs: '<'
    },
    template: `
      <div class="nav-tabs-main">
        <hawtio-tabs tabs="$ctrl.tabs" on-change="$ctrl.goto(tab)"></hawtio-tabs>
        <div ng-view></div>
      </div>
    `,
    controller: HawtioTabsLayoutController
  };

}
