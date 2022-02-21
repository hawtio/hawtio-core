namespace Page {

  class PageController {
    readonly WIDTH_LIMIT = 768;
    isNavOpen = false;
    previousWidth: number;
    templateUrl: string;

    constructor(private $window: ng.IWindowService, private $timeout: ng.ITimeoutService,
      private $rootScope: ng.IRootScopeService) {
      'ngInject';
      this.previousWidth = this.$window.innerWidth;
    }

    $onInit() {
      angular.element(this.$window).on('resize', () => {
        this.$timeout(() => {
          if (this.wasInDesktopView() && this.isInMobileView()) {
            this.isNavOpen = false;
          }
          if (this.wasInMobileView() && this.isInDesktopView()) {
            this.isNavOpen = true;
          }
          this.previousWidth = this.$window.innerWidth;
        });
      });
      this.$rootScope.$on(CLOSE_MAIN_NAV_EVENT, () => this.isNavOpen = false);
    }

    $onDestroy() {
      angular.element(this.$window).off('resize');
    }

    onNavToggle() {
      this.isNavOpen = !this.isNavOpen;
    }

    onTemplateChange(templateUrl: string) {
      this.templateUrl = templateUrl;
    }

    onSidebarItemClick() {
      if (this.isInMobileView()) {
        this.isNavOpen = false;
      }
    }

    wasInDesktopView() {
      return this.previousWidth >= this.WIDTH_LIMIT;
    }

    wasInMobileView() {
      return this.previousWidth < this.WIDTH_LIMIT;
    }

    isInDesktopView() {
      return this.$window.innerWidth >= this.WIDTH_LIMIT;
    }

    isInMobileView() {
      return this.$window.innerWidth < this.WIDTH_LIMIT;
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
        <page-sidebar class="pf-c-page__sidebar pf-m-dark"
          ng-class="{'pf-m-expanded': $ctrl.isNavOpen, 'pf-m-collapsed': !$ctrl.isNavOpen}"
          on-template-change="$ctrl.onTemplateChange(templateUrl)"
          on-item-click="$ctrl.onSidebarItemClick()"></page-sidebar>
        <page-main role="main" class="pf-c-page__main" template-url="{{$ctrl.templateUrl}}"></page-main>
      </div>
      <about></about>
    `,
    controller: PageController
  };

}
