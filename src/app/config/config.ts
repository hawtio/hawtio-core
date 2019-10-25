namespace Core {

  export interface Config {
    branding?: { [key: string]: string };
    login?: {
      description?: string,
      links?: { url: string, text: string }[]
    };
    about?: {
      title?: string,
      description?: string,
      productInfo?: AboutProductInfo[]
    }
    disabledRoutes?: string[];
  }

  export interface AboutProductInfo {
    name: string;
    value: string;
  }

}
