namespace HawtioMainNav {

  export class HawtioTabsController {

    names: string[];
    tabNames: string[] = [];
    dropdownNames: string[] = [];
    adjustingTabs: boolean;
    onChange: Function;
    activeTab: string;

    constructor(private $document: ng.IDocumentService, private $timeout: ng.ITimeoutService) {
      'ngInject';      
    }

    $onInit() {
      this.names.push('aaaaaaa', 'abbbbbb', 'acccccc', 'adddd', 'aeeeeee', 'afffff', 'a');
      this.setDefaultAtiveTab();
      this.adjustTabs();
    }
    
    private setDefaultAtiveTab() {
      if (this.names.length > 0) {
        this.activeTab = this.names[0];
      }
    }

    private adjustTabs() {
      this.tabNames = this.names;
      this.adjustingTabs = true;

      // wait for the tabs to be rendered by AngularJS before calculating the widths
      this.$timeout(() => {
        this.tabNames = [];
        this.adjustingTabs = false;
        
        let $ul = this.$document.find('.hawtio-tabs');
        let $liTabs = $ul.find('.hawtio-tab');
        let $liDropdown = $ul.find('.dropdown');
        
        let availableWidth = $ul.width() - $liDropdown.width();
        let lisWidth = 0;

        $liTabs.each((index: number, element: Element) => {
          lisWidth += element.clientWidth;
          if (lisWidth < availableWidth) {
            this.tabNames.push(this.names[index]);
          } else {
            this.dropdownNames.push(this.names[index]);
          }
        });
      });
    }

    onClick(name: string) {
      this.activeTab = name;
      this.onChange({name: name});
    }

  }

  export const hawtioTabsComponent: angular.IComponentOptions = {
    bindings: {
      names: '<',
      onChange: '&',
    },
    template: `
      <ul class="nav nav-tabs hawtio-tabs">
        <li ng-repeat="name in $ctrl.tabNames" class="hawtio-tab" 
            ng-class="{invisible: $ctrl.adjustingTabs, active: name === $ctrl.activeTab}">
          <a href="#" ng-click="$ctrl.onClick(name)">{{name}}</a>
        </li>
        <li class="dropdown" ng-class="{invisible: $ctrl.dropdownNames.length === 0}">
          <a id="moreDropdown" class="dropdown-toggle" href="" data-toggle="dropdown">
            More
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="moreDropdown">
            <li role="presentation" ng-repeat="name in $ctrl.dropdownNames">
              <a role="menuitem" tabindex="-1" href="#" ng-click="$ctrl.onClick(name)">{{name}}</a>
            </li>
          </ul>
        </li>
      </ul>
    `,
    controller: HawtioTabsController
  };

  _module.component('hawtioTabs', hawtioTabsComponent);

}