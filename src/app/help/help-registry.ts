/// <reference path="help-topic.ts"/>

namespace Core {

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
      changes: 'Change Log',
    };

    private topics: HelpTopic[] = [];

    constructor(private $rootScope) {
      'ngInject';
    }

    public addUserDoc(topicName: string, path: string, isValid: () => boolean = null) {
      this.addSubTopic(topicName, 'user', path, isValid);
    }

    public addDevDoc(topicName: string, path: string, isValid: () => boolean = null) {
      this.addSubTopic(topicName, 'developer', path, isValid);
    }

    public addSubTopic(topicName: string, subtopic: string, path, isValid: () => boolean = null) {
      this.getOrCreateTopic(topicName, subtopic, path, isValid);
    }

    public getOrCreateTopic(topicName: string, subTopicName: string, path: string, isValid: () => boolean = null) {
      let topic = this.getTopic(topicName, subTopicName)
      if (!angular.isDefined(topic)) {

        if (isValid === null) {
          isValid = () => {
            return true;
          }
        }

        topic = new HelpTopic();
        topic.topicName = topicName;
        topic.subTopicName = subTopicName;
        topic.path = path;
        topic.isValid = isValid;

        this.topics.push(topic);
        this.$rootScope.$broadcast('hawtioNewHelpTopic');
      }
      return topic;
    }

    public mapTopicName(name) {
      if (angular.isDefined(this.topicNameMappings[name])) {
        return this.topicNameMappings[name];
      }
      return name;
    }

    public mapSubTopicName(name) {
      if (angular.isDefined(this.subTopicNameMappings[name])) {
        return this.subTopicNameMappings[name];
      }
      return name;
    }

    public getTopics() {
      let answer = this.topics.filter((topic) => {
        return topic.isValid() === true;
      });
      return answer;
    }

    public getTopic(topicName: string, subTopicName: string): HelpTopic {
      return this.topics.filter((topic) => {
        return topic.topicName === topicName && topic.subTopicName === subTopicName;
      })[0];
    }
  
  }

}
