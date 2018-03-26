namespace About {

  export function configureMenu(HawtioExtension: Core.HawtioExtension, $compile: ng.ICompileService) {
    'ngInject';
    HawtioExtension.add('hawtio-about', $scope => {
      let template = `
        <a ng-init="flags = {open: false}" ng-click="flags.open = true">About</a>
        <about flags="flags"></about>
      `;
      return $compile(template)($scope);
    });
  }

}
