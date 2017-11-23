// hawtio log initialization
/* globals Logger window console document localStorage $ angular jQuery navigator Jolokia */
(function () {
    'use strict';
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
        // console.log("Using log level: ", logLevel);
        Logger.setLevel(logLevel);
        if ('showLog' in window.localStorage) {
            var showLog = window.localStorage['showLog'];
            // console.log("showLog: ", showLog);
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
            var childLoggers = [];
            try {
                childLoggers = JSON.parse(localStorage['childLoggers']);
            }
            catch (e) {
            }
            childLoggers.forEach(function (child) {
                Logger.get(child.logger).setLevel(Logger[child.level]);
            });
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
    Logger.getType = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
    };
    Logger.isError = function (obj) {
        return obj && Logger.getType(obj) === 'Error';
    };
    Logger.isArray = function (obj) {
        return obj && Logger.getType(obj) === 'Array';
    };
    Logger.isObject = function (obj) {
        return obj && Logger.getType(obj) === 'Object';
    };
    Logger.isString = function (obj) {
        return obj && Logger.getType(obj) === 'String';
    };
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
            //line = line.replace(/\s/g, "&nbsp;");
            stackTrace = stackTrace + "<p>" + line + "</p>\n";
        }
        stackTrace = stackTrace + "</div>\n";
        return stackTrace;
    };
    Logger.setHandler(function (messages, context) {
        // MyConsole.log("context: ", context);
        // MyConsole.log("messages: ", messages);
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
            for (var i = 0; i < messages.length; i++) {
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
                            logger.info("Stack trace: ", stackTrace);
                        });
                    }
                }
                else {
                    text = text + message;
                }
            }
            if (context.name) {
                text = '[<span class="green">' + context.name + '</span>] ' + text;
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
        function onAdd() {
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
        }
        onAdd();
        postLog.forEach(function (func) { func(); });
    });
})();
/*
 * Plugin loader and discovery mechanism for hawtio
 */
var hawtioPluginLoader = (function (self) {
    'use strict';
    var log = Logger.get('hawtio-loader');
    var bootstrapEl = document.documentElement;
    self.log = log;
    /**
     * List of URLs that the plugin loader will try and discover
     * plugins from
     * @type {Array}
     */
    self.urls = [];
    /**
     * Holds all of the angular modules that need to be bootstrapped
     * @type {Array}
     */
    self.modules = [];
    /**
     * Tasks to be run before bootstrapping, tasks can be async.
     * Supply a function that takes the next task to be
     * executed as an argument and be sure to call the passed
     * in function.
     *
     * @type {Array}
     */
    self.tasks = [];
    self.setBootstrapElement = function (el) {
        log.debug("Setting bootstrap element to: ", el);
        bootstrapEl = el;
    };
    self.getBootstrapElement = function () {
        return bootstrapEl;
    };
    self.registerPreBootstrapTask = function (task, front) {
        if (angular.isFunction(task)) {
            log.debug("Adding legacy task");
            task = {
                task: task
            };
        }
        if (!task.name) {
            task.name = 'unnamed-task-' + (self.tasks.length + 1);
        }
        if (task.depends && !angular.isArray(task.depends) && task.depends !== '*') {
            task.depends = [task.depends];
        }
        if (!front) {
            self.tasks.push(task);
        }
        else {
            self.tasks.unshift(task);
        }
    };
    self.addModule = function (module) {
        log.debug("Adding module: " + module);
        self.modules.push(module);
    };
    self.addUrl = function (url) {
        log.debug("Adding URL: " + url);
        self.urls.push(url);
    };
    self.getModules = function () {
        return self.modules;
    };
    self.loaderCallback = null;
    self.setLoaderCallback = function (cb) {
        self.loaderCallback = cb;
        // log.debug("Setting callback to : ", self.loaderCallback);
    };
    function intersection(search, needle) {
        if (!angular.isArray(needle)) {
            needle = [needle];
        }
        //self.log.debug("Search: ", search);
        //self.log.debug("Needle: ", needle);
        var answer = [];
        needle.forEach(function (n) {
            search.forEach(function (s) {
                if (n === s) {
                    answer.push(s);
                }
            });
        });
        return answer;
    }
    self.loadPlugins = function (callback) {
        var lcb = self.loaderCallback;
        var plugins = {};
        var urlsToLoad = self.urls.length;
        var totalUrls = urlsToLoad;
        var bootstrap = function () {
            var executedTasks = [];
            var deferredTasks = [];
            var bootstrapTask = {
                name: 'Hawtio Bootstrap',
                depends: '*',
                runs: 0,
                task: function (next) {
                    function listTasks() {
                        deferredTasks.forEach(function (task) {
                            self.log.info("  name: " + task.name + " depends: ", task.depends);
                        });
                    }
                    if (deferredTasks.length > 0) {
                        self.log.info("tasks yet to run: ");
                        listTasks();
                        bootstrapTask.runs = bootstrapTask.runs + 1;
                        self.log.info("Task list restarted : ", bootstrapTask.runs, " times");
                        if (bootstrapTask.runs === 5) {
                            self.log.info("Orphaned tasks: ");
                            listTasks();
                            deferredTasks.length = 0;
                        }
                        else {
                            deferredTasks.push(bootstrapTask);
                        }
                    }
                    self.log.debug("Executed tasks: ", executedTasks);
                    next();
                }
            };
            self.registerPreBootstrapTask(bootstrapTask);
            var executeTask = function () {
                var tObj = null;
                var tmp = [];
                // if we've executed all of the tasks, let's drain any deferred tasks
                // into the regular task queue
                if (self.tasks.length === 0) {
                    tObj = deferredTasks.shift();
                }
                // first check and see what tasks have executed and see if we can pull a task
                // from the deferred queue
                while (!tObj && deferredTasks.length > 0) {
                    var task = deferredTasks.shift();
                    if (task.depends === '*') {
                        if (self.tasks.length > 0) {
                            tmp.push(task);
                        }
                        else {
                            tObj = task;
                        }
                    }
                    else {
                        var intersect = intersection(executedTasks, task.depends);
                        if (intersect.length === task.depends.length) {
                            tObj = task;
                        }
                        else {
                            tmp.push(task);
                        }
                    }
                }
                if (tmp.length > 0) {
                    tmp.forEach(function (task) {
                        deferredTasks.push(task);
                    });
                }
                // no deferred tasks to execute, let's get a new task
                if (!tObj) {
                    tObj = self.tasks.shift();
                }
                // check if task has dependencies
                if (tObj && tObj.depends && self.tasks.length > 0) {
                    self.log.debug("Task '" + tObj.name + "' has dependencies: ", tObj.depends);
                    if (tObj.depends === '*') {
                        if (self.tasks.length > 0) {
                            self.log.debug("Task '" + tObj.name + "' wants to run after all other tasks, deferring");
                            deferredTasks.push(tObj);
                            executeTask();
                            return;
                        }
                    }
                    else {
                        var intersect = intersection(executedTasks, tObj.depends);
                        if (intersect.length != tObj.depends.length) {
                            self.log.debug("Deferring task: '" + tObj.name + "'");
                            deferredTasks.push(tObj);
                            executeTask();
                            return;
                        }
                    }
                }
                if (tObj) {
                    self.log.debug("Executing task: '" + tObj.name + "'");
                    //self.log.debug("ExecutedTasks: ", executedTasks);
                    var called = false;
                    var next = function () {
                        if (next['notFired']) {
                            next['notFired'] = false;
                            executedTasks.push(tObj.name);
                            setTimeout(executeTask, 1);
                        }
                    };
                    next['notFired'] = true;
                    tObj.task(next);
                }
                else {
                    self.log.debug("All tasks executed");
                    setTimeout(callback, 1);
                }
            };
            setTimeout(executeTask, 1);
        };
        var loadScripts = function () {
            // keep track of when scripts are loaded so we can execute the callback
            var loaded = 0;
            $.each(plugins, function (key, data) {
                loaded = loaded + data.Scripts.length;
            });
            var totalScripts = loaded;
            var scriptLoaded = function () {
                $.ajaxSetup({ async: true });
                loaded = loaded - 1;
                if (lcb) {
                    lcb.scriptLoaderCallback(lcb, totalScripts, loaded + 1);
                }
                if (loaded === 0) {
                    bootstrap();
                }
            };
            if (loaded > 0) {
                $.each(plugins, function (key, data) {
                    data.Scripts.forEach(function (script) {
                        // log.debug("Loading script: ", data.Name + " script: " + script);
                        var scriptName = data.Context + "/" + script;
                        log.debug("Fetching script: ", scriptName);
                        $.ajaxSetup({ async: false });
                        $.getScript(scriptName)
                            .done(function (textStatus) {
                            log.debug("Loaded script: ", scriptName);
                        })
                            .fail(function (jqxhr, settings, exception) {
                            log.info("Failed loading script: \"", exception.message, "\" (<a href=\"", scriptName, ":", exception.lineNumber, "\">", scriptName, ":", exception.lineNumber, "</a>)");
                        })
                            .always(scriptLoaded);
                    });
                });
            }
            else {
                // no scripts to load, so just do the callback
                $.ajaxSetup({ async: true });
                bootstrap();
            }
        };
        if (urlsToLoad === 0) {
            loadScripts();
        }
        else {
            var urlLoaded = function () {
                urlsToLoad = urlsToLoad - 1;
                if (lcb) {
                    lcb.urlLoaderCallback(lcb, totalUrls, urlsToLoad + 1);
                }
                if (urlsToLoad === 0) {
                    loadScripts();
                }
            };
            var regex = new RegExp(/^jolokia:/);
            $.each(self.urls, function (index, url) {
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
                        // console.error("Error fetching data: " + Exception);
                    }
                    urlLoaded();
                }
                else {
                    log.debug("Trying url: ", url);
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
                        // log.debug("got data: ", data);
                        $.extend(plugins, data);
                    }).always(function () {
                        urlLoaded();
                    });
                }
            });
        }
    };
    self.debug = function () {
        log.debug("urls and modules");
        log.debug(self.urls);
        log.debug(self.modules);
    };
    self.setLoaderCallback({
        scriptLoaderCallback: function (self, total, remaining) {
            log.debug("Total scripts: ", total, " Remaining: ", remaining);
        },
        urlLoaderCallback: function (self, total, remaining) {
            log.debug("Total URLs: ", total, " Remaining: ", remaining);
        }
    });
    return self;
})(hawtioPluginLoader || {});
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
    var _module = angular.module(HawtioCore.pluginName, []);
    _module.config(["$locationProvider", function ($locationProvider) {
            $locationProvider.html5Mode(true);
        }]);
    _module.run(['documentBase', function (documentBase) {
            log.debug("loaded");
        }]);
    var dummyLocalStorage = {
        length: 0,
        key: function (index) { return undefined; },
        getItem: function (key) { return dummyLocalStorage[key]; },
        setItem: function (key, data) { dummyLocalStorage[key] = data; },
        removeItem: function (key) {
            var removed = dummyLocalStorage[key];
            delete dummyLocalStorage[key];
            return removed;
        },
        clear: function () {
        }
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
        //log.debug("Document base: ", answer);
        return answer;
    };
    /**
     * services, mostly stubs
     */
    // localStorage service, returns a dummy impl
    // if for some reason it's not in the window
    // object
    _module.factory('localStorage', function () {
        return window.localStorage || dummyLocalStorage;
    });
    // Holds the document base so plugins can easily
    // figure out absolute URLs when needed
    _module.factory('documentBase', function () {
        return HawtioCore.documentBase();
    });
    // Holds a mapping of plugins to layouts, plugins use 
    // this to specify a full width view, tree view or their 
    // own custom view
    _module.factory('viewRegistry', function () {
        return {};
    });
    // Placeholder service for the help registry
    _module.factory('helpRegistry', function () {
        return {
            addUserDoc: function () { },
            addDevDoc: function () { },
            addSubTopic: function () { },
            getOrCreateTopic: function () { return undefined; },
            mapTopicName: function () { return undefined; },
            mapSubTopicName: function () { return undefined; },
            getTopics: function () { return undefined; },
            disableAutodiscover: function () { },
            discoverHelpFiles: function () { }
        };
    });
    // Placeholder service for the preferences registry
    _module.factory('preferencesRegistry', function () {
        return {
            addTab: function () { },
            getTab: function () { return undefined; },
            getTabs: function () { return undefined; }
        };
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
            getAddLink: function () {
                return '';
            }
        };
    });
    // Placeholder service for branding
    _module.factory('branding', function () {
        return {};
    });
    // Placeholder user details service
    _module.factory('userDetails', function () {
        return {
            logout: function () {
                log.debug("Dummy userDetails.logout()");
            }
        };
    });
    hawtioPluginLoader.addModule("ng");
    hawtioPluginLoader.addModule("ngSanitize");
    hawtioPluginLoader.addModule(HawtioCore.pluginName);
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
            log.debug("Using bootstrap element: ", bootstrapEl);
            // bootstrap in hybrid mode if angular2 is detected
            if (HawtioCore.UpgradeAdapter) {
                log.debug("ngUpgrade detected, bootstrapping in Angular 1/2 hybrid mode");
                HawtioCore.UpgradeAdapterRef = HawtioCore.UpgradeAdapter.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), { strictDi: true });
                HawtioCore._injector = HawtioCore.UpgradeAdapterRef.ng1Injector;
            }
            else {
                HawtioCore._injector = angular.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), {
                    strictDi: true
                });
            }
            log.debug("Bootstrapped application");
        });
    });
    return HawtioCore;
})();
/// <reference path="../core/hawtio-core.ts"/>
var HawtioExtensionService;
(function (HawtioExtensionService) {
    HawtioExtensionService.pluginName = 'hawtio-extension-service';
    HawtioExtensionService.templatePath = 'plugins/hawtio-extension-service/html';
    HawtioExtensionService._module = angular.module(HawtioExtensionService.pluginName, []);
    HawtioExtensionService._module.service('HawtioExtension', function () {
        this._registeredExtensions = {};
        this.add = function (extensionPointName, fn) {
            if (!this._registeredExtensions[extensionPointName]) {
                this._registeredExtensions[extensionPointName] = [];
            }
            this._registeredExtensions[extensionPointName].push(fn);
        };
        this.render = function (extensionPointName, element, scope) {
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
    });
    HawtioExtensionService._module.directive('hawtioExtension', ["HawtioExtension", function (HawtioExtension) {
            return {
                restrict: 'EA',
                link: function (scope, element, attrs) {
                    if (attrs.name) {
                        HawtioExtension.render(attrs.name, element, scope);
                    }
                }
            };
        }]);
    hawtioPluginLoader.addModule(HawtioExtensionService.pluginName);
})(HawtioExtensionService || (HawtioExtensionService = {}));
/// <reference path="../core/hawtio-core.ts"/>
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
    function documentBase($document) {
        var base = $document.find('base');
        return base.attr('href');
    }
    function trimLeading(text, prefix) {
        if (text && prefix) {
            if (_.startsWith(text, prefix) || text.indexOf(prefix) === 0) {
                return text.substring(prefix.length);
            }
        }
        return text;
    }
    HawtioMainNav.pluginName = 'hawtio-nav';
    var log = Logger.get(HawtioMainNav.pluginName);
    // Actions class with some pre-defined actions
    var Actions = (function () {
        function Actions() { }
        Object.defineProperty(Actions, "ADD", {
            get: function () {
                return 'hawtio-main-nav-add';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Actions, "REMOVE", {
            get: function () {
                return 'hawtio-main-nav-remove';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Actions, "CHANGED", {
            get: function () {
                return 'hawtio-main-nav-change';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Actions, "REDRAW", {
            get: function () {
                return 'hawtio-main-nav-redraw';
            },
            enumerable: true,
            configurable: true
        });
        return Actions;
    })();
    HawtioMainNav.Actions = Actions;
    // Class RegistryImpl
    var RegistryImpl = (function () {
        function RegistryImpl(root) {
            this.items = [];
            this.root = root;
            /*
               this.on(HawtioMainNav.Actions.ADD, 'log', function (item) {
               console.log('Adding item with id: ', item.id);
               });
               this.on(HawtioMainNav.Actions.REMOVE, 'log', function (item) {
               console.log('Removing item with id: ', item.id);
               });
               */
        }
        RegistryImpl.prototype.builder = function () {
            return new HawtioMainNav.NavItemBuilderImpl();
        };
        RegistryImpl.prototype.add = function (item) {
            var _this = this;
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            var toAdd = _.union([item], items);
            this.items = _.union(this.items, toAdd);
            toAdd.forEach(function (item) {
                _this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.ADD, {
                    detail: {
                        item: item
                    }
                }));
            });
            this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.CHANGED, {
                detail: {
                    items: this.items
                }
            }));
            this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.REDRAW, {
                detail: {}
            }));
        };
        RegistryImpl.prototype.remove = function (search) {
            var _this = this;
            var removed = _.remove(this.items, search);
            removed.forEach(function (item) {
                _this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.REMOVE, {
                    detail: {
                        item: item
                    }
                }));
            });
            this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.CHANGED, {
                detail: {
                    items: this.items
                }
            }));
            this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.REDRAW, {
                detail: {}
            }));
            return removed;
        };
        RegistryImpl.prototype.iterate = function (iterator) {
            this.items.forEach(iterator);
        };
        RegistryImpl.prototype.selected = function () {
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
        RegistryImpl.prototype.on = function (action, key, fn) {
            var _this = this;
            switch (action) {
                case HawtioMainNav.Actions.ADD:
                    this.root.addEventListener(HawtioMainNav.Actions.ADD, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event.detail.item);
                    });
                    if (this.items.length > 0) {
                        this.items.forEach(function (item) {
                            _this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.ADD, {
                                detail: {
                                    item: item
                                }
                            }));
                        });
                    }
                    break;
                case HawtioMainNav.Actions.REMOVE:
                    this.root.addEventListener(HawtioMainNav.Actions.REMOVE, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event.detail.item);
                    });
                    break;
                case HawtioMainNav.Actions.CHANGED:
                    this.root.addEventListener(HawtioMainNav.Actions.CHANGED, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event.detail.items);
                    });
                    if (this.items.length > 0) {
                        this.root.dispatchEvent(new CustomEvent(HawtioMainNav.Actions.CHANGED, {
                            detail: {
                                items: _this.items
                            }
                        }));
                    }
                    break;
                case HawtioMainNav.Actions.REDRAW:
                    this.root.addEventListener(HawtioMainNav.Actions.REDRAW, function (event) {
                        //log.debug("event key: ", key, " event: ", event);
                        fn(event);
                    });
                    var event = new CustomEvent(HawtioMainNav.Actions.REDRAW, {
                        detail: {
                            text: ''
                        }
                    });
                    this.root.dispatchEvent(event);
                    break;
                default:
            }
        };
        return RegistryImpl;
    })();
    // Factory for registry, used to create angular service
    function createRegistry(root) {
        return new RegistryImpl(root);
    }
    HawtioMainNav.createRegistry = createRegistry;
    // Class NavItemBuilderImpl
    var NavItemBuilderImpl = (function () {
        function NavItemBuilderImpl() {
            this.self = {
                id: ''
            };
        }
        NavItemBuilderImpl['join'] = function () {
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
        };
        NavItemBuilderImpl.prototype.id = function (id) {
            this.self.id = id;
            return this;
        };
        NavItemBuilderImpl.prototype.rank = function (rank) {
            this.self.rank = rank;
            return this;
        };
        NavItemBuilderImpl.prototype.title = function (title) {
            this.self.title = title;
            return this;
        };
        NavItemBuilderImpl.prototype.tooltip = function (tooltip) {
            this.self.tooltip = tooltip;
            return this;
        };
        NavItemBuilderImpl.prototype.page = function (page) {
            this.self.page = page;
            return this;
        };
        NavItemBuilderImpl.prototype.reload = function (reload) {
            this.self.reload = reload;
            return this;
        };
        NavItemBuilderImpl.prototype.attributes = function (attributes) {
            this.self.attributes = attributes;
            return this;
        };
        NavItemBuilderImpl.prototype.linkAttributes = function (attributes) {
            this.self.linkAttributes = attributes;
            return this;
        };
        NavItemBuilderImpl.prototype.context = function (context) {
            this.self.context = context;
            return this;
        };
        NavItemBuilderImpl.prototype.href = function (href) {
            this.self.href = href;
            return this;
        };
        NavItemBuilderImpl.prototype.click = function (click) {
            this.self.click = click;
            return this;
        };
        NavItemBuilderImpl.prototype.isSelected = function (isSelected) {
            this.self.isSelected = isSelected;
            return this;
        };
        NavItemBuilderImpl.prototype.isValid = function (isValid) {
            this.self.isValid = isValid;
            return this;
        };
        NavItemBuilderImpl.prototype.show = function (show) {
            this.self.show = show;
            return this;
        };
        NavItemBuilderImpl.prototype.template = function (template) {
            this.self.template = template;
            return this;
        };
        NavItemBuilderImpl.prototype.defaultPage = function (defaultPage) {
            this.self.defaultPage = defaultPage;
            return this;
        };
        NavItemBuilderImpl.prototype.tabs = function (item) {
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            this.self.tabs = _.union(this.self.tabs, [item], items);
            return this;
        };
        NavItemBuilderImpl.prototype.subPath = function (title, path, page, rank, reload, isValid) {
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
                        return NavItemBuilderImpl['join'](parent.href(), path);
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
        NavItemBuilderImpl.prototype.build = function () {
            var answer = _.cloneDeep(this.self);
            this.self = {
                id: ''
            };
            return answer;
        };
        return NavItemBuilderImpl;
    })();
    HawtioMainNav.NavItemBuilderImpl = NavItemBuilderImpl;
    // Factory functions
    HawtioMainNav.createBuilder = function () {
        return new HawtioMainNav.NavItemBuilderImpl();
    };
    // Plugin initialization
    var _module = angular.module(HawtioMainNav.pluginName, ['ngRoute']);
    HawtioMainNav._module = _module;
    _module.constant('layoutFull', 'templates/main-nav/layoutFull.html');
    _module.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
            $routeProvider.otherwise({ templateUrl: 'templates/main-nav/welcome.html' });
        }]);
    _module.controller('HawtioNav.WelcomeController', ['$scope', '$location', 'WelcomePageRegistry', 'HawtioNav', '$timeout', '$document', function ($scope, $location, welcome, nav, $timeout, $document) {
            function gotoNavItem(item) {
                if (item && item.href) {
                    var href = trimLeading(item.href(), documentBase($document));
                    var uri = new URI(href);
                    var search = _.merge($location.search(), uri.query(true));
                    log.debug("Going to item id: ", item.id, " href: ", uri.path(), " query: ", search);
                    $timeout(function () {
                        $location.path(uri.path()).search(search);
                    }, 10);
                }
            }
            function gotoFirstAvailableNav() {
                var candidates = [];
                nav.iterate(function (item) {
                    var isValid = item['isValid'] || function () { return true; };
                    var show = item.show || function () { return true; };
                    if (isValid() && show()) {
                        candidates.push(item);
                    }
                });
                var rankedCandidates = sortByRank(candidates);
                gotoNavItem(rankedCandidates[0]);
            }
            $timeout(function () {
                var search = $location.search();
                if (search.tab) {
                    var tab = search.tab;
                    var selected;
                    nav.iterate(function (item) {
                        if (!selected && item.id === tab) {
                            selected = item;
                        }
                    });
                    if (selected) {
                        gotoNavItem(selected);
                        return;
                    }
                }
                var candidates = [];
                nav.iterate(function (item) {
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
                    if (welcome.pages.length === 0) {
                        log.debug("No welcome pages, going to first available nav");
                        gotoFirstAvailableNav();
                    }
                    var sortedPages = _.sortBy(welcome.pages, function (page) { return page['rank']; });
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
            }, 500);
        }]);
    _module.controller('HawtioNav.ViewController', ['$scope', '$route', '$location', 'layoutFull', 'viewRegistry', function ($scope, $route, $location, layoutFull, viewRegistry) {
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
        }]);
    _module.run(['HawtioNav', '$rootScope', '$route', '$document', function (HawtioNav, $rootScope, $route, $document) {
            HawtioNav.on(HawtioMainNav.Actions.CHANGED, "$apply", function (item) {
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            });
            var href = documentBase($document);
            function applyBaseHref(item) {
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
            }
            HawtioNav.on(HawtioMainNav.Actions.ADD, "htmlBaseRewriter", function (item) {
                if (item.href) {
                    applyBaseHref(item);
                    _.forEach(item.tabs, applyBaseHref);
                }
            });
            HawtioNav.on(HawtioMainNav.Actions.ADD, "$apply", function (item) {
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
        }]);
    hawtioPluginLoader.addModule(HawtioMainNav.pluginName);
    hawtioPluginLoader.addModule("ngRoute");
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
                        var answer = _.some(item.tabs, function (subTab) {
                            return subTab['isSelected']();
                        });
                        if (answer) {
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
            template = $templateCache.get('templates/main-nav/navItem.html');
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
            HawtioNav.on(HawtioMainNav.Actions.ADD, 'subTabEnricher', function (item) {
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
            HawtioNav.on(HawtioMainNav.Actions.ADD, 'hrefEnricher', function (item) {
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
            HawtioNav.on(HawtioMainNav.Actions.ADD, 'isSelectedEnricher', function (item) {
                addIsSelected($location, item);
                if (item.tabs) {
                    item.tabs.forEach(function (item) { addIsSelected($location, item); });
                }
            });
            HawtioNav.on(HawtioMainNav.Actions.ADD, 'PrimaryController', function (item) {
                config.nav[item.id] = item;
            });
            HawtioNav.on(HawtioMainNav.Actions.REMOVE, 'PrimaryController', function (item) {
                delete config.nav[item.id];
            });
            HawtioNav.on(HawtioMainNav.Actions.CHANGED, 'PrimaryController', function (items) {
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
    // provider so it's possible to get a nav builder in _module.config()
    HawtioMainNav._module.provider('HawtioNavBuilder', [function HawtioNavBuilderProvider() {
            this.$get = function () {
                return {};
            };
            this.create = function () {
                return HawtioMainNav.createBuilder();
            };
            this.join = NavItemBuilderImpl['join'];
            function setRoute($routeProvider, tab) {
                log.debug("Setting route: ", tab.href(), " to template URL: ", tab['page']());
                var config = {
                    templateUrl: tab['page']()
                };
                if (!_.isUndefined(tab['reload'])) {
                    config['reloadOnSearch'] = tab['reload'];
                }
                $routeProvider.when(tab.href(), config);
            }
            this.configureRouting = function ($routeProvider, tab) {
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
                    setRoute($routeProvider, tab);
                }
                if (tab.tabs) {
                    tab.tabs.forEach(function (tab) {
                        return setRoute($routeProvider, tab);
                    });
                }
            };
        }]);
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
            var registry = HawtioMainNav.createRegistry(window);
            return registry;
        }]);
    HawtioMainNav._module.component('hawtioVerticalNav', {
        templateUrl: 'templates/main-nav/verticalNav.html',
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
/// <reference path="../core/hawtio-core.ts"/>
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
    // this is also added by hawtio-core-navigation, but we'll add it here as well
    hawtioPluginLoader.addModule('ngRoute');
    hawtioPluginLoader.addModule(templateCache.pluginName);
})(templateCache || (templateCache = {}));

angular.module('hawtio-nav').run(['$templateCache', function($templateCache) {$templateCache.put('templates/main-nav/layoutFull.html','<div ng-view class="nav-ht nav-ht-full-layout"></div>');
$templateCache.put('templates/main-nav/layoutTest.html','<div>\n  <h1>Test Layout</h1>\n  <div ng-view>\n\n\n  </div>\n</div>\n\n\n');
$templateCache.put('templates/main-nav/navItem.html','<li class="list-group-item" \n    ng-class="{ active: item.isSelected(), \n                \'secondary-nav-item-pf\': item.tabs,\n                \'is-hover\': item.isHover }" \n    ng-if="item.isValid === undefined || item.isValid()"\n    ng-hide="item.hide()"\n    ng-mouseenter="$ctrl.onHover(item)"\n    ng-mouseleave="$ctrl.onUnHover(item)"\n    data-target="#{{item.id}}-secondary">\n  <a ng-href="{{item.href()}}" ng-click="item.click($event)">\n    <span class="list-group-item-value">\n      <ng-bind-html ng-bind-html="item.title()"></ng-bind-html>\n    </span>\n  </a>\n  <div id="#{{item.id}}-secondary" class="nav-pf-secondary-nav" ng-if="item.tabs">\n    <div class="nav-item-pf-header">\n      <ng-bind-html ng-bind-html="item.title()"></ng-bind-html>\n    </div>\n    <ul class="list-group" item="item" hawtio-sub-tabs></ul>\n  </div>\n</li>\n');
$templateCache.put('templates/main-nav/subTabHeader.html','<li class="header">\n  <a href=""><strong>{{item.title()}}</strong></a>\n</li>\n');
$templateCache.put('templates/main-nav/verticalNav.html','<div class="nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-persistent-secondary" \n     ng-class="{\'hover-secondary-nav-pf\': $ctrl.showSecondaryNav}">\n  <ul class="list-group" hawtio-main-nav></ul>\n</div>');
$templateCache.put('templates/main-nav/welcome.html','<div ng-controller="HawtioNav.WelcomeController"></div>\n');}]);