namespace Section1 {

  export class Section1Service {
    private state: boolean = null;

    constructor(private $q: ng.IQService) {
      'ngInject';
    }

    init(): ng.IPromise<void> {
      return this.$q((resolve, reject) => {
        console.log('section1: initializing...');
        setTimeout(() => {
          this.state = true;
          console.log('section1: initialized');
          resolve();
        }, 1000);
      });  
    }

    isValid(): boolean {
      if (this.state === null) {
        throw Error(`state hasn't been initialized yet`);
      }
      return this.state;
    }
  }

}
