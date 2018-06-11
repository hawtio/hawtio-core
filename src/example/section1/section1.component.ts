namespace Section1 {

  export class Section1Controller {
    tabs = [
      new Nav.HawtioTab('Page 1', '/section1/page1'),
      new Nav.HawtioTab('Page 2', '/section1/page2')
    ]
  }

  export const section1Component: angular.IComponentOptions = {
    template: '<hawtio-tabs-layout tabs="$ctrl.tabs"></hawtio-tabs-layout>',
    controller: Section1Controller
  };

}
