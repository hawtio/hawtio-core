/// <reference path="help-registry.ts"/>
/// <reference path="help-topic.ts"/>

namespace Help {

  export class HelpService {

    constructor(private $templateCache, private helpRegistry: HelpRegistry) {
      'ngInject';

      marked.setOptions({
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: true,
        sanitize: false,
        smartLists: true,
        langPrefix: 'language-'
      });
    }

    getTopics(): HelpTopic[] {
      return this.helpRegistry.getTopics().filter(topic => topic.isIndexTopic());
    }

    getSubTopics(topic: HelpTopic): HelpTopic[] {
      let otherSubTopics = this.helpRegistry.getTopics().filter(t => !t.isIndexTopic() &&
        t.subTopicName === topic.subTopicName);
      otherSubTopics = _.sortBy(otherSubTopics, 'label');
      return [topic, ...otherSubTopics];
    }

    getTopic(topicName: string, subTopicName: string): HelpTopic {
      return this.helpRegistry.getTopic(topicName, subTopicName);
    }

    getHelpContent(topic: HelpTopic): string {
      if (!angular.isDefined(topic)) {
        return "Unable to display help data for " + topic.path;
      } else {
        let template = this.$templateCache.get(topic.path);
        if (template) {
          return marked(template);
        } else {
          return "Unable to display help data for " + topic.path;
        }
      }
    }
  
  }

}
