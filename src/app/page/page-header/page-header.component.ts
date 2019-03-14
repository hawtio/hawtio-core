namespace Page {

  class PageHeaderController {
    appName: string;
    appLogoUrl: string;

    constructor(configManager: Core.ConfigManager) {
      'ngInject';
      this.appName = configManager.getBrandingValue('appName');
      this.appLogoUrl = configManager.getBrandingValue('appLogoUrl');
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
          <img class="pf-c-brand" ng-src="{{$ctrl.appLogoUrl}}" alt="{{$ctrl.appName}}">
        </div>
      </div>
      <div class="pf-c-page__header-selector" hawtio-extension name="context-selector">
      </div>
      <div class="pf-c-page__header-tools">
        <div class="pf-c-page__header-tools-group pf-m-icons">
          <span hawtio-extension name="header-tools"></span>
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
