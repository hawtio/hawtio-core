/// <reference path="help.service.ts"/>

namespace Core {

  export class HelpController {

    breadcrumbs: HelpTopic[];
    sections: HelpTopic[];
    selectedTopic: HelpTopic;
    selectedBreadcrumb: HelpTopic;
    html: any;

    constructor($rootScope, private helpService: HelpService, private $sce: ng.ISCEService) {
      'ngInject';
      $rootScope.$on('hawtioNewHelpTopic', function () {
        this.breadcrumbs = this.helpService.getBreadcrumbs();
        this.sections = this.helpService.getSections();
      });
    }

    $onInit() {
      this.breadcrumbs = this.helpService.getBreadcrumbs();
      this.sections = this.helpService.getSections();
      this.onSelectBreadcrumb(this.helpService.getTopic('index', 'user'));
    }

    onSelectTopic(topic: HelpTopic) {
      this.selectedTopic = topic;
      this.html = this.$sce.trustAsHtml(this.helpService.getHelpContent(topic));
    }

    onSelectBreadcrumb(topic: HelpTopic) {
      this.selectedBreadcrumb = topic;
      this.selectedTopic = null;
      this.html = this.$sce.trustAsHtml(this.helpService.getHelpContent(topic));
    }
  }

  export const helpComponent = <angular.IComponentOptions>{
    templateUrl: 'help/help.component.html',
    controller: HelpController
  };

}