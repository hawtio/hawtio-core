namespace Page {

  const DEFAULT_TEMPLATE = '<div ng-view></div>';
  const DEFAULT_TEMPLATE_URL = '/defaultTemplateUrl.html';

  class PageController {
    isNavOpen = true;
    templateUrl = DEFAULT_TEMPLATE_URL;

    onNavToggle = () => {
      this.isNavOpen = !this.isNavOpen;
    }

  }

  export const pageComponent: angular.IComponentOptions = {
    template: `
      <div class="pf-c-background-image">
        <svg xmlns="http://www.w3.org/2000/svg" class="pf-c-background-image__filter" width="0" height="0">
          <filter id="image_overlay">
            <feColorMatrix type="matrix" values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 1 0" />
            <feComponentTransfer color-interpolation-filters="sRGB" result="duotone">
              <feFuncR type="table" tableValues="0.086274509803922 0.43921568627451"></feFuncR>
              <feFuncG type="table" tableValues="0.086274509803922 0.43921568627451"></feFuncG>
              <feFuncB type="table" tableValues="0.086274509803922 0.43921568627451"></feFuncB>
              <feFuncA type="table" tableValues="0 1"></feFuncA>
            </feComponentTransfer>
          </filter>
        </svg>
      </div>
      <div class="pf-c-page">
        <page-header role="banner" class="pf-c-page__header" on-nav-toggle="$ctrl.onNavToggle()"></page-header>
        <page-sidebar class="pf-c-page__sidebar" ng-show="$ctrl.isNavOpen"></page-sidebar>
        <page-main role="main" class="pf-c-page__main" template-url="$ctrl.templateUrl"></page-main>
      </div>
      <about></about>
    `,
    controller: PageController
  };

}
