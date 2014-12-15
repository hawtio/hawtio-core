/// <reference path="angular.d.ts"/>
/// <reference path="angular-route.d.ts"/>
/// <reference path="logger.d.ts"/>
declare module Hawtio {

  export interface PluginLoaderStatic {

    /**
     * Register a function to be executed after scripts are loaded but
     * before the app is bootstrapped
     */
    registerPreBootstrapTask(task:(next:() => void) => void);

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
}



