namespace Core {

  export interface Config {
    branding?: Branding;
    login?: Login;
    about?: About;
    disabledRoutes?: string[];
    online?: Online;
  }

  export interface Branding {
    appName: string;
    appLogoUrl: string;
    companyLogoUrl?: string;
    css?: string;
    favicon?: string;
  }

  export interface Login {
    description?: string;
    links?: LoginLink[];
  }

  export interface LoginLink {
    url: string,
    text: string
  }

  export interface About {
    title?: string,
    description?: string,
    productInfo?: AboutProductInfo[]
  }

  export interface AboutProductInfo {
    name: string;
    value: string;
  }

  export interface Online {
    projectSelector?: string;
  }
}
