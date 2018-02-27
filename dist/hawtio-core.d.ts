/// <reference types="angular-route" />
/// <reference types="angular" />
declare namespace Core {
    /**
     * @deprecated TODO Temporal type alias to avoid breaking existing code
     */
    type UserDetails = AuthService;
    /**
     * UserDetails service that represents user credentials and login/logout actions.
     */
    class AuthService {
        private postLoginTasks;
        private preLogoutTasks;
        private postLogoutTasks;
        private localStorage;
        private _username;
        private _password;
        private _token;
        private _loggedIn;
        constructor(postLoginTasks: Tasks, preLogoutTasks: Tasks, postLogoutTasks: Tasks, localStorage: Storage);
        /**
         * Log in as a specific user.
         */
        login(username: string, password: string, token?: string): void;
        /**
         * Log out the current user.
         */
        logout(): void;
        private clear();
        readonly username: string;
        readonly password: string;
        readonly token: string;
        readonly loggedIn: boolean;
    }
}
declare namespace Core {
    function getBasicAuthHeader(username: string, password: string): string;
}
declare namespace Core {
    const authModule: string;
}
declare namespace Core {
    interface Config {
        branding?: {
            [key: string]: string;
        };
        disabledRoutes?: string[];
    }
}
declare namespace Core {
    class ConfigManager {
        private config;
        private $routeProvider;
        constructor(config: Config, $routeProvider: ng.route.IRouteProvider);
        getBrandingValue(key: string): string;
        isRouteEnabled(path: string): boolean;
        addRoute(path: string, route: ng.route.IRoute): ConfigManager;
    }
}
declare namespace Core {
    class BrandingImageController {
        private configManager;
        class: string;
        src: string;
        alt: string;
        srcValue: string;
        altValue: string;
        constructor(configManager: ConfigManager);
        $onInit(): void;
    }
    const brandingImageComponent: angular.IComponentOptions;
}
declare namespace Core {
    class BrandingTextController {
        private configManager;
        key: string;
        value: string;
        constructor(configManager: ConfigManager);
        $onInit(): void;
    }
    const brandingTextComponent: angular.IComponentOptions;
}
declare namespace Core {
    const configModule: string;
}
declare namespace Core {
    function configLoader(next: () => void): void;
}
declare namespace Core {
    class HumanizeService {
        toUpperCase(str: string): string;
        toLowerCase(str: string): string;
        toSentenceCase(str: string): string;
        toTitleCase(str: string): string;
    }
}
declare namespace Core {
    const _module: angular.IModule;
    const coreModule: string;
    const log: Logging.Logger;
}
declare namespace Bootstrap {
}
declare namespace Core {
    type PluginLoaderCallback = {
        scriptLoaderCallback: (self: PluginLoaderCallback, total: number, remaining: number) => void;
        urlLoaderCallback: (self: PluginLoaderCallback, total: number, remaining: number) => void;
    };
    /**
     * Task to be run before bootstrapping
     *
     * name: the task name
     * depends: an array of task names this task needs to have executed first,
     *          or '*'
     * task: the function to be executed with 1 argument, which is a function
     *       that will execute the next task in the queue
     */
    type PreBootstrapTask = {
        name?: string;
        depends?: string | string[];
        task: (next: () => void) => void;
    };
    type HawtioPlugin = {
        Name: string;
        Context: string;
        Domain: string;
        Scripts: string[];
    };
    type HawtioPlugins = {
        [key: string]: HawtioPlugin;
    };
    class PluginLoader {
        private bootstrapEl;
        private loaderCallback;
        /**
         * List of URLs that the plugin loader will try and discover
         * plugins from
         */
        private urls;
        /**
         * Holds all of the angular modules that need to be bootstrapped
         */
        private modules;
        /**
         * Tasks to be run before bootstrapping, tasks can be async.
         * Supply a function that takes the next task to be
         * executed as an argument and be sure to call the passed
         * in function.
         */
        private tasks;
        private runs;
        private executedTasks;
        private deferredTasks;
        private readonly bootstrapTask;
        constructor();
        /**
         * Set the HTML element that the plugin loader will pass to angular.bootstrap
         */
        setBootstrapElement(el: HTMLElement): PluginLoader;
        /**
         * Get the HTML element used for angular.bootstrap
         */
        getBootstrapElement(): HTMLElement;
        /**
         * Register a function to be executed after scripts are loaded but
         * before the app is bootstrapped.
         *
         * 'task' can either be a simple function or a PreBootstrapTask object
         */
        registerPreBootstrapTask(task: ((next: () => void) => void) | PreBootstrapTask, front?: boolean): PluginLoader;
        /**
         * Add an angular module to the list of modules to bootstrap
         */
        addModule(module: string): PluginLoader;
        /**
         * Add a URL for discovering plugins.
         */
        addUrl(url: string): PluginLoader;
        /**
         * Return the current list of configured modules.
         *
         * It is invoked from HawtioCore's bootstrapping.
         */
        getModules(): string[];
        /**
         * Set a callback to be notified as URLs are checked and plugin
         * scripts are downloaded
         */
        setLoaderCallback(callback: PluginLoaderCallback): PluginLoader;
        /**
         * Downloads plugins at any configured URLs and bootstraps the app.
         *
         * It is invoked from HawtioCore's bootstrapping.
         */
        loadPlugins(callback: () => void): void;
        private loadScripts(plugins, callback);
        private bootstrap(callback);
        private executeTasks(callback);
        private listTasks(tasks);
        private intersection(search, needle);
        /**
         * Dumps the current list of configured modules and URLs to the console
         */
        debug(): void;
    }
}
declare const hawtioPluginLoader: Core.PluginLoader;
declare let HawtioCore: HawtioCore;
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
    type TaskMap = {
        [name: string]: () => void;
    };
    type ParameterizedTaskMap = {
        [name: string]: (...params: any[]) => void;
    };
    class Tasks {
        protected name: string;
        protected tasks: TaskMap;
        protected tasksExecuted: boolean;
        constructor(name: string);
        addTask(name: string, task: () => void): Tasks;
        execute(callback?: () => void): void;
        private executeTask(name, task);
        reset(): void;
    }
    class ParameterizedTasks extends Tasks {
        protected tasks: ParameterizedTaskMap;
        constructor(name: string);
        addTask(name: string, task: (...params: any[]) => void): Tasks;
        execute(...params: any[]): void;
        private executeParameterizedTask(name, task, params);
    }
}
declare namespace Core {
    const eventServicesModule: string;
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
declare namespace Help {
    class HelpTopic {
        topicName: string;
        subTopicName: string;
        label: string;
        path: string;
        isValid: () => boolean;
        selected: boolean;
        isIndexTopic(): boolean;
    }
}
declare namespace Help {
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
        getLabel(name: any): string;
        getTopics(): HelpTopic[];
        getTopic(topicName: string, subTopicName: string): HelpTopic;
    }
}
declare namespace Help {
    class HelpService {
        private $templateCache;
        private helpRegistry;
        constructor($templateCache: any, helpRegistry: HelpRegistry);
        getTopics(): HelpTopic[];
        getSubTopics(topic: HelpTopic): HelpTopic[];
        getTopic(topicName: string, subTopicName: string): HelpTopic;
        getHelpContent(topic: HelpTopic): string;
    }
}
declare namespace Help {
    class HelpController {
        private helpService;
        private $sce;
        topics: HelpTopic[];
        selectedTopic: HelpTopic;
        subTopics: HelpTopic[];
        selectedSubTopic: HelpTopic;
        html: any;
        constructor($rootScope: any, helpService: HelpService, $sce: ng.ISCEService);
        $onInit(): void;
        onSelectTopic(topic: HelpTopic): void;
        onSelectSubTopic(subTopic: HelpTopic): void;
    }
    const helpComponent: angular.IComponentOptions;
}
declare namespace Help {
    function configureRoutes($routeProvider: any): void;
    function configureDocumentation(helpRegistry: HelpRegistry, $templateCache: any): void;
    function configureMenu(HawtioExtension: Core.HawtioExtension, $compile: ng.ICompileService): void;
}
declare namespace Help {
    const helpModule: string;
}
declare namespace HawtioMainNav {
    const pluginName = "hawtio-core-nav";
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
        subPath(title: string, path: string, page?: string, rank?: number, reload?: boolean, isValid?: boolean): this;
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
        addTab(label: string, templateUrl: string, isValid?: () => boolean): void;
        getTab(label: string): any;
        getTabs(): {};
    }
}
declare namespace Core {
    class HawtioTab {
        readonly label: string;
        readonly path: string;
        constructor(label: string, path: string);
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
    function configureMenu(HawtioExtension: HawtioExtension, $compile: ng.ICompileService): void;
    function savePreviousLocationWhenOpeningPreferences($rootScope: ng.IScope, preferencesService: PreferencesService): void;
    function configureDocumentation(helpRegistry: Help.HelpRegistry): void;
    function configurePreferencesPages(preferencesRegistry: PreferencesRegistry): void;
}
declare namespace Core {
    const preferencesModule: string;
}
declare var templateCache: any;
declare namespace App {
    const appModule: string;
}
declare namespace Core {
    class HawtioTabsController {
        private $document;
        private $timeout;
        private $location;
        tabs: HawtioTab[];
        moreTabs: HawtioTab[];
        adjustingTabs: boolean;
        onChange: Function;
        activeTab: HawtioTab;
        constructor($document: ng.IDocumentService, $timeout: ng.ITimeoutService, $location: ng.ILocationService);
        $onChanges(changesObj: ng.IOnChangesObject): void;
        private activateTab(changesObj);
        private adjustTabs();
        onClick(tab: HawtioTab): void;
    }
    const hawtioTabsComponent: angular.IComponentOptions;
}
