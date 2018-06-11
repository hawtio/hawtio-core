module Init {

  export class InitService {
    private initFunctions: (() => ng.IPromise<any>)[] = [];

    constructor(private $q: ng.IQService) {
      'ngInject';
    }
    
    registerInitFunction(initFunction: () => ng.IPromise<any>) {
      this.initFunctions.push(initFunction);
    }

    init(): ng.IPromise<any> {
      return this.$q.all(this.initFunctions.map(initFunction => initFunction()));
    }
  }

}
