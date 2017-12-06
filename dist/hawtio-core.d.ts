/// <reference types="angular" />
/// <reference types="angular-route" />
declare namespace Config {
    class ConfigService {
        private config;
        constructor(config: any);
        getBrandLogoUrl(): any;
        getBrandNameUrl(): any;
        getBrandNameText(): any;
        private getProperty(group, name);
    }
}
declare namespace Branding {
    class BrandLogoController {
        private src;
        constructor($rootScope: ng.IRootScopeService);
    }
    const brandLogoComponent: angular.IComponentOptions;
}
declare namespace Branding {
    class BrandNameController {
        private src;
        private alt;
        constructor($rootScope: ng.IRootScopeService);
    }
    const brandNameComponent: angular.IComponentOptions;
}
declare namespace Branding {
    const log: Logging.Logger;
    const brandingModule: string;
}
declare namespace Config {
    function configLoader($rootScope: ng.IRootScopeService, $http: ng.IHttpService): void;
}
declare namespace Config {
    const log: Logging.Logger;
    const EVENT_LOADED = "hawtio-config-loaded";
    const configModule: string;
}
declare namespace Hawtio {
    class PluginLoader {
        private log;
        private bootstrapEl;
        private loaderCallback;
        /**
         * List of URLs that the plugin loader will try and discover
         * plugins from
         * @type {Array}
         */
        private urls;
        /**
         * Holds all of the angular modules that need to be bootstrapped
         * @type {Array}
         */
        private modules;
        /**
         * Tasks to be run before bootstrapping, tasks can be async.
         * Supply a function that takes the next task to be
         * executed as an argument and be sure to call the passed
         * in function.
         *
         * @type {Array}
         */
        private tasks;
        constructor();
        /**
         * Set the HTML element that the plugin loader will pass to angular.bootstrap
         */
        setBootstrapElement(el: any): void;
        /**
         * Get the HTML element used for angular.bootstrap
         */
        getBootstrapElement(): HTMLElement;
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
        registerPreBootstrapTask(task: any, front?: any): void;
        /**
         * Add an angular module to the list of modules to bootstrap
         */
        addModule(module: any): void;
        /**
         * Add a URL for discovering plugins.
         */
        addUrl(url: any): void;
        /**
         * Return the current list of configured modules
         */
        getModules(): any[];
        /**
         * Set a callback to be notified as URLs are checked and plugin
         * scripts are downloaded
         */
        setLoaderCallback(cb: any): void;
        private intersection(search, needle);
        /**
         * Downloads plugins at any configured URLs and bootstraps the app
         */
        loadPlugins(callback: any): void;
        /**
         * Dumps the current list of configured modules and URLs to the console
         */
        debug(): void;
    }
}
declare const hawtioPluginLoader: Hawtio.PluginLoader;
declare var HawtioCore: HawtioCore;
interface HawtioCore {
    /**
     * The app's injector, set once bootstrap is completed
     */
    injector: ng.auto.IInjectorService;
    /**
     * This plugin's name and angular module
     */
    pluginName: string;
    /**
     * Dummy local storage object
     */
    dummyLocalStorage: WindowLocalStorage;
    /**
     * Function that returns the base href attribute
     */
    documentBase(): string;
    /**
     * If angular2 is installed, this will be an instance of an ng.upgrade.UpgradeAdapter
     */
    UpgradeAdapter: any;
    /**
     * This will be a reference to the value returned from UpgradeAdapter.bootstrap(),
     * which contains the angular1 injector (As well as the angular2 root injector)
     */
    UpgradeAdapterRef: any;
}
declare var HawtioExtensionService: any;
declare namespace HawtioMainNav {
    const pluginName = "hawtio-nav";
    class Actions {
        static ADD: string;
        static REMOVE: string;
        static CHANGED: string;
        static REDRAW: string;
    }
    class Registry {
        items: any[];
        root: any;
        constructor(root: any);
        builder(): NavItemBuilder;
        add(item: any): void;
        remove(search: any): any[];
        iterate(iterator: any): void;
        selected(): number | ((...items: any[]) => number) | ((callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any) => void) | (() => string) | (() => any) | {
            (...items: ReadonlyArray<any>[]): any[];
            (...items: any[]): any[];
        } | ((separator?: string) => string) | (() => any[]) | ((start?: number, end?: number) => any[]) | ((compareFn?: (a: any, b: any) => number) => any[]) | {
            (start: number, deleteCount?: number): any[];
            (start: number, deleteCount: number, ...items: any[]): any[];
        } | ((searchElement: any, fromIndex?: number) => number) | ((callbackfn: (value: any, index: number, array: any[]) => boolean, thisArg?: any) => boolean) | (<U>(callbackfn: (value: any, index: number, array: any[]) => U, thisArg?: any) => U[]) | {
            <S extends any>(callbackfn: (value: any, index: number, array: any[]) => value is S, thisArg?: any): S[];
            (callbackfn: (value: any, index: number, array: any[]) => any, thisArg?: any): any[];
        } | {
            (callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any): any;
            (callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue: any): any;
            <U>(callbackfn: (previousValue: U, currentValue: any, currentIndex: number, array: any[]) => U, initialValue: U): U;
        };
        on(action: any, key: any, fn: any): void;
    }
    function createRegistry(root: any): Registry;
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
        [name: string]: any;
    }
    interface DefaultPageRanking {
        rank: number;
        isValid: (yes: () => void, no: () => void) => void;
    }
    interface AttributeMap {
        [name: string]: string;
    }
    class NavItemBuilder {
        private self;
        id(id: any): this;
        rank(rank: any): this;
        title(title: any): this;
        tooltip(tooltip: any): this;
        page(page: any): this;
        reload(reload: any): this;
        attributes(attributes: any): this;
        linkAttributes(attributes: any): this;
        context(context: any): this;
        href(href: any): this;
        click(click: any): this;
        isSelected(isSelected: any): this;
        isValid(isValid: any): this;
        show(show: any): this;
        template(template: any): this;
        defaultPage(defaultPage: any): this;
        tabs(item: any): this;
        subPath(title: any, path: any, page: any, rank: any, reload: any, isValid: any): this;
        build(): NavItem;
    }
    function createBuilder(): NavItemBuilder;
    const _module: angular.IModule;
    class BuilderFactory {
        $get(): {};
        create(): NavItemBuilder;
        join(...paths: any[]): string;
        setRoute($routeProvider: any, tab: any): void;
        configureRouting($routeProvider: angular.route.IRouteProvider, tab: NavItem): any;
    }
}
declare var templateCache: any;
declare namespace Hawtio {
    const rootModule: string;
}
