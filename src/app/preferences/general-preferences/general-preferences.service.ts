namespace Core {
  export class GeneralPreferencesService {
    constructor(private $window: ng.IWindowService) {
      'ngInject';
      this.$window.localStorage.setItem('current_state', "ON");
    }
    getVerticalnavstate(): string {
      return this.$window.localStorage.getItem('current_state');

    }
    setVerticalnavstate(current_state): void {

      this.$window.localStorage.setItem('current_state', current_state);
    }

  }
}