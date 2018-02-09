namespace Core {

  export class HelpTopic {

    topicName: string;
    subTopicName: string;
    label: string;
    path: string;
    isValid: () => boolean;
    selected: boolean;

    isIndexTopic(): boolean {
      return this.topicName === 'index';
    }
  }

}
