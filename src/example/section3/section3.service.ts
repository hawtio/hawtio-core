namespace Section3 {

  export class Section3Service {
    private state: boolean = null;

    constructor(private $q: ng.IQService) {
      'ngInject';
    }

    init(): ng.IPromise<void> {
      return this.$q((resolve, reject) => {
        console.log('section3: initializing...');
        setTimeout(() => {
          this.state = false;
          console.log('section3: initialized');
          resolve();
        }, 1500);
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
