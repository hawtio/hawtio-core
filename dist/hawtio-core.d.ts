/// <reference types="angular"/>
/// <reference types="angular-route"/>

declare module Hawtio {

  export interface PluginLoaderStatic {

    /**
     * Register a function to be executed after scripts are loaded but
     * before the app is bootstrapped.
     *
     * 'task' can either be a simple function or an object with the
     * following attributes:
     *
     * name: the task name
     * depends: an array of task names this task needs to have executed first
     * task: the function to be executed with 1 argument, which is a function
     *       that will execute the next task in the queue
     */
    registerPreBootstrapTask(task:any, front?:boolean);

    /**
     * Add an angular module to the list of modules to bootstrap
     */
    addModule(module:string);

    /**
     * Add a URL for discovering plugins.
     */
    addUrl(url:string);

    /**
     * Return the current list of configured modules
     */
    getModules():string[];

    /**
     * Set a callback to be notified as URLs are checked and plugin 
     * scripts are downloaded
     */
    setLoaderCallback(callback:any);

    /**
     * Downloads plugins at any configured URLs and bootstraps the app
     */
    loadPlugins(callback: () => void);

    /**
     * Dumps the current list of configured modules and URLs to the console
     */
    debug();

    /**
     * Set the HTML element that the plugin loader will pass to angular.bootstrap
     */
    setBootstrapElement(el:HTMLElement):void;

    /**
     * Get the HTML element used for angular.bootstrap
     */
    getBootstrapElement():HTMLElement;
  }

}

declare var hawtioPluginLoader: Hawtio.PluginLoaderStatic;

declare module HawtioCore {
    /**
     * The app's injector, set once bootstrap is completed
     */
    var injector: ng.auto.IInjectorService;
    /**
     * This plugin's name and angular module
     */
    var pluginName: string;
    /**
     * Dummy local storage object
     */
    var dummyLocalStorage:WindowLocalStorage;
    /**
     * Function that returns the base href attribute
     */
    function documentBase(): string;

    /**
     * If angular2 is installed, this will be an instance of an ng.upgrade.UpgradeAdapter
     */
    var UpgradeAdapter:any;

    /**
     * This will be a reference to the value returned from UpgradeAdapter.bootstrap(),
     * which contains the angular1 injector (As well as the angular2 root injector)
     */
    var UpgradeAdapterRef:any;

}

declare module HawtioMainNav {
  
  var pluginName: string;

  interface IActions {
      ADD: string;
      REMOVE: string;
      CHANGED: string;
  }
  var Actions: IActions;

  interface Registry {
      builder(): NavItemBuilder;
      add(item: NavItem, ...items: NavItem[]): any;
      remove(search: (item: NavItem) => boolean): NavItem[];
      iterate(iterator: (item: NavItem) => void): any;
      on(action: string, key: string, fn: (item: any) => void): void;
      selected(): NavItem;
  }

  interface DefaultPageRanking {
    rank: number;
    isValid: (yes: () => void, no: () => void) => void;
  }

  /* These are gonna get deprecated */
  interface WelcomePage {
    rank: number;
    isValid?: () => boolean;
    href: () => string;
  }

  interface WelcomePageRegistry {
    pages: Array<WelcomePage>;
  }
  /* End These are gonna get deprecated */

  interface BuilderFactory {
      create(): NavItemBuilder;
      join(...paths:string[]):string;
      configureRouting($routeProvider: angular.route.IRouteProvider, tab: NavItem): any;
  }

  interface AttributeMap {
    [name:string]: string;
  }

  interface NavItem {
      id: string;
      rank?: number;
      page?: () => string;
      reload?: boolean;
      context?: boolean;
      title?: () => string;
      tooltip?: () => string;
      href?: () => string;
      click?: ($event: any) => void;
      isValid?: () => boolean;
      show?: () => boolean;
      isSelected?: () => boolean;
      template?: () => string;
      tabs?: NavItem[];
      defaultPage?: DefaultPageRanking;
      attributes?: AttributeMap;
      linkAttributes?: AttributeMap;
      [name:string]: any;
  }

  interface NavItemBuilder {
      id(id: string): NavItemBuilder;
      defaultPage(defaultPage: DefaultPageRanking): NavItemBuilder;
      rank(rank: number): NavItemBuilder;
      reload(reload: boolean): NavItemBuilder;
      page(page: () => string): NavItemBuilder;
      title(title: () => string): NavItemBuilder;
      tooltip(tooltip: () => string): NavItemBuilder;
      context(context: boolean): NavItemBuilder;
      attributes(attributes:AttributeMap): NavItemBuilder;
      linkAttributes(attributes:AttributeMap): NavItemBuilder;
      href(href: () => string): NavItemBuilder;
      click(click: ($event: any) => void): NavItemBuilder;
      isValid(isValid: () => boolean): NavItemBuilder;
      show(show: () => boolean): NavItemBuilder;
      isSelected(isSelected: () => boolean): NavItemBuilder;
      template(template: () => string): NavItemBuilder;
      tabs(item: NavItem, ...items: NavItem[]): NavItemBuilder;
      subPath(title: string, path: string, page?: string, rank?: number, reload?: boolean, isValid?: () => boolean): NavItemBuilder;
      build(): NavItem;
  }

  interface ICreateRegistry {
      (): Registry;
  }

  var createRegistry: ICreateRegistry;
  interface ICreateBuilder {
      (): NavItemBuilder;
  }

  var createBuilder: ICreateBuilder;

}

declare module HawtioPerspective {

  interface Selector {
    content?: string;
    id?: string;
    href?: string;
    title?: string;
    onCondition?: () => boolean;
  }

  interface TabMap {
    includes: Array<Selector>;
    excludes: Array<Selector>;
  }

  interface PerspectiveLabel {
    id: string;
    label: string;
    icon: any;
  }

  interface Perspective {
    label: string;
    icon: any;
    lastPage: string;
    isValid: () => boolean;
    tabs: TabMap;

  }

  interface Registry {
    add(id:string, perspective:Perspective):void;
    remove(id:string):Perspective;
    setCurrent(id:string):void;
    getCurrent():Perspective;
    getLabels():PerspectiveLabel[]
  }

}

declare var templateCache: any;
