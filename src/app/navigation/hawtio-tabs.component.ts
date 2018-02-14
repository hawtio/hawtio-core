/// <reference path="hawtio-tab.ts"/>

namespace Core {

  export class HawtioTabsController {

    tabs: HawtioTab[] = [];
    moreTabs: HawtioTab[] = [];
    adjustingTabs: boolean;
    onChange: Function;
    activeTab: HawtioTab;

    constructor(private $document: ng.IDocumentService, private $timeout: ng.ITimeoutService,
      private $location: ng.ILocationService) {
      'ngInject';      
    }

    $onChanges(changesObj: ng.IOnChangesObject) {
      if (!this.tabs) {
        throw Error(`hawtioTabsComponent 'tabs' input is ${this.tabs}`);
      }
      this.activateTab(changesObj);
      this.adjustTabs();
    }
    
    private activateTab(changesObj: ng.IOnChangesObject) {
      if (changesObj.activeTab && changesObj.activeTab.currentValue) {
        this.activeTab = _.find(this.tabs, tab => tab === changesObj.activeTab.currentValue);
      } else if (this.tabs.length > 0) {
        this.activeTab = this.tabs[0];
        this.$location.path(this.activeTab.path);
      }
    }

    private adjustTabs() {
      this.adjustingTabs = true;

      // wait for the tabs to be rendered by AngularJS before calculating the widths
      this.$timeout(() => {
        let $ul = this.$document.find('.hawtio-tabs');
        let $liTabs = $ul.find('.hawtio-tab');
        let $liDropdown = $ul.find('.dropdown');
        
        let availableWidth = $ul.width() - $liDropdown.width();
        let lisWidth = 0;
        this.moreTabs = [];

        $liTabs.each((index: number, element: Element) => {
          lisWidth += element.clientWidth;
          if (lisWidth > availableWidth) {
            this.moreTabs.unshift(this.tabs.pop());
          }
        });

        this.adjustingTabs = false;
      });
    }

    onClick(tab: HawtioTab) {
      this.activeTab = tab;
      this.onChange({tab: tab});
    }

  }

  export const hawtioTabsComponent: angular.IComponentOptions = {
    bindings: {
      tabs: '<',
      activeTab: '<',
      onChange: '&',
    },
    template: `
      <ul class="nav nav-tabs hawtio-tabs">
        <li ng-repeat="tab in $ctrl.tabs track by tab.path" class="hawtio-tab" 
            ng-class="{invisible: $ctrl.adjustingTabs, active: tab === $ctrl.activeTab}">
          <a href="#" ng-click="$ctrl.onClick(tab)">{{tab.label}}</a>
        </li>
        <li class="dropdown" ng-class="{invisible: $ctrl.moreTabs.length === 0}">
          <a id="moreDropdown" class="dropdown-toggle" href="" data-toggle="dropdown">
            More
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="moreDropdown">
            <li role="presentation" ng-repeat="tab in $ctrl.moreTabs track by tab.label">
              <a role="menuitem" tabindex="-1" href="#" ng-click="$ctrl.onClick(tab)">{{tab.label}}</a>
            </li>
          </ul>
        </li>
      </ul>
    `,
    controller: HawtioTabsController
  };

  HawtioMainNav._module.component('hawtioTabs', hawtioTabsComponent);

}