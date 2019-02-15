namespace Page {

  class PageHeaderController {
    brandSrc: string;
    username: string;

    constructor(configManager: Core.ConfigManager, userDetails: Core.AuthService) {
      'ngInject';
      this.brandSrc = configManager.getBrandingValue('appLogoUrl');
      this.username = userDetails['fullName'];
    }
  }

  export const pageHeaderComponent: angular.IComponentOptions = {
    bindings: {
      onNavToggle: '&'
    },
    template: `
      <div class="pf-c-page__header-brand">
        <div class="pf-c-page__header-brand-toggle">
          <button class="pf-c-button pf-m-plain" ng-click="$ctrl.onNavToggle()">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </button>
        </div>
        <div class="pf-c-page__header-brand-link">
          <img class="pf-c-brand" ng-src="{{$ctrl.brandSrc}}">
        </div>
      </div>
      <div class="pf-c-page__header-tools">
        <div class="pf-c-page__header-tools-group pf-m-icons">
          <help-dropdown></help-dropdown>
        </div>
        <div class="pf-c-page__header-tools-group">
          <user-dropdown></user-dropdown>
        </div>
      </div>
    `,
    controller: PageHeaderController
  };

}
