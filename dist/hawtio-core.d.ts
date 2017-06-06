/// <reference types="angular"/>
/// <reference types="angular-route"/>
/// <reference types="js-logger"/>

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



