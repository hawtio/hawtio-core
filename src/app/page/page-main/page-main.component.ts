namespace Page {

  export const pageMainComponent: angular.IComponentOptions = {
    bindings: {
      templateUrl: '@'
    },
    template: `
      <section class="pf-c-page__main-section pf-m-light">
        <ng-include src="$ctrl.templateUrl"></ng-include>
      </section>
    `
  };

}
