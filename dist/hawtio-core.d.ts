/// <reference types="angular" />
/// <reference types="angular-route" />
declare namespace Core {
    interface AuthService {
        logout(): void;
    }
    class DummyAuthService implements AuthService {
        logout(): void;
    }
}
declare namespace Core {
    const authModule: string;
}
declare namespace Core {
    class ConfigService {
        private config;
        constructor(config: any);
        getBrandingValue(name: string): any;
        private getValue(group, name);
    }
}
declare namespace Core {
    function configLoader($rootScope: ng.IRootScopeService, $http: ng.IHttpService): void;
}
declare namespace Core {
    class BrandingImageController {
        private $rootScope;
        class: string;
        src: string;
        alt: string;
        constructor($rootScope: ng.IRootScopeService);
        $onInit(): void;
    }
    const brandingImageComponent: angular.IComponentOptions;
}
declare namespace Core {
    class BrandingTextController {
        private $rootScope;
        key: string;
        value: string;
        constructor($rootScope: ng.IRootScopeService);
        $onInit(): void;
    }
    const brandingTextComponent: angular.IComponentOptions;
}
declare namespace Core {
    const EVENT_LOADED = "hawtio-config-loaded";
    const configModule: string;
}
declare namespace Core {
    class PluginLoader {
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
declare const hawtioPluginLoader: Core.PluginLoader;
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
declare namespace Core {
    class HawtioExtension {
        private _registeredExtensions;
        add(extensionPointName: string, fn: any): void;
        render(extensionPointName: string, element: any, scope: any): void;
    }
}
declare namespace Core {
    function hawtioExtensionDirective(HawtioExtension: HawtioExtension): any;
}
declare namespace Core {
    const hawtioExtensionModule: string;
}
declare namespace Core {
    class HelpTopic {
        topicName: string;
        subTopicName: string;
        label: string;
        path: string;
        isValid: any;
        selected: boolean;
        isIndexTopic(): boolean;
    }
}
declare namespace Core {
    class HelpRegistry {
        private $rootScope;
        private topicNameMappings;
        private subTopicNameMappings;
        private topics;
        constructor($rootScope: any);
        addUserDoc(topicName: string, path: string, isValid?: () => boolean): void;
        addDevDoc(topicName: string, path: string, isValid?: () => boolean): void;
        addSubTopic(topicName: string, subtopic: string, path: any, isValid?: () => boolean): void;
        getOrCreateTopic(topicName: string, subTopicName: string, path: string, isValid?: () => boolean): HelpTopic;
        mapTopicName(name: any): any;
        mapSubTopicName(name: any): any;
        getTopics(): HelpTopic[];
        getTopic(topicName: string, subTopicName: string): HelpTopic;
    }
}
declare namespace Core {
    class HelpService {
        private $templateCache;
        private helpRegistry;
        constructor($templateCache: any, helpRegistry: HelpRegistry);
        getBreadcrumbs(): HelpTopic[];
        getSections(): HelpTopic[];
        getTopics(): HelpTopic[];
        getTopic(topicName: string, subTopicName: string): HelpTopic;
        getHelpContent(topic: HelpTopic): string;
    }
}
declare namespace Core {
    class HelpController {
        private helpService;
        private $sce;
        breadcrumbs: HelpTopic[];
        sections: HelpTopic[];
        selectedTopic: HelpTopic;
        selectedBreadcrumb: HelpTopic;
        html: any;
        constructor($rootScope: any, helpService: HelpService, $sce: ng.ISCEService);
        $onInit(): void;
        onSelectTopic(topic: HelpTopic): void;
        onSelectBreadcrumb(topic: HelpTopic): void;
    }
    const helpComponent: angular.IComponentOptions;
}
declare namespace Core {
    function HelpConfig($routeProvider: any, $provide: any): void;
    function HelpRun(helpRegistry: HelpRegistry, viewRegistry: any, layoutFull: any, $templateCache: any): void;
}
declare namespace Core {
    const helpModule: string;
}
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
        selected(): any;
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
declare namespace Core {
    class LoggingPreferencesService {
        private $window;
        private static DEFAULT_LOG_BUFFER_SIZE;
        private static DEFAULT_GLOBAL_LOG_LEVEL;
        constructor($window: ng.IWindowService);
        getLogBuffer(): number;
        setLogBuffer(logBuffer: number): void;
        getGlobalLogLevel(): Logging.LogLevel;
        setGlobalLogLevel(logLevel: Logging.LogLevel): void;
        getChildLoggers(): Logging.ChildLogger[];
        getAvailableChildLoggers(): Logging.ChildLogger[];
        addChildLogger(childLogger: Logging.ChildLogger): void;
        removeChildLogger(childLogger: Logging.ChildLogger): void;
        setChildLoggers(childLoggers: Logging.ChildLogger[]): void;
        reconfigureLoggers(): void;
    }
}
declare namespace Core {
    function LoggingPreferencesController($scope: any, loggingPreferencesService: LoggingPreferencesService): void;
}
declare namespace Core {
    const loggingPreferencesModule: string;
}
declare namespace Core {
    class PreferencesService {
        private $window;
        constructor($window: ng.IWindowService);
        saveLocationUrl(url: string): void;
        restoreLocation($location: ng.ILocationService): void;
        /**
         * Binds a $location.search() property to a model on a scope; so that its initialised correctly on startup
         * and its then watched so as the model changes, the $location.search() is updated to reflect its new value
         * @method bindModelToSearchParam
         * @for Core
         * @static
         * @param {*} $scope
         * @param {ng.ILocationService} $location
         * @param {String} modelName
         * @param {String} paramName
         * @param {Object} initialValue
         */
        bindModelToSearchParam($scope: any, $location: any, modelName: string, paramName: string, initialValue?: any, to?: (value: any) => any, from?: (value: any) => any): void;
        /**
         * Navigates the given set of paths in turn on the source object
         * and updates the last path value to the given newValue
         *
         * @method pathSet
         * @for Core
         * @static
         * @param {Object} object the start object to start navigating from
         * @param {Array} paths an array of path names to navigate or a string of dot separated paths to navigate
         * @param {Object} newValue the value to update
         * @return {*} the last step on the path which is updated
         */
        pathSet(object: any, paths: any, newValue: any): any;
    }
}
declare namespace Core {
    class PreferencesRegistry {
        private $rootScope;
        private tabs;
        constructor($rootScope: ng.IRootScopeService);
        addTab(name: string, template: string, isValid?: () => boolean): void;
        getTab(name: string): any;
        getTabs(): {};
    }
}
declare namespace Core {
    function PreferencesHomeController($scope: any, $location: ng.ILocationService, preferencesRegistry: PreferencesRegistry, preferencesService: PreferencesService): void;
}
declare namespace Core {
    const preferencesHomeModule: string;
}
declare namespace Core {
    function ResetPreferencesController($scope: any, $window: ng.IWindowService): void;
}
declare namespace Core {
    const resetPreferencesModule: string;
}
declare namespace Core {
    function configureRoutes($routeProvider: any): void;
    function addItemToUserMenu(HawtioExtension: HawtioExtension, $templateCache: ng.ITemplateCacheService, $compile: ng.ICompileService): void;
    function savePreviousLocationWhenOpeningPreferences($rootScope: ng.IScope, preferencesService: PreferencesService): void;
    function addHelpDocumentation(helpRegistry: HelpRegistry): void;
    function addPreferencesPages(preferencesRegistry: PreferencesRegistry): void;
}
declare namespace Core {
    const preferencesModule: string;
}
declare var templateCache: any;
declare namespace Core {
    const appModule: string;
    const log: Logging.Logger;
}
declare namespace HawtioMainNav {
    class HawtioTabsController {
        private $document;
        private $timeout;
        names: string[];
        tabNames: string[];
        dropdownNames: string[];
        adjustingTabs: boolean;
        onChange: Function;
        activeTab: string;
        constructor($document: ng.IDocumentService, $timeout: ng.ITimeoutService);
        $onInit(): void;
        private setDefaultAtiveTab();
        private adjustTabs();
        onClick(name: string): void;
    }
    const hawtioTabsComponent: angular.IComponentOptions;
}
