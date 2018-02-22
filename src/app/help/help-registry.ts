/// <reference path="help-topic.ts"/>

namespace Help {

  export class HelpRegistry {

    private topicNameMappings = {
      activemq: 'ActiveMQ',
      camel: 'Camel',
      jboss: 'JBoss',
      jclouds: 'jclouds',
      jmx: 'JMX',
      jvm: 'Connect',
      log: 'Logs',
      openejb: 'OpenEJB',
      osgi: 'OSGi'
    };

    private subTopicNameMappings = {
      user: 'User Guide',
      developer: 'Developers',
      faq: 'FAQ',
      changes: 'Change Log'
    };

    private topics: HelpTopic[] = [];

    constructor(private $rootScope) {
      'ngInject';
    }

    public addUserDoc(topicName: string, path: string, isValid?: () => boolean): void {
      this.addSubTopic(topicName, 'user', path, isValid);
    }

    public addDevDoc(topicName: string, path: string, isValid?: () => boolean): void {
      this.addSubTopic(topicName, 'developer', path, isValid);
    }

    public addSubTopic(topicName: string, subtopic: string, path, isValid?: () => boolean): void {
      this.getOrCreateTopic(topicName, subtopic, path, isValid);
    }

    public getOrCreateTopic(topicName: string, subTopicName: string, path: string,
      isValid: () => boolean = () => true): HelpTopic {
      let topic = this.getTopic(topicName, subTopicName)
      if (!angular.isDefined(topic)) {

        topic = new HelpTopic();
        topic.topicName = topicName;
        topic.subTopicName = subTopicName;
        topic.path = path;
        topic.isValid = isValid;
        topic.label = topic.isIndexTopic() ? this.getLabel(subTopicName) : this.getLabel(topicName);

        this.topics.push(topic);
        this.$rootScope.$broadcast('hawtioNewHelpTopic');
      }
      return topic;
    }

    public getLabel(name): string {
      if (angular.isDefined(this.topicNameMappings[name])) {
        return this.topicNameMappings[name];
      }
      if (angular.isDefined(this.subTopicNameMappings[name])) {
        return this.subTopicNameMappings[name];
      }
      return name;
    }

    public getTopics(): HelpTopic[] {
      return this.topics.filter((topic) => topic.isValid());
    }

    public getTopic(topicName: string, subTopicName: string): HelpTopic {
      return this.topics.filter((topic) =>
        topic.topicName === topicName && topic.subTopicName === subTopicName)[0];
    }

  }

}
