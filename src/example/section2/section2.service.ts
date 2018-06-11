namespace Section2 {

  export class Section2Service {
    private state: boolean = null;

    constructor(private $q: ng.IQService) {
      'ngInject';
    }

    init(): ng.IPromise<void> {
      return this.$q((resolve, reject) => {
        console.log('section2: initializing...');
        setTimeout(() => {
          this.state = true;
          console.log('section2: initialized');
          resolve();
        }, 2000);
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
