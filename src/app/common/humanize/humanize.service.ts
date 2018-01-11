namespace Core {

  export class HumanizeService {

    toUpperCase(str: string): string {
      return _.upperCase(str);
    }

    toLowerCase(str: string): string {
      return _.lowerCase(str);
    }
    
    toSentenceCase(str: string): string {
      return _.capitalize(_.lowerCase(str));
    }

    toTitleCase(str: string): string {
      return _.startCase(_.lowerCase(str));
    }
    
  }

}