/// <reference types="angular" />
declare module Init {
    class InitService {
        private $q;
        private initFunctions;
        constructor($q: ng.IQService);
        registerInitFunction(initFunction: () => ng.IPromise<any>): void;
        init(): ng.IPromise<any>;
    }
}
declare namespace Nav {
    const DEFAULT_TEMPLATE = "<div ng-view></div>";
    const DEFAULT_TEMPLATE_URL = "/defaultTemplateUrl.html";
    /**
     * This interface must include the mandatory fields of pfVerticalNavigation 'items' parameter
     * https://www.patternfly.org/angular-patternfly/#/api/patternfly.navigation.component:pfVerticalNavigation%20-%20Basic
     */
    interface MainNavItemProps {
        /** Name to be displayed on the menu */
        title: string;
        /** Route path to navigate to on click. pfVerticalNavigation invokes $location.path(href) internally. */
        href?: string;
        /** Base path of hawtioTabs route paths. Should be used instead of 'href' when the template has second level navigation. */
        basePath?: string;
        /** HTML template that should be rendered when the item is clicked. */
        template?: string;
        /** Function that checks whether the item should be added to the menu. */
        isValid?: () => boolean;
        /** Affects the position of the item in the menu. Items with higher ranks are shown on the top. */
        rank?: number;
    }
    class MainNavItem implements MainNavItemProps {
        title: string;
        href: string;
        basePath: string;
        template: string;
        isValid: () => boolean;
        rank: number;
        constructor(item: MainNavItemProps);
        readonly templateUrl: string;
    }
}
declare namespace Nav {
    class MainNavService {
        private $location;
        private $templateCache;
        private configManager;
        private allItems;
        constructor($location: ng.ILocationService, $templateCache: ng.ITemplateCacheService, configManager: Core.ConfigManager);
        addItem(props: MainNavItemProps): void;
        private isMainNavItemEnabled;
        getValidItems(): MainNavItem[];
        getActiveItem(): Nav.MainNavItem;
        activateItem(item: Nav.MainNavItem): void;
        clearActiveItem(): void;
        changeRouteIfRequired(): void;
        findItemByPath(): Nav.MainNavItem;
        isMainNavPath(): boolean;
        private getItemThatMatcheslocation;
        isRootPath(): boolean;
    }
}
declare namespace App {
    class AppController {
        private initService;
        loading: boolean;
        constructor(initService: Init.InitService);
        $onInit(): void;
    }
    const appComponent: angular.IComponentOptions;
}
declare namespace Core {
    interface Config {
        branding?: {
            [key: string]: string;
        };
        about?: {
            title?: string;
            description?: string;
            productInfo?: AboutProductInfo[];
        };
        disabledRoutes?: string[];
    }
    interface AboutProductInfo {
        name: string;
        value: string;
    }
}
declare namespace About {
    class AboutService {
        private configManager;
        private moreProductInfo;
        constructor(configManager: Core.ConfigManager);
        getTitle(): string;
        getProductInfo(): Core.AboutProductInfo[];
        addProductInfo(name: string, value: string): void;
        getAdditionalInfo(): string;
        getCopyright(): string;
        getImgSrc(): string;
    }
}
declare namespace App {
    function configureAboutPage(aboutService: About.AboutService): void;
}
declare namespace About {
    class AboutController {
        private aboutService;
        flags: {
            open: boolean;
        };
        title: string;
        productInfo: Core.AboutProductInfo[];
        additionalInfo: string;
        copyright: string;
        imgSrc: string;
        constructor(aboutService: AboutService);
        $onInit(): void;
        onClose(): void;
    }
    const aboutComponent: angular.IComponentOptions;
}
declare namespace About {
    function configureMenu(HawtioExtension: Core.HawtioExtension, $compile: ng.ICompileService): void;
}
declare namespace About {
    const aboutModule: string;
}
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
        private clear;
        readonly username: string;
        readonly password: string;
        token: string;
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
    class ConfigManager {
        private config;
        constructor(config: Config);
        getBrandingValue(key: string): string;
        getAboutValue(key: string): any;
        isRouteEnabled(path: string): boolean;
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
        private loadScripts;
        private bootstrap;
        private executeTasks;
        private listTasks;
        private intersection;
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
        private executeTask;
        reset(): void;
    }
    class ParameterizedTasks extends Tasks {
        protected tasks: ParameterizedTaskMap;
        constructor(name: string);
        addTask(name: string, task: (...params: any[]) => void): Tasks;
        execute(...params: any[]): void;
        private executeParameterizedTask;
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
declare namespace Init {
    const initModule: string;
}
declare namespace Nav {
    class HawtioTab {
        readonly label: string;
        readonly path: string;
        visible: boolean;
        constructor(label: string, path: string);
    }
}
declare namespace Nav {
    class HawtioTabsController {
        private $document;
        private $timeout;
        private $location;
        private $rootScope;
        private configManager;
        tabs: HawtioTab[];
        adjustingTabs: boolean;
        onChange: Function;
        activeTab: HawtioTab;
        unregisterRouteChangeListener: Function;
        constructor($document: ng.IDocumentService, $timeout: ng.ITimeoutService, $location: ng.ILocationService, $rootScope: ng.IRootScopeService, configManager: Core.ConfigManager);
        $onInit(): void;
        $onDestroy(): void;
        $onChanges(changesObj: ng.IOnChangesObject): void;
        private discardDisabledTabs;
        private activateTab;
        private adjustTabs;
        readonly visibleTabs: HawtioTab[];
        readonly moreTabs: HawtioTab[];
        onClick(tab: HawtioTab): void;
    }
    const hawtioTabsComponent: angular.IComponentOptions;
}
declare namespace Nav {
    class HawtioTabsLayoutController {
        private $location;
        tabs: HawtioTab[];
        constructor($location: ng.ILocationService);
        goto(tab: Nav.HawtioTab): void;
    }
    const hawtioTabsLayoutComponent: angular.IComponentOptions;
}
declare namespace Nav {
    class MainNavController {
        private mainNavService;
        private $rootScope;
        private $interval;
        brandSrc: string;
        username: string;
        items: Nav.MainNavItem[];
        templateUrl: string;
        unregisterRouteChangeListener: Function;
        itemsChecker: ng.IPromise<any>;
        constructor(configManager: Core.ConfigManager, userDetails: Core.AuthService, mainNavService: Nav.MainNavService, $rootScope: ng.IRootScopeService, $interval: ng.IIntervalService);
        $onInit(): void;
        getActiveItem(): Nav.MainNavItem;
        $onDestroy(): void;
        loadData(): void;
        loadDataAndSetActiveItem(): void;
        updateTemplateUrl: (item: MainNavItem) => void;
    }
    const mainNavComponent: angular.IComponentOptions;
}
declare namespace Nav {
    const navigationModule: string;
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
        private tabs;
        addTab(label: string, templateUrl: string, isValid?: () => boolean): void;
        getTab(label: string): any;
        getTabs(): any;
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
declare namespace Shared {
    class HawtioLoadingController {
        private $timeout;
        loading: boolean;
        show: boolean;
        constructor($timeout: ng.ITimeoutService);
        $onInit(): void;
    }
    const hawtioLoadingComponent: angular.IComponentOptions;
}
declare namespace Shared {
    const hawtioActionBarComponent: angular.IComponentOptions;
}
declare namespace Shared {
    const sharedModule: string;
}
declare namespace Core {
    const templateCacheModule: string;
}
declare namespace App {
    const appModule: string;
}
declare namespace ArrayHelpers {
    /**
     * Removes elements in the target array based on the new collection, returns true if
     * any changes were made
     */
    function removeElements(collection: Array<any>, newCollection: Array<any>, index?: string): boolean;
    /**
     * Changes the existing collection to match the new collection to avoid re-assigning
     * the array pointer, returns true if the array size has changed
     */
    function sync(collection: Array<any>, newCollection: Array<any>, index?: string): boolean;
}
declare namespace StringHelpers {
    function isDate(str: any): boolean;
    /**
     * Convert a string into a bunch of '*' of the same length
     * @param str
     * @returns {string}
     */
    function obfusicate(str: String): String;
    /**
     * Simple toString that obscures any field called 'password'
     * @param obj
     * @returns {string}
     */
    function toString(obj: any): string;
}
declare namespace UrlHelpers {
    /**
     * Returns the URL without the starting '#' if it's there
     * @param url
     * @returns {string}
     */
    function noHash(url: string): string;
    function extractPath(url: string): string;
    /**
     * Returns whether or not the context is in the supplied URL.  If the search string starts/ends with '/' then the entire URL is checked.  If the search string doesn't start with '/' then the search string is compared against the end of the URL.  If the search string starts with '/' but doesn't end with '/' then the start of the URL is checked, excluding any '#'
     * @param url
     * @param thingICareAbout
     * @returns {boolean}
     */
    function contextActive(url: string, thingICareAbout: string): boolean;
    /**
     * Joins the supplied strings together using '/', stripping any leading/ending '/'
     * from the supplied strings if needed, except the first and last string
     * @returns {string}
     */
    function join(...paths: string[]): string;
    function parseQueryString(text?: string): any;
    /**
     * Apply a proxy to the supplied URL if the jolokiaUrl is using the proxy, or if the URL is for a a different host/port
     * @param jolokiaUrl
     * @param url
     * @returns {*}
     */
    function maybeProxy(jolokiaUrl: string, url: string): string;
    /**
     * Escape any colons in the URL for ng-resource, mostly useful for handling proxified URLs
     * @param url
     * @returns {*}
     */
    function escapeColons(url: string): string;
}
declare namespace Core {
    /**
     * Private method to support testing.
     *
     * @private
     */
    function _resetUrlPrefix(): void;
    /**
     * Prefixes absolute URLs with current window.location.pathname
     *
     * @param path
     * @returns {string}
     */
    function url(path: string): string;
    /**
     * Returns location of the global window
     *
     * @returns {string}
     */
    function windowLocation(): Location;
    function unescapeHTML(str: any): string;
    /**
     * Trims the leading prefix from a string if its present
     * @method trimLeading
     * @for Core
     * @static
     * @param {String} text
     * @param {String} prefix
     * @return {String}
     */
    function trimLeading(text: string, prefix: string): string;
    /**
     * Trims the trailing postfix from a string if its present
     * @method trimTrailing
     * @for Core
     * @static
     * @param {String} trim
     * @param {String} postfix
     * @return {String}
     */
    function trimTrailing(text: string, postfix: string): string;
    /**
     * Ensure our main app container takes up at least the viewport
     * height
     */
    function adjustHeight(): void;
    function isChromeApp(): boolean;
    /**
     * Adds the specified CSS file to the document's head, handy
     * for external plugins that might bring along their own CSS
     *
     * @param path
     */
    function addCSS(path: any): void;
    /**
     * Wrapper to get the window local storage object
     *
     * @returns {WindowLocalStorage}
     */
    function getLocalStorage(): WindowLocalStorage;
    /**
     * If the value is not an array then wrap it in one
     *
     * @method asArray
     * @for Core
     * @static
     * @param {any} value
     * @return {Array}
     */
    function asArray(value: any): any[];
    /**
     * Ensure whatever value is passed in is converted to a boolean
     *
     * In the branding module for now as it's needed before bootstrap
     *
     * @method parseBooleanValue
     * @for Core
     * @param {any} value
     * @param {Boolean} defaultValue default value to use if value is not defined
     * @return {Boolean}
     */
    function parseBooleanValue(value: any, defaultValue?: boolean): boolean;
    function toString(value: any): string;
    /**
     * Converts boolean value to string "true" or "false"
     *
     * @param value
     * @returns {string}
     */
    function booleanToString(value: boolean): string;
    /**
     * object to integer converter
     *
     * @param value
     * @param description
     * @returns {*}
     */
    function parseIntValue(value: any, description?: string): number;
    /**
     * Formats numbers as Strings.
     *
     * @param value
     * @returns {string}
     */
    function numberToString(value: number): string;
    /**
     * object to integer converter
     *
     * @param value
     * @param description
     * @returns {*}
     */
    function parseFloatValue(value: any, description?: string): number;
    /**
     * Navigates the given set of paths in turn on the source object
     * and returns the last most value of the path or null if it could not be found.
     *
     * @method pathGet
     * @for Core
     * @static
     * @param {Object} object the start object to start navigating from
     * @param {Array} paths an array of path names to navigate or a string of dot separated paths to navigate
     * @return {*} the last step on the path which is updated
     */
    function pathGet(object: any, paths: any): any;
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
    function pathSet(object: any, paths: any, newValue: any): any;
    /**
     * Performs a $scope.$apply() if not in a digest right now otherwise it will fire a digest later
     *
     * @method $applyNowOrLater
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $applyNowOrLater($scope: ng.IScope): void;
    /**
     * Performs a $scope.$apply() after the given timeout period
     *
     * @method $applyLater
     * @for Core
     * @static
     * @param {*} $scope
     * @param {Integer} timeout
     */
    function $applyLater($scope: any, timeout?: number): void;
    /**
     * Performs a $scope.$apply() if not in a digest or apply phase on the given scope
     *
     * @method $apply
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $apply($scope: ng.IScope): void;
    /**
     * Performs a $scope.$digest() if not in a digest or apply phase on the given scope
     *
     * @method $apply
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $digest($scope: ng.IScope): void;
    /**
     * Look up a list of child element names or lazily create them.
     *
     * Useful for example to get the <tbody> <tr> element from a <table> lazily creating one
     * if not present.
     *
     * Usage: var trElement = getOrCreateElements(tableElement, ["tbody", "tr"])
     * @method getOrCreateElements
     * @for Core
     * @static
     * @param {Object} domElement
     * @param {Array} arrayOfElementNames
     * @return {Object}
     */
    function getOrCreateElements(domElement: any, arrayOfElementNames: string[]): any;
    /**
     * static unescapeHtml
     *
     * @param str
     * @returns {any}
     */
    function unescapeHtml(str: any): any;
    /**
     * static escapeHtml method
     *
     * @param str
     * @returns {*}
     */
    function escapeHtml(str: any): any;
    /**
     * Returns true if the string is either null or empty
     *
     * @method isBlank
     * @for Core
     * @static
     * @param {String} str
     * @return {Boolean}
     */
    function isBlank(str: string): boolean;
    /**
     * removes all quotes/apostrophes from beginning and end of string
     *
     * @param text
     * @returns {string}
     */
    function trimQuotes(text: string): string;
    /**
     * Converts camel-case and dash-separated strings into Human readable forms
     *
     * @param value
     * @returns {*}
     */
    function humanizeValue(value: any): string;
}
declare namespace HawtioCompile {
    const _module: angular.IModule;
}
declare namespace ControllerHelpers {
    function createClassSelector(config: any): (selection: any, model: any) => string;
    function createValueClassSelector(config: any): (model: any) => string;
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
    function bindModelToSearchParam($scope: any, $location: any, modelName: string, paramName: string, initialValue?: any, to?: (value: any) => any, from?: (value: any) => any): void;
    /**
     * For controllers where reloading is disabled via "reloadOnSearch: false" on the registration; lets pick which
     * query parameters need to change to force the reload. We default to the JMX selection parameter 'nid'
     * @method reloadWhenParametersChange
     * @for Core
     * @static
     * @param {Object} $route
     * @param {*} $scope
     * @param {ng.ILocationService} $location
     * @param {string[]} parameters
     */
    function reloadWhenParametersChange($route: any, $scope: any, $location: ng.ILocationService, parameters?: string[]): void;
}
declare namespace Core {
    const lazyLoaders: {};
    const numberTypeNames: {
        'byte': boolean;
        'short': boolean;
        'int': boolean;
        'long': boolean;
        'float': boolean;
        'double': boolean;
        'java.lang.byte': boolean;
        'java.lang.short': boolean;
        'java.lang.integer': boolean;
        'java.lang.long': boolean;
        'java.lang.float': boolean;
        'java.lang.double': boolean;
    };
    /**
     * Returns the number of lines in the given text
     *
     * @method lineCount
     * @static
     * @param {String} value
     * @return {Number}
     *
     */
    function lineCount(value: any): number;
    function safeNull(value: any): string;
    function safeNullAsString(value: any, type: string): string;
    /**
     * Converts the given value to an array of query arguments.
     *
     * If the value is null an empty array is returned.
     * If the value is a non empty string then the string is split by commas
     *
     * @method toSearchArgumentArray
     * @static
     * @param {*} value
     * @return {String[]}
     *
     */
    function toSearchArgumentArray(value: any): string[];
    function folderMatchesPatterns(node: any, patterns: any): any;
    function supportsLocalStorage(): boolean;
    function isNumberTypeName(typeName: any): boolean;
    function escapeDots(text: string): string;
    /**
     * Escapes all dots and 'span' text in the css style names to avoid clashing with bootstrap stuff
     *
     * @method escapeTreeCssStyles
     * @static
     * @param {String} text
     * @return {String}
     */
    function escapeTreeCssStyles(text: string): string;
    function showLogPanel(): void;
    /**
     * Returns the CSS class for a log level based on if its info, warn, error etc.
     *
     * @method logLevelClass
     * @static
     * @param {String} level
     * @return {String}
     */
    function logLevelClass(level: string): "error" | "" | "info" | "warning";
    function toPath(hashUrl: string): string;
    /**
     * Creates a link by appending the current $location.search() hash to the given href link,
     * removing any required parameters from the link
     * @method createHref
     * @for Core
     * @static
     * @param {ng.ILocationService} $location
     * @param {String} href the link to have any $location.search() hash parameters appended
     * @param {Array} removeParams any parameters to be removed from the $location.search()
     * @return {Object} the link with any $location.search() parameters added
     */
    function createHref($location: any, href: any, removeParams?: any): any;
    /**
     * Turns the given search hash into a URI style query string
     * @method hashToString
     * @for Core
     * @static
     * @param {Object} hash
     * @return {String}
     */
    function hashToString(hash: any): string;
    /**
     * Parses the given string of x=y&bar=foo into a hash
     * @method stringToHash
     * @for Core
     * @static
     * @param {String} hashAsString
     * @return {Object}
     */
    function stringToHash(hashAsString: string): {};
    /**
     * Converts the given XML node to a string representation of the XML
     * @method xmlNodeToString
     * @for Core
     * @static
     * @param {Object} xmlNode
     * @return {Object}
     */
    function xmlNodeToString(xmlNode: any): any;
    /**
     * Returns true if the given DOM node is a text node
     * @method isTextNode
     * @for Core
     * @static
     * @param {Object} node
     * @return {Boolean}
     */
    function isTextNode(node: any): boolean;
    /**
     * Returns the lowercase file extension of the given file name or returns the empty
     * string if the file does not have an extension
     * @method fileExtension
     * @for Core
     * @static
     * @param {String} name
     * @param {String} defaultValue
     * @return {String}
     */
    function fileExtension(name: string, defaultValue?: string): string;
    function getUUID(): string;
    /**
     * Parses some text of the form "xxxx2.3.4xxxx"
     * to extract the version numbers as an array of numbers then returns an array of 2 or 3 numbers.
     *
     * Characters before the first digit are ignored as are characters after the last digit.
     * @method parseVersionNumbers
     * @for Core
     * @static
     * @param {String} text a maven like string containing a dash then numbers separated by dots
     * @return {Array}
     */
    function parseVersionNumbers(text: string): number[];
    /**
     * Converts a version string with numbers and dots of the form "123.456.790" into a string
     * which is sortable as a string, by left padding each string between the dots to at least 4 characters
     * so things just sort as a string.
     *
     * @param text
     * @return {string} the sortable version string
     */
    function versionToSortableString(version: string, maxDigitsBetweenDots?: number): string;
    function time(message: string, fn: any): any;
    /**
     * Compares the 2 version arrays and returns -1 if v1 is less than v2 or 0 if they are equal or 1 if v1 is greater than v2
     * @method compareVersionNumberArrays
     * @for Core
     * @static
     * @param {Array} v1 an array of version numbers with the most significant version first (major, minor, patch).
     * @param {Array} v2
     * @return {Number}
     */
    function compareVersionNumberArrays(v1: number[], v2: number[]): 0 | 1 | -1;
    /**
     * Helper function which converts objects into tables of key/value properties and
     * lists into a <ul> for each value.
     * @method valueToHtml
     * @for Core
     * @static
     * @param {any} value
     * @return {String}
     */
    function valueToHtml(value: any): any;
    /**
     * If the string starts and ends with [] {} then try parse as JSON and return the parsed content or return null
     * if it does not appear to be JSON
     * @method tryParseJson
     * @for Core
     * @static
     * @param {String} text
     * @return {Object}
     */
    function tryParseJson(text: string): any;
    /**
     * Given values (n, "person") will return either "1 person" or "2 people" depending on if a plural
     * is required using the String.pluralize() function from sugarjs
     * @method maybePlural
     * @for Core
     * @static
     * @param {Number} count
     * @param {String} word
     * @return {String}
     */
    function maybePlural(count: Number, word: string): string;
    /**
     * given a JMX ObjectName of the form <code>domain:key=value,another=something</code> then return the object
     * <code>{key: "value", another: "something"}</code>
     * @method objectNameProperties
     * @for Core
     * @static
     * @param {String} name
     * @return {Object}
     */
    function objectNameProperties(objectName: string): {};
    /**
     * Removes dodgy characters from a value such as '/' or '.' so that it can be used as a DOM ID value
     * and used in jQuery / CSS selectors
     * @method toSafeDomID
     * @for Core
     * @static
     * @param {String} text
     * @return {String}
     */
    function toSafeDomID(text: string): string;
    /**
     * Invokes the given function on each leaf node in the array of folders
     * @method forEachLeafFolder
     * @for Core
     * @static
     * @param {Array[Folder]} folders
     * @param {Function} fn
     */
    function forEachLeafFolder(folders: any, fn: any): void;
    function extractHashURL(url: string): string;
    /**
     * Breaks a URL up into a nice object
     * @method parseUrl
     * @for Core
     * @static
     * @param url
     * @returns object
     */
    function parseUrl(url: string): any;
    function getDocHeight(): number;
    /**
     * If a URL is external to the current web application, then
     * replace the URL with the proxy servlet URL
     * @method useProxyIfExternal
     * @for Core
     * @static
     * @param {String} connectUrl
     * @return {String}
     */
    function useProxyIfExternal(connectUrl: any): any;
    /**
     * Extracts the url of the target, eg usually http://localhost:port, but if we use fabric to proxy to another host,
     * then we return the url that we proxied too (eg the real target)
     *
     * @param {ng.ILocationService} $location
     * @param {String} scheme to force use a specific scheme, otherwise the scheme from location is used
     * @param {Number} port to force use a specific port number, otherwise the port from location is used
     */
    function extractTargetUrl($location: any, scheme: any, port: any): string;
    /**
     * Returns true if the $location is from the hawtio proxy
     */
    function isProxyUrl($location: ng.ILocationService): boolean;
    /**
     * handy do nothing converter for the below function
     **/
    function doNothing(value: any): any;
    const bindModelToSearchParam: typeof ControllerHelpers.bindModelToSearchParam;
    const reloadWhenParametersChange: typeof ControllerHelpers.reloadWhenParametersChange;
    /**
     * Returns a new function which ensures that the delegate function is only invoked at most once
     * within the given number of millseconds
     * @method throttled
     * @for Core
     * @static
     * @param {Function} fn the function to be invoked at most once within the given number of millis
     * @param {Number} millis the time window during which this function should only be called at most once
     * @return {Object}
     */
    function throttled(fn: any, millis: number): () => any;
    /**
     * Attempts to parse the given JSON text and returns the JSON object structure or null.
     *Bad JSON is logged at info level.
     *
     * @param text a JSON formatted string
     * @param message description of the thing being parsed logged if its invalid
     */
    function parseJsonText(text: string, message?: string): any;
    /**
     * Returns the humanized markup of the given value
     */
    function humanizeValueHtml(value: any): string;
    /**
     * Gets a query value from the given url
     *
     * @param url  url
     * @param parameterName the uri parameter value to get
     * @returns {*}
     */
    function getQueryParameterValue(url: any, parameterName: any): string;
    /**
     * Takes a value in ms and returns a human readable
     * duration
     * @param value
     */
    function humanizeMilliseconds(value: number): String;
    function getRegexs(): any;
    function removeRegex(name: any): void;
    function writeRegexs(regexs: any): void;
    function maskPassword(value: any): any;
    /**
     * Match the given filter against the text, ignoring any case.
     * <p/>
     * This operation will regard as a match if either filter or text is null/undefined.
     * As its used for filtering out, unmatched.
     * <p/>
     *
     * @param text   the text
     * @param filter the filter
     * @return true if matched, false if not.
     */
    function matchFilterIgnoreCase(text: any, filter: any): any;
}
declare var humanizeDuration: any;
declare var humandate: any;
declare namespace CoreFilters {
}
declare namespace FilterHelpers {
    const log: Logging.Logger;
    function search(object: any, filter: string, maxDepth?: number, and?: boolean): boolean;
    /**
     * Tests if an object contains the text in "filter".  The function
     * only checks the values in an object and ignores keys altogether,
     * can also work with strings/numbers/arrays
     * @param object
     * @param filter
     * @returns {boolean}
     */
    function searchObject(object: any, filter: string, maxDepth?: number, depth?: number): boolean;
}
declare namespace Core {
    /**
     * Operation arguments are stored in a map of argument name -> type
     */
    interface JMXOperationArgument {
        name: string;
        desc: string;
        type: string;
    }
    /**
     * Schema for a JMX operation object
     */
    interface JMXOperation {
        args: Array<JMXOperationArgument>;
        desc: string;
        ret: string;
        canInvoke?: boolean;
    }
    /**
     * JMX operation object that's a map of the operation name to the operation schema
     */
    interface JMXOperations {
        [methodName: string]: JMXOperation;
    }
    /**
     * JMX attribute object that contains the type, description and if it's read/write or not
     */
    interface JMXAttribute {
        desc: string;
        rw: boolean;
        type: string;
        canInvoke?: boolean;
    }
    /**
     * JMX mbean attributes, attribute name is the key
     */
    interface JMXAttributes {
        [attributeName: string]: JMXAttribute;
    }
    /**
     * JMX mbean object that contains the operations/attributes
     */
    interface JMXMBean {
        op: JMXOperations;
        attr: JMXAttributes;
        desc: string;
        canInvoke?: boolean;
    }
    /**
     * Individual JMX domain, mbean names are stored as keys
     */
    interface JMXDomain {
        [mbeanName: string]: JMXMBean;
    }
    /**
     * The top level object returned from a 'list' operation
     */
    interface JMXDomains {
        [domainName: string]: JMXDomain;
    }
    function operationToString(name: string, args: Array<JMXOperationArgument>): string;
}
declare namespace Log {
    function formatStackTrace(exception: any): string;
    function formatStackLine(line: string): string;
}
/**
 * Module that provides functions related to working with javascript objects
 */
declare namespace ObjectHelpers {
    /**
     * Convert an array of 'things' to an object, using 'index' as the attribute name for that value
     * @param arr
     * @param index
     * @param decorator
     */
    function toMap(arr: Array<any>, index: string, decorator?: (any: any) => void): any;
}
declare namespace PluginHelpers {
    interface PluginModule {
        pluginName: string;
        log: Logging.Logger;
        _module: ng.IModule;
        controller?: (name: string, inlineAnnotatedConstructor: any[]) => any;
    }
    function createControllerFunction(_module: ng.IModule, pluginName: string): (name: string, inlineAnnotatedConstructor: any[]) => angular.IModule;
    function createRoutingFunction(templateUrl: string): (templateName: string, reloadOnSearch?: boolean) => {
        templateUrl: string;
        reloadOnSearch: boolean;
    };
}
declare namespace Core {
    /**
    * Parsers the given value as JSON if it is define
    */
    function parsePreferencesJson(value: any, key: any): any;
    function initPreferenceScope($scope: any, localStorage: any, defaults: any): void;
    /**
     * Returns true if there is no validFn defined or if its defined
     * then the function returns true.
     *
     * @method isValidFunction
     * @for Perspective
     * @param {Core.Workspace} workspace
     * @param {Function} validFn
     * @param {string} perspectiveId
     * @return {boolean}
     */
    function isValidFunction(workspace: any, validFn: any, perspectiveId: any): boolean;
}
declare namespace SelectionHelpers {
    function selectNone(group: any[]): void;
    function selectAll(group: any[], filter?: (any: any) => boolean): void;
    function toggleSelection(item: any): void;
    function selectOne(group: any[], item: any): void;
    function sync(selections: any[], group: any[], index: string): any[];
    function select(group: any[], item: any, $event: any): void;
    function isSelected(item: any, yes?: string, no?: string): any;
    function clearGroup(group: any): void;
    function toggleSelectionFromGroup(group: any[], item: any, search?: (item: any) => boolean): void;
    function isInGroup(group: any[], item: any, yes?: string, no?: string, search?: (item: any) => boolean): any;
    function filterByGroup(group: any, item: any, yes?: string, no?: string, search?: (item: any) => boolean): any;
    function syncGroupSelection(group: any, collection: any, attribute?: string): void;
    function decorate($scope: any): void;
}
declare namespace StorageHelpers {
    interface BindModelToLocalStorageOptions {
        $scope: any;
        $location: ng.ILocationService;
        localStorage: WindowLocalStorage;
        modelName: string;
        paramName: string;
        initialValue?: any;
        to?: (value: any) => any;
        from?: (value: any) => any;
        onChange?: (value: any) => void;
    }
    function bindModelToLocalStorage(options: BindModelToLocalStorageOptions): void;
}
declare namespace UI {
    var scrollBarWidth: number;
    function findParentWith($scope: any, attribute: any): any;
    function getIfSet(attribute: any, $attr: any, def: any): any;
    function observe($scope: any, $attrs: any, key: any, defValue: any, callbackFunc?: any): void;
    function getScrollbarWidth(): number;
}
