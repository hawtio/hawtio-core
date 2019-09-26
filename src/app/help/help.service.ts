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
        return `
          <h3 id="error">Error</h3>
          <div class="alert alert-danger">
            <span class="pficon pficon-error-circle-o"></span>
            Help data is not defined for <code>${topic.path}</code>
          </div>`;
      } else {
        let template = this.$templateCache.get(topic.path);
        if (template) {
          return marked(template);
        } else {
          return `
            <h3 id="error">Error</h3>
            <div class="alert alert-danger">
              <span class="pficon pficon-error-circle-o"></span>
              Unable to display help data for <code>${topic.path}</code>
            </div>`;
        }
      }
    }

  }

}
