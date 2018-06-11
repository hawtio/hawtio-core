/// <reference path="init/init.service.ts"/>
/// <reference path="navigation/main-nav/main-nav.service.ts"/>

namespace App {

  export class AppController {
    loading = true;

    constructor(private initService: Init.InitService) {
      'ngInject';
    }

    $onInit() {
      this.initService.init()
        .then(() => this.loading = false);
    }
  }

  export const appComponent: angular.IComponentOptions = {
    template: `
      <hawtio-loading loading="$ctrl.loading">
        <main-nav></main-nav>
      </hawtio-loading>
    `,
    controller: AppController
  };

}
