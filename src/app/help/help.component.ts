/// <reference path="help.service.ts"/>

namespace Help {

  export class HelpController {

    topics: HelpTopic[];
    selectedTopic: HelpTopic;
    subTopics: HelpTopic[];
    selectedSubTopic: HelpTopic;
    html: any;

    constructor($rootScope, private helpService: HelpService, private $sce: ng.ISCEService) {
      'ngInject';
    }

    $onInit() {
      this.topics = this.helpService.getTopics();
      this.onSelectTopic(this.helpService.getTopic('index', 'user'));
    }

    onSelectTopic(topic: HelpTopic) {
      this.selectedTopic = topic;
      this.subTopics = this.helpService.getSubTopics(topic);
      this.onSelectSubTopic(this.subTopics[0]);
    }

    onSelectSubTopic(subTopic: HelpTopic) {
      this.selectedSubTopic = subTopic;
      this.html = this.$sce.trustAsHtml(this.helpService.getHelpContent(subTopic));
    }
  }

  export const helpComponent = <angular.IComponentOptions>{
    templateUrl: 'help/help.component.html',
    controller: HelpController
  };

}