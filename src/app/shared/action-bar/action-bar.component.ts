namespace Shared {

  export const hawtioActionBarComponent: angular.IComponentOptions = {
    transclude: true,
    template: `
      <div class="container-fluid">
        <div class="row toolbar-pf">
          <div class="col-sm-12">
            <form class="toolbar-pf-actions">
              <div class="form-group" ng-transclude>
              </div>
            </form>
          </div>
        </div>
      </div>
    `
  };

}
