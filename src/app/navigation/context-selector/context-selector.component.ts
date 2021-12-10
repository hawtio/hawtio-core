namespace Nav {

  export class ContextSelectorController {
    readonly KEY_ARROW_DOWN = 40;
    readonly KEY_ARROW_UP = 38;
    readonly KEY_ESCAPE = 27;
    label: string;
    items: ContextSelectorItem[] = [];
    filteredItems: ContextSelectorItem[];
    onChange: ({ item: string }) => void;
    isOpen = false;
    searchText: string;
    selectedItem: ContextSelectorItem;

    constructor(private $timeout: ng.ITimeoutService) {
      'ngInject';
    }

    $onInit() {
      this.setupCloseOnClickOutside();
    }

    $onChanges() {
      this.reset();
    }

    setupCloseOnClickOutside() {
      this.$timeout(() => {
        $('.pf-c-context-selector').click(event => event.stopPropagation());
        $('body').click(event => this.$timeout(() => this.reset()));
      });
    }

    getLabel(): string {
      return this.selectedItem ? this.selectedItem.label : this.label;
    }

    toggle() {
      if (!this.isOpen) {
        this.isOpen = true;
        if (this.isItemSelected()) {
          this.focusSelectedItem();
        } else {
          this.focusSearchInput();
        }
      } else {
        this.reset();
      }
    }

    reset() {
      this.isOpen = false;
      this.searchText = '';
      this.items.forEach(item => {
        if (item) {
          item.id = _.kebabCase(item.label);
        }
      });
      this.filteredItems = this.items;
    }

    onSearchKeyUp($event: JQueryEventObject) {
      switch ($event.keyCode) {
        case this.KEY_ARROW_DOWN:
          this.focusFirstItem();
          break;
        case this.KEY_ESCAPE:
          this.reset();
          break;
        default:
          this.filterItems();
      }
    }

    onItemKeyUp($event: JQueryEventObject) {
      const button = $event.target;
      switch ($event.keyCode) {
        case this.KEY_ARROW_DOWN:
          this.focusNextItem(button);
          break;
        case this.KEY_ARROW_UP:
          this.isFirstItem(button) ? this.focusSearchInput() : this.focusPreviousItem(button);
          break;
        case this.KEY_ESCAPE:
          this.reset();
          break;
      }
    }

    filterItems() {
      var regExp = new RegExp(this.searchText, 'i');
      this.filteredItems = this.items.filter(selectorItem => regExp.test(selectorItem.label));
    }

    onItemClick(item: ContextSelectorItem) {
      this.selectedItem = item;
      this.reset();
      this.onChange({ item });
    }

    isItemSelected(): boolean {
      return !!this.selectedItem;
    }

    focusSelectedItem() {
      this.$timeout(() => $('#' + this.selectedItem.id).focus(), 50);
    }

    kebabCase(str: string) {
      return _.kebabCase(str);
    }

    focusSearchInput() {
      this.$timeout(() => $('#contextSelectorSearchInput').focus());
    }

    focusFirstItem() {
      this.$timeout(() => $('.pf-c-context-selector__menu-list > li:first-child').find('button').focus());
    }

    focusPreviousItem(button: Element) {
      this.$timeout(() => $(button).parent().prev().find('button').focus());
    }

    focusNextItem(button: Element) {
      this.$timeout(() => $(button).parent().next().find('button').focus());
    }

    isFirstItem(button: Element): boolean {
      return $(button).parent().index() === 0;
    }
  }

  export const contextSelectorComponent: ng.IComponentOptions = {
    bindings: {
      label: '@',
      items: '<',
      onChange: '&',
    },
    template: `
      <div class="pf-c-context-selector" ng-class="{'pf-m-expanded': $ctrl.isOpen}">
        <button class="pf-c-context-selector__toggle" ng-click="$ctrl.toggle()">
          <span class="pf-c-context-selector__toggle-text">{{$ctrl.getLabel()}}</span>
          <i class="fa fa-angle-down pf-c-context-selector__toggle-icon" aria-hidden="true"></i>
        </button>
        <div class="pf-c-context-selector__menu" ng-show="$ctrl.isOpen">
          <div class="pf-c-context-selector__menu-input">
            <div class="pf-c-input-group">
              <input type="search" id="contextSelectorSearchInput" class="pf-c-form-control"
                name="contextSelectorSearchInput" placeholder="Search" ng-model="$ctrl.searchText"
                ng-keyup="$ctrl.onSearchKeyUp($event)" ng-focus="$ctrl.onSearchFocus()"
                ng-blur="$ctrl.onSearchBlur()">
            </div>
          </div>
          <ul class="pf-c-context-selector__menu-list">
            <li ng-repeat="item in $ctrl.filteredItems track by item.id">
              <button id="{{item.id}}" class="pf-c-context-selector__menu-list-item"
                ng-click="$ctrl.onItemClick(item)" ng-keyup="$ctrl.onItemKeyUp($event)"
                ng-focus="$ctrl.onItemFocus()" ng-blur="$ctrl.onItemBlur()">{{item.label}}</button>
            </li>
          </ul>
        </div>
      </div>
    `,
    controller: ContextSelectorController
  };

}
