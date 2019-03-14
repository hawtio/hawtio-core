namespace Example {

  export function addContextSelector(HawtioExtension: Core.HawtioExtension, $compile: ng.ICompileService) {
    'ngInject';
    HawtioExtension.add('context-selector', $scope => {
      $scope.contextSelectorLabel = 'Select a context...';
      $scope.contextSelectorItems = <Nav.ContextSelectorItem[]>[
        { label: 'A context' },
        { label: 'Another context' },
        { label: 'Yet another context' }
      ];
      $scope.onContextSelectorChange = (item: Nav.ContextSelectorItem) => console.log(`Selected '${item.label}'`);
      const template = `
        <context-selector label="{{contextSelectorLabel}}" items="contextSelectorItems"
          on-change="onContextSelectorChange(item)"></context-selector>
      `;
      return $compile(template)($scope);
    });
  }

  export function addHeaderTools(HawtioExtension: Core.HawtioExtension, $compile: ng.ICompileService) {
    'ngInject';
    HawtioExtension.add('header-tools', $scope => {
      $scope.appLauncherItems = <Nav.AppLauncherItem[]>[
        { label: 'App 1' },
        { label: 'App 2' },
        { label: 'App 3' }
      ];
      $scope.onAppLauncherChange = (item: Nav.AppLauncherItem) => console.log(`Selected '${item.label}'`);
      const template = `
        <app-launcher items="appLauncherItems" on-change="onAppLauncherChange(item)"></app-launcher>
      `;
      return $compile(template)($scope);
    });
  }

}
