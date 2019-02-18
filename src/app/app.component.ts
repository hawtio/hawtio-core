/// <reference path="init/init.service.ts"/>

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
        <page></page>
      </hawtio-loading>
    `,
    controller: AppController
  };

}
