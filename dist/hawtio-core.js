var Core;
(function (Core) {
    var DummyAuthService = /** @class */ (function () {
        function DummyAuthService() {
        }
        DummyAuthService.prototype.logout = function () {
            // do nothing
        };
        return DummyAuthService;
    }());
    Core.DummyAuthService = DummyAuthService;
})(Core || (Core = {}));
/// <reference path="auth.service.ts"/>
var Core;
(function (Core) {
    Core.authModule = angular
        .module('hawtio-auth', [])
        .service('authService', Core.DummyAuthService)
        .name;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var HumanizeService = /** @class */ (function () {
        function HumanizeService() {
        }
        HumanizeService.prototype.toUpperCase = function (str) {
            return _.upperCase(str);
        };
        HumanizeService.prototype.toLowerCase = function (str) {
            return _.lowerCase(str);
        };
        HumanizeService.prototype.toSentenceCase = function (str) {
            return _.capitalize(_.lowerCase(str));
        };
        HumanizeService.prototype.toTitleCase = function (str) {
            return _.startCase(_.lowerCase(str));
        };
        return HumanizeService;
    }());
    Core.HumanizeService = HumanizeService;
})(Core || (Core = {}));
/// <reference path="humanize/humanize.service.ts"/>
var Core;
(function (Core) {
    Core.commonModule = angular
        .module('hawtio-common', [])
        .service('humanizeService', Core.HumanizeService)
        .name;
})(Core || (Core = {}));
/// <reference path="config.ts"/>
var Core;
(function (Core) {
    var ConfigManager = /** @class */ (function () {
        function ConfigManager(config, $routeProvider) {
            this.config = config;
            this.$routeProvider = $routeProvider;
        }
        ConfigManager.prototype.getBrandingValue = function (key) {
            if (this.config && this.config.branding && this.config.branding[key]) {
                return this.config.branding[key];
            }
            else {
                return '';
            }
        };
        ConfigManager.prototype.isRouteEnabled = function (path) {
            return !this.config || !this.config.disabledRoutes || this.config.disabledRoutes.indexOf(path) === -1;
        };
        ConfigManager.prototype.addRoute = function (path, route) {
            if (this.isRouteEnabled(path)) {
                this.$routeProvider.when(path, route);
            }
            return this;
        };
        return ConfigManager;
    }());
    Core.ConfigManager = ConfigManager;
})(Core || (Core = {}));
/// <reference path="../config-manager.ts"/>
var Core;
(function (Core) {
    var BrandingImageController = /** @class */ (function () {
        BrandingImageController.$inject = ["configManager"];
        function BrandingImageController(configManager) {
            'ngInject';
            this.configManager = configManager;
        }
        BrandingImageController.prototype.$onInit = function () {
            this.srcValue = this.configManager.getBrandingValue(this.src);
            this.altValue = this.configManager.getBrandingValue(this.alt);
        };
        return BrandingImageController;
    }());
    Core.BrandingImageController = BrandingImageController;
    Core.brandingImageComponent = {
        bindings: {
            class: '@',
            src: '@',
            alt: '@'
        },
        template: '<img class="{{$ctrl.class}}" src="{{$ctrl.srcValue}}" alt="{{$ctrl.altValue}}"/>',
        controller: BrandingImageController
    };
})(Core || (Core = {}));
/// <reference path="../config-manager.ts"/>
var Core;
(function (Core) {
    var BrandingTextController = /** @class */ (function () {
        BrandingTextController.$inject = ["configManager"];
        function BrandingTextController(configManager) {
            'ngInject';
            this.configManager = configManager;
        }
        BrandingTextController.prototype.$onInit = function () {
            this.value = this.configManager.getBrandingValue(this.key);
        };
        return BrandingTextController;
    }());
    Core.BrandingTextController = BrandingTextController;
    Core.brandingTextComponent = {
        bindings: {
            key: '@'
        },
        template: '{{$ctrl.value}}',
        controller: BrandingTextController
    };
})(Core || (Core = {}));
/// <reference path="branding/branding-image.component.ts"/>
/// <reference path="branding/branding-text.component.ts"/>
/// <reference path="config.ts"/>
/// <reference path="config-manager.ts"/>
var Core;
(function (Core) {
    initConfigManager.$inject = ["$provide", "$routeProvider"];
    Core.configModule = angular
        .module('hawtio-config', [])
        .config(initConfigManager)
        .component('hawtioBrandingImage', Core.brandingImageComponent)
        .component('hawtioBrandingText', Core.brandingTextComponent)
        .name;
    function initConfigManager($provide, $routeProvider) {
        'ngInject';
        var config = window['hawtconfig'];
        var configManager = new Core.ConfigManager(config, $routeProvider);
        $provide.constant('configManager', configManager);
        delete window['hawtconfig'];
    }
})(Core || (Core = {}));
var Core;
(function (Core) {
    function configLoader(next) {
        Core.log.info('Loading hawtconfig.json...');
        $.getJSON('hawtconfig.json')
            .done(function (config) {
            window['hawtconfig'] = config;
            Core.log.info('hawtconfig.json loaded');
        })
            .fail(function (jqxhr, textStatus, errorThrown) {
            Core.log.error("Error fetching 'hawtconfig.json'. Status: '" + textStatus + "'. Error: '" + errorThrown + "'");
        })
            .always(function () {
            next();
        });
    }
    Core.configLoader = configLoader;
})(Core || (Core = {}));
var Bootstrap;
(function (Bootstrap) {
    // hawtio log initialization
    // globals Logger window console document localStorage $ angular jQuery navigator Jolokia
    Logger.setLevel(Logger.INFO);
    Logger.storagePrefix = 'hawtio';
    Logger.oldGet = Logger.get;
    Logger.loggers = {};
    Logger.get = function (name) {
        var answer = Logger.oldGet(name);
        Logger.loggers[name] = answer;
        return answer;
    };
    // we'll default to 100 statements I guess...
    window['LogBuffer'] = 100;
    if ('localStorage' in window) {
        if (!('logLevel' in window.localStorage)) {
            window.localStorage['logLevel'] = JSON.stringify(Logger.INFO);
        }
        var logLevel = Logger.DEBUG;
        try {
            logLevel = JSON.parse(window.localStorage['logLevel']);
        }
        catch (e) {
            console.error("Failed to parse log level setting: ", e);
        }
        Logger.setLevel(logLevel);
        if ('showLog' in window.localStorage) {
            var showLog = window.localStorage['showLog'];
            if (showLog === 'true') {
                var container = document.getElementById("log-panel");
                if (container) {
                    container.setAttribute("style", "bottom: 50%;");
                }
            }
        }
        if ('logBuffer' in window.localStorage) {
            var logBuffer = window.localStorage['logBuffer'];
            window['LogBuffer'] = parseInt(logBuffer, 10);
        }
        else {
            window.localStorage['logBuffer'] = window['LogBuffer'];
        }
        if ('childLoggers' in window.localStorage) {
            try {
                var childLoggers = JSON.parse(localStorage['childLoggers']);
                childLoggers.forEach(function (childLogger) {
                    Logger.get(childLogger.name).setLevel(childLogger.filterLevel);
                });
            }
            catch (e) {
            }
        }
    }
    var consoleLogger = null;
    if ('console' in window) {
        window['JSConsole'] = window.console;
        consoleLogger = function (messages, context) {
            var MyConsole = window['JSConsole'];
            var hdlr = MyConsole.log;
            // Prepend the logger's name to the log message for easy identification.
            if (context.name) {
                messages[0] = "[" + context.name + "] " + messages[0];
            }
            // Delegate through to custom warn/error loggers if present on the console.
            if (context.level === Logger.WARN && 'warn' in MyConsole) {
                hdlr = MyConsole.warn;
            }
            else if (context.level === Logger.ERROR && 'error' in MyConsole) {
                hdlr = MyConsole.error;
            }
            else if (context.level === Logger.INFO && 'info' in MyConsole) {
                hdlr = MyConsole.info;
            }
            if (hdlr && hdlr.apply) {
                try {
                    hdlr.apply(MyConsole, messages);
                }
                catch (e) {
                    MyConsole.log(messages);
                }
            }
        };
    }
    // keep these hidden in the Logger object
    Logger.getType = function (obj) { return _.toString(obj).slice(8, -1); };
    Logger.isError = function (obj) { return obj && Logger.getType(obj) === 'Error'; };
    Logger.isArray = function (obj) { return obj && Logger.getType(obj) === 'Array'; };
    Logger.isObject = function (obj) { return obj && Logger.getType(obj) === 'Object'; };
    Logger.isString = function (obj) { return obj && Logger.getType(obj) === 'String'; };
    window['logInterceptors'] = [];
    Logger.formatStackTraceString = function (stack) {
        var lines = stack.split("\n");
        if (lines.length > 100) {
            // too many lines, let's snip the middle so the browser doesn't bail
            var start = 20;
            var amount = lines.length - start * 2;
            lines.splice(start, amount, '>>> snipped ' + amount + ' frames <<<');
        }
        var stackTrace = "<div class=\"log-stack-trace\">\n";
        for (var j = 0; j < lines.length; j++) {
            var line = lines[j];
            if (line.trim().length === 0) {
                continue;
            }
            stackTrace = stackTrace + "<p>" + line + "</p>\n";
        }
        stackTrace = stackTrace + "</div>\n";
        return stackTrace;
    };
    Logger.setHandler(function (messages, context) {
        var node = undefined;
        var panel = undefined;
        var container = document.getElementById("hawtio-log-panel");
        if (container) {
            panel = document.getElementById("hawtio-log-panel-statements");
            node = document.createElement("li");
        }
        var text = "";
        var postLog = [];
        // try and catch errors logged via console.error(e.toString) and reformat
        if (context['level'].name === 'ERROR' && messages.length === 1) {
            if (Logger.isString(messages[0])) {
                var message = messages[0];
                var messageSplit = message.split(/\n/);
                if (messageSplit.length > 1) {
                    // we may have more cases that require normalizing, so a more flexible solution
                    // may be needed
                    var lookFor = "Error: Jolokia-Error: ";
                    if (messageSplit[0].search(lookFor) === 0) {
                        var msg = messageSplit[0].slice(lookFor.length);
                        window['JSConsole'].info("msg: ", msg);
                        try {
                            var errorObject = JSON.parse(msg);
                            var error = new Error();
                            error.message = errorObject['error'];
                            error.stack = errorObject['stacktrace'].replace("\\t", "&nbsp;&nbsp").replace("\\n", "\n");
                            messages = [error];
                        }
                        catch (e) {
                            // we'll just bail and let it get logged as a string...
                        }
                    }
                    else {
                        var error = new Error();
                        error.message = messageSplit[0];
                        error.stack = message;
                        messages = [error];
                    }
                }
            }
        }
        var scroll = false;
        if (node) {
            var _loop_1 = function (i) {
                var message = messages[i];
                if (Logger.isArray(message) || Logger.isObject(message)) {
                    var obj = "";
                    try {
                        obj = '<pre data-language="javascript">' + JSON.stringify(message, null, 2) + '</pre>';
                    }
                    catch (error) {
                        obj = message + " (failed to convert) ";
                        // silently ignore, could be a circular object...
                    }
                    text = text + obj;
                }
                else if (Logger.isError(message)) {
                    if ('message' in message) {
                        text = text + message['message'];
                    }
                    if ('stack' in message) {
                        postLog.push(function () {
                            var stackTrace = Logger.formatStackTraceString(message['stack']);
                            var logger = context.name ? Logger.get(context.name) : Logger;
                            logger.info("Stack trace:", stackTrace);
                        });
                    }
                }
                else {
                    text = text + message;
                }
            };
            for (var i = 0; i < messages.length; i++) {
                _loop_1(i);
            }
            if (context.name) {
                text = "[<span class=\"green\">" + context.name + "</span>] " + text;
            }
            node.innerHTML = text;
            node.className = context.level.name;
            if (container) {
                if (container.scrollHeight === 0) {
                    scroll = true;
                }
                if (panel.scrollTop > (panel.scrollHeight - container.scrollHeight - 200)) {
                    scroll = true;
                }
            }
        }
        // on add
        if (panel && node) {
            panel.appendChild(node);
            if (panel.childNodes.length > parseInt(window['LogBuffer'])) {
                panel.removeChild(panel.firstChild);
            }
            if (scroll) {
                panel.scrollTop = panel.scrollHeight;
            }
        }
        if (consoleLogger) {
            consoleLogger(messages, context);
        }
        var interceptors = window['logInterceptors'];
        for (var i = 0; i < interceptors.length; i++) {
            interceptors[i](context.level.name, text);
        }
        postLog.forEach(function (func) { return func(); });
    });
})(Bootstrap || (Bootstrap = {}));
var Core;
(function (Core) {
    /*
    * Plugin loader and discovery mechanism for hawtio
    */
    var PluginLoader = /** @class */ (function () {
        function PluginLoader() {
            var _this = this;
            this.bootstrapEl = document.documentElement;
            this.loaderCallback = null;
            /**
             * List of URLs that the plugin loader will try and discover
             * plugins from
             */
            this.urls = [];
            /**
             * Holds all of the angular modules that need to be bootstrapped
             */
            this.modules = [];
            /**
             * Tasks to be run before bootstrapping, tasks can be async.
             * Supply a function that takes the next task to be
             * executed as an argument and be sure to call the passed
             * in function.
             */
            this.tasks = [];
            this.runs = 0;
            this.executedTasks = [];
            this.deferredTasks = [];
            this.bootstrapTask = {
                name: 'HawtioBootstrap',
                depends: '*',
                task: function (next) {
                    if (_this.deferredTasks.length > 0) {
                        Core.log.info("Tasks yet to run:");
                        _this.listTasks(_this.deferredTasks);
                        _this.runs = _this.runs + 1;
                        Core.log.info("Task list restarted:", _this.runs, "times");
                        if (_this.runs === 5) {
                            Core.log.info("Orphaned tasks:");
                            _this.listTasks(_this.deferredTasks);
                            _this.deferredTasks.length = 0;
                        }
                        else {
                            _this.deferredTasks.push(_this.bootstrapTask);
                        }
                    }
                    Core.log.debug("Executed tasks:", _this.executedTasks);
                    next();
                }
            };
            this.setLoaderCallback({
                scriptLoaderCallback: function (self, total, remaining) {
                    Core.log.debug("Total scripts:", total, "Remaining:", remaining);
                },
                urlLoaderCallback: function (self, total, remaining) {
                    Core.log.debug("Total URLs:", total, "Remaining:", remaining);
                }
            });
        }
        /**
         * Set the HTML element that the plugin loader will pass to angular.bootstrap
         */
        PluginLoader.prototype.setBootstrapElement = function (el) {
            Core.log.debug("Setting bootstrap element to:", el);
            this.bootstrapEl = el;
            return this;
        };
        /**
         * Get the HTML element used for angular.bootstrap
         */
        PluginLoader.prototype.getBootstrapElement = function () {
            return this.bootstrapEl;
        };
        /**
         * Register a function to be executed after scripts are loaded but
         * before the app is bootstrapped.
         *
         * 'task' can either be a simple function or a PreBootstrapTask object
         */
        PluginLoader.prototype.registerPreBootstrapTask = function (task, front) {
            var taskToAdd;
            if (angular.isFunction(task)) {
                Core.log.debug("Adding legacy task");
                taskToAdd = {
                    task: task
                };
            }
            else {
                taskToAdd = task;
            }
            if (!taskToAdd.name) {
                taskToAdd.name = 'unnamed-task-' + (this.tasks.length + 1);
            }
            if (taskToAdd.depends && !_.isArray(taskToAdd.depends) && taskToAdd.depends !== '*') {
                taskToAdd.depends = [taskToAdd.depends];
            }
            if (!front) {
                this.tasks.push(taskToAdd);
            }
            else {
                this.tasks.unshift(taskToAdd);
            }
            return this;
        };
        /**
         * Add an angular module to the list of modules to bootstrap
         */
        PluginLoader.prototype.addModule = function (module) {
            Core.log.debug("Adding module:", module);
            this.modules.push(module);
            return this;
        };
        ;
        /**
         * Add a URL for discovering plugins.
         */
        PluginLoader.prototype.addUrl = function (url) {
            Core.log.debug("Adding URL:", url);
            this.urls.push(url);
            return this;
        };
        ;
        /**
         * Return the current list of configured modules
         */
        PluginLoader.prototype.getModules = function () {
            return this.modules;
        };
        /**
         * Set a callback to be notified as URLs are checked and plugin
         * scripts are downloaded
         */
        PluginLoader.prototype.setLoaderCallback = function (callback) {
            this.loaderCallback = callback;
            return this;
        };
        /**
         * Downloads plugins at any configured URLs and bootstraps the app
         */
        PluginLoader.prototype.loadPlugins = function (callback) {
            var _this = this;
            var plugins = {};
            var urlsToLoad = this.urls.length;
            var totalUrls = urlsToLoad;
            if (urlsToLoad === 0) {
                this.loadScripts(plugins, callback);
                return;
            }
            var urlLoaded = function () {
                urlsToLoad = urlsToLoad - 1;
                if (_this.loaderCallback) {
                    _this.loaderCallback.urlLoaderCallback(_this.loaderCallback, totalUrls, urlsToLoad + 1);
                }
                if (urlsToLoad === 0) {
                    _this.loadScripts(plugins, callback);
                }
            };
            var regex = new RegExp(/^jolokia:/);
            this.urls.forEach(function (url, index) {
                if (regex.test(url)) {
                    var parts = url.split(':');
                    parts = parts.reverse();
                    parts.pop();
                    url = parts.pop();
                    var attribute = parts.reverse().join(':');
                    var jolokia = new Jolokia(url);
                    try {
                        var data = jolokia.getAttribute(attribute, null);
                        $.extend(plugins, data);
                    }
                    catch (Exception) {
                        // ignore
                    }
                    urlLoaded();
                }
                else {
                    Core.log.debug("Trying url:", url);
                    $.get(url, function (data) {
                        if (angular.isString(data)) {
                            try {
                                data = angular.fromJson(data);
                            }
                            catch (error) {
                                // ignore this source of plugins
                                return;
                            }
                        }
                        $.extend(plugins, data);
                    }).always(function () { return urlLoaded(); });
                }
            });
        };
        PluginLoader.prototype.loadScripts = function (plugins, callback) {
            var _this = this;
            // keep track of when scripts are loaded so we can execute the callback
            var loaded = 0;
            _.forOwn(plugins, function (data, key) {
                loaded = loaded + data.Scripts.length;
            });
            var totalScripts = loaded;
            var scriptLoaded = function () {
                $.ajaxSetup({ async: true });
                loaded = loaded - 1;
                if (_this.loaderCallback) {
                    _this.loaderCallback.scriptLoaderCallback(_this.loaderCallback, totalScripts, loaded + 1);
                }
                if (loaded === 0) {
                    _this.bootstrap(callback);
                }
            };
            if (loaded > 0) {
                _.forOwn(plugins, function (data, key) {
                    data.Scripts.forEach(function (script) {
                        var scriptName = data.Context + "/" + script;
                        Core.log.debug("Fetching script:", scriptName);
                        $.ajaxSetup({ async: false });
                        $.getScript(scriptName)
                            .done(function (textStatus) {
                            Core.log.debug("Loaded script:", scriptName);
                        })
                            .fail(function (jqxhr, settings, exception) {
                            Core.log.info("Failed loading script: \"", exception.message, "\" (<a href=\"", scriptName, ":", exception.lineNumber, "\">", scriptName, ":", exception.lineNumber, "</a>)");
                        })
                            .always(scriptLoaded);
                    });
                });
            }
            else {
                // no scripts to load, so just do the callback
                $.ajaxSetup({ async: true });
                this.bootstrap(callback);
            }
        };
        ;
        PluginLoader.prototype.bootstrap = function (callback) {
            var _this = this;
            this.registerPreBootstrapTask(this.bootstrapTask);
            setTimeout(function () { return _this.executeTasks(callback); }, 1);
        };
        PluginLoader.prototype.executeTasks = function (callback) {
            var _this = this;
            var taskObject = null;
            var tmp = [];
            // if we've executed all of the tasks, let's drain any deferred tasks
            // into the regular task queue
            if (this.tasks.length === 0) {
                taskObject = this.deferredTasks.shift();
            }
            // first check and see what tasks have executed and see if we can pull a task
            // from the deferred queue
            while (!taskObject && this.deferredTasks.length > 0) {
                var task = this.deferredTasks.shift();
                if (task.depends === '*') {
                    if (this.tasks.length > 0) {
                        tmp.push(task);
                    }
                    else {
                        taskObject = task;
                    }
                }
                else {
                    var intersect = this.intersection(this.executedTasks, task.depends);
                    if (intersect.length === task.depends.length) {
                        taskObject = task;
                    }
                    else {
                        tmp.push(task);
                    }
                }
            }
            if (tmp.length > 0) {
                tmp.forEach(function (task) { return _this.deferredTasks.push(task); });
            }
            // no deferred tasks to execute, let's get a new task
            if (!taskObject) {
                taskObject = this.tasks.shift();
            }
            // check if task has dependencies
            if (taskObject && taskObject.depends && this.tasks.length > 0) {
                Core.log.debug("Task '" + taskObject.name + "' has dependencies:", taskObject.depends);
                if (taskObject.depends === '*') {
                    if (this.tasks.length > 0) {
                        Core.log.debug("Task '" + taskObject.name + "' wants to run after all other tasks, deferring");
                        this.deferredTasks.push(taskObject);
                        this.executeTasks(callback);
                        return;
                    }
                }
                else {
                    var intersect = this.intersection(this.executedTasks, taskObject.depends);
                    if (intersect.length != taskObject.depends.length) {
                        Core.log.debug("Deferring task: '" + taskObject.name + "'");
                        this.deferredTasks.push(taskObject);
                        this.executeTasks(callback);
                        return;
                    }
                }
            }
            if (taskObject) {
                Core.log.debug("Executing task: '" + taskObject.name + "'");
                var called = false;
                var next_1 = function () {
                    if (next_1['notFired']) {
                        next_1['notFired'] = false;
                        _this.executedTasks.push(taskObject.name);
                        setTimeout(function () { return _this.executeTasks(callback); }, 1);
                    }
                };
                next_1['notFired'] = true;
                taskObject.task(next_1);
            }
            else {
                Core.log.debug("All tasks executed");
                setTimeout(callback, 1);
            }
        };
        PluginLoader.prototype.listTasks = function (tasks) {
            tasks.forEach(function (task) {
                return Core.log.info("  name:", task.name, "depends:", task.depends);
            });
        };
        PluginLoader.prototype.intersection = function (search, needle) {
            if (!Array.isArray(needle)) {
                needle = [needle];
            }
            var answer = [];
            needle.forEach(function (n) {
                search.forEach(function (s) {
                    if (n === s) {
                        answer.push(s);
                    }
                });
            });
            return answer;
        };
        /**
         * Dumps the current list of configured modules and URLs to the console
         */
        PluginLoader.prototype.debug = function () {
            Core.log.debug("urls and modules");
            Core.log.debug(this.urls);
            Core.log.debug(this.modules);
        };
        ;
        return PluginLoader;
    }());
    Core.PluginLoader = PluginLoader;
})(Core || (Core = {}));
/// <reference path="logging-init.ts"/>
/// <reference path="plugin-loader.ts"/>
/*
 * Plugin loader and discovery mechanism for hawtio
 */
var hawtioPluginLoader = new Core.PluginLoader();
// Hawtio core plugin responsible for bootstrapping a hawtio app
var HawtioCore = (function () {
    'use strict';
    function HawtioCoreClass() {
    }
    /**
     * The app's injector, set once bootstrap is completed
     */
    Object.defineProperty(HawtioCoreClass.prototype, "injector", {
        get: function () {
            if (HawtioCore.UpgradeAdapter) {
                return HawtioCore.UpgradeAdapter.ng1Injector;
            }
            return HawtioCore._injector;
        },
        enumerable: true,
        configurable: true
    });
    var HawtioCore = new HawtioCoreClass();
    /**
     * This plugin's name and angular module
     */
    HawtioCore.pluginName = "hawtio-core";
    /**
     * This plugins logger instance
     */
    var log = Logger.get(HawtioCore.pluginName);
    var _module = angular
        .module(HawtioCore.pluginName, [])
        .config(["$locationProvider", function ($locationProvider) {
            $locationProvider.html5Mode(true);
        }])
        .run(['documentBase', function (documentBase) {
            log.debug("loaded");
        }]);
    var dummyLocalStorage = {
        length: 0,
        key: function (index) { return undefined; },
        getItem: function (key) { return dummyLocalStorage[key]; },
        setItem: function (key, data) { return dummyLocalStorage[key] = data; },
        removeItem: function (key) {
            var removed = dummyLocalStorage[key];
            delete dummyLocalStorage[key];
            return removed;
        },
        clear: function () { }
    };
    HawtioCore.dummyLocalStorage = dummyLocalStorage;
    HawtioCore.documentBase = function () {
        var base = $('head').find('base');
        var answer = '/';
        if (base && base.length > 0) {
            answer = base.attr('href');
        }
        else {
            log.warn("Document is missing a 'base' tag, defaulting to '/'");
        }
        return answer;
    };
    /**
     * services, mostly stubs
     */
    // localStorage service, returns a dummy impl
    // if for some reason it's not in the window
    // object
    _module.factory('localStorage', function () { return window.localStorage || dummyLocalStorage; });
    // Holds the document base so plugins can easily
    // figure out absolute URLs when needed
    _module.factory('documentBase', function () { return HawtioCore.documentBase(); });
    // Holds a mapping of plugins to layouts, plugins use 
    // this to specify a full width view, tree view or their 
    // own custom view
    _module.factory('viewRegistry', function () {
        return {};
    });
    // Placeholder service for the page title service
    _module.factory('pageTitle', function () {
        return {
            addTitleElement: function () { },
            getTitle: function () { return undefined; },
            getTitleWithSeparator: function () { return undefined; },
            getTitleExcluding: function () { return undefined; },
            getTitleArrayExcluding: function () { return undefined; }
        };
    });
    // service for the javascript object that does notifications
    _module.factory('toastr', ["$window", function ($window) {
            var answer = $window.toastr;
            if (!answer) {
                // lets avoid any NPEs
                answer = {};
                $window.toastr = answer;
            }
            return answer;
        }]);
    _module.factory('HawtioDashboard', function () {
        return {
            hasDashboard: false,
            inDashboard: false,
            getAddLink: function () { return ''; }
        };
    });
    // Placeholder user details service
    _module.factory('userDetails', function () {
        return {
            logout: function () {
                log.debug("Dummy userDetails.logout()");
            }
        };
    });
    // bootstrap the app
    $(function () {
        jQuery['uaMatch'] = function (ua) {
            ua = ua.toLowerCase();
            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];
            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        };
        // Don't clobber any existing jQuery['browser'] in case it's different
        if (!jQuery['browser']) {
            var matched = jQuery['uaMatch'](navigator.userAgent);
            var browser = {};
            if (matched.browser) {
                browser[matched.browser] = true;
                browser['version'] = matched.version;
            }
            // Chrome is Webkit, but Webkit is also Safari.
            if (browser['chrome']) {
                browser['webkit'] = true;
            }
            else if (browser['webkit']) {
                browser['safari'] = true;
            }
            jQuery['browser'] = browser;
        }
        if (window['ng'] && window['ng']['upgrade']) {
            // Create this here so that plugins can use pre-bootstrap tasks
            // to add providers
            HawtioCore.UpgradeAdapter = new ng['upgrade'].UpgradeAdapter();
        }
        hawtioPluginLoader.loadPlugins(function () {
            if (HawtioCore.injector || HawtioCore.UpgradeAdapterRef) {
                log.debug("Application already bootstrapped");
                return;
            }
            var bootstrapEl = hawtioPluginLoader.getBootstrapElement();
            log.debug("Using bootstrap element:", bootstrapEl);
            // bootstrap in hybrid mode if angular2 is detected
            if (HawtioCore.UpgradeAdapter) {
                log.debug("ngUpgrade detected, bootstrapping in Angular 1/2 hybrid mode");
                HawtioCore.UpgradeAdapterRef = HawtioCore.UpgradeAdapter.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), { strictDi: true });
                HawtioCore._injector = HawtioCore.UpgradeAdapterRef.ng1Injector;
            }
            else {
                HawtioCore._injector = angular.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), { strictDi: true });
            }
            log.debug("Bootstrapped application");
        });
    });
    return HawtioCore;
})();
var Core;
(function (Core) {
    var HawtioExtension = /** @class */ (function () {
        function HawtioExtension() {
            this._registeredExtensions = {};
        }
        HawtioExtension.prototype.add = function (extensionPointName, fn) {
            if (!this._registeredExtensions[extensionPointName]) {
                this._registeredExtensions[extensionPointName] = [];
            }
            this._registeredExtensions[extensionPointName].push(fn);
        };
        HawtioExtension.prototype.render = function (extensionPointName, element, scope) {
            var fns = this._registeredExtensions[extensionPointName];
            if (!fns) {
                return;
            }
            for (var i = 0; i < fns.length; i++) {
                var toAppend = fns[i](scope);
                if (!toAppend) {
                    return;
                }
                if (typeof toAppend == "string") {
                    toAppend = document.createTextNode(toAppend);
                }
                element.append(toAppend);
            }
        };
        return HawtioExtension;
    }());
    Core.HawtioExtension = HawtioExtension;
})(Core || (Core = {}));
/// <reference path="hawtio-extension.ts"/>
var Core;
(function (Core) {
    hawtioExtensionDirective.$inject = ["HawtioExtension"];
    function hawtioExtensionDirective(HawtioExtension) {
        'ngInject';
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                if (attrs.name) {
                    HawtioExtension.render(attrs.name, element, scope);
                }
            }
        };
    }
    Core.hawtioExtensionDirective = hawtioExtensionDirective;
})(Core || (Core = {}));
/// <reference path="hawtio-extension.ts"/>
/// <reference path="hawtio-extension.directive.ts"/>
var Core;
(function (Core) {
    Core.hawtioExtensionModule = angular
        .module('hawtio-extension-service', [])
        .service('HawtioExtension', Core.HawtioExtension)
        .directive('hawtioExtension', Core.hawtioExtensionDirective)
        .name;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var HelpTopic = /** @class */ (function () {
        function HelpTopic() {
        }
        HelpTopic.prototype.isIndexTopic = function () {
            return this.topicName === 'index';
        };
        return HelpTopic;
    }());
    Core.HelpTopic = HelpTopic;
})(Core || (Core = {}));
/// <reference path="help-topic.ts"/>
var Core;
(function (Core) {
    var HelpRegistry = /** @class */ (function () {
        HelpRegistry.$inject = ["$rootScope"];
        function HelpRegistry($rootScope) {
            'ngInject';
            this.$rootScope = $rootScope;
            this.topicNameMappings = {
                activemq: 'ActiveMQ',
                camel: 'Camel',
                jboss: 'JBoss',
                jclouds: 'jclouds',
                jmx: 'JMX',
                jvm: 'Connect',
                log: 'Logs',
                openejb: 'OpenEJB',
                osgi: 'OSGi'
            };
            this.subTopicNameMappings = {
                user: 'User Guide',
                developer: 'Developers',
                faq: 'FAQ',
                changes: 'Change Log'
            };
            this.topics = [];
        }
        HelpRegistry.prototype.addUserDoc = function (topicName, path, isValid) {
            this.addSubTopic(topicName, 'user', path, isValid);
        };
        HelpRegistry.prototype.addDevDoc = function (topicName, path, isValid) {
            this.addSubTopic(topicName, 'developer', path, isValid);
        };
        HelpRegistry.prototype.addSubTopic = function (topicName, subtopic, path, isValid) {
            this.getOrCreateTopic(topicName, subtopic, path, isValid);
        };
        HelpRegistry.prototype.getOrCreateTopic = function (topicName, subTopicName, path, isValid) {
            if (isValid === void 0) { isValid = function () { return true; }; }
            var topic = this.getTopic(topicName, subTopicName);
            if (!angular.isDefined(topic)) {
                topic = new Core.HelpTopic();
                topic.topicName = topicName;
                topic.subTopicName = subTopicName;
                topic.path = path;
                topic.isValid = isValid;
                this.topics.push(topic);
                this.$rootScope.$broadcast('hawtioNewHelpTopic');
            }
            return topic;
        };
        HelpRegistry.prototype.mapTopicName = function (name) {
            if (angular.isDefined(this.topicNameMappings[name])) {
                return this.topicNameMappings[name];
            }
            return name;
        };
        HelpRegistry.prototype.mapSubTopicName = function (name) {
            if (angular.isDefined(this.subTopicNameMappings[name])) {
                return this.subTopicNameMappings[name];
            }
            return name;
        };
        HelpRegistry.prototype.getTopics = function () {
            var answer = this.topics.filter(function (topic) { return topic.isValid(); });
            return answer;
        };
        HelpRegistry.prototype.getTopic = function (topicName, subTopicName) {
            return this.topics.filter(function (topic) {
                return topic.topicName === topicName && topic.subTopicName === subTopicName;
            })[0];
        };
        return HelpRegistry;
    }());
    Core.HelpRegistry = HelpRegistry;
})(Core || (Core = {}));
/// <reference path="help-registry.ts"/>
/// <reference path="help-topic.ts"/>
var Core;
(function (Core) {
    var HelpService = /** @class */ (function () {
        HelpService.$inject = ["$templateCache", "helpRegistry"];
        function HelpService($templateCache, helpRegistry) {
            'ngInject';
            this.$templateCache = $templateCache;
            this.helpRegistry = helpRegistry;
            marked.setOptions({
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: true,
                sanitize: false,
                smartLists: true,
                langPrefix: 'language-'
            });
        }
        HelpService.prototype.getBreadcrumbs = function () {
            var _this = this;
            return this.helpRegistry.getTopics().filter(function (topic) {
                if (topic.isIndexTopic() === true) {
                    topic.label = _this.helpRegistry.mapSubTopicName(topic.subTopicName);
                    return topic;
                }
            });
        };
        HelpService.prototype.getSections = function () {
            var _this = this;
            var sections = this.helpRegistry.getTopics().filter(function (topic) {
                if (topic.isIndexTopic() === false) {
                    topic.label = _this.helpRegistry.mapTopicName(topic.topicName);
                    return topic;
                }
            });
            return _.sortBy(sections, 'label');
        };
        HelpService.prototype.getTopics = function () {
            return this.helpRegistry.getTopics();
        };
        HelpService.prototype.getTopic = function (topicName, subTopicName) {
            return this.helpRegistry.getTopic(topicName, subTopicName);
        };
        HelpService.prototype.getHelpContent = function (topic) {
            if (!angular.isDefined(topic)) {
                return "Unable to display help data for " + topic.path;
            }
            else {
                var template = this.$templateCache.get(topic.path);
                if (template) {
                    return marked(template);
                }
                else {
                    return "Unable to display help data for " + topic.path;
                }
            }
        };
        return HelpService;
    }());
    Core.HelpService = HelpService;
})(Core || (Core = {}));
/// <reference path="help.service.ts"/>
var Core;
(function (Core) {
    var HelpController = /** @class */ (function () {
        HelpController.$inject = ["$rootScope", "helpService", "$sce"];
        function HelpController($rootScope, helpService, $sce) {
            'ngInject';
            this.helpService = helpService;
            this.$sce = $sce;
            $rootScope.$on('hawtioNewHelpTopic', function () {
                this.breadcrumbs = this.helpService.getBreadcrumbs();
                this.sections = this.helpService.getSections();
            });
        }
        HelpController.prototype.$onInit = function () {
            this.breadcrumbs = this.helpService.getBreadcrumbs();
            this.sections = this.helpService.getSections();
            this.onSelectBreadcrumb(this.helpService.getTopic('index', 'user'));
        };
        HelpController.prototype.onSelectTopic = function (topic) {
            this.selectedTopic = topic;
            this.html = this.$sce.trustAsHtml(this.helpService.getHelpContent(topic));
        };
        HelpController.prototype.onSelectBreadcrumb = function (topic) {
            this.selectedBreadcrumb = topic;
            this.selectedTopic = null;
            this.html = this.$sce.trustAsHtml(this.helpService.getHelpContent(topic));
        };
        return HelpController;
    }());
    Core.HelpController = HelpController;
    Core.helpComponent = {
        templateUrl: 'help/help.component.html',
        controller: HelpController
    };
})(Core || (Core = {}));
var Core;
(function (Core) {
    HelpConfig.$inject = ["$routeProvider", "$provide"];
    HelpRun.$inject = ["helpRegistry", "viewRegistry", "layoutFull", "$templateCache"];
    function HelpConfig($routeProvider, $provide) {
        'ngInject';
        $routeProvider.when('/help', { template: '<help></help>' });
    }
    Core.HelpConfig = HelpConfig;
    function HelpRun(helpRegistry, viewRegistry, layoutFull, $templateCache) {
        'ngInject';
        viewRegistry['help'] = layoutFull;
        helpRegistry.addUserDoc('index', 'help/help.md');
        // These docs live in the main hawtio project
        helpRegistry.addSubTopic('index', 'faq', 'plugins/help/doc/FAQ.md', function () {
            return $templateCache.get('plugins/help/doc/FAQ.md') !== undefined;
        });
        helpRegistry.addSubTopic('index', 'changes', 'plugins/help/doc/CHANGES.md', function () {
            return $templateCache.get('plugins/help/doc/CHANGES.md') !== undefined;
        });
    }
    Core.HelpRun = HelpRun;
})(Core || (Core = {}));
/// <reference path="help.component.ts"/>
/// <reference path="help.config.ts"/>
/// <reference path="help.service.ts"/>
/// <reference path="help-registry.ts"/>
var Core;
(function (Core) {
    Core.helpModule = angular
        .module('hawtio-help', [])
        .config(Core.HelpConfig)
        .run(Core.HelpRun)
        .component('help', Core.helpComponent)
        .service('helpService', Core.HelpService)
        .service('helpRegistry', Core.HelpRegistry)
        .name;
})(Core || (Core = {}));
/* global _ */
/* global angular */
/* global jQuery */
/*globals window document Logger CustomEvent URI _ $ angular hawtioPluginLoader jQuery*/
// Polyfill custom event if necessary since we kinda need it
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
(function () {
    if (typeof window['CustomEvent'] !== "function") {
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        CustomEvent.prototype = window['Event'].prototype;
        window['CustomEvent'] = CustomEvent;
    }
})();
var HawtioMainNav;
(function (HawtioMainNav) {
    welcomeController.$inject = ["$scope", "$location", "WelcomePageRegistry", "HawtioNav", "$timeout", "documentBase"];
    viewController.$inject = ["$scope", "$route", "$location", "layoutFull", "viewRegistry", "documentBase"];
    configureHtmlBase.$inject = ["HawtioNav", "$rootScope", "$route", "documentBase"];
    function trimLeading(text, prefix) {
        if (text && prefix) {
            if (_.startsWith(text, prefix) || text.indexOf(prefix) === 0) {
                return text.substring(prefix.length);
            }
        }
        return text;
    }
    HawtioMainNav.pluginName = 'hawtio-core-nav';
    var log = Logger.get(HawtioMainNav.pluginName);
    // Actions class with some pre-defined actions
    var Actions = /** @class */ (function () {
        function Actions() {
        }
        Actions.ADD = 'hawtio-main-nav-add';
        Actions.REMOVE = 'hawtio-main-nav-remove';
        Actions.CHANGED = 'hawtio-main-nav-change';
        Actions.REDRAW = 'hawtio-main-nav-redraw';
        return Actions;
    }());
    HawtioMainNav.Actions = Actions;
    var Registry = /** @class */ (function () {
        function Registry(root) {
            this.items = [];
            this.root = root;
        }
        Registry.prototype.builder = function () {
            return new NavItemBuilder();
        };
        Registry.prototype.add = function (item) {
            var _this = this;
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            var toAdd = _.union([item], items);
            this.items = _.union(this.items, toAdd);
            toAdd.forEach(function (item) {
                _this.root.dispatchEvent(new CustomEvent(Actions.ADD, {
                    detail: {
                        item: item
                    }
                }));
            });
            this.root.dispatchEvent(new CustomEvent(Actions.CHANGED, {
                detail: {
                    items: this.items
                }
            }));
            this.root.dispatchEvent(new CustomEvent(Actions.REDRAW, {
                detail: {}
            }));
        };
        Registry.prototype.remove = function (search) {
            var _this = this;
            var removed = _.remove(this.items, search);
            removed.forEach(function (item) {
                _this.root.dispatchEvent(new CustomEvent(Actions.REMOVE, {
                    detail: {
                        item: item
                    }
                }));
            });
            this.root.dispatchEvent(new CustomEvent(Actions.CHANGED, {
                detail: {
                    items: this.items
                }
            }));
            this.root.dispatchEvent(new CustomEvent(Actions.REDRAW, {
                detail: {}
            }));
            return removed;
        };
        Registry.prototype.iterate = function (iterator) {
            this.items.forEach(iterator);
        };
        Registry.prototype.selected = function () {
            var valid = _.filter(this.items, function (item) {
                if (!item['isValid']) {
                    return true;
                }
                return item['isValid']();
            });
            var answer = _.find(valid, function (item) {
                if (!item['isSelected']) {
                    return false;
                }
                return item['isSelected']();
            });
            return answer;
        };
        Registry.prototype.on = function (action, key, fn) {
            var _this = this;
            switch (action) {
                case Actions.ADD:
                    this.root.addEventListener(Actions.ADD, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event.detail.item);
                    });
                    if (this.items.length > 0) {
                        this.items.forEach(function (item) {
                            _this.root.dispatchEvent(new CustomEvent(Actions.ADD, {
                                detail: {
                                    item: item
                                }
                            }));
                        });
                    }
                    break;
                case Actions.REMOVE:
                    this.root.addEventListener(Actions.REMOVE, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event.detail.item);
                    });
                    break;
                case Actions.CHANGED:
                    this.root.addEventListener(Actions.CHANGED, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event.detail.items);
                    });
                    if (this.items.length > 0) {
                        this.root.dispatchEvent(new CustomEvent(Actions.CHANGED, {
                            detail: {
                                items: _this.items
                            }
                        }));
                    }
                    break;
                case Actions.REDRAW:
                    this.root.addEventListener(Actions.REDRAW, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event);
                    });
                    var event_1 = new CustomEvent(Actions.REDRAW, {
                        detail: {
                            text: ''
                        }
                    });
                    this.root.dispatchEvent(event_1);
                    break;
                default:
            }
        };
        return Registry;
    }());
    HawtioMainNav.Registry = Registry;
    // Factory for registry, used to create angular service
    function createRegistry(root) {
        return new Registry(root);
    }
    HawtioMainNav.createRegistry = createRegistry;
    function join() {
        var args = [];
        for (var _a = 0; _a < arguments.length; _a++) {
            args[_a] = arguments[_a];
        }
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i - 0] = arguments[_i];
        }
        var tmp = [];
        var length = paths.length - 1;
        paths.forEach(function (path, index) {
            if (!path || path === '') {
                return;
            }
            if (index !== 0 && path.charAt(0) === '/') {
                path = path.slice(1);
            }
            if (index !== length && path.charAt(path.length) === '/') {
                path = path.slice(0, path.length - 1);
            }
            if (path && path !== '') {
                tmp.push(path);
            }
        });
        var rc = tmp.join('/');
        return rc;
    }
    // Class NavItemBuilderImpl
    var NavItemBuilder = /** @class */ (function () {
        function NavItemBuilder() {
            this.self = {
                id: ''
            };
        }
        NavItemBuilder.prototype.id = function (id) {
            this.self.id = id;
            return this;
        };
        NavItemBuilder.prototype.rank = function (rank) {
            this.self.rank = rank;
            return this;
        };
        NavItemBuilder.prototype.title = function (title) {
            this.self.title = title;
            return this;
        };
        NavItemBuilder.prototype.tooltip = function (tooltip) {
            this.self.tooltip = tooltip;
            return this;
        };
        NavItemBuilder.prototype.page = function (page) {
            this.self.page = page;
            return this;
        };
        NavItemBuilder.prototype.reload = function (reload) {
            this.self.reload = reload;
            return this;
        };
        NavItemBuilder.prototype.attributes = function (attributes) {
            this.self.attributes = attributes;
            return this;
        };
        NavItemBuilder.prototype.linkAttributes = function (attributes) {
            this.self.linkAttributes = attributes;
            return this;
        };
        NavItemBuilder.prototype.context = function (context) {
            this.self.context = context;
            return this;
        };
        NavItemBuilder.prototype.href = function (href) {
            this.self.href = href;
            return this;
        };
        NavItemBuilder.prototype.click = function (click) {
            this.self.click = click;
            return this;
        };
        NavItemBuilder.prototype.isSelected = function (isSelected) {
            this.self.isSelected = isSelected;
            return this;
        };
        NavItemBuilder.prototype.isValid = function (isValid) {
            this.self.isValid = isValid;
            return this;
        };
        NavItemBuilder.prototype.show = function (show) {
            this.self.show = show;
            return this;
        };
        NavItemBuilder.prototype.template = function (template) {
            this.self.template = template;
            return this;
        };
        NavItemBuilder.prototype.defaultPage = function (defaultPage) {
            this.self.defaultPage = defaultPage;
            return this;
        };
        NavItemBuilder.prototype.tabs = function (item) {
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            this.self.tabs = _.union(this.self.tabs, [item], items);
            return this;
        };
        NavItemBuilder.prototype.subPath = function (title, path, page, rank, reload, isValid) {
            var parent = this.self;
            if (!this.self.tabs) {
                this.self.tabs = [];
            }
            var tab = {
                id: parent.id + '-' + path,
                title: function () {
                    return title;
                },
                href: function () {
                    if (parent.href) {
                        return join(parent.href(), path);
                    }
                    return path;
                }
            };
            if (!_.isUndefined(page)) {
                tab['page'] = function () {
                    return page;
                };
            }
            if (!_.isUndefined(rank)) {
                tab['rank'] = rank;
            }
            if (!_.isUndefined(reload)) {
                tab['reload'] = reload;
            }
            if (!_.isUndefined(isValid)) {
                tab['isValid'] = isValid;
            }
            this.self.tabs.push(tab);
            return this;
        };
        NavItemBuilder.prototype.build = function () {
            var answer = _.cloneDeep(this.self);
            this.self = {
                id: ''
            };
            return answer;
        };
        ;
        return NavItemBuilder;
    }());
    HawtioMainNav.NavItemBuilder = NavItemBuilder;
    // Factory functions
    function createBuilder() {
        return new NavItemBuilder();
    }
    HawtioMainNav.createBuilder = createBuilder;
    ;
    // Plugin initialization
    HawtioMainNav._module = angular.module(HawtioMainNav.pluginName, ['ngRoute']);
    HawtioMainNav._module.constant('layoutFull', 'navigation/templates/layoutFull.html');
    HawtioMainNav._module.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
            $routeProvider.otherwise({ templateUrl: 'navigation/templates/welcome.html' });
        }]);
    HawtioMainNav._module.controller('HawtioNav.WelcomeController', welcomeController);
    function welcomeController($scope, $location, WelcomePageRegistry, HawtioNav, $timeout, documentBase) {
        'ngInject';
        var backoffPeriod = 500;
        var locationChanged = false;
        $scope.$on("$locationChangeStart", function (event, next, current) {
            locationChanged = true;
        });
        function gotoNavItem(item) {
            if (item && item.href) {
                var href = trimLeading(item.href(), documentBase);
                var uri_1 = new URI(href);
                var search_1 = _.merge($location.search(), uri_1.query(true));
                log.debug("Going to item id: ", item.id, " href: ", uri_1.path(), " query: ", search_1);
                $timeout(function () {
                    $location.path(uri_1.path()).search(search_1);
                }, 10);
            }
        }
        function gotoFirstAvailableNav() {
            var candidates = [];
            HawtioNav.iterate(function (item) {
                var isValid = item['isValid'] || function () { return true; };
                var show = item.show || function () { return true; };
                if (isValid() && show()) {
                    candidates.push(item);
                }
            });
            var rankedCandidates = sortByRank(candidates);
            if (rankedCandidates.length > 0) {
                gotoNavItem(rankedCandidates[0]);
            }
            else if (!locationChanged) {
                log.debug('No default nav available, backing off for', backoffPeriod, 'ms');
                $timeout(gotoBestCandidateNav, backoffPeriod);
                backoffPeriod *= 1.25;
            }
        }
        function gotoBestCandidateNav() {
            var search = $location.search();
            if (search.tab) {
                var tab_1 = search.tab;
                var selected_1;
                HawtioNav.iterate(function (item) {
                    if (!selected_1 && item.id === tab_1) {
                        selected_1 = item;
                    }
                });
                if (selected_1) {
                    gotoNavItem(selected_1);
                    return;
                }
            }
            var candidates = [];
            HawtioNav.iterate(function (item) {
                if ('defaultPage' in item) {
                    var page = item.defaultPage;
                    if (!('rank' in page)) {
                        candidates.push(item);
                        return;
                    }
                    var index = _.findIndex(candidates, function (i) {
                        if ('rank' in i && item.rank > i.rank) {
                            return true;
                        }
                    });
                    if (index < 0) {
                        candidates.push(item);
                    }
                    else {
                        candidates.splice(index, 0, item);
                    }
                }
            });
            function welcomePageFallback() {
                if (WelcomePageRegistry.pages.length === 0) {
                    log.debug("No welcome pages, going to first available nav");
                    gotoFirstAvailableNav();
                    return;
                }
                var sortedPages = _.sortBy(WelcomePageRegistry.pages, function (page) { return page['rank']; });
                var page = _.find(sortedPages, function (page) {
                    if ('isValid' in page) {
                        return page['isValid']();
                    }
                    return true;
                });
                if (page) {
                    gotoNavItem(page);
                }
                else {
                    gotoFirstAvailableNav();
                }
            }
            function evalCandidates(candidates) {
                if (candidates.length === 0) {
                    welcomePageFallback();
                    return;
                }
                var item = candidates.pop();
                var remaining = candidates;
                log.debug("Trying candidate: ", item, " remaining: ", remaining);
                if (!item) {
                    welcomePageFallback();
                    return;
                }
                var func = item.defaultPage.isValid;
                if (func) {
                    var yes = function () {
                        gotoNavItem(item);
                    };
                    var no = function () {
                        evalCandidates(remaining);
                    };
                    try {
                        func(yes, no);
                    }
                    catch (err) {
                        log.debug("Failed to eval item: ", item.id, " error: ", err);
                        no();
                    }
                }
                else {
                    evalCandidates(remaining);
                }
            }
            evalCandidates(candidates);
        }
        $timeout(gotoBestCandidateNav, 500);
    }
    HawtioMainNav._module.controller('HawtioNav.ViewController', viewController);
    function viewController($scope, $route, $location, layoutFull, viewRegistry, documentBase) {
        'ngInject';
        findViewPartial();
        $scope.$on("$routeChangeSuccess", function (event, current, previous) {
            findViewPartial();
        });
        function searchRegistryViaQuery(query) {
            var answer = undefined;
            if (!query || _.keys(query).length === 0) {
                log.debug("No query, skipping query matching");
                return;
            }
            var keys = _.keys(viewRegistry);
            var candidates = _.filter(keys, function (key) { return key.charAt(0) === '{'; });
            candidates.forEach(function (candidate) {
                if (!answer) {
                    try {
                        var obj = angular.fromJson(candidate);
                        if (_.isObject(obj)) {
                            _.mergeWith(obj, query, function (a, b) {
                                if (a) {
                                    if (a === b) {
                                        answer = viewRegistry[candidate];
                                    }
                                    else {
                                        answer = undefined;
                                    }
                                }
                            });
                        }
                    }
                    catch (e) {
                        // ignore and move on...
                        log.debug("Unable to parse json: ", candidate);
                    }
                }
            });
            return answer;
        }
        function searchRegistry(path) {
            var answer = undefined;
            _.forIn(viewRegistry, function (value, key) {
                if (!answer) {
                    try {
                        var reg = new RegExp(key, "");
                        if (reg.exec(path)) {
                            answer = value;
                        }
                    }
                    catch (e) {
                        log.debug("Invalid RegExp " + key + " for viewRegistry value: " + value);
                    }
                }
            });
            return answer;
        }
        function findViewPartial() {
            var answer = null;
            var hash = $location.search();
            answer = searchRegistryViaQuery(hash);
            if (answer) {
                log.debug("View partial matched on query");
            }
            if (!answer) {
                var path = $location.path();
                if (path) {
                    answer = searchRegistry(path);
                    if (answer) {
                        log.debug("View partial matched on path name");
                    }
                }
            }
            if (!answer) {
                answer = layoutFull;
                log.debug("Using default view partial");
            }
            $scope.viewPartial = answer;
            log.debug("Using view partial: " + answer);
            return answer;
        }
    }
    HawtioMainNav._module.run(configureHtmlBase);
    function configureHtmlBase(HawtioNav, $rootScope, $route, documentBase) {
        'ngInject';
        HawtioNav.on(Actions.CHANGED, "$apply", function (item) {
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
        var href = documentBase;
        var applyBaseHref = function (item) {
            if (!item.preBase) {
                item.preBase = item.href;
                item.href = function () {
                    if (href) {
                        var preBase = item.preBase();
                        if (preBase && preBase.charAt(0) === '/') {
                            preBase = preBase.substr(1);
                            return href + preBase;
                        }
                    }
                    return item.preBase();
                };
            }
        };
        HawtioNav.on(Actions.ADD, "htmlBaseRewriter", function (item) {
            if (item.href) {
                applyBaseHref(item);
                _.forEach(item.tabs, applyBaseHref);
            }
        });
        HawtioNav.on(Actions.ADD, "$apply", function (item) {
            var oldClick = item.click;
            item.click = function ($event) {
                if (!($event instanceof jQuery.Event)) {
                    try {
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    }
                    catch (e) {
                        // ignore
                    }
                }
                if (oldClick) {
                    oldClick($event);
                }
            };
        });
        $route.reload();
        log.debug("loaded");
    }
    // helper function for testing nav items
    function itemIsValid(item) {
        if (!('isValid' in item)) {
            return true;
        }
        if (_.isFunction(item['isValid'])) {
            return item['isValid']();
        }
        return false;
    }
    // Construct once and share between invocations to avoid memory leaks
    var tmpLink = $('<a>');
    function addIsSelected($location, item) {
        if (!('isSelected' in item) && 'href' in item) {
            item['isSelected'] = function () {
                // item.href() might be relative, in which
                // case we should let the browser resolve
                // what the full path should be
                tmpLink.attr("href", item.href());
                var href = new URI(tmpLink[0]['href']);
                var itemPath = trimLeading(href.path(), '/');
                if (itemPath === '') {
                    // log.debug("nav item: ", item.id, " returning empty href, can't be selected");
                    return false;
                }
                var current = new URI();
                var path = trimLeading(current.path(), '/');
                var query = current.query(true);
                var mainTab = query['main-tab'];
                var subTab = query['sub-tab'];
                if (itemPath !== '' && !mainTab && !subTab) {
                    if (item.isSubTab && _.startsWith(path, itemPath)) {
                        return true;
                    }
                    if (item.tabs) {
                        var answer_1 = _.some(item.tabs, function (subTab) {
                            return subTab['isSelected']();
                        });
                        if (answer_1) {
                            return true;
                        }
                    }
                }
                var answer = false;
                if (item.isSubTab) {
                    if (!subTab) {
                        answer = _.startsWith(path, itemPath);
                    }
                    else {
                        answer = subTab === item.id;
                    }
                }
                else {
                    if (!mainTab) {
                        answer = _.startsWith(path, itemPath);
                    }
                    else {
                        answer = mainTab === item.id;
                    }
                }
                return answer;
            };
        }
    }
    function drawNavItem($templateCache, $compile, scope, element, item) {
        if (!itemIsValid(item)) {
            return;
        }
        var newScope = scope.$new();
        item.hide = function () { return item.show && !item.show(); };
        newScope.item = item;
        var template = null;
        if (_.isFunction(item.template)) {
            template = item.template();
        }
        else {
            template = $templateCache.get('navigation/templates/navItem.html');
        }
        if (item.attributes || item.linkAttributes) {
            var tmpEl = $(template);
            if (item.attributes) {
                tmpEl.attr(item.attributes);
            }
            if (item.linkAttributes) {
                tmpEl.find('a').attr(item.linkAttributes);
            }
            template = tmpEl.prop('outerHTML');
        }
        element.append($compile(template)(newScope));
    }
    function sortByRank(collection) {
        var answer = [];
        collection.forEach(function (item) {
            rankItem(item, answer);
        });
        return answer;
    }
    function rankItem(item, collection) {
        if (!('rank' in item) || collection.length === 0) {
            collection.push(item);
            return;
        }
        var index = _.findIndex(collection, function (i) {
            if ('rank' in i && item.rank > i['rank']) {
                return true;
            }
        });
        if (!('rank' in collection[0])) {
            index = 0;
        }
        if (index < 0) {
            collection.push(item);
        }
        else {
            collection.splice(index, 0, item);
        }
    }
    HawtioMainNav._module.directive('hawtioSubTabs', ['$templateCache', '$compile', function ($templateCache, $compile) {
            return {
                restrict: 'A',
                scope: {
                    item: '<'
                },
                link: function (scope, element) {
                    var rankedTabs = sortByRank(scope.item.tabs);
                    rankedTabs.forEach(function (item) {
                        drawNavItem($templateCache, $compile, scope, element, item);
                    });
                }
            };
        }]);
    HawtioMainNav._module.directive("hawtioMainNav", ["HawtioNav", "$templateCache", "$compile", "$location", "$rootScope", function (HawtioNav, $templateCache, $compile, $location, $rootScope) {
            var config = {
                nav: {},
                numKeys: 0,
                numValid: 0
            };
            var iterationFunc = function (item) {
                if (itemIsValid(item)) {
                    config.numValid = config.numValid + 1;
                }
            };
            HawtioNav.on(Actions.ADD, 'subTabEnricher', function (item) {
                if (item.tabs && item.tabs.length > 0) {
                    item.tabs.forEach(function (subItem) {
                        subItem.isSubTab = true;
                        if (!subItem.oldHref) {
                            subItem.oldHref = subItem.href;
                            subItem.href = function () {
                                var uri = new URI(subItem.oldHref());
                                if (uri.path() === "") {
                                    return "";
                                }
                                uri.search(function (search) {
                                    _.merge(search, uri.query(true));
                                    search['main-tab'] = item.id;
                                    search['sub-tab'] = subItem.id;
                                });
                                return uri.toString();
                            };
                        }
                    });
                }
            });
            HawtioNav.on(Actions.ADD, 'hrefEnricher', function (item) {
                item.isSubTab = false;
                if (item.href && !item.oldHref) {
                    item.oldHref = item.href;
                    item.href = function () {
                        var oldHref = item.oldHref();
                        if (!oldHref) {
                            log.debug("Item: ", item.id, " returning null for href()");
                            return "";
                        }
                        var uri = new URI(oldHref);
                        if (uri.path() === "") {
                            return "";
                        }
                        uri.search(function (search) {
                            if (!search['main-tab']) {
                                search['main-tab'] = item.id;
                            }
                            _.merge(search, uri.query(true));
                            if (!search['sub-tab'] && item.tabs && item.tabs.length > 0) {
                                var sorted = sortByRank(item.tabs);
                                search['sub-tab'] = sorted[0].id;
                            }
                        });
                        return uri.toString();
                    };
                }
            });
            HawtioNav.on(Actions.ADD, 'isSelectedEnricher', function (item) {
                addIsSelected($location, item);
                if (item.tabs) {
                    item.tabs.forEach(function (item) { addIsSelected($location, item); });
                }
            });
            HawtioNav.on(Actions.ADD, 'PrimaryController', function (item) {
                config.nav[item.id] = item;
            });
            HawtioNav.on(Actions.REMOVE, 'PrimaryController', function (item) {
                delete config.nav[item.id];
            });
            HawtioNav.on(Actions.CHANGED, 'PrimaryController', function (items) {
                config.numKeys = items.length;
                config.numValid = 0;
                items.forEach(iterationFunc);
            });
            return {
                restrict: 'A',
                replace: false,
                controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                        $scope.config = config;
                        $scope.$on('hawtio-nav-redraw', function () {
                            log.debug("Redrawing main nav");
                            $element.empty();
                            var rankedContexts = [];
                            // first add any contextual menus (like perspectives)
                            HawtioNav.iterate(function (item) {
                                if (!('context' in item)) {
                                    return;
                                }
                                if (!item.context) {
                                    return;
                                }
                                rankItem(item, rankedContexts);
                            });
                            rankedContexts.forEach(function (item) {
                                drawNavItem($templateCache, $compile, $scope, $element, item);
                            });
                            // then add the rest of the nav items
                            var rankedTabs = [];
                            HawtioNav.iterate(function (item) {
                                if (item.context) {
                                    return;
                                }
                                rankItem(item, rankedTabs);
                            });
                            rankedTabs.forEach(function (item) {
                                drawNavItem($templateCache, $compile, $scope, $element, item);
                            });
                        });
                    }],
                link: function (scope, element, attr) {
                    scope.$watch(_.debounce(function () {
                        var oldValid = config.numValid;
                        var oldKeys = config.numKeys;
                        config.numValid = 0;
                        config.numKeys = 0;
                        HawtioNav.iterate(iterationFunc);
                        if (config.numValid !== oldValid || config.numKeys !== oldKeys) {
                            scope.$broadcast('hawtio-nav-redraw');
                            scope.$apply();
                        }
                    }, 500, { trailing: true }));
                    scope.$broadcast('hawtio-nav-redraw');
                }
            };
        }]);
    var BuilderFactory = /** @class */ (function () {
        function BuilderFactory() {
        }
        BuilderFactory.prototype.$get = function () {
            return {};
        };
        BuilderFactory.prototype.create = function () {
            return createBuilder();
        };
        BuilderFactory.prototype.join = function () {
            var paths = [];
            for (var _a = 0; _a < arguments.length; _a++) {
                paths[_a] = arguments[_a];
            }
            return join.apply(void 0, paths);
        };
        BuilderFactory.prototype.setRoute = function ($routeProvider, tab) {
            log.debug("Setting route: ", tab.href(), " to template URL: ", tab['page']());
            var config = {
                templateUrl: tab['page']()
            };
            if (!_.isUndefined(tab['reload'])) {
                config['reloadOnSearch'] = tab['reload'];
            }
            $routeProvider.when(tab.href(), config);
        };
        BuilderFactory.prototype.configureRouting = function ($routeProvider, tab) {
            var _this = this;
            if (_.isUndefined(tab['page'])) {
                if (tab.tabs) {
                    var target = _.first(tab.tabs)['href'];
                    if (target) {
                        log.debug("Setting route: ", tab.href(), " to redirect to ", target());
                        $routeProvider.when(tab.href(), {
                            reloadOnSearch: tab['reload'],
                            redirectTo: target()
                        });
                    }
                }
            }
            else {
                this.setRoute($routeProvider, tab);
            }
            if (tab.tabs) {
                tab.tabs.forEach(function (tab) { return _this.setRoute($routeProvider, tab); });
            }
        };
        return BuilderFactory;
    }());
    HawtioMainNav.BuilderFactory = BuilderFactory;
    // provider so it's possible to get a nav builder in _module.config()
    HawtioMainNav._module.provider('HawtioNavBuilder', BuilderFactory);
    HawtioMainNav._module.factory('HawtioPerspective', [function () {
            var log = Logger.get('hawtio-dummy-perspective');
            return {
                add: function (id, perspective) {
                    log.debug("add called for id: ", id);
                },
                remove: function (id) {
                    log.debug("remove called for id: ", id);
                    return undefined;
                },
                setCurrent: function (id) {
                    log.debug("setCurrent called for id: ", id);
                },
                getCurrent: function (id) {
                    log.debug("getCurrent called for id: ", id);
                    return undefined;
                },
                getLabels: function () {
                    return [];
                }
            };
        }]);
    HawtioMainNav._module.factory('WelcomePageRegistry', [function () {
            return {
                pages: []
            };
        }]);
    HawtioMainNav._module.factory('HawtioNav', ['$window', '$rootScope', function ($window, $rootScope) {
            var registry = createRegistry(window);
            return registry;
        }]);
    HawtioMainNav._module.component('hawtioVerticalNav', {
        templateUrl: 'navigation/templates/verticalNav.html',
        controller: function () {
            this.showSecondaryNav = false;
            this.onHover = function (item) {
                if (item.tabs && item.tabs.length > 0) {
                    item.isHover = true;
                    this.showSecondaryNav = true;
                }
            };
            this.onUnHover = function (item) {
                if (this.showSecondaryNav) {
                    item.isHover = false;
                    this.showSecondaryNav = false;
                }
            };
        }
    });
})(HawtioMainNav || (HawtioMainNav = {}));
var Core;
(function (Core) {
    var LoggingPreferencesService = /** @class */ (function () {
        LoggingPreferencesService.$inject = ["$window"];
        function LoggingPreferencesService($window) {
            'ngInject';
            this.$window = $window;
        }
        LoggingPreferencesService.prototype.getLogBuffer = function () {
            if (window.localStorage.getItem('logBuffer') !== null) {
                return parseInt(this.$window.localStorage.getItem('logBuffer'), 10);
            }
            else {
                return LoggingPreferencesService.DEFAULT_LOG_BUFFER_SIZE;
            }
        };
        LoggingPreferencesService.prototype.setLogBuffer = function (logBuffer) {
            this.$window.localStorage.setItem('logBuffer', logBuffer.toString());
        };
        LoggingPreferencesService.prototype.getGlobalLogLevel = function () {
            if (this.$window.localStorage.getItem('logLevel') !== null) {
                return JSON.parse(this.$window.localStorage.getItem('logLevel'));
            }
            else {
                return LoggingPreferencesService.DEFAULT_GLOBAL_LOG_LEVEL;
            }
        };
        LoggingPreferencesService.prototype.setGlobalLogLevel = function (logLevel) {
            this.$window.localStorage.setItem('logLevel', JSON.stringify(logLevel));
        };
        LoggingPreferencesService.prototype.getChildLoggers = function () {
            if (this.$window.localStorage.getItem('childLoggers') !== null) {
                return JSON.parse(this.$window.localStorage.getItem('childLoggers'));
            }
            else {
                return [];
            }
        };
        LoggingPreferencesService.prototype.getAvailableChildLoggers = function () {
            var allChildLoggers = _.values(Logger['loggers']).map(function (obj) { return obj['context']; });
            var childLoggers = this.getChildLoggers();
            var availableChildLoggers = allChildLoggers.filter(function (childLogger) { return !childLoggers.some(function (c) { return c.name === childLogger.name; }); });
            return _.sortBy(availableChildLoggers, 'name');
        };
        ;
        LoggingPreferencesService.prototype.addChildLogger = function (childLogger) {
            var childLoggers = this.getChildLoggers();
            childLoggers.push(childLogger);
            this.setChildLoggers(childLoggers);
        };
        LoggingPreferencesService.prototype.removeChildLogger = function (childLogger) {
            var childLoggers = this.getChildLoggers();
            _.remove(childLoggers, function (c) { return c.name === childLogger.name; });
            this.setChildLoggers(childLoggers);
            Logger.get(childLogger.name).setLevel(this.getGlobalLogLevel());
        };
        LoggingPreferencesService.prototype.setChildLoggers = function (childLoggers) {
            this.$window.localStorage.setItem('childLoggers', JSON.stringify(childLoggers));
        };
        LoggingPreferencesService.prototype.reconfigureLoggers = function () {
            Logger.setLevel(this.getGlobalLogLevel());
            this.getChildLoggers().forEach(function (childLogger) {
                Logger.get(childLogger.name).setLevel(childLogger.filterLevel);
            });
        };
        LoggingPreferencesService.DEFAULT_LOG_BUFFER_SIZE = 100;
        LoggingPreferencesService.DEFAULT_GLOBAL_LOG_LEVEL = Logger.INFO;
        return LoggingPreferencesService;
    }());
    Core.LoggingPreferencesService = LoggingPreferencesService;
})(Core || (Core = {}));
/// <reference path="logging-preferences.service.ts"/>
var Core;
(function (Core) {
    LoggingPreferencesController.$inject = ["$scope", "loggingPreferencesService"];
    function LoggingPreferencesController($scope, loggingPreferencesService) {
        'ngInject';
        // Initialize tooltips
        $('[data-toggle="tooltip"]').tooltip();
        $scope.logBuffer = loggingPreferencesService.getLogBuffer();
        $scope.logLevel = loggingPreferencesService.getGlobalLogLevel();
        $scope.childLoggers = loggingPreferencesService.getChildLoggers();
        $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
        $scope.availableLogLevels = [Logger.OFF, Logger.ERROR, Logger.WARN, Logger.INFO, Logger.DEBUG];
        $scope.onLogBufferChange = function (logBuffer) {
            if (logBuffer) {
                loggingPreferencesService.setLogBuffer(logBuffer);
            }
        };
        $scope.onLogLevelChange = function (logLevel) {
            loggingPreferencesService.setGlobalLogLevel(logLevel);
            loggingPreferencesService.reconfigureLoggers();
        };
        $scope.addChildLogger = function (childLogger) {
            loggingPreferencesService.addChildLogger(childLogger);
            $scope.childLoggers = loggingPreferencesService.getChildLoggers();
            $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
        };
        $scope.removeChildLogger = function (childLogger) {
            loggingPreferencesService.removeChildLogger(childLogger);
            $scope.childLoggers = loggingPreferencesService.getChildLoggers();
            $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
        };
        $scope.onChildLoggersChange = function (childLoggers) {
            loggingPreferencesService.setChildLoggers(childLoggers);
            loggingPreferencesService.reconfigureLoggers();
        };
    }
    Core.LoggingPreferencesController = LoggingPreferencesController;
})(Core || (Core = {}));
/// <reference path="logging-preferences.controller.ts"/>
/// <reference path="logging-preferences.service.ts"/>
var Core;
(function (Core) {
    Core.loggingPreferencesModule = angular
        .module('hawtio-logging-preferences', [])
        .controller('PreferencesLoggingController', Core.LoggingPreferencesController)
        .service('loggingPreferencesService', Core.LoggingPreferencesService)
        .name;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var PreferencesService = /** @class */ (function () {
        PreferencesService.$inject = ["$window"];
        function PreferencesService($window) {
            'ngInject';
            this.$window = $window;
        }
        PreferencesService.prototype.saveLocationUrl = function (url) {
            this.$window.sessionStorage.setItem('lastUrl', url);
        };
        PreferencesService.prototype.restoreLocation = function ($location) {
            var url = this.$window.sessionStorage.getItem('lastUrl');
            $location.url(url);
        };
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
        PreferencesService.prototype.bindModelToSearchParam = function ($scope, $location, modelName, paramName, initialValue, to, from) {
            if (!(modelName in $scope)) {
                $scope[modelName] = initialValue;
            }
            var toConverter = to || (function (value) { return value; });
            var fromConverter = from || (function (value) { return value; });
            function currentValue() {
                return fromConverter($location.search()[paramName] || initialValue);
            }
            var value = currentValue();
            this.pathSet($scope, modelName, value);
            $scope.$watch(modelName, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue !== undefined && newValue !== null) {
                        $location.search(paramName, toConverter(newValue));
                    }
                    else {
                        $location.search(paramName, '');
                    }
                }
            });
        };
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
        PreferencesService.prototype.pathSet = function (object, paths, newValue) {
            var pathArray = (angular.isArray(paths)) ? paths : (paths || "").split(".");
            var value = object;
            var lastIndex = pathArray.length - 1;
            angular.forEach(pathArray, function (name, idx) {
                var next = value[name];
                if (idx >= lastIndex || !angular.isObject(next)) {
                    next = (idx < lastIndex) ? {} : newValue;
                    value[name] = next;
                }
                value = next;
            });
            return value;
        };
        return PreferencesService;
    }());
    Core.PreferencesService = PreferencesService;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var PreferencesRegistry = /** @class */ (function () {
        PreferencesRegistry.$inject = ["$rootScope"];
        function PreferencesRegistry($rootScope) {
            'ngInject';
            this.$rootScope = $rootScope;
            this.tabs = {};
        }
        PreferencesRegistry.prototype.addTab = function (label, templateUrl, isValid) {
            if (isValid === void 0) { isValid = undefined; }
            if (!isValid) {
                isValid = function () { return true; };
            }
            this.tabs[label] = {
                templateUrl: templateUrl,
                isValid: isValid
            };
            this.$rootScope.$broadcast('HawtioPreferencesTabAdded');
        };
        PreferencesRegistry.prototype.getTab = function (label) {
            return this.tabs[label];
        };
        PreferencesRegistry.prototype.getTabs = function () {
            var answer = {};
            angular.forEach(this.tabs, function (value, key) {
                if (value.isValid()) {
                    answer[key] = value;
                }
            });
            return answer;
        };
        return PreferencesRegistry;
    }());
    Core.PreferencesRegistry = PreferencesRegistry;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var HawtioTab = /** @class */ (function () {
        function HawtioTab(label, path) {
            this.label = label;
            this.path = path;
        }
        return HawtioTab;
    }());
    Core.HawtioTab = HawtioTab;
})(Core || (Core = {}));
/// <reference path="../preferences.service.ts"/>
/// <reference path="../preferences-registry.ts"/>
/// <reference path="../../navigation/hawtio-tab.ts"/>
var Core;
(function (Core) {
    PreferencesHomeController.$inject = ["$scope", "$location", "preferencesRegistry", "preferencesService"];
    function PreferencesHomeController($scope, $location, preferencesRegistry, preferencesService) {
        'ngInject';
        var panels = preferencesRegistry.getTabs();
        $scope.tabs = _.keys(panels).sort(byLabel).map(function (label) { return new Core.HawtioTab(label, label); });
        // pick the first one as the default
        preferencesService.bindModelToSearchParam($scope, $location, "pref", "pref", $scope.tabs[0].label);
        $scope.setPanel = function (tab) {
            $scope.pref = tab.label;
        };
        $scope.close = function () {
            preferencesService.restoreLocation($location);
        };
        $scope.getPrefs = function (pref) {
            var panel = panels[pref];
            if (panel) {
                return panel.templateUrl;
            }
            return undefined;
        };
        $scope.getTab = function (pref) {
            return _.find($scope.tabs, { label: pref });
        };
        /**
         * Sort the preference by names (and ensure Reset is last).
         */
        function byLabel(a, b) {
            if ("Reset" == a) {
                return 1;
            }
            else if ("Reset" == b) {
                return -1;
            }
            return a.localeCompare(b);
        }
    }
    Core.PreferencesHomeController = PreferencesHomeController;
})(Core || (Core = {}));
/// <reference path="preferences-home.controller.ts"/>
var Core;
(function (Core) {
    Core.preferencesHomeModule = angular
        .module('hawtio-preferences-home', [])
        .controller('PreferencesHomeController', Core.PreferencesHomeController)
        .name;
})(Core || (Core = {}));
var Core;
(function (Core) {
    ResetPreferencesController.$inject = ["$scope", "$window"];
    var SHOW_ALERT = 'showPreferencesResetAlert';
    function ResetPreferencesController($scope, $window) {
        'ngInject';
        $scope.showAlert = !!$window.sessionStorage.getItem(SHOW_ALERT);
        $window.sessionStorage.removeItem(SHOW_ALERT);
        $scope.doReset = function () {
            Core.log.info("Resetting preferences");
            $window.localStorage.clear();
            $window.sessionStorage.setItem(SHOW_ALERT, 'true');
            $window.setTimeout(function () {
                $window.location.reload();
            }, 10);
        };
    }
    Core.ResetPreferencesController = ResetPreferencesController;
})(Core || (Core = {}));
/// <reference path="reset-preferences.controller.ts"/>
var Core;
(function (Core) {
    Core.resetPreferencesModule = angular
        .module('hawtio-preferences-menu-item', [])
        .controller('ResetPreferencesController', Core.ResetPreferencesController)
        .name;
})(Core || (Core = {}));
/// <reference path="../extension/hawtio-extension.ts"/>
/// <reference path="../help/help-registry.ts"/>
/// <reference path="preferences.service.ts"/>
var Core;
(function (Core) {
    configureRoutes.$inject = ["$routeProvider"];
    addItemToUserMenu.$inject = ["HawtioExtension", "$templateCache", "$compile"];
    savePreviousLocationWhenOpeningPreferences.$inject = ["$rootScope", "preferencesService"];
    addHelpDocumentation.$inject = ["helpRegistry"];
    addPreferencesPages.$inject = ["preferencesRegistry"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider.when('/preferences', {
            templateUrl: 'preferences/preferences-home/preferences-home.html',
            reloadOnSearch: false
        });
    }
    Core.configureRoutes = configureRoutes;
    function addItemToUserMenu(HawtioExtension, $templateCache, $compile) {
        'ngInject';
        HawtioExtension.add('hawtio-user', function ($scope) {
            var template = '<li><a ng-href="preferences">Preferences</a></li>';
            return $compile(template)($scope);
        });
    }
    Core.addItemToUserMenu = addItemToUserMenu;
    function savePreviousLocationWhenOpeningPreferences($rootScope, preferencesService) {
        'ngInject';
        $rootScope.$on("$locationChangeSuccess", function (event, newUrl, oldUrl) {
            if (newUrl.indexOf('/preferences') !== -1 && oldUrl.indexOf('/preferences') === -1) {
                var baseUrl = newUrl.substring(0, newUrl.indexOf('/preferences'));
                var url = oldUrl.substring(baseUrl.length);
                preferencesService.saveLocationUrl(url);
            }
        });
    }
    Core.savePreviousLocationWhenOpeningPreferences = savePreviousLocationWhenOpeningPreferences;
    function addHelpDocumentation(helpRegistry) {
        'ngInject';
        helpRegistry.addUserDoc('preferences', 'preferences/help.md');
    }
    Core.addHelpDocumentation = addHelpDocumentation;
    function addPreferencesPages(preferencesRegistry) {
        'ngInject';
        preferencesRegistry.addTab("Console Logs", 'preferences/logging-preferences/logging-preferences.html');
        preferencesRegistry.addTab("Reset", 'preferences/reset-preferences/reset-preferences.html');
    }
    Core.addPreferencesPages = addPreferencesPages;
})(Core || (Core = {}));
/// <reference path="logging-preferences/logging-preferences.module.ts"/>
/// <reference path="preferences-home/preferences-home.module.ts"/>
/// <reference path="reset-preferences/reset-preferences.module.ts"/>
/// <reference path="preferences.config.ts"/>
/// <reference path="preferences.service.ts"/>
/// <reference path="preferences-registry.ts"/>
var Core;
(function (Core) {
    Core.preferencesModule = angular
        .module('hawtio-preferences', [
        'ng',
        'ngRoute',
        'ngSanitize',
        Core.loggingPreferencesModule,
        Core.preferencesHomeModule,
        Core.resetPreferencesModule
    ])
        .config(Core.configureRoutes)
        .run(Core.addItemToUserMenu)
        .run(Core.savePreviousLocationWhenOpeningPreferences)
        .run(Core.addHelpDocumentation)
        .run(Core.addPreferencesPages)
        .service('preferencesService', Core.PreferencesService)
        .service('preferencesRegistry', Core.PreferencesRegistry)
        .name;
})(Core || (Core = {}));
var templateCache;
(function (templateCache) {
    templateCache.pluginName = 'hawtio-template-cache';
    templateCache._module = angular.module(templateCache.pluginName, []);
    templateCache._module.config(['$provide', function ($provide) {
            // extend template cache a bit so we can avoid fetching templates from the
            // server
            $provide.decorator('$templateCache', ['$delegate', function ($delegate) {
                    var log = Logger.get('$templateCache');
                    var oldPut = $delegate.put;
                    $delegate.watches = {};
                    $delegate.put = function (id, template) {
                        ////log.debug("Adding template: ", id); //, " with content: ", template);
                        /*
                        if (!template) {
                          //log.debug("Template is undefined, ignoring");
                          return;
                        }
                        */
                        oldPut(id, template);
                        if (id in $delegate.watches) {
                            //log.debug("Found watches for id: ", id);
                            $delegate.watches[id].forEach(function (func) {
                                func(template);
                            });
                            //log.debug("Removing watches for id: ", id);
                            delete $delegate.watches[id];
                        }
                    };
                    var oldGet = $delegate.get;
                    $delegate.get = function (id) {
                        var answer = oldGet(id);
                        //log.debug("Getting template: ", id); //, " returning: ", answer);
                        return answer;
                    };
                    return $delegate;
                }]);
            // extend templateRequest so we can prevent it from requesting templates, as
            // we have 'em all in $templateCache
            $provide.decorator('$templateRequest', ['$rootScope', '$timeout', '$q', '$templateCache', '$delegate',
                function ($rootScope, $timeout, $q, $templateCache, $delegate) {
                    var fn = function (url, ignore) {
                        var log = Logger.get('$templateRequest');
                        //log.debug("request for template at: ", url);
                        var answer = $templateCache.get(url);
                        var deferred = $q.defer();
                        if (!angular.isDefined(answer)) {
                            //log.debug("No template in cache for URL: ", url);
                            if ('watches' in $templateCache) {
                                //log.debug("Adding watch to $templateCache for url: ", url);
                                if (!$templateCache.watches[url]) {
                                    $templateCache.watches[url] = [];
                                }
                                $templateCache.watches[url].push(function (template) {
                                    //log.debug("Resolving watch on template: ", url);
                                    deferred.resolve(template);
                                });
                                return deferred.promise;
                            }
                            else {
                                // Guess we'll just let the real templateRequest service handle it
                                return $delegate(url, ignore);
                            }
                        }
                        else {
                            //log.debug("Found template for URL: ", url);
                            $timeout(function () {
                                deferred.resolve(answer);
                            }, 1);
                            return deferred.promise;
                        }
                    };
                    fn['totalPendingRequests'] = 0;
                    return fn;
                }]);
        }]);
})(templateCache || (templateCache = {}));
/// <reference path="auth/auth.module.ts"/>
/// <reference path="common/common.module.ts"/>
/// <reference path="config/config.module.ts"/>
/// <reference path="config/config-loader.ts"/>
/// <reference path="core/hawtio-core.ts"/>
/// <reference path="extension/hawtio-extension.module.ts"/>
/// <reference path="help/help.module.ts"/>
/// <reference path="navigation/hawtio-core-navigation.ts"/>
/// <reference path="preferences/preferences.module.ts"/>
/// <reference path="template-cache/hawtio-template-cache.ts"/>
var Core;
(function (Core) {
    Core.appModule = angular
        .module('hawtio', [
        'ng',
        'ngRoute',
        'ngSanitize',
        Core.authModule,
        Core.commonModule,
        Core.configModule,
        HawtioCore.pluginName,
        Core.hawtioExtensionModule,
        Core.helpModule,
        HawtioMainNav.pluginName,
        Core.preferencesModule,
        templateCache.pluginName
    ])
        .name;
    Core.log = Logger.get('hawtio-core');
    hawtioPluginLoader
        .addModule(Core.appModule)
        .registerPreBootstrapTask({
        name: 'ConfigLoader',
        task: Core.configLoader
    });
})(Core || (Core = {}));
/// <reference path="hawtio-tab.ts"/>
var Core;
(function (Core) {
    var HawtioTabsController = /** @class */ (function () {
        HawtioTabsController.$inject = ["$document", "$timeout", "$location"];
        function HawtioTabsController($document, $timeout, $location) {
            'ngInject';
            this.$document = $document;
            this.$timeout = $timeout;
            this.$location = $location;
            this.tabs = [];
            this.moreTabs = [];
        }
        HawtioTabsController.prototype.$onChanges = function (changesObj) {
            if (!this.tabs) {
                throw Error("hawtioTabsComponent 'tabs' input is " + this.tabs);
            }
            this.activateTab(changesObj);
            this.adjustTabs();
        };
        HawtioTabsController.prototype.activateTab = function (changesObj) {
            if (changesObj.activeTab && changesObj.activeTab.currentValue) {
                this.activeTab = _.find(this.tabs, function (tab) { return tab === changesObj.activeTab.currentValue; });
            }
            else if (this.tabs.length > 0) {
                this.activeTab = this.tabs[0];
                this.$location.path(this.activeTab.path);
            }
        };
        HawtioTabsController.prototype.adjustTabs = function () {
            var _this = this;
            this.adjustingTabs = true;
            // wait for the tabs to be rendered by AngularJS before calculating the widths
            this.$timeout(function () {
                var $ul = _this.$document.find('.hawtio-tabs');
                var $liTabs = $ul.find('.hawtio-tab');
                var $liDropdown = $ul.find('.dropdown');
                var availableWidth = $ul.width() - $liDropdown.width();
                var lisWidth = 0;
                _this.moreTabs = [];
                $liTabs.each(function (index, element) {
                    lisWidth += element.clientWidth;
                    if (lisWidth > availableWidth) {
                        _this.moreTabs.unshift(_this.tabs.pop());
                    }
                });
                _this.adjustingTabs = false;
            });
        };
        HawtioTabsController.prototype.onClick = function (tab) {
            this.activeTab = tab;
            this.onChange({ tab: tab });
        };
        return HawtioTabsController;
    }());
    Core.HawtioTabsController = HawtioTabsController;
    Core.hawtioTabsComponent = {
        bindings: {
            tabs: '<',
            activeTab: '<',
            onChange: '&',
        },
        template: "\n      <ul class=\"nav nav-tabs hawtio-tabs\">\n        <li ng-repeat=\"tab in $ctrl.tabs track by tab.path\" class=\"hawtio-tab\" \n            ng-class=\"{invisible: $ctrl.adjustingTabs, active: tab === $ctrl.activeTab}\">\n          <a href=\"#\" ng-click=\"$ctrl.onClick(tab)\">{{tab.label}}</a>\n        </li>\n        <li class=\"dropdown\" ng-class=\"{invisible: $ctrl.moreTabs.length === 0}\">\n          <a id=\"moreDropdown\" class=\"dropdown-toggle\" href=\"\" data-toggle=\"dropdown\">\n            More\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"moreDropdown\">\n            <li role=\"presentation\" ng-repeat=\"tab in $ctrl.moreTabs track by tab.label\">\n              <a role=\"menuitem\" tabindex=\"-1\" href=\"#\" ng-click=\"$ctrl.onClick(tab)\">{{tab.label}}</a>\n            </li>\n          </ul>\n        </li>\n      </ul>\n    ",
        controller: HawtioTabsController
    };
    HawtioMainNav._module.component('hawtioTabs', Core.hawtioTabsComponent);
})(Core || (Core = {}));

angular.module('hawtio-core').run(['$templateCache', function($templateCache) {$templateCache.put('help/help.component.html','<div>\n  <h1>Help</h1>\n  <ul class="nav nav-tabs">\n    <li ng-repeat="breadcrumb in $ctrl.breadcrumbs" ng-class="{active : breadcrumb === $ctrl.selectedBreadcrumb}">\n      <a href="#" ng-click="$ctrl.onSelectBreadcrumb(breadcrumb)">{{breadcrumb.label}}</a>\n    </li>\n  </ul>\n  <ul class="nav nav-tabs nav-tabs-pf help-secondary-tabs">\n    <li ng-repeat="section in $ctrl.sections" ng-class="{active : section === $ctrl.selectedTopic}">\n      <a ng-href="#" ng-click="$ctrl.onSelectTopic(section)">{{section.label}}</a>\n    </li>\n  </ul>\n  <div ng-bind-html="$ctrl.html"></div>\n</div>\n');
$templateCache.put('navigation/templates/layoutFull.html','<div ng-view class="nav-ht nav-ht-full-layout"></div>');
$templateCache.put('navigation/templates/layoutTest.html','<div>\n  <h1>Test Layout</h1>\n  <div ng-view>\n\n\n  </div>\n</div>\n\n\n');
$templateCache.put('navigation/templates/navItem.html','<li class="list-group-item" \n    ng-class="{ active: item.isSelected(), \n                \'secondary-nav-item-pf\': item.tabs,\n                \'is-hover\': item.isHover }" \n    ng-if="item.isValid === undefined || item.isValid()"\n    ng-hide="item.hide()"\n    ng-mouseenter="$ctrl.onHover(item)"\n    ng-mouseleave="$ctrl.onUnHover(item)"\n    data-target="#{{item.id}}-secondary">\n  <a ng-href="{{item.href()}}" ng-click="item.click($event)">\n    <span class="list-group-item-value">\n      <ng-bind-html ng-bind-html="item.title()"></ng-bind-html>\n    </span>\n  </a>\n  <div id="#{{item.id}}-secondary" class="nav-pf-secondary-nav" ng-if="item.tabs">\n    <div class="nav-item-pf-header">\n      <ng-bind-html ng-bind-html="item.title()"></ng-bind-html>\n    </div>\n    <ul class="list-group" item="item" hawtio-sub-tabs></ul>\n  </div>\n</li>\n');
$templateCache.put('navigation/templates/subTabHeader.html','<li class="header">\n  <a href=""><strong>{{item.title()}}</strong></a>\n</li>\n');
$templateCache.put('navigation/templates/verticalNav.html','<div class="nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-persistent-secondary" \n     ng-class="{\'hover-secondary-nav-pf\': $ctrl.showSecondaryNav}">\n  <ul class="list-group" hawtio-main-nav></ul>\n</div>');
$templateCache.put('navigation/templates/welcome.html','<div ng-controller="HawtioNav.WelcomeController"></div>\n');
$templateCache.put('preferences/logging-preferences/logging-preferences.html','<div ng-controller="PreferencesLoggingController">\n  <form class="form-horizontal logging-preferences-form">\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-buffer">\n        Log buffer\n        <span class="pficon pficon-info" data-toggle="tooltip" data-placement="top" title="Number of log statements to keep in the console"></span>\n      </label>\n      <div class="col-md-6">\n        <input type="number" id="log-buffer" class="form-control" ng-model="logBuffer" ng-blur="onLogBufferChange(logBuffer)">\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-level">Global log level</label>\n      <div class="col-md-6">\n        <select id="log-level" class="form-control" ng-model="logLevel"\n                ng-options="logLevel.name for logLevel in availableLogLevels track by logLevel.name"\n                ng-change="onLogLevelChange(logLevel)">\n        </select>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-buffer">Child loggers</label>\n      <div class="col-md-6">\n        <div class="form-group" ng-repeat="childLogger in childLoggers track by childLogger.name">\n          <label class="col-md-4 control-label child-logger-label" for="log-level">\n            {{childLogger.name}}\n          </label>\n          <div class="col-md-8">\n            <select id="log-level" class="form-control child-logger-select" ng-model="childLogger.filterLevel"\n                    ng-options="logLevel.name for logLevel in availableLogLevels track by logLevel.name"\n                    ng-change="onChildLoggersChange(childLoggers)">\n            </select>\n            <button type="button" class="btn btn-default child-logger-delete-button" ng-click="removeChildLogger(childLogger)">\n              <span class="pficon pficon-delete"></span>\n            </button>\n          </div>\n        </div>\n        <div>\n          <div class="dropdown">\n            <button class="btn btn-default dropdown-toggle" type="button" id="addChildLogger" data-toggle="dropdown">\n              Add\n              <span class="caret"></span>\n            </button>\n            <ul class="dropdown-menu" role="menu" aria-labelledby="addChildLogger">\n              <li role="presentation" ng-repeat="availableChildLogger in availableChildLoggers track by availableChildLogger.name">\n                <a role="menuitem" tabindex="-1" href="#" ng-click="addChildLogger(availableChildLogger)">\n                  {{ availableChildLogger.name }}\n                </a>\n              </li>\n            </ul>\n          </div>          \n        </div>\n      </div>\n    </div>\n  </form>\n</div>\n');
$templateCache.put('preferences/preferences-home/preferences-home.html','<div ng-controller="PreferencesHomeController">\n  <button class="btn btn-primary pull-right" ng-click="close()">Close</button>\n  <h1>\n    Preferences\n  </h1>\n  <hawtio-tabs tabs="tabs" active-tab="getTab(pref)" on-change="setPanel(tab)"></hawtio-tabs>\n  <div ng-include="getPrefs(pref)"></div>\n</div>\n');
$templateCache.put('preferences/reset-preferences/reset-preferences.html','<div ng-controller="ResetPreferencesController">\n  <div class="alert alert-success preferences-reset-alert" ng-if="showAlert">\n    <span class="pficon pficon-ok"></span>\n    Settings reset successfully!\n  </div>\n  <h3>Reset settings</h3>\n  <p>\n    Clear all custom settings stored in your browser\'s local storage and reset to defaults.\n  </p>\n  <p>\n    <button class="btn btn-danger" ng-click="doReset()">Reset settings</button>\n  </p>\n</div>');
$templateCache.put('help/help.md','### Plugin Help\n\nBrowse the available help topics for plugin specific documentation using the help navigation bar on the left.\n\n### Further Reading\n\n- [hawtio](http://hawt.io "hawtio") website\n- Chat with the hawtio team on IRC by joining **#hawtio** on **irc.freenode.net**\n- Help improve [hawtio](http://hawt.io "hawtio") by [contributing](http://hawt.io/contributing/index.html)\n- [hawtio on github](https://github.com/hawtio/hawtio)\n');
$templateCache.put('preferences/help.md','## Preferences\n\nThe preferences page is used to configure application preferences and individual plugin preferences.\n\nThe preferences page is accessible by clicking the user icon (<i class=\'fa pficon-user\'></i>) in the main navigation bar,\nand then by choosing the preferences sub menu option.\n');}]);