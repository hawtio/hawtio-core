namespace Core {
    export class GeneralPreferencesService{
        constructor(private $window: ng.IWindowService) {
            'ngInject';
          }
          getVerticalnavstate(): number {
            if (this.$window.localStorage.getItem('verticalnav') === "OFF") {
              
            return 0;
          }
          return 1;
    }
}
}