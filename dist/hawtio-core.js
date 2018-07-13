var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var AppController = /** @class */ (function () {
        function AppController() {
            this.verticalNavCollapsed = false;
        }
        AppController.prototype.toggleVerticalNav = function (collapsed) {
            this.verticalNavCollapsed = collapsed;
        };
        return AppController;
    }());
    App.AppController = AppController;
    App.appComponent = {
        template: "\n      <nav-bar on-toggle-vertical-nav=\"$ctrl.toggleVerticalNav(collapsed)\"></nav-bar>\n      <vertical-nav collapsed=\"$ctrl.verticalNavCollapsed\"></vertical-nav>\n      <div id=\"main\" class=\"container-fluid container-pf-nav-pf-vertical hidden-icons-pf ng-cloak container-hawtio-nav-hawtio-vertical\"\n          ng-class=\"{'collapsed-nav': $ctrl.verticalNavCollapsed}\"\n          ng-controller=\"HawtioNav.ViewController\"\n          ng-include src=\"viewPartial\">\n      </div>\n    ",
        controller: AppController
    };
})(App || (App = {}));
/// <reference path="../config/config.ts"/>
var About;
(function (About) {
    var AboutService = /** @class */ (function () {
        AboutService.$inject = ["configManager"];
        function AboutService(configManager) {
            'ngInject';
            this.configManager = configManager;
            this.moreProductInfo = [];
        }
        AboutService.prototype.getTitle = function () {
            return this.configManager.getAboutValue('title');
        };
        AboutService.prototype.getProductInfo = function () {
            var productInfo = [];
            productInfo = productInfo.concat(this.configManager.getAboutValue('productInfo') || []);
            productInfo = this.moreProductInfo;
            productInfo = _.sortBy(productInfo, ['label']);
            return productInfo;
        };
        AboutService.prototype.addProductInfo = function (name, value) {
            this.moreProductInfo.push({ name: name, value: value });
        };
        AboutService.prototype.getAdditionalInfo = function () {
            return this.configManager.getAboutValue('additionalInfo');
        };
        AboutService.prototype.getCopyright = function () {
            return this.configManager.getAboutValue('copyright');
        };
        AboutService.prototype.getImgSrc = function () {
            return this.configManager.getAboutValue('imgSrc');
        };
        return AboutService;
    }());
    About.AboutService = AboutService;
})(About || (About = {}));
/// <reference path="about/about.service.ts"/>
var App;
(function (App) {
    configureAboutPage.$inject = ["aboutService"];
    function configureAboutPage(aboutService) {
        'ngInject';
        aboutService.addProductInfo('Hawtio Core', 'PACKAGE_VERSION_PLACEHOLDER');
    }
    App.configureAboutPage = configureAboutPage;
})(App || (App = {}));
/// <reference path="about.service.ts"/>
/// <reference path="../config/config.ts"/>
var About;
(function (About) {
    var AboutController = /** @class */ (function () {
        AboutController.$inject = ["aboutService"];
        function AboutController(aboutService) {
            'ngInject';
            this.aboutService = aboutService;
        }
        AboutController.prototype.$onInit = function () {
            this.title = this.aboutService.getTitle();
            this.productInfo = this.aboutService.getProductInfo();
            this.additionalInfo = this.aboutService.getAdditionalInfo();
            this.copyright = this.aboutService.getCopyright();
            this.imgSrc = this.aboutService.getImgSrc();
        };
        AboutController.prototype.onClose = function () {
            this.flags.open = false;
        };
        return AboutController;
    }());
    About.AboutController = AboutController;
    About.aboutComponent = {
        bindings: {
            flags: '<'
        },
        template: "\n      <pf-about-modal is-open=\"$ctrl.flags.open\" on-close=\"$ctrl.onClose()\" title=\"$ctrl.title\"\n        product-info=\"$ctrl.productInfo\" additional-info=\"$ctrl.additionalInfo\" copyright=\"$ctrl.copyright\"\n        img-src=\"$ctrl.imgSrc\">\n      </pf-about-modal>\n    ",
        controller: AboutController
    };
})(About || (About = {}));
var About;
(function (About) {
    configureMenu.$inject = ["HawtioExtension", "$compile"];
    function configureMenu(HawtioExtension, $compile) {
        'ngInject';
        HawtioExtension.add('hawtio-about', function ($scope) {
            var template = "\n        <a ng-init=\"flags = {open: false}\" ng-click=\"flags.open = true\">About</a>\n        <about flags=\"flags\"></about>\n      ";
            return $compile(template)($scope);
        });
    }
    About.configureMenu = configureMenu;
})(About || (About = {}));
/// <reference path="about.component.ts"/>
/// <reference path="about.config.ts"/>
/// <reference path="about.service.ts"/>
var About;
(function (About) {
    About.aboutModule = angular
        .module('hawtio-about', [])
        .run(About.configureMenu)
        .component('about', About.aboutComponent)
        .service('aboutService', About.AboutService)
        .name;
})(About || (About = {}));
var Core;
(function (Core) {
    var DEFAULT_USER = 'public';
    /**
     * UserDetails service that represents user credentials and login/logout actions.
     */
    var AuthService = /** @class */ (function () {
        AuthService.$inject = ["postLoginTasks", "preLogoutTasks", "postLogoutTasks", "localStorage"];
        function AuthService(postLoginTasks, preLogoutTasks, postLogoutTasks, localStorage) {
            'ngInject';
            this.postLoginTasks = postLoginTasks;
            this.preLogoutTasks = preLogoutTasks;
            this.postLogoutTasks = postLogoutTasks;
            this.localStorage = localStorage;
            this._username = DEFAULT_USER;
            this._password = null;
            this._token = null;
            this._loggedIn = false;
        }
        /**
         * Log in as a specific user.
         */
        AuthService.prototype.login = function (username, password, token) {
            this._username = username;
            this._password = password;
            if (token) {
                this._token = token;
            }
            this._loggedIn = true;
            Core.log.info('Logged in as', this._username);
            this.postLoginTasks.execute();
        };
        /**
         * Log out the current user.
         */
        AuthService.prototype.logout = function () {
            var _this = this;
            if (!this._loggedIn) {
                Core.log.debug('Not logged in');
                return;
            }
            this.preLogoutTasks.execute(function () {
                var username = _this._username;
                // do logout
                _this.clear();
                _this.postLogoutTasks.execute(function () {
                    Core.log.info('Logged out:', username);
                });
            });
        };
        AuthService.prototype.clear = function () {
            this._username = DEFAULT_USER;
            this._password = null;
            this._token = null;
            this._loggedIn = false;
        };
        Object.defineProperty(AuthService.prototype, "username", {
            get: function () {
                return this._username;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AuthService.prototype, "password", {
            get: function () {
                return this._password;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AuthService.prototype, "token", {
            get: function () {
                return this._token;
            },
            set: function (token) {
                this._token = token;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AuthService.prototype, "loggedIn", {
            get: function () {
                return this._loggedIn;
            },
            enumerable: true,
            configurable: true
        });
        return AuthService;
    }());
    Core.AuthService = AuthService;
})(Core || (Core = {}));
var Core;
(function (Core) {
    function getBasicAuthHeader(username, password) {
        var authInfo = username + ":" + password;
        authInfo = window.btoa(authInfo);
        return "Basic " + authInfo;
    }
    Core.getBasicAuthHeader = getBasicAuthHeader;
})(Core || (Core = {}));
/// <reference path="auth.service.ts"/>
/// <reference path="auth.helper.ts"/>
var Core;
(function (Core) {
    Core.authModule = angular
        .module('hawtio-core-auth', [])
        .service('authService', Core.AuthService)
        .factory('userDetails', ['authService', function (authService) { return authService; }]) // remove when all references are gone
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
        ConfigManager.prototype.getAboutValue = function (key) {
            if (this.config && this.config.about && this.config.about[key]) {
                return this.config.about[key];
            }
            else {
                return null;
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
    Core._module = angular
        .module('hawtio-core', [])
        .service('humanizeService', Core.HumanizeService);
    Core.coreModule = Core._module.name;
    Core.log = Logger.get(Core.coreModule);
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
         * Return the current list of configured modules.
         *
         * It is invoked from HawtioCore's bootstrapping.
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
         * Downloads plugins at any configured URLs and bootstraps the app.
         *
         * It is invoked from HawtioCore's bootstrapping.
         */
        PluginLoader.prototype.loadPlugins = function (callback) {
            var _this = this;
            Core.log.info("Bootstrapping hawtio app...");
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
/// <reference path="core.module.ts"/>
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
    Core._module
        .config(["$locationProvider", function ($locationProvider) {
            $locationProvider.html5Mode(true);
        }])
        .run(['documentBase', function (documentBase) { return Core.log.debug("HawtioCore loaded at", documentBase); }]);
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
            Core.log.warn("Document is missing a 'base' tag, defaulting to '/'");
        }
        return answer;
    };
    /**
     * services, mostly stubs
     */
    Core._module
        // localStorage service, returns a dummy impl
        // if for some reason it's not in the window
        // object
        .factory('localStorage', function () { return window.localStorage || dummyLocalStorage; })
        // Holds the document base so plugins can easily
        // figure out absolute URLs when needed
        .factory('documentBase', function () { return HawtioCore.documentBase(); })
        // Holds a mapping of plugins to layouts, plugins use 
        // this to specify a full width view, tree view or their 
        // own custom view
        .factory('viewRegistry', function () {
        return {};
    })
        // Placeholder service for the page title service
        .factory('pageTitle', function () {
        return {
            addTitleElement: function () { },
            getTitle: function () { return undefined; },
            getTitleWithSeparator: function () { return undefined; },
            getTitleExcluding: function () { return undefined; },
            getTitleArrayExcluding: function () { return undefined; }
        };
    })
        // service for the javascript object that does notifications
        .factory('toastr', ["$window", function ($window) {
            var answer = $window.toastr;
            if (!answer) {
                // lets avoid any NPEs
                answer = {};
                $window.toastr = answer;
            }
            return answer;
        }]).factory('HawtioDashboard', function () {
        return {
            hasDashboard: false,
            inDashboard: false,
            getAddLink: function () { return ''; }
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
                Core.log.debug("Application already bootstrapped");
                return;
            }
            var bootstrapEl = hawtioPluginLoader.getBootstrapElement();
            Core.log.debug("Using bootstrap element:", bootstrapEl);
            // bootstrap in hybrid mode if angular2 is detected
            if (HawtioCore.UpgradeAdapter) {
                Core.log.debug("ngUpgrade detected, bootstrapping in Angular 1/2 hybrid mode");
                HawtioCore.UpgradeAdapterRef = HawtioCore.UpgradeAdapter.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), { strictDi: true });
                HawtioCore._injector = HawtioCore.UpgradeAdapterRef.ng1Injector;
            }
            else {
                HawtioCore._injector = angular.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), { strictDi: true });
            }
            Core.log.debug("Bootstrapped application");
        });
    });
    return HawtioCore;
})();
var Core;
(function (Core) {
    var log = Logger.get("hawtio-core-tasks");
    var Tasks = /** @class */ (function () {
        function Tasks(name) {
            this.name = name;
            this.tasks = {};
            this.tasksExecuted = false;
        }
        Tasks.prototype.addTask = function (name, task) {
            this.tasks[name] = task;
            if (this.tasksExecuted) {
                this.executeTask(name, task);
            }
            return this;
        };
        Tasks.prototype.execute = function (callback) {
            var _this = this;
            log.debug("Executing tasks:", this.name);
            if (this.tasksExecuted) {
                return;
            }
            _.forOwn(this.tasks, function (task, name) { return _this.executeTask(name, task); });
            this.tasksExecuted = true;
            if (!_.isNil(callback)) {
                callback();
            }
        };
        Tasks.prototype.executeTask = function (name, task) {
            if (_.isNull(task)) {
                return;
            }
            log.debug("Executing task:", name);
            try {
                task();
            }
            catch (error) {
                log.debug("Failed to execute task:", name, "error:", error);
            }
        };
        Tasks.prototype.reset = function () {
            this.tasksExecuted = false;
        };
        return Tasks;
    }());
    Core.Tasks = Tasks;
    var ParameterizedTasks = /** @class */ (function (_super) {
        __extends(ParameterizedTasks, _super);
        function ParameterizedTasks(name) {
            var _this = _super.call(this, name) || this;
            _this.tasks = {};
            return _this;
        }
        ParameterizedTasks.prototype.addTask = function (name, task) {
            this.tasks[name] = task;
            return this;
        };
        ParameterizedTasks.prototype.execute = function () {
            var _this = this;
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            log.debug("Executing tasks:", this.name);
            if (this.tasksExecuted) {
                return;
            }
            _.forOwn(this.tasks, function (task, name) { return _this.executeParameterizedTask(name, task, params); });
            this.tasksExecuted = true;
            this.reset();
        };
        ParameterizedTasks.prototype.executeParameterizedTask = function (name, task, params) {
            if (_.isNull(task)) {
                return;
            }
            log.debug("Executing task:", name, "with parameters:", params);
            try {
                task.apply(task, params);
            }
            catch (e) {
                log.debug("Failed to execute task:", name, "error:", e);
            }
        };
        return ParameterizedTasks;
    }(Tasks));
    Core.ParameterizedTasks = ParameterizedTasks;
})(Core || (Core = {}));
/// <reference path="tasks.ts"/>
var Core;
(function (Core) {
    initializeTasks.$inject = ["$rootScope", "locationChangeStartTasks", "postLoginTasks", "preLogoutTasks", "postLogoutTasks"];
    Core.eventServicesModule = angular
        .module('hawtio-core-event-services', [])
        // service to register tasks that should happen when the URL changes
        .factory('locationChangeStartTasks', function () { return new Core.ParameterizedTasks('LocationChangeStartTasks'); })
        // service to register stuff that should happen when the user logs in
        .factory('postLoginTasks', function () { return new Core.Tasks('PostLogin'); })
        // service to register stuff that should happen when the user logs out
        .factory('preLogoutTasks', function () { return new Core.Tasks('PreLogout'); })
        // service to register stuff that should happen after the user logs out
        .factory('postLogoutTasks', function () { return new Core.Tasks('PostLogout'); })
        .run(initializeTasks)
        .name;
    function initializeTasks($rootScope, locationChangeStartTasks, postLoginTasks, preLogoutTasks, postLogoutTasks) {
        'ngInject';
        // Reset pre/post-logout tasks after login
        postLoginTasks
            .addTask("ResetPreLogoutTasks", function () { return preLogoutTasks.reset(); })
            .addTask("ResetPostLogoutTasks", function () { return postLogoutTasks.reset(); });
        // Reset pre-login tasks before logout
        preLogoutTasks
            .addTask("ResetPostLoginTasks", function () { return postLoginTasks.reset(); });
        $rootScope.$on('$locationChangeStart', function ($event, newUrl, oldUrl) {
            return locationChangeStartTasks.execute($event, newUrl, oldUrl);
        });
        Core.log.debug("Event services loaded");
    }
})(Core || (Core = {}));
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
var Help;
(function (Help) {
    var HelpTopic = /** @class */ (function () {
        function HelpTopic() {
        }
        HelpTopic.prototype.isIndexTopic = function () {
            return this.topicName === 'index';
        };
        return HelpTopic;
    }());
    Help.HelpTopic = HelpTopic;
})(Help || (Help = {}));
/// <reference path="help-topic.ts"/>
var Help;
(function (Help) {
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
                topic = new Help.HelpTopic();
                topic.topicName = topicName;
                topic.subTopicName = subTopicName;
                topic.path = path;
                topic.isValid = isValid;
                topic.label = topic.isIndexTopic() ? this.getLabel(subTopicName) : this.getLabel(topicName);
                this.topics.push(topic);
                this.$rootScope.$broadcast('hawtioNewHelpTopic');
            }
            return topic;
        };
        HelpRegistry.prototype.getLabel = function (name) {
            if (angular.isDefined(this.topicNameMappings[name])) {
                return this.topicNameMappings[name];
            }
            if (angular.isDefined(this.subTopicNameMappings[name])) {
                return this.subTopicNameMappings[name];
            }
            return name;
        };
        HelpRegistry.prototype.getTopics = function () {
            return this.topics.filter(function (topic) { return topic.isValid(); });
        };
        HelpRegistry.prototype.getTopic = function (topicName, subTopicName) {
            return this.topics.filter(function (topic) {
                return topic.topicName === topicName && topic.subTopicName === subTopicName;
            })[0];
        };
        return HelpRegistry;
    }());
    Help.HelpRegistry = HelpRegistry;
})(Help || (Help = {}));
/// <reference path="help-registry.ts"/>
/// <reference path="help-topic.ts"/>
var Help;
(function (Help) {
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
        HelpService.prototype.getTopics = function () {
            return this.helpRegistry.getTopics().filter(function (topic) { return topic.isIndexTopic(); });
        };
        HelpService.prototype.getSubTopics = function (topic) {
            var otherSubTopics = this.helpRegistry.getTopics().filter(function (t) { return !t.isIndexTopic() &&
                t.subTopicName === topic.subTopicName; });
            otherSubTopics = _.sortBy(otherSubTopics, 'label');
            return [topic].concat(otherSubTopics);
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
    Help.HelpService = HelpService;
})(Help || (Help = {}));
/// <reference path="help.service.ts"/>
var Help;
(function (Help) {
    var HelpController = /** @class */ (function () {
        HelpController.$inject = ["$rootScope", "helpService", "$sce"];
        function HelpController($rootScope, helpService, $sce) {
            'ngInject';
            this.helpService = helpService;
            this.$sce = $sce;
        }
        HelpController.prototype.$onInit = function () {
            this.topics = this.helpService.getTopics();
            this.onSelectTopic(this.helpService.getTopic('index', 'user'));
        };
        HelpController.prototype.onSelectTopic = function (topic) {
            this.selectedTopic = topic;
            this.subTopics = this.helpService.getSubTopics(topic);
            this.onSelectSubTopic(this.subTopics[0]);
        };
        HelpController.prototype.onSelectSubTopic = function (subTopic) {
            this.selectedSubTopic = subTopic;
            this.html = this.$sce.trustAsHtml(this.helpService.getHelpContent(subTopic));
        };
        return HelpController;
    }());
    Help.HelpController = HelpController;
    Help.helpComponent = {
        templateUrl: 'help/help.component.html',
        controller: HelpController
    };
})(Help || (Help = {}));
var Help;
(function (Help) {
    configureRoutes.$inject = ["$routeProvider"];
    configureDocumentation.$inject = ["helpRegistry", "$templateCache"];
    configureMenu.$inject = ["HawtioExtension", "$compile"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider.when('/help', { template: '<help></help>' });
    }
    Help.configureRoutes = configureRoutes;
    function configureDocumentation(helpRegistry, $templateCache) {
        'ngInject';
        helpRegistry.addUserDoc('index', 'help/help.md');
        // These docs live in the main hawtio project
        helpRegistry.addSubTopic('index', 'faq', 'plugins/help/doc/FAQ.md', function () {
            return $templateCache.get('plugins/help/doc/FAQ.md') !== undefined;
        });
        helpRegistry.addSubTopic('index', 'changes', 'plugins/help/doc/CHANGES.md', function () {
            return $templateCache.get('plugins/help/doc/CHANGES.md') !== undefined;
        });
    }
    Help.configureDocumentation = configureDocumentation;
    function configureMenu(HawtioExtension, $compile) {
        'ngInject';
        HawtioExtension.add('hawtio-help', function ($scope) {
            var template = '<a ng-href="help">Help</a>';
            return $compile(template)($scope);
        });
    }
    Help.configureMenu = configureMenu;
})(Help || (Help = {}));
/// <reference path="help.component.ts"/>
/// <reference path="help.config.ts"/>
/// <reference path="help.service.ts"/>
/// <reference path="help-registry.ts"/>
var Help;
(function (Help) {
    Help.helpModule = angular
        .module('hawtio-help', [])
        .config(Help.configureRoutes)
        .run(Help.configureDocumentation)
        .run(Help.configureMenu)
        .component('help', Help.helpComponent)
        .service('helpService', Help.HelpService)
        .service('helpRegistry', Help.HelpRegistry)
        .name;
})(Help || (Help = {}));
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
var Nav;
(function (Nav) {
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
    Nav.pluginName = 'hawtio-core-nav';
    var log = Logger.get(Nav.pluginName);
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
    Nav.Actions = Actions;
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
    Nav.Registry = Registry;
    // Factory for registry, used to create angular service
    function createRegistry(root) {
        return new Registry(root);
    }
    Nav.createRegistry = createRegistry;
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
    Nav.NavItemBuilder = NavItemBuilder;
    // Factory functions
    function createBuilder() {
        return new NavItemBuilder();
    }
    Nav.createBuilder = createBuilder;
    ;
    // Plugin initialization
    Nav._module = angular.module(Nav.pluginName, ['ngRoute']);
    Nav._module.constant('layoutFull', 'navigation/templates/layoutFull.html');
    Nav._module.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({ templateUrl: 'navigation/templates/welcome.html' });
        }]);
    Nav._module.controller('HawtioNav.WelcomeController', welcomeController);
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
    Nav._module.controller('HawtioNav.ViewController', viewController);
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
    Nav._module.run(configureHtmlBase);
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
    Nav._module.directive('hawtioSubTabs', ['$templateCache', '$compile', function ($templateCache, $compile) {
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
    Nav._module.directive("hawtioMainNav", ["HawtioNav", "$templateCache", "$compile", "$location", "$rootScope", function (HawtioNav, $templateCache, $compile, $location, $rootScope) {
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
            var _this_1 = this;
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
                tab.tabs.forEach(function (tab) { return _this_1.setRoute($routeProvider, tab); });
            }
        };
        return BuilderFactory;
    }());
    Nav.BuilderFactory = BuilderFactory;
    // provider so it's possible to get a nav builder in _module.config()
    Nav._module.provider('HawtioNavBuilder', BuilderFactory);
    Nav._module.factory('HawtioPerspective', [function () {
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
    Nav._module.factory('WelcomePageRegistry', [function () {
            return {
                pages: []
            };
        }]);
    Nav._module.factory('HawtioNav', ['$window', '$rootScope', function ($window, $rootScope) {
            var registry = createRegistry(window);
            return registry;
        }]);
    Nav._module.component('hawtioVerticalNav', {
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
})(Nav || (Nav = {}));
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
var Nav;
(function (Nav) {
    var HawtioTab = /** @class */ (function () {
        function HawtioTab(label, path) {
            this.label = label;
            this.path = path;
            this.visible = true;
        }
        return HawtioTab;
    }());
    Nav.HawtioTab = HawtioTab;
})(Nav || (Nav = {}));
/// <reference path="../preferences.service.ts"/>
/// <reference path="../preferences-registry.ts"/>
/// <reference path="../../navigation/hawtio-tab.ts"/>
var Core;
(function (Core) {
    PreferencesHomeController.$inject = ["$scope", "$location", "preferencesRegistry", "preferencesService"];
    function PreferencesHomeController($scope, $location, preferencesRegistry, preferencesService) {
        'ngInject';
        var panels = preferencesRegistry.getTabs();
        $scope.tabs = _.keys(panels).sort(byLabel).map(function (label) { return new Nav.HawtioTab(label, label); });
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
    configureMenu.$inject = ["HawtioExtension", "$compile"];
    savePreviousLocationWhenOpeningPreferences.$inject = ["$rootScope", "preferencesService"];
    configureDocumentation.$inject = ["helpRegistry"];
    configurePreferencesPages.$inject = ["preferencesRegistry"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider.when('/preferences', {
            templateUrl: 'preferences/preferences-home/preferences-home.html',
            reloadOnSearch: false
        });
    }
    Core.configureRoutes = configureRoutes;
    function configureMenu(HawtioExtension, $compile) {
        'ngInject';
        HawtioExtension.add('hawtio-preferences', function ($scope) {
            var template = '<a ng-href="preferences">Preferences</a>';
            return $compile(template)($scope);
        });
    }
    Core.configureMenu = configureMenu;
    function savePreviousLocationWhenOpeningPreferences($rootScope, preferencesService) {
        'ngInject';
        $rootScope.$on("$locationChangeSuccess", function (event, newUrl, oldUrl) {
            if (newUrl.indexOf('/preferences') !== -1 && oldUrl.indexOf('/preferences') === -1) {
                var baseUrl = newUrl.substring(0, newUrl.indexOf('/preferences'));
                var url_1 = oldUrl.substring(baseUrl.length);
                preferencesService.saveLocationUrl(url_1);
            }
        });
    }
    Core.savePreviousLocationWhenOpeningPreferences = savePreviousLocationWhenOpeningPreferences;
    function configureDocumentation(helpRegistry) {
        'ngInject';
        helpRegistry.addUserDoc('preferences', 'preferences/help.md');
    }
    Core.configureDocumentation = configureDocumentation;
    function configurePreferencesPages(preferencesRegistry) {
        'ngInject';
        preferencesRegistry.addTab("Console Logs", 'preferences/logging-preferences/logging-preferences.html');
        preferencesRegistry.addTab("Reset", 'preferences/reset-preferences/reset-preferences.html');
    }
    Core.configurePreferencesPages = configurePreferencesPages;
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
        .run(Core.configureMenu)
        .run(Core.savePreviousLocationWhenOpeningPreferences)
        .run(Core.configureDocumentation)
        .run(Core.configurePreferencesPages)
        .service('preferencesService', Core.PreferencesService)
        .service('preferencesRegistry', Core.PreferencesRegistry)
        .name;
})(Core || (Core = {}));
var Core;
(function (Core) {
    templateCacheConfig.$inject = ["$provide"];
    var pluginName = 'hawtio-core-template-cache';
    var log = Logger.get(pluginName);
    Core.templateCacheModule = angular
        .module(pluginName, [])
        .config(templateCacheConfig)
        .name;
    function templateCacheConfig($provide) {
        'ngInject';
        // extend template cache a bit so we can avoid fetching templates from the
        // server
        $provide.decorator('$templateCache', ['$delegate', function ($delegate) {
                var oldPut = $delegate.put;
                $delegate.watches = {};
                $delegate.put = function (id, template) {
                    log.debug("Adding template:", id); //, " with content: ", template);
                    oldPut(id, template);
                    if (id in $delegate.watches) {
                        log.debug("Found watches for id:", id);
                        $delegate.watches[id].forEach(function (func) {
                            func(template);
                        });
                        log.debug("Removing watches for id:", id);
                        delete $delegate.watches[id];
                    }
                };
                var oldGet = $delegate.get;
                $delegate.get = function (id) {
                    var answer = oldGet(id);
                    log.debug("Getting template:", id); //, " returning: ", answer);
                    return answer;
                };
                return $delegate;
            }]);
        // extend templateRequest so we can prevent it from requesting templates, as
        // we have 'em all in $templateCache
        $provide.decorator('$templateRequest', ['$rootScope', '$timeout', '$q', '$templateCache', '$delegate',
            function ($rootScope, $timeout, $q, $templateCache, $delegate) {
                var fn = function (url, ignore) {
                    log.debug("request for template at:", url);
                    var answer = $templateCache.get(url);
                    var deferred = $q.defer();
                    if (!angular.isDefined(answer)) {
                        log.debug("No template in cache for URL:", url);
                        if ('watches' in $templateCache) {
                            log.debug("Adding watch to $templateCache for url:", url);
                            if (!$templateCache.watches[url]) {
                                $templateCache.watches[url] = [];
                            }
                            $templateCache.watches[url].push(function (template) {
                                log.debug("Resolving watch on template:", url);
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
                        log.debug("Found template for URL:", url);
                        $timeout(function () {
                            deferred.resolve(answer);
                        }, 1);
                        return deferred.promise;
                    }
                };
                fn['totalPendingRequests'] = 0;
                return fn;
            }]);
    }
})(Core || (Core = {}));
/// <reference path="about/about.module.ts"/>
/// <reference path="auth/auth.module.ts"/>
/// <reference path="config/config.module.ts"/>
/// <reference path="config/config-loader.ts"/>
/// <reference path="core/core.module.ts"/>
/// <reference path="core/hawtio-core.ts"/>
/// <reference path="event-services/event-services.module.ts"/>
/// <reference path="extension/hawtio-extension.module.ts"/>
/// <reference path="help/help.module.ts"/>
/// <reference path="navigation/hawtio-core-navigation.ts"/>
/// <reference path="preferences/preferences.module.ts"/>
/// <reference path="template-cache/hawtio-template-cache.ts"/>
/// <reference path="app.config.ts"/>
/// <reference path="app.component.ts"/>
var App;
(function (App) {
    App.appModule = angular
        .module('hawtio', [
        'ng',
        'ngRoute',
        'ngSanitize',
        'patternfly',
        'patternfly.modals',
        'patternfly.table',
        'patternfly.toolbars',
        About.aboutModule,
        Core.authModule,
        Core.configModule,
        Core.coreModule,
        Core.eventServicesModule,
        Core.hawtioExtensionModule,
        Help.helpModule,
        Nav.pluginName,
        Core.preferencesModule,
        Core.templateCacheModule
    ])
        .run(App.configureAboutPage)
        .component('hawtioApp', App.appComponent)
        .name;
    hawtioPluginLoader
        .addModule(App.appModule)
        .registerPreBootstrapTask({
        name: 'ConfigLoader',
        task: Core.configLoader
    });
})(App || (App = {}));
/// <reference path="hawtio-tab.ts"/>
var Nav;
(function (Nav) {
    var HawtioTabsController = /** @class */ (function () {
        HawtioTabsController.$inject = ["$document", "$timeout", "$location"];
        function HawtioTabsController($document, $timeout, $location) {
            'ngInject';
            this.$document = $document;
            this.$timeout = $timeout;
            this.$location = $location;
        }
        HawtioTabsController.prototype.$onChanges = function (changesObj) {
            if (this.tabs) {
                this.adjustTabs();
                this.activateTab(changesObj);
            }
        };
        HawtioTabsController.prototype.activateTab = function (changesObj) {
            if (changesObj.activeTab && changesObj.activeTab.currentValue) {
                this.activeTab = _.find(this.tabs, function (tab) { return tab === changesObj.activeTab.currentValue; });
            }
            else {
                var tab = _.find(this.tabs, { path: this.$location.path() });
                if (tab) {
                    this.activeTab = tab;
                    this.$location.path(tab.path);
                }
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
                var tabsWidth = 0;
                $liTabs.each(function (i, element) {
                    tabsWidth += element.clientWidth;
                    _this.tabs[i].visible = tabsWidth < availableWidth;
                });
                _this.adjustingTabs = false;
            });
        };
        Object.defineProperty(HawtioTabsController.prototype, "visibleTabs", {
            get: function () {
                return _.filter(this.tabs, { 'visible': true });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HawtioTabsController.prototype, "moreTabs", {
            get: function () {
                return _.filter(this.tabs, { 'visible': false });
            },
            enumerable: true,
            configurable: true
        });
        HawtioTabsController.prototype.onClick = function (tab) {
            this.activeTab = tab;
            this.onChange({ tab: tab });
        };
        return HawtioTabsController;
    }());
    Nav.HawtioTabsController = HawtioTabsController;
    Nav.hawtioTabsComponent = {
        bindings: {
            tabs: '<',
            activeTab: '<',
            onChange: '&',
        },
        template: "\n      <ul class=\"nav nav-tabs hawtio-tabs\" ng-if=\"$ctrl.tabs\">\n        <li ng-repeat=\"tab in $ctrl.visibleTabs track by tab.path\" class=\"hawtio-tab\" \n            ng-class=\"{invisible: $ctrl.adjustingTabs, active: tab === $ctrl.activeTab}\">\n          <a href=\"#\" ng-click=\"$ctrl.onClick(tab)\">{{tab.label}}</a>\n        </li>\n        <li class=\"dropdown\" ng-class=\"{invisible: $ctrl.moreTabs.length === 0}\">\n          <a id=\"moreDropdown\" class=\"dropdown-toggle\" href=\"\" data-toggle=\"dropdown\">\n            More\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"moreDropdown\">\n            <li role=\"presentation\" ng-repeat=\"tab in $ctrl.moreTabs track by tab.label\">\n              <a role=\"menuitem\" tabindex=\"-1\" href=\"#\" ng-click=\"$ctrl.onClick(tab)\">{{tab.label}}</a>\n            </li>\n          </ul>\n        </li>\n      </ul>\n    ",
        controller: HawtioTabsController
    };
    Nav._module.component('hawtioTabs', Nav.hawtioTabsComponent);
})(Nav || (Nav = {}));
/// <reference path="hawtio-core-navigation.ts"/>
var Nav;
(function (Nav) {
    var NavBarController = /** @class */ (function () {
        NavBarController.$inject = ["userDetails"];
        function NavBarController(userDetails) {
            'ngInject';
            this.userDetails = userDetails;
            this.verticalNavCollapsed = false;
            this.username = userDetails['fullName'];
            console.log(userDetails);
        }
        NavBarController.prototype.toggleVerticalNav = function () {
            this.verticalNavCollapsed = !this.verticalNavCollapsed;
            this.onToggleVerticalNav({ collapsed: this.verticalNavCollapsed });
        };
        return NavBarController;
    }());
    Nav.NavBarController = NavBarController;
    Nav.navBarComponent = {
        bindings: {
            onToggleVerticalNav: '&'
        },
        template: "\n      <nav class=\"navbar navbar-pf-vertical\">\n        <div class=\"navbar-header\">\n          <button type=\"button\" class=\"navbar-toggle\" ng-click=\"$ctrl.toggleVerticalNav()\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n          </button>        \n          <a href=\".\" class=\"navbar-brand\">\n            <hawtio-branding-image class=\"navbar-brand-name\" src=\"appLogoUrl\" alt=\"appName\"></hawtio-branding-image>\n          </a>\n        </div>\n        <nav class=\"collapse navbar-collapse\">\n          <ul class=\"nav navbar-nav navbar-right navbar-iconic\">\n            <li class=\"dropdown\">\n              <a class=\"dropdown-toggle nav-item-iconic\" id=\"helpDropdownMenu\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n                <span title=\"Help\" class=\"fa pficon-help\"></span>\n                <span class=\"caret\"></span>\n              </a>\n              <ul class=\"dropdown-menu\" aria-labelledby=\"helpDropdownMenu\">\n                <li hawtio-extension name=\"hawtio-help\"></li>\n                <li hawtio-extension name=\"hawtio-about\"></li>\n              </ul>\n            </li>\n            <li class=\"dropdown\">\n              <a class=\"dropdown-toggle nav-item-iconic\" id=\"userDropdownMenu\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n                <span class=\"fa pf-icon pficon-user\" aria-hidden=\"true\"></span>\n                <span class=\"username truncate\">{{$ctrl.username}}</span> <span class=\"caret\" aria-hidden=\"true\"></span>\n              </a>\n              <ul class=\"dropdown-menu\" aria-labelledby=\"userDropdownMenu\">\n                <li hawtio-extension name=\"hawtio-preferences\"></li>\n                <li hawtio-extension name=\"hawtio-logout\"></li>\n              </ul>\n            </li>\n          </ul>\n        </nav>\n      </nav>\n    ",
        controller: NavBarController
    };
    Nav._module.component('navBar', Nav.navBarComponent);
})(Nav || (Nav = {}));
/// <reference path="hawtio-core-navigation.ts"/>
var Nav;
(function (Nav) {
    var VerticalNavController = /** @class */ (function () {
        function VerticalNavController() {
            this.showSecondaryNav = false;
        }
        VerticalNavController.prototype.onHover = function (item) {
            if (item.tabs && item.tabs.length > 0) {
                item.isHover = true;
                this.showSecondaryNav = true;
            }
        };
        VerticalNavController.prototype.onUnHover = function (item) {
            if (this.showSecondaryNav) {
                item.isHover = false;
                this.showSecondaryNav = false;
            }
        };
        return VerticalNavController;
    }());
    Nav.VerticalNavController = VerticalNavController;
    Nav.verticalNavComponent = {
        bindings: {
            collapsed: '<'
        },
        template: "\n      <div class=\"nav-pf-vertical nav-pf-vertical-with-sub-menus hidden-icons-pf nav-hawtio-vertical\"\n           ng-class=\"{'hover-secondary-nav-pf': $ctrl.showSecondaryNav, collapsed: $ctrl.collapsed}\">\n        <ul class=\"list-group\" hawtio-main-nav></ul>\n      </div>\n    ",
        controller: VerticalNavController
    };
    Nav._module.component('verticalNav', Nav.verticalNavComponent);
})(Nav || (Nav = {}));
var ArrayHelpers;
(function (ArrayHelpers) {
    /**
     * Removes elements in the target array based on the new collection, returns true if
     * any changes were made
     */
    function removeElements(collection, newCollection, index) {
        if (index === void 0) { index = 'id'; }
        var oldLength = collection.length;
        _.remove(collection, function (item) { return !_.some(newCollection, function (c) { return c[index] === item[index]; }); });
        return collection.length !== oldLength;
    }
    ArrayHelpers.removeElements = removeElements;
    /**
     * Changes the existing collection to match the new collection to avoid re-assigning
     * the array pointer, returns true if the array size has changed
     */
    function sync(collection, newCollection, index) {
        if (index === void 0) { index = 'id'; }
        var answer = removeElements(collection, newCollection, index);
        if (newCollection) {
            newCollection.forEach(function (item) {
                var oldItem = _.find(collection, function (c) { return c[index] === item[index]; });
                if (!oldItem) {
                    answer = true;
                    collection.push(item);
                }
                else {
                    if (item !== oldItem) {
                        angular.copy(item, oldItem);
                        answer = true;
                    }
                }
            });
        }
        return answer;
    }
    ArrayHelpers.sync = sync;
})(ArrayHelpers || (ArrayHelpers = {}));
var StringHelpers;
(function (StringHelpers) {
    var dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:/i;
    function isDate(str) {
        if (!angular.isString(str)) {
            // we only deal with strings
            return false;
        }
        return dateRegex.test(str);
    }
    StringHelpers.isDate = isDate;
    /**
     * Convert a string into a bunch of '*' of the same length
     * @param str
     * @returns {string}
     */
    function obfusicate(str) {
        if (!angular.isString(str)) {
            // return null so we don't show any old random non-string thing
            return null;
        }
        return str.split('').map(function (c) { return '*'; }).join('');
    }
    StringHelpers.obfusicate = obfusicate;
    /**
     * Simple toString that obscures any field called 'password'
     * @param obj
     * @returns {string}
     */
    function toString(obj) {
        if (!obj) {
            return '{ null }';
        }
        var answer = [];
        angular.forEach(obj, function (value, key) {
            var val = value;
            if (('' + key).toLowerCase() === 'password') {
                val = StringHelpers.obfusicate(value);
            }
            else if (angular.isObject(val)) {
                val = toString(val);
            }
            answer.push(key + ': ' + val);
        });
        return '{ ' + answer.join(', ') + ' }';
    }
    StringHelpers.toString = toString;
})(StringHelpers || (StringHelpers = {}));
/// <reference path="baseHelpers.ts"/>
var UrlHelpers;
(function (UrlHelpers) {
    var log = Logger.get("hawtio-core-utils-url-helpers");
    /**
     * Returns the URL without the starting '#' if it's there
     * @param url
     * @returns {string}
     */
    function noHash(url) {
        if (url && _.startsWith(url, '#')) {
            return url.substring(1);
        }
        else {
            return url;
        }
    }
    UrlHelpers.noHash = noHash;
    function extractPath(url) {
        if (url.indexOf('?') !== -1) {
            return url.split('?')[0];
        }
        else {
            return url;
        }
    }
    UrlHelpers.extractPath = extractPath;
    /**
     * Returns whether or not the context is in the supplied URL.  If the search string starts/ends with '/' then the entire URL is checked.  If the search string doesn't start with '/' then the search string is compared against the end of the URL.  If the search string starts with '/' but doesn't end with '/' then the start of the URL is checked, excluding any '#'
     * @param url
     * @param thingICareAbout
     * @returns {boolean}
     */
    function contextActive(url, thingICareAbout) {
        var cleanUrl = extractPath(url);
        if (_.endsWith(thingICareAbout, '/') && _.startsWith(thingICareAbout, "/")) {
            return cleanUrl.indexOf(thingICareAbout) > -1;
        }
        if (_.startsWith(thingICareAbout, "/")) {
            return _.startsWith(noHash(cleanUrl), thingICareAbout);
        }
        return _.endsWith(cleanUrl, thingICareAbout);
    }
    UrlHelpers.contextActive = contextActive;
    /**
     * Joins the supplied strings together using '/', stripping any leading/ending '/'
     * from the supplied strings if needed, except the first and last string
     * @returns {string}
     */
    function join() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var tmp = [];
        var length = paths.length - 1;
        paths.forEach(function (path, index) {
            if (Core.isBlank(path)) {
                return;
            }
            if (path === '/') {
                tmp.push('');
                return;
            }
            if (index !== 0 && path.match(/^\//)) {
                path = path.slice(1);
            }
            if (index !== length && path.match(/\/$/)) {
                path = path.slice(0, path.length - 1);
            }
            if (!Core.isBlank(path)) {
                tmp.push(path);
            }
        });
        var rc = tmp.join('/');
        return rc;
    }
    UrlHelpers.join = join;
    function parseQueryString(text) {
        var uri = new URI(text);
        return URI.parseQuery(uri.query());
    }
    UrlHelpers.parseQueryString = parseQueryString;
    /**
     * Apply a proxy to the supplied URL if the jolokiaUrl is using the proxy, or if the URL is for a a different host/port
     * @param jolokiaUrl
     * @param url
     * @returns {*}
     */
    function maybeProxy(jolokiaUrl, url) {
        if (jolokiaUrl && _.startsWith(jolokiaUrl, 'proxy/')) {
            log.debug("Jolokia URL is proxied, applying proxy to:", url);
            return join('proxy', url);
        }
        var origin = window.location['origin'];
        if (url && (_.startsWith(url, 'http') && !_.startsWith(url, origin))) {
            log.debug("Url doesn't match page origin:", origin, "applying proxy to:", url);
            return join('proxy', url);
        }
        log.debug("No need to proxy:", url);
        return url;
    }
    UrlHelpers.maybeProxy = maybeProxy;
    /**
     * Escape any colons in the URL for ng-resource, mostly useful for handling proxified URLs
     * @param url
     * @returns {*}
     */
    function escapeColons(url) {
        var answer = url;
        if (_.startsWith(url, 'proxy')) {
            answer = url.replace(/:/g, '\\:');
        }
        else {
            answer = url.replace(/:([^\/])/, '\\:$1');
        }
        return answer;
    }
    UrlHelpers.escapeColons = escapeColons;
})(UrlHelpers || (UrlHelpers = {}));
/// <reference path="stringHelpers.ts"/>
/// <reference path="urlHelpers.ts"/>
var Core;
(function (Core) {
    var _urlPrefix = null;
    /**
     * Private method to support testing.
     *
     * @private
     */
    function _resetUrlPrefix() {
        _urlPrefix = null;
    }
    Core._resetUrlPrefix = _resetUrlPrefix;
    /**
     * Prefixes absolute URLs with current window.location.pathname
     *
     * @param path
     * @returns {string}
     */
    function url(path) {
        if (path) {
            if (_.startsWith(path, "/")) {
                if (!_urlPrefix) {
                    // lets discover the base url via the base html element
                    _urlPrefix = $('base').attr('href') || "";
                    if (_.endsWith(_urlPrefix, '/')) {
                        _urlPrefix = _urlPrefix.substring(0, _urlPrefix.length - 1);
                    }
                }
                if (_urlPrefix) {
                    return _urlPrefix + path;
                }
            }
        }
        return path;
    }
    Core.url = url;
    /**
     * Returns location of the global window
     *
     * @returns {string}
     */
    function windowLocation() {
        return window.location;
    }
    Core.windowLocation = windowLocation;
    function unescapeHTML(str) {
        var txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    }
    Core.unescapeHTML = unescapeHTML;
    /**
     * Private method to support testing.
     *
     * @private
     */
    function _resetJolokiaUrls() {
        // Add any other known possible jolokia URLs here
        jolokiaUrls = [
            Core.url("jolokia"),
            "/jolokia" // instance that's already installed in a karaf container for example
        ];
        return jolokiaUrls;
    }
    Core._resetJolokiaUrls = _resetJolokiaUrls;
    var jolokiaUrls = Core._resetJolokiaUrls();
    /**
     * Trims the leading prefix from a string if its present
     * @method trimLeading
     * @for Core
     * @static
     * @param {String} text
     * @param {String} prefix
     * @return {String}
     */
    function trimLeading(text, prefix) {
        if (text && prefix) {
            if (_.startsWith(text, prefix) || text.indexOf(prefix) === 0) {
                return text.substring(prefix.length);
            }
        }
        return text;
    }
    Core.trimLeading = trimLeading;
    /**
     * Trims the trailing postfix from a string if its present
     * @method trimTrailing
     * @for Core
     * @static
     * @param {String} trim
     * @param {String} postfix
     * @return {String}
     */
    function trimTrailing(text, postfix) {
        if (text && postfix) {
            if (_.endsWith(text, postfix)) {
                return text.substring(0, text.length - postfix.length);
            }
        }
        return text;
    }
    Core.trimTrailing = trimTrailing;
    /**
     * Ensure our main app container takes up at least the viewport
     * height
     */
    function adjustHeight() {
        var windowHeight = $(window).height();
        var headerHeight = $("#main-nav").height();
        var containerHeight = windowHeight - headerHeight;
        $("#main").css("min-height", "" + containerHeight + "px");
    }
    Core.adjustHeight = adjustHeight;
    function isChromeApp() {
        var answer = false;
        try {
            answer = (chrome && chrome.app && chrome.extension) ? true : false;
        }
        catch (e) {
            answer = false;
        }
        //log.info("isChromeApp is: " + answer);
        return answer;
    }
    Core.isChromeApp = isChromeApp;
    /**
     * Adds the specified CSS file to the document's head, handy
     * for external plugins that might bring along their own CSS
     *
     * @param path
     */
    function addCSS(path) {
        if ('createStyleSheet' in document) {
            // IE9
            document.createStyleSheet(path);
        }
        else {
            // Everyone else
            var link = $("<link>");
            $("head").append(link);
            link.attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: path
            });
        }
    }
    Core.addCSS = addCSS;
    var dummyStorage = {};
    /**
     * Wrapper to get the window local storage object
     *
     * @returns {WindowLocalStorage}
     */
    function getLocalStorage() {
        // TODO Create correct implementation of windowLocalStorage
        var storage = window.localStorage || (function () {
            return dummyStorage;
        })();
        return storage;
    }
    Core.getLocalStorage = getLocalStorage;
    /**
     * If the value is not an array then wrap it in one
     *
     * @method asArray
     * @for Core
     * @static
     * @param {any} value
     * @return {Array}
     */
    function asArray(value) {
        return angular.isArray(value) ? value : [value];
    }
    Core.asArray = asArray;
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
    function parseBooleanValue(value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        if (!angular.isDefined(value) || !value) {
            return defaultValue;
        }
        if (value.constructor === Boolean) {
            return value;
        }
        if (angular.isString(value)) {
            switch (value.toLowerCase()) {
                case "true":
                case "1":
                case "yes":
                    return true;
                default:
                    return false;
            }
        }
        if (angular.isNumber(value)) {
            return value !== 0;
        }
        throw new Error("Can't convert value " + value + " to boolean");
    }
    Core.parseBooleanValue = parseBooleanValue;
    function toString(value) {
        if (angular.isNumber(value)) {
            return numberToString(value);
        }
        else {
            return angular.toJson(value, true);
        }
    }
    Core.toString = toString;
    /**
     * Converts boolean value to string "true" or "false"
     *
     * @param value
     * @returns {string}
     */
    function booleanToString(value) {
        return "" + value;
    }
    Core.booleanToString = booleanToString;
    /**
     * object to integer converter
     *
     * @param value
     * @param description
     * @returns {*}
     */
    function parseIntValue(value, description) {
        if (description === void 0) { description = "integer"; }
        if (angular.isString(value)) {
            try {
                return parseInt(value);
            }
            catch (e) {
                console.log("Failed to parse " + description + " with text '" + value + "'");
            }
        }
        else if (angular.isNumber(value)) {
            return value;
        }
        return null;
    }
    Core.parseIntValue = parseIntValue;
    /**
     * Formats numbers as Strings.
     *
     * @param value
     * @returns {string}
     */
    function numberToString(value) {
        return "" + value;
    }
    Core.numberToString = numberToString;
    /**
     * object to integer converter
     *
     * @param value
     * @param description
     * @returns {*}
     */
    function parseFloatValue(value, description) {
        if (description === void 0) { description = "float"; }
        if (angular.isString(value)) {
            try {
                return parseFloat(value);
            }
            catch (e) {
                console.log("Failed to parse " + description + " with text '" + value + "'");
            }
        }
        else if (angular.isNumber(value)) {
            return value;
        }
        return null;
    }
    Core.parseFloatValue = parseFloatValue;
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
    function pathGet(object, paths) {
        var pathArray = (angular.isArray(paths)) ? paths : (paths || "").split(".");
        var value = object;
        angular.forEach(pathArray, function (name) {
            if (value) {
                try {
                    value = value[name];
                }
                catch (e) {
                    // ignore errors
                    return null;
                }
            }
            else {
                return null;
            }
        });
        return value;
    }
    Core.pathGet = pathGet;
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
    function pathSet(object, paths, newValue) {
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
    }
    Core.pathSet = pathSet;
    function getPhase($scope) {
        if ($scope.$$phase) {
            return $scope.$$phase;
        }
        if (HawtioCore.injector) {
            var $rootScope = HawtioCore.injector.get('$rootScope');
            if ($rootScope) {
                return $rootScope.$$phase;
            }
        }
    }
    /**
     * Performs a $scope.$apply() if not in a digest right now otherwise it will fire a digest later
     *
     * @method $applyNowOrLater
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $applyNowOrLater($scope) {
        if (getPhase($scope)) {
            setTimeout(function () {
                Core.$apply($scope);
            }, 50);
        }
        else {
            $scope.$apply();
        }
    }
    Core.$applyNowOrLater = $applyNowOrLater;
    /**
     * Performs a $scope.$apply() after the given timeout period
     *
     * @method $applyLater
     * @for Core
     * @static
     * @param {*} $scope
     * @param {Integer} timeout
     */
    function $applyLater($scope, timeout) {
        if (timeout === void 0) { timeout = 50; }
        setTimeout(function () {
            Core.$apply($scope);
        }, timeout);
    }
    Core.$applyLater = $applyLater;
    /**
     * Performs a $scope.$apply() if not in a digest or apply phase on the given scope
     *
     * @method $apply
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $apply($scope) {
        var phase = getPhase($scope);
        if (!phase) {
            $scope.$apply();
        }
    }
    Core.$apply = $apply;
    /**
     * Performs a $scope.$digest() if not in a digest or apply phase on the given scope
     *
     * @method $apply
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $digest($scope) {
        var phase = getPhase($scope);
        if (!phase) {
            $scope.$digest();
        }
    }
    Core.$digest = $digest;
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
    function getOrCreateElements(domElement, arrayOfElementNames) {
        var element = domElement;
        angular.forEach(arrayOfElementNames, function (name) {
            if (element) {
                var children = $(element).children(name);
                if (!children || !children.length) {
                    $("<" + name + "></" + name + ">").appendTo(element);
                    children = $(element).children(name);
                }
                element = children;
            }
        });
        return element;
    }
    Core.getOrCreateElements = getOrCreateElements;
    var _escapeHtmlChars = {
        "#": "&#35;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
    };
    /**
     * static unescapeHtml
     *
     * @param str
     * @returns {any}
     */
    function unescapeHtml(str) {
        angular.forEach(_escapeHtmlChars, function (value, key) {
            var regex = new RegExp(value, "g");
            str = str.replace(regex, key);
        });
        str = str.replace(/&gt;/g, ">");
        return str;
    }
    Core.unescapeHtml = unescapeHtml;
    /**
     * static escapeHtml method
     *
     * @param str
     * @returns {*}
     */
    function escapeHtml(str) {
        if (angular.isString(str)) {
            var newStr = "";
            for (var i = 0; i < str.length; i++) {
                var ch = str.charAt(i);
                ch = _escapeHtmlChars[ch] || ch;
                newStr += ch;
            }
            return newStr;
        }
        else {
            return str;
        }
    }
    Core.escapeHtml = escapeHtml;
    /**
     * Returns true if the string is either null or empty
     *
     * @method isBlank
     * @for Core
     * @static
     * @param {String} str
     * @return {Boolean}
     */
    function isBlank(str) {
        if (str === undefined || str === null) {
            return true;
        }
        if (angular.isString(str)) {
            return str.trim().length === 0;
        }
        else {
            // TODO - not undefined but also not a string...
            return false;
        }
    }
    Core.isBlank = isBlank;
    /**
     * removes all quotes/apostrophes from beginning and end of string
     *
     * @param text
     * @returns {string}
     */
    function trimQuotes(text) {
        return _.trim(text, ' \'"');
    }
    Core.trimQuotes = trimQuotes;
    /**
     * Converts camel-case and dash-separated strings into Human readable forms
     *
     * @param value
     * @returns {*}
     */
    function humanizeValue(value) {
        if (value) {
            var text = value + '';
            if (Core.isBlank(text)) {
                return text;
            }
            try {
                text = _.snakeCase(text);
                text = _.capitalize(text.split('_').join(' '));
            }
            catch (e) {
                // ignore
            }
            return trimQuotes(text);
        }
        return value;
    }
    Core.humanizeValue = humanizeValue;
})(Core || (Core = {}));
var HawtioCompile;
(function (HawtioCompile) {
    var pluginName = 'hawtio-core-compile';
    var log = Logger.get(pluginName);
    HawtioCompile._module = angular
        .module(pluginName, [])
        .run(function () {
        log.debug("Module loaded");
    })
        .directive('compile', ['$compile', function ($compile) {
            return function (scope, element, attrs) {
                scope.$watch(function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                }, function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                });
            };
        }]);
    hawtioPluginLoader.addModule(pluginName);
})(HawtioCompile || (HawtioCompile = {}));
var ControllerHelpers;
(function (ControllerHelpers) {
    var log = Logger.get("hawtio-core-utils-controller-helpers");
    function createClassSelector(config) {
        return function (selector, model) {
            if (selector === model && selector in config) {
                return config[selector];
            }
            return '';
        };
    }
    ControllerHelpers.createClassSelector = createClassSelector;
    function createValueClassSelector(config) {
        return function (model) {
            if (model in config) {
                return config[model];
            }
            else {
                return '';
            }
        };
    }
    ControllerHelpers.createValueClassSelector = createValueClassSelector;
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
    function bindModelToSearchParam($scope, $location, modelName, paramName, initialValue, to, from) {
        if (!(modelName in $scope)) {
            $scope[modelName] = initialValue;
        }
        var toConverter = to || Core.doNothing;
        var fromConverter = from || Core.doNothing;
        function currentValue() {
            return fromConverter($location.search()[paramName] || initialValue);
        }
        var value = currentValue();
        Core.pathSet($scope, modelName, value);
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
    }
    ControllerHelpers.bindModelToSearchParam = bindModelToSearchParam;
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
    function reloadWhenParametersChange($route, $scope, $location, parameters) {
        if (parameters === void 0) { parameters = ["nid"]; }
        var initial = angular.copy($location.search());
        $scope.$on('$routeUpdate', function () {
            // lets check if any of the parameters changed
            var current = $location.search();
            var changed = [];
            angular.forEach(parameters, function (param) {
                if (current[param] !== initial[param]) {
                    changed.push(param);
                }
            });
            if (changed.length) {
                log.debug("Reloading page due to change to parameters:", changed);
                $route.reload();
            }
        });
    }
    ControllerHelpers.reloadWhenParametersChange = reloadWhenParametersChange;
})(ControllerHelpers || (ControllerHelpers = {}));
/// <reference path="baseHelpers.ts"/>
/// <reference path="controllerHelpers.ts"/>
var Core;
(function (Core) {
    var log = Logger.get("hawtio-core-utils");
    Core.lazyLoaders = {};
    Core.numberTypeNames = {
        'byte': true,
        'short': true,
        'int': true,
        'long': true,
        'float': true,
        'double': true,
        'java.lang.byte': true,
        'java.lang.short': true,
        'java.lang.integer': true,
        'java.lang.long': true,
        'java.lang.float': true,
        'java.lang.double': true
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
    function lineCount(value) {
        var rows = 0;
        if (value) {
            rows = 1;
            value.toString().each(/\n/, function () { return rows++; });
        }
        return rows;
    }
    Core.lineCount = lineCount;
    function safeNull(value) {
        if (typeof value === 'boolean') {
            return value + '';
        }
        else if (typeof value === 'number') {
            // return numbers as-is
            return value + '';
        }
        if (value) {
            return value;
        }
        else {
            return "";
        }
    }
    Core.safeNull = safeNull;
    function safeNullAsString(value, type) {
        if (typeof value === 'boolean') {
            return "" + value;
        }
        else if (typeof value === 'number') {
            // return numbers as-is
            return "" + value;
        }
        else if (typeof value === 'string') {
            // its a string
            return "" + value;
        }
        else if (type === 'javax.management.openmbean.CompositeData' || type === '[Ljavax.management.openmbean.CompositeData;' || type === 'java.util.Map') {
            // composite data or composite data array, we just display as json
            // use json representation
            var data = angular.toJson(value, true);
            return data;
        }
        else if (type === 'javax.management.ObjectName') {
            return "" + (value == null ? "" : value.canonicalName);
        }
        else if (type === 'javax.management.openmbean.TabularData') {
            // tabular data is a key/value structure so loop each field and convert to array we can
            // turn into a String
            var arr = [];
            for (var key in value) {
                var val = value[key];
                var line = "" + key + "=" + val;
                arr.push(line);
            }
            // sort array so the values is listed nicely
            arr = _.sortBy(arr, function (row) { return row.toString(); });
            return arr.join("\n");
        }
        else if (angular.isArray(value)) {
            // join array with new line, and do not sort as the order in the array may matter
            return value.join("\n");
        }
        else if (value) {
            // force as string
            return "" + value;
        }
        else {
            return "";
        }
    }
    Core.safeNullAsString = safeNullAsString;
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
    function toSearchArgumentArray(value) {
        if (value) {
            if (angular.isArray(value))
                return value;
            if (angular.isString(value))
                return value.split(',');
        }
        return [];
    }
    Core.toSearchArgumentArray = toSearchArgumentArray;
    function folderMatchesPatterns(node, patterns) {
        if (node) {
            var folderNames_1 = node.folderNames;
            if (folderNames_1) {
                return patterns.any(function (ignorePaths) {
                    for (var i = 0; i < ignorePaths.length; i++) {
                        var folderName = folderNames_1[i];
                        var ignorePath = ignorePaths[i];
                        if (!folderName)
                            return false;
                        var idx = ignorePath.indexOf(folderName);
                        if (idx < 0) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        }
        return false;
    }
    Core.folderMatchesPatterns = folderMatchesPatterns;
    function scopeStoreJolokiaHandle($scope, jolokia, jolokiaHandle) {
        // TODO do we even need to store the jolokiaHandle in the scope?
        if (jolokiaHandle) {
            $scope.$on('$destroy', function () {
                closeHandle($scope, jolokia);
            });
            $scope.jolokiaHandle = jolokiaHandle;
        }
    }
    Core.scopeStoreJolokiaHandle = scopeStoreJolokiaHandle;
    function closeHandle($scope, jolokia) {
        var jolokiaHandle = $scope.jolokiaHandle;
        if (jolokiaHandle) {
            //console.log('Closing the handle ' + jolokiaHandle);
            jolokia.unregister(jolokiaHandle);
            $scope.jolokiaHandle = null;
        }
    }
    Core.closeHandle = closeHandle;
    /**
     * Pass in null for the success function to switch to sync mode
     *
     * @method onSuccess
     * @static
     * @param {Function} Success callback function
     * @param {Object} Options object to pass on to Jolokia request
     * @return {Object} initialized options object
     */
    function onSuccess(fn, options) {
        if (options === void 0) { options = {}; }
        options['mimeType'] = 'application/json';
        if (!_.isUndefined(fn)) {
            options['success'] = fn;
        }
        if (!options['method']) {
            options['method'] = "POST";
        }
        // the default (unsorted) order is important for Karaf runtime
        options['canonicalNaming'] = false;
        options['canonicalProperties'] = false;
        if (!options['error']) {
            options['error'] = function (response) { return defaultJolokiaErrorHandler(response, options); };
        }
        return options;
    }
    Core.onSuccess = onSuccess;
    /**
     * The default error handler which logs errors either using debug or log level logging based on the silent setting
     * @param response the response from a jolokia request
     */
    function defaultJolokiaErrorHandler(response, options) {
        if (options === void 0) { options = {}; }
        var operation = Core.pathGet(response, ['request', 'operation']) || "unknown";
        var silent = options['silent'];
        var stacktrace = response.stacktrace;
        if (silent || isIgnorableException(response)) {
            log.debug("Operation", operation, "failed due to:", response['error']);
        }
        else {
            log.warn("Operation", operation, "failed due to:", response['error']);
        }
    }
    Core.defaultJolokiaErrorHandler = defaultJolokiaErrorHandler;
    /**
     * Checks if it's an error that can happen on timing issues such as its been removed or if we run against older containers
     * @param {Object} response the error response from a jolokia request
     */
    function isIgnorableException(response) {
        var isNotFound = function (target) {
            return target.indexOf("InstanceNotFoundException") >= 0
                || target.indexOf("AttributeNotFoundException") >= 0
                || target.indexOf("IllegalArgumentException: No operation") >= 0;
        };
        return (response.stacktrace && isNotFound(response.stacktrace)) || (response.error && isNotFound(response.error));
    }
    /**
     * Logs any failed operation and stack traces
     */
    function logJolokiaStackTrace(response) {
        var stacktrace = response.stacktrace;
        if (stacktrace) {
            var operation = Core.pathGet(response, ['request', 'operation']) || "unknown";
            log.info("Operation", operation, "failed due to:", response['error']);
        }
    }
    Core.logJolokiaStackTrace = logJolokiaStackTrace;
    function supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        }
        catch (e) {
            return false;
        }
    }
    Core.supportsLocalStorage = supportsLocalStorage;
    function isNumberTypeName(typeName) {
        if (typeName) {
            var text = typeName.toString().toLowerCase();
            var flag = Core.numberTypeNames[text];
            return flag;
        }
        return false;
    }
    Core.isNumberTypeName = isNumberTypeName;
    /**
     * Applies the Jolokia escaping rules to the mbean name.
     * See: http://www.jolokia.org/reference/html/protocol.html#escape-rules
     *
     * @param {string} mbean the mbean
     * @returns {string}
     */
    function applyJolokiaEscapeRules(mbean) {
        return mbean
            .replace(/!/g, '!!')
            .replace(/\//g, '!/')
            .replace(/"/g, '!"');
    }
    /**
     * Escapes the mbean for Jolokia GET requests.
     *
     * @param {string} mbean the mbean
     * @returns {string}
     */
    function escapeMBean(mbean) {
        return encodeURI(applyJolokiaEscapeRules(mbean));
    }
    Core.escapeMBean = escapeMBean;
    /**
     * Escapes the mbean as a path for Jolokia POST "list" requests.
     * See: https://jolokia.org/reference/html/protocol.html#list
     *
     * @param {string} mbean the mbean
     * @returns {string}
     */
    function escapeMBeanPath(mbean) {
        return applyJolokiaEscapeRules(mbean).replace(':', '/');
    }
    Core.escapeMBeanPath = escapeMBeanPath;
    function escapeDots(text) {
        return text.replace(/\./g, '-');
    }
    Core.escapeDots = escapeDots;
    /**
     * Escapes all dots and 'span' text in the css style names to avoid clashing with bootstrap stuff
     *
     * @method escapeTreeCssStyles
     * @static
     * @param {String} text
     * @return {String}
     */
    function escapeTreeCssStyles(text) {
        return escapeDots(text).replace(/span/g, 'sp-an');
    }
    Core.escapeTreeCssStyles = escapeTreeCssStyles;
    function showLogPanel() {
        var log = $("#log-panel");
        var body = $('body');
        localStorage['showLog'] = 'true';
        log.css({ 'bottom': '50%' });
        body.css({
            'overflow-y': 'hidden'
        });
    }
    Core.showLogPanel = showLogPanel;
    /**
     * Returns the CSS class for a log level based on if its info, warn, error etc.
     *
     * @method logLevelClass
     * @static
     * @param {String} level
     * @return {String}
     */
    function logLevelClass(level) {
        if (level) {
            var first = level[0];
            if (first === 'w' || first === "W") {
                return "warning";
            }
            else if (first === 'e' || first === "E") {
                return "error";
            }
            else if (first === 'i' || first === "I") {
                return "info";
            }
            else if (first === 'd' || first === "D") {
                // we have no debug css style
                return "";
            }
        }
        return "";
    }
    Core.logLevelClass = logLevelClass;
    function toPath(hashUrl) {
        if (Core.isBlank(hashUrl)) {
            return hashUrl;
        }
        if (_.startsWith(hashUrl, "#")) {
            return hashUrl.substring(1);
        }
        else {
            return hashUrl;
        }
    }
    Core.toPath = toPath;
    function parseMBean(mbean) {
        var answer = {};
        var parts = mbean.split(":");
        if (parts.length > 1) {
            answer['domain'] = _.first(parts);
            parts = _.without(parts, _.first(parts));
            parts = parts.join(":");
            answer['attributes'] = {};
            var nameValues = parts.split(",");
            nameValues.forEach(function (str) {
                var nameValue = str.split('=');
                var name = _.first(nameValue).trim();
                nameValue = _.without(nameValue, _.first(nameValue));
                answer['attributes'][name] = nameValue.join('=').trim();
            });
        }
        return answer;
    }
    Core.parseMBean = parseMBean;
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
    function createHref($location, href, removeParams) {
        if (removeParams === void 0) { removeParams = null; }
        var hashMap = angular.copy($location.search());
        // lets remove any top level nav bar related hash searches
        if (removeParams) {
            angular.forEach(removeParams, function (param) { return delete hashMap[param]; });
        }
        var hash = Core.hashToString(hashMap);
        if (hash) {
            var prefix = (href.indexOf("?") >= 0) ? "&" : "?";
            href += prefix + hash;
        }
        return href;
    }
    Core.createHref = createHref;
    /**
     * Turns the given search hash into a URI style query string
     * @method hashToString
     * @for Core
     * @static
     * @param {Object} hash
     * @return {String}
     */
    function hashToString(hash) {
        var keyValuePairs = [];
        angular.forEach(hash, function (value, key) {
            keyValuePairs.push(key + "=" + value);
        });
        var params = keyValuePairs.join("&");
        return encodeURI(params);
    }
    Core.hashToString = hashToString;
    /**
     * Parses the given string of x=y&bar=foo into a hash
     * @method stringToHash
     * @for Core
     * @static
     * @param {String} hashAsString
     * @return {Object}
     */
    function stringToHash(hashAsString) {
        var entries = {};
        if (hashAsString) {
            var text = decodeURI(hashAsString);
            var items = text.split('&');
            angular.forEach(items, function (item) {
                var kv = item.split('=');
                var key = kv[0];
                var value = kv[1] || key;
                entries[key] = value;
            });
        }
        return entries;
    }
    Core.stringToHash = stringToHash;
    /**
     * Register a JMX operation to poll for changes, only
     * calls back when a change occurs
     *
     * @param jolokia
     * @param scope
     * @param arguments
     * @param callback
     * @param options
     * @returns Object
     */
    function registerForChanges(jolokia, $scope, arguments, callback, options) {
        var decorated = {
            responseJson: '',
            success: function (response) {
                var json = angular.toJson(response.value);
                if (decorated.responseJson !== json) {
                    decorated.responseJson = json;
                    callback(response);
                }
            }
        };
        angular.extend(decorated, options);
        return Core.register(jolokia, $scope, arguments, onSuccess(undefined, decorated));
    }
    Core.registerForChanges = registerForChanges;
    var responseHistory = null;
    function getOrInitObjectFromLocalStorage(key) {
        var answer = undefined;
        if (!(key in localStorage)) {
            localStorage[key] = angular.toJson({});
        }
        return angular.fromJson(localStorage[key]);
    }
    Core.getOrInitObjectFromLocalStorage = getOrInitObjectFromLocalStorage;
    function argumentsToString(arguments) {
        return StringHelpers.toString(arguments);
    }
    function keyForArgument(argument) {
        if (!('type' in argument)) {
            return null;
        }
        var answer = argument['type'];
        switch (answer.toLowerCase()) {
            case 'exec':
                answer += ':' + argument['mbean'] + ':' + argument['operation'];
                var argString = argumentsToString(argument['arguments']);
                if (!Core.isBlank(argString)) {
                    answer += ':' + argString;
                }
                break;
            case 'read':
                answer += ':' + argument['mbean'] + ':' + argument['attribute'];
                break;
            default:
                return null;
        }
        return answer;
    }
    function createResponseKey(arguments) {
        var answer = '';
        if (angular.isArray(arguments)) {
            answer = arguments.map(function (arg) { return keyForArgument(arg); }).join(':');
        }
        else {
            answer = keyForArgument(arguments);
        }
        return answer;
    }
    function getResponseHistory() {
        if (responseHistory === null) {
            //responseHistory = getOrInitObjectFromLocalStorage('responseHistory');
            responseHistory = {};
            log.debug("Created response history", responseHistory);
        }
        return responseHistory;
    }
    Core.getResponseHistory = getResponseHistory;
    Core.MAX_RESPONSE_CACHE_SIZE = 20;
    function getOldestKey(responseHistory) {
        var oldest = null;
        var oldestKey = null;
        angular.forEach(responseHistory, function (value, key) {
            //log.debug("Checking entry: ", key);
            //log.debug("Oldest timestamp: ", oldest, " key: ", key, " value: ", value);
            if (!value || !value.timestamp) {
                // null value is an excellent candidate for deletion
                oldest = 0;
                oldestKey = key;
            }
            else if (oldest === null || value.timestamp < oldest) {
                oldest = value.timestamp;
                oldestKey = key;
            }
        });
        return oldestKey;
    }
    function addResponse(arguments, value) {
        var responseHistory = getResponseHistory();
        var key = createResponseKey(arguments);
        if (key === null) {
            log.debug("key for arguments is null, not caching: ", StringHelpers.toString(arguments));
            return;
        }
        //log.debug("Adding response to history, key: ", key, " value: ", value);
        // trim the cache if needed
        var keys = _.keys(responseHistory);
        //log.debug("Number of stored responses: ", keys.length);
        if (keys.length >= Core.MAX_RESPONSE_CACHE_SIZE) {
            log.debug("Cache limit (", Core.MAX_RESPONSE_CACHE_SIZE, ") met or  exceeded (", keys.length, "), trimming oldest response");
            var oldestKey = getOldestKey(responseHistory);
            if (oldestKey !== null) {
                // delete the oldest entry
                log.debug("Deleting key: ", oldestKey);
                delete responseHistory[oldestKey];
            }
            else {
                log.debug("Got null key, could be a cache problem, wiping cache");
                keys.forEach(function (key) {
                    log.debug("Deleting key: ", key);
                    delete responseHistory[key];
                });
            }
        }
        responseHistory[key] = value;
        //localStorage['responseHistory'] = angular.toJson(responseHistory);
    }
    function getResponse(jolokia, arguments, callback) {
        var responseHistory = getResponseHistory();
        var key = createResponseKey(arguments);
        if (key === null) {
            jolokia.request(arguments, callback);
            return;
        }
        if (key in responseHistory && 'success' in callback) {
            var value_1 = responseHistory[key];
            // do this async, the controller might not handle us immediately calling back
            setTimeout(function () {
                callback['success'](value_1);
            }, 10);
        }
        else {
            log.debug("Unable to find existing response for key: ", key);
            jolokia.request(arguments, callback);
        }
    }
    // end jolokia caching stuff
    /**
     * Register a JMX operation to poll for changes
     * @method register
     * @for Core
     * @static
     * @return {Function} a zero argument function for unregistering  this registration
     * @param {*} jolokia
     * @param {*} scope
     * @param {Object} arguments
     * @param {Function} callback
     */
    function register(jolokia, scope, arguments, callback) {
        if (scope.$$destroyed) {
            // fail fast to prevent registration leaks
            return;
        }
        /*
        if (scope && !Core.isBlank(scope.name)) {
          Core.log.debug("Calling register from scope: ", scope.name);
        } else {
          Core.log.debug("Calling register from anonymous scope");
        }
        */
        if (!angular.isDefined(scope.$jhandle) || !angular.isArray(scope.$jhandle)) {
            //log.debug("No existing handle set, creating one");
            scope.$jhandle = [];
        }
        else {
            //log.debug("Using existing handle set");
        }
        if (angular.isDefined(scope.$on)) {
            scope.$on('$destroy', function (event) {
                unregister(jolokia, scope);
            });
        }
        var handle = null;
        if ('success' in callback) {
            var cb_1 = callback.success;
            var args_1 = arguments;
            callback.success = function (response) {
                addResponse(args_1, response);
                cb_1(response);
            };
        }
        if (angular.isArray(arguments)) {
            if (arguments.length >= 1) {
                // TODO can't get this to compile in typescript :)
                //let args = [callback].concat(arguments);
                var args_2 = [callback];
                angular.forEach(arguments, function (value) { return args_2.push(value); });
                //let args = [callback];
                //args.push(arguments);
                var registerFn = jolokia.register;
                handle = registerFn.apply(jolokia, args_2);
                scope.$jhandle.push(handle);
                getResponse(jolokia, arguments, callback);
            }
        }
        else {
            handle = jolokia.register(callback, arguments);
            scope.$jhandle.push(handle);
            getResponse(jolokia, arguments, callback);
        }
        return function () {
            if (handle !== null) {
                scope.$jhandle.remove(handle);
                jolokia.unregister(handle);
            }
        };
    }
    Core.register = register;
    /**
     * Register a JMX operation to poll for changes using a jolokia search using the given mbean pattern
     * @method registerSearch
     * @for Core
     * @static
     * @paran {*} jolokia
     * @param {*} scope
     * @param {String} mbeanPattern
     * @param {Function} callback
     */
    /*
    TODO - won't compile, and where is 'arguments' coming from?
    export function registerSearch(jolokia:Jolokia.IJolokia, scope, mbeanPattern:string, callback) {
        if (!angular.isDefined(scope.$jhandle) || !angular.isArray(scope.$jhandle)) {
            scope.$jhandle = [];
        }
        if (angular.isDefined(scope.$on)) {
            scope.$on('$destroy', function (event) {
                unregister(jolokia, scope);
            });
        }
        if (angular.isArray(arguments)) {
            if (arguments.length >= 1) {
                // TODO can't get this to compile in typescript :)
                //let args = [callback].concat(arguments);
                let args = [callback];
                angular.forEach(arguments, (value) => args.push(value));
                //let args = [callback];
                //args.push(arguments);
                let registerFn = jolokia.register;
                let handle = registerFn.apply(jolokia, args);
                scope.$jhandle.push(handle);
                jolokia.search(mbeanPattern, callback);
            }
        } else {
            let handle = jolokia.register(callback, arguments);
            scope.$jhandle.push(handle);
            jolokia.search(mbeanPattern, callback);
        }
    }
    */
    function unregister(jolokia, scope) {
        if (angular.isDefined(scope.$jhandle)) {
            scope.$jhandle.forEach(function (handle) {
                jolokia.unregister(handle);
            });
            delete scope.$jhandle;
        }
    }
    Core.unregister = unregister;
    /**
     * Converts the given XML node to a string representation of the XML
     * @method xmlNodeToString
     * @for Core
     * @static
     * @param {Object} xmlNode
     * @return {Object}
     */
    function xmlNodeToString(xmlNode) {
        try {
            // Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
            return (new XMLSerializer()).serializeToString(xmlNode);
        }
        catch (e) {
            try {
                // Internet Explorer.
                return xmlNode.xml;
            }
            catch (e) {
                //Other browsers without XML Serializer
                console.log('WARNING: XMLSerializer not supported');
            }
        }
        return false;
    }
    Core.xmlNodeToString = xmlNodeToString;
    /**
     * Returns true if the given DOM node is a text node
     * @method isTextNode
     * @for Core
     * @static
     * @param {Object} node
     * @return {Boolean}
     */
    function isTextNode(node) {
        return node && node.nodeType === 3;
    }
    Core.isTextNode = isTextNode;
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
    function fileExtension(name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        var extension = defaultValue;
        if (name) {
            var idx = name.lastIndexOf(".");
            if (idx > 0) {
                extension = name.substring(idx + 1, name.length).toLowerCase();
            }
        }
        return extension;
    }
    Core.fileExtension = fileExtension;
    function getUUID() {
        var d = new Date();
        var ms = (d.getTime() * 1000) + d.getUTCMilliseconds();
        var random = Math.floor((1 + Math.random()) * 0x10000);
        return ms.toString(16) + random.toString(16);
    }
    Core.getUUID = getUUID;
    var _versionRegex = /[^\d]*(\d+)\.(\d+)(\.(\d+))?.*/;
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
    function parseVersionNumbers(text) {
        if (text) {
            var m = text.match(_versionRegex);
            if (m && m.length > 4) {
                var m1 = m[1];
                var m2 = m[2];
                var m4 = m[4];
                if (angular.isDefined(m4)) {
                    return [parseInt(m1), parseInt(m2), parseInt(m4)];
                }
                else if (angular.isDefined(m2)) {
                    return [parseInt(m1), parseInt(m2)];
                }
                else if (angular.isDefined(m1)) {
                    return [parseInt(m1)];
                }
            }
        }
        return null;
    }
    Core.parseVersionNumbers = parseVersionNumbers;
    /**
     * Converts a version string with numbers and dots of the form "123.456.790" into a string
     * which is sortable as a string, by left padding each string between the dots to at least 4 characters
     * so things just sort as a string.
     *
     * @param text
     * @return {string} the sortable version string
     */
    function versionToSortableString(version, maxDigitsBetweenDots) {
        if (maxDigitsBetweenDots === void 0) { maxDigitsBetweenDots = 4; }
        return (version || "").split(".").map(function (x) {
            var length = x.length;
            return (length >= maxDigitsBetweenDots)
                ? x : _.padStart(x, maxDigitsBetweenDots - length, ' ');
        }).join(".");
    }
    Core.versionToSortableString = versionToSortableString;
    function time(message, fn) {
        var start = new Date().getTime();
        var answer = fn();
        var elapsed = new Date().getTime() - start;
        console.log(message + " " + elapsed);
        return answer;
    }
    Core.time = time;
    /**
     * Compares the 2 version arrays and returns -1 if v1 is less than v2 or 0 if they are equal or 1 if v1 is greater than v2
     * @method compareVersionNumberArrays
     * @for Core
     * @static
     * @param {Array} v1 an array of version numbers with the most significant version first (major, minor, patch).
     * @param {Array} v2
     * @return {Number}
     */
    function compareVersionNumberArrays(v1, v2) {
        if (v1 && !v2) {
            return 1;
        }
        if (!v1 && v2) {
            return -1;
        }
        if (v1 === v2) {
            return 0;
        }
        for (var i = 0; i < v1.length; i++) {
            var n1 = v1[i];
            if (i >= v2.length) {
                return 1;
            }
            var n2 = v2[i];
            if (!angular.isDefined(n1)) {
                return -1;
            }
            if (!angular.isDefined(n2)) {
                return 1;
            }
            if (n1 > n2) {
                return 1;
            }
            else if (n1 < n2) {
                return -1;
            }
        }
        return 0;
    }
    Core.compareVersionNumberArrays = compareVersionNumberArrays;
    /**
     * Helper function which converts objects into tables of key/value properties and
     * lists into a <ul> for each value.
     * @method valueToHtml
     * @for Core
     * @static
     * @param {any} value
     * @return {String}
     */
    function valueToHtml(value) {
        if (angular.isArray(value)) {
            var size = value.length;
            if (!size) {
                return "";
            }
            else if (size === 1) {
                return valueToHtml(value[0]);
            }
            else {
                var buffer_1 = "<ul>";
                angular.forEach(value, function (childValue) {
                    buffer_1 += "<li>" + valueToHtml(childValue) + "</li>";
                });
                return buffer_1 + "</ul>";
            }
        }
        else if (angular.isObject(value)) {
            var buffer_2 = "<table>";
            angular.forEach(value, function (childValue, key) {
                buffer_2 += "<tr><td>" + key + "</td><td>" + valueToHtml(childValue) + "</td></tr>";
            });
            return buffer_2 + "</table>";
        }
        else if (angular.isString(value)) {
            var uriPrefixes = ["http://", "https://", "file://", "mailto:"];
            var answer_2 = value;
            angular.forEach(uriPrefixes, function (prefix) {
                if (_.startsWith(answer_2, prefix)) {
                    answer_2 = "<a href='" + value + "'>" + value + "</a>";
                }
            });
            return answer_2;
        }
        return value;
    }
    Core.valueToHtml = valueToHtml;
    /**
     * If the string starts and ends with [] {} then try parse as JSON and return the parsed content or return null
     * if it does not appear to be JSON
     * @method tryParseJson
     * @for Core
     * @static
     * @param {String} text
     * @return {Object}
     */
    function tryParseJson(text) {
        text = _.trim(text);
        if ((_.startsWith(text, "[") && _.endsWith(text, "]")) || (_.startsWith(text, "{") && _.endsWith(text, "}"))) {
            try {
                return JSON.parse(text);
            }
            catch (e) {
                // ignore
            }
        }
        return null;
    }
    Core.tryParseJson = tryParseJson;
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
    function maybePlural(count, word) {
        /* TODO - will need to find another dependency for this
        if (word.pluralize) {
          let pluralWord = (count === 1) ? word : word.pluralize();
          return "" + count + " " + pluralWord;
        } else {
        */
        var pluralWord = (count === 1) ? word : word + 's';
        return "" + count + " " + pluralWord;
        //}
    }
    Core.maybePlural = maybePlural;
    /**
     * given a JMX ObjectName of the form <code>domain:key=value,another=something</code> then return the object
     * <code>{key: "value", another: "something"}</code>
     * @method objectNameProperties
     * @for Core
     * @static
     * @param {String} name
     * @return {Object}
     */
    function objectNameProperties(objectName) {
        var entries = {};
        if (objectName) {
            var idx = objectName.indexOf(":");
            if (idx > 0) {
                var path = objectName.substring(idx + 1);
                var items = path.split(',');
                angular.forEach(items, function (item) {
                    var kv = item.split('=');
                    var key = kv[0];
                    var value = kv[1] || key;
                    entries[key] = value;
                });
            }
        }
        return entries;
    }
    Core.objectNameProperties = objectNameProperties;
    /*
    export function setPageTitle($document, title:Core.PageTitle) {
      $document.attr('title', title.getTitleWithSeparator(' '));
    }
  
    export function setPageTitleWithTab($document, title:Core.PageTitle, tab:string) {
      $document.attr('title', title.getTitleWithSeparator(' ') + " " + tab);
    }
    */
    /**
     * Removes dodgy characters from a value such as '/' or '.' so that it can be used as a DOM ID value
     * and used in jQuery / CSS selectors
     * @method toSafeDomID
     * @for Core
     * @static
     * @param {String} text
     * @return {String}
     */
    function toSafeDomID(text) {
        return text ? text.replace(/(\/|\.)/g, "_") : text;
    }
    Core.toSafeDomID = toSafeDomID;
    /**
     * Invokes the given function on each leaf node in the array of folders
     * @method forEachLeafFolder
     * @for Core
     * @static
     * @param {Array[Folder]} folders
     * @param {Function} fn
     */
    function forEachLeafFolder(folders, fn) {
        angular.forEach(folders, function (folder) {
            var children = folder["children"];
            if (angular.isArray(children) && children.length > 0) {
                forEachLeafFolder(children, fn);
            }
            else {
                fn(folder);
            }
        });
    }
    Core.forEachLeafFolder = forEachLeafFolder;
    function extractHashURL(url) {
        var parts = url.split('#');
        if (parts.length === 0) {
            return url;
        }
        var answer = parts[1];
        if (parts.length > 1) {
            var remaining = parts.slice(2);
            remaining.forEach(function (part) {
                answer = answer + "#" + part;
            });
        }
        return answer;
    }
    Core.extractHashURL = extractHashURL;
    var httpRegex = new RegExp('^(https?):\/\/(([^:/?#]*)(?::([0-9]+))?)');
    /**
     * Breaks a URL up into a nice object
     * @method parseUrl
     * @for Core
     * @static
     * @param url
     * @returns object
     */
    function parseUrl(url) {
        if (Core.isBlank(url)) {
            return null;
        }
        var matches = url.match(httpRegex);
        if (matches === null) {
            return null;
        }
        //log.debug("matches: ", matches);
        var scheme = matches[1];
        var host = matches[3];
        var port = matches[4];
        var parts = null;
        if (!Core.isBlank(port)) {
            parts = url.split(port);
        }
        else {
            parts = url.split(host);
        }
        // make sure we use port as a number
        var portNum = Core.parseIntValue(port);
        var path = parts[1];
        if (path && _.startsWith(path, '/')) {
            path = path.slice(1, path.length);
        }
        //log.debug("parts: ", parts);
        return {
            scheme: scheme,
            host: host,
            port: portNum,
            path: path
        };
    }
    Core.parseUrl = parseUrl;
    function getDocHeight() {
        var D = document;
        return Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
    }
    Core.getDocHeight = getDocHeight;
    /**
     * If a URL is external to the current web application, then
     * replace the URL with the proxy servlet URL
     * @method useProxyIfExternal
     * @for Core
     * @static
     * @param {String} connectUrl
     * @return {String}
     */
    function useProxyIfExternal(connectUrl) {
        if (Core.isChromeApp()) {
            return connectUrl;
        }
        var host = window.location.host;
        if (!_.startsWith(connectUrl, "http://" + host + "/") && !_.startsWith(connectUrl, "https://" + host + "/")) {
            // lets remove the http stuff
            var idx = connectUrl.indexOf("://");
            if (idx > 0) {
                connectUrl = connectUrl.substring(idx + 3);
            }
            // lets replace the : with a /
            connectUrl = connectUrl.replace(":", "/");
            connectUrl = Core.trimLeading(connectUrl, "/");
            connectUrl = Core.trimTrailing(connectUrl, "/");
            connectUrl = Core.url("/proxy/" + connectUrl);
        }
        return connectUrl;
    }
    Core.useProxyIfExternal = useProxyIfExternal;
    /*
    export function checkInjectorLoaded() {
      // TODO sometimes the injector is not yet initialised; so lets try initialise it here just in case
      if (!Core.injector) {
        Core.injector = angular.element(document.documentElement).injector();
      }
    }
    */
    /**
     * Extracts the url of the target, eg usually http://localhost:port, but if we use fabric to proxy to another host,
     * then we return the url that we proxied too (eg the real target)
     *
     * @param {ng.ILocationService} $location
     * @param {String} scheme to force use a specific scheme, otherwise the scheme from location is used
     * @param {Number} port to force use a specific port number, otherwise the port from location is used
     */
    function extractTargetUrl($location, scheme, port) {
        if (angular.isUndefined(scheme)) {
            scheme = $location.scheme();
        }
        var host = $location.host();
        //  $location.search()['url']; does not work for some strange reason
        // let qUrl = $location.search()['url'];
        // if its a proxy request using hawtio-proxy servlet, then the url parameter
        // has the actual host/port
        var qUrl = $location.absUrl();
        var idx = qUrl.indexOf("url=");
        if (idx > 0) {
            qUrl = qUrl.substr(idx + 4);
            var value = decodeURIComponent(qUrl);
            if (value) {
                idx = value.indexOf("/proxy/");
                // after proxy we have host and optional port (if port is not 80)
                if (idx > 0) {
                    value = value.substr(idx + 7);
                    // if the path has http:// or some other scheme in it lets trim that off
                    idx = value.indexOf("://");
                    if (idx > 0) {
                        value = value.substr(idx + 3);
                    }
                    var data = value.split("/");
                    if (data.length >= 1) {
                        host = data[0];
                    }
                    if (angular.isUndefined(port) && data.length >= 2) {
                        var qPort = Core.parseIntValue(data[1], "port number");
                        if (qPort) {
                            port = qPort;
                        }
                    }
                }
            }
        }
        if (angular.isUndefined(port)) {
            port = $location.port();
        }
        var url = scheme + "://" + host;
        if (port != 80) {
            url += ":" + port;
        }
        return url;
    }
    Core.extractTargetUrl = extractTargetUrl;
    /**
     * Returns true if the $location is from the hawtio proxy
     */
    function isProxyUrl($location) {
        var url = $location.url();
        return url.indexOf('/hawtio/proxy/') > 0;
    }
    Core.isProxyUrl = isProxyUrl;
    /**
     * handy do nothing converter for the below function
     **/
    function doNothing(value) { return value; }
    Core.doNothing = doNothing;
    // moved these into their own helper file
    Core.bindModelToSearchParam = ControllerHelpers.bindModelToSearchParam;
    Core.reloadWhenParametersChange = ControllerHelpers.reloadWhenParametersChange;
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
    function throttled(fn, millis) {
        var nextInvokeTime = 0;
        var lastAnswer = null;
        return function () {
            var now = Date.now();
            if (nextInvokeTime < now) {
                nextInvokeTime = now + millis;
                lastAnswer = fn();
            }
            else {
                //log.debug("Not invoking function as we did call " + (now - (nextInvokeTime - millis)) + " ms ago");
            }
            return lastAnswer;
        };
    }
    Core.throttled = throttled;
    /**
     * Attempts to parse the given JSON text and returns the JSON object structure or null.
     *Bad JSON is logged at info level.
     *
     * @param text a JSON formatted string
     * @param message description of the thing being parsed logged if its invalid
     */
    function parseJsonText(text, message) {
        if (message === void 0) { message = "JSON"; }
        var answer = null;
        try {
            answer = angular.fromJson(text);
        }
        catch (e) {
            log.info("Failed to parse " + message + " from: " + text + ". " + e);
        }
        return answer;
    }
    Core.parseJsonText = parseJsonText;
    /**
     * Returns the humanized markup of the given value
     */
    function humanizeValueHtml(value) {
        var formattedValue = "";
        if (value === true) {
            formattedValue = '<i class="icon-check"></i>';
        }
        else if (value === false) {
            formattedValue = '<i class="icon-check-empty"></i>';
        }
        else {
            formattedValue = Core.humanizeValue(value);
        }
        return formattedValue;
    }
    Core.humanizeValueHtml = humanizeValueHtml;
    /**
     * Gets a query value from the given url
     *
     * @param url  url
     * @param parameterName the uri parameter value to get
     * @returns {*}
     */
    function getQueryParameterValue(url, parameterName) {
        var parts;
        var query = (url || '').split('?');
        if (query && query.length > 0) {
            parts = query[1];
        }
        else {
            parts = '';
        }
        var vars = parts.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == parameterName) {
                return decodeURIComponent(pair[1]);
            }
        }
        // not found
        return null;
    }
    Core.getQueryParameterValue = getQueryParameterValue;
    /**
     * Takes a value in ms and returns a human readable
     * duration
     * @param value
     */
    function humanizeMilliseconds(value) {
        if (!angular.isNumber(value)) {
            return "XXX";
        }
        var seconds = value / 1000;
        var years = Math.floor(seconds / 31536000);
        if (years) {
            return maybePlural(years, "year");
        }
        var days = Math.floor((seconds %= 31536000) / 86400);
        if (days) {
            return maybePlural(days, "day");
        }
        var hours = Math.floor((seconds %= 86400) / 3600);
        if (hours) {
            return maybePlural(hours, 'hour');
        }
        var minutes = Math.floor((seconds %= 3600) / 60);
        if (minutes) {
            return maybePlural(minutes, 'minute');
        }
        seconds = Math.floor(seconds % 60);
        if (seconds) {
            return maybePlural(seconds, 'second');
        }
        return value + " ms";
    }
    Core.humanizeMilliseconds = humanizeMilliseconds;
    /*
      export function storeConnectionRegex(regexs, name, json) {
        if (!regexs.any((r) => { r['name'] === name })) {
          let regex:string = '';
    
          if (json['useProxy']) {
            regex = '/hawtio/proxy/';
          } else {
            regex = '//';
          }
          regex += json['host'] + ':' + json['port'] + '/' + json['path'];
          regexs.push({
            name: name,
            regex: regex.escapeURL(true),
            color: UI.colors.sample()
          });
          writeRegexs(regexs);
        }
      }
    */
    function getRegexs() {
        var regexs = [];
        try {
            regexs = angular.fromJson(localStorage['regexs']);
        }
        catch (e) {
            // corrupted config
            delete localStorage['regexs'];
        }
        return regexs;
    }
    Core.getRegexs = getRegexs;
    function removeRegex(name) {
        var regexs = Core.getRegexs();
        var hasFunc = function (r) { return r['name'] === name; };
        if (regexs.any(hasFunc)) {
            regexs = regexs.exclude(hasFunc);
            Core.writeRegexs(regexs);
        }
    }
    Core.removeRegex = removeRegex;
    function writeRegexs(regexs) {
        localStorage['regexs'] = angular.toJson(regexs);
    }
    Core.writeRegexs = writeRegexs;
    function maskPassword(value) {
        if (value) {
            var text = '' + value;
            // we use the same patterns as in Apache Camel in its
            // org.apache.camel.util.URISupport.sanitizeUri
            var userInfoPattern = "(.*://.*:)(.*)(@)";
            value = value.replace(new RegExp(userInfoPattern, 'i'), "$1xxxxxx$3");
        }
        return value;
    }
    Core.maskPassword = maskPassword;
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
    function matchFilterIgnoreCase(text, filter) {
        if (angular.isUndefined(text) || angular.isUndefined(filter)) {
            return true;
        }
        if (text == null || filter == null) {
            return true;
        }
        text = text.toString().trim().toLowerCase();
        filter = filter.toString().trim().toLowerCase();
        if (text.length === 0 || filter.length === 0) {
            return true;
        }
        // there can be more tokens separated by comma
        var tokens = filter.split(",");
        // filter out empty tokens, and make sure its trimmed
        tokens = tokens.filter(function (t) {
            return t.length > 0;
        }).map(function (t) {
            return t.trim();
        });
        // match if any of the tokens matches the text
        var answer = tokens.some(function (t) {
            var bool = text.indexOf(t) > -1;
            return bool;
        });
        return answer;
    }
    Core.matchFilterIgnoreCase = matchFilterIgnoreCase;
})(Core || (Core = {}));
/// <reference path="coreHelpers.ts" />
var CoreFilters;
(function (CoreFilters) {
    var pluginName = 'hawtio-core-filters';
    var _module = angular.module(pluginName, []);
    _module.filter("valueToHtml", function () { return Core.valueToHtml; });
    _module.filter('humanize', function () { return Core.humanizeValue; });
    _module.filter('humanizeMs', function () { return Core.humanizeMilliseconds; });
    _module.filter('maskPassword', function () { return Core.maskPassword; });
    // relativeTime was the first humanize filter for dates,
    // let's maybe also add a 'humanizeDate' filter to match
    // up with 'humanizeDuration'
    var relativeTimeFunc = function (date) {
        return humandate.relativeTime(date);
    };
    // Turn a date into a relative time from right now
    _module.filter('relativeTime', function () {
        return relativeTimeFunc;
    });
    _module.filter('humanizeDate', function () {
        return relativeTimeFunc;
    });
    // Output a duration in milliseconds in a human-readable format
    _module.filter('humanizeDuration', function () {
        return function (duration) {
            return humanizeDuration(duration, { round: true });
        };
    });
    hawtioPluginLoader.addModule(pluginName);
})(CoreFilters || (CoreFilters = {}));
/// <reference path="baseHelpers.ts"/>
var FilterHelpers;
(function (FilterHelpers) {
    FilterHelpers.log = Logger.get("hawtio-core-utils-filter-helpers");
    function search(object, filter, maxDepth, and) {
        if (maxDepth === void 0) { maxDepth = -1; }
        if (and === void 0) { and = true; }
        var f = filter.split(" ");
        var matches = _.filter(f, function (f) { return searchObject(object, f, maxDepth); });
        if (and) {
            return matches.length === f.length;
        }
        else {
            return matches.length > 0;
        }
    }
    FilterHelpers.search = search;
    /**
     * Tests if an object contains the text in "filter".  The function
     * only checks the values in an object and ignores keys altogether,
     * can also work with strings/numbers/arrays
     * @param object
     * @param filter
     * @returns {boolean}
     */
    function searchObject(object, filter, maxDepth, depth) {
        if (maxDepth === void 0) { maxDepth = -1; }
        if (depth === void 0) { depth = 0; }
        // avoid inifinite recursion...
        if ((maxDepth > 0 && depth >= maxDepth) || depth > 50) {
            return false;
        }
        var f = filter.toLowerCase();
        var answer = false;
        if (angular.isString(object)) {
            answer = object.toLowerCase().indexOf(f) !== -1;
        }
        else if (angular.isNumber(object)) {
            answer = ("" + object).toLowerCase().indexOf(f) !== -1;
        }
        else if (angular.isArray(object)) {
            answer = _.some(object, function (item) { return searchObject(item, f, maxDepth, depth + 1); });
        }
        else if (angular.isObject(object)) {
            answer = searchObject(_.values(object), f, maxDepth, depth);
        }
        return answer;
    }
    FilterHelpers.searchObject = searchObject;
})(FilterHelpers || (FilterHelpers = {}));
var Core;
(function (Core) {
    /**
     * @class Folder
     * @uses NodeSelection
     */
    var Folder = /** @class */ (function () {
        function Folder(title) {
            this.title = title;
            this.id = null;
            this.typeName = null;
            this.items = [];
            this.folderNames = [];
            this.domain = null;
            this.objectName = null;
            this.map = {};
            this.entries = {};
            this.addClass = null;
            this.parent = null;
            this.isLazy = false;
            this.icon = null;
            this.tooltip = null;
            this.entity = null;
            this.version = null;
            this.mbean = null;
            this.expand = false;
            this.addClass = Core.escapeTreeCssStyles(title);
        }
        Object.defineProperty(Folder.prototype, "key", {
            get: function () {
                return this.id;
            },
            set: function (key) {
                this.id = key;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "children", {
            get: function () {
                return this.items;
            },
            set: function (items) {
                this.items = items;
            },
            enumerable: true,
            configurable: true
        });
        Folder.prototype.get = function (key) {
            return this.map[key];
        };
        Folder.prototype.isFolder = function () {
            return this.children.length > 0;
        };
        /**
         * Navigates the given paths and returns the value there or null if no value could be found
         * @method navigate
         * @for Folder
         * @param {Array} paths
         * @return {NodeSelection}
         */
        Folder.prototype.navigate = function () {
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i] = arguments[_i];
            }
            var node = this;
            paths.forEach(function (path) {
                if (node) {
                    node = node.get(path);
                }
            });
            return node;
        };
        Folder.prototype.hasEntry = function (key, value) {
            var entries = this.entries;
            if (entries) {
                var actual = entries[key];
                return actual && value === actual;
            }
            return false;
        };
        Folder.prototype.parentHasEntry = function (key, value) {
            if (this.parent) {
                return this.parent.hasEntry(key, value);
            }
            return false;
        };
        Folder.prototype.ancestorHasEntry = function (key, value) {
            var parent = this.parent;
            while (parent) {
                if (parent.hasEntry(key, value))
                    return true;
                parent = parent.parent;
            }
            return false;
        };
        Folder.prototype.ancestorHasType = function (typeName) {
            var parent = this.parent;
            while (parent) {
                if (typeName === parent.typeName)
                    return true;
                parent = parent.parent;
            }
            return false;
        };
        Folder.prototype.getOrElse = function (key, defaultValue) {
            if (defaultValue === void 0) { defaultValue = new Folder(key); }
            var answer = this.map[key];
            if (!answer) {
                answer = defaultValue;
                this.map[key] = answer;
                this.children.push(answer);
                answer.parent = this;
            }
            return answer;
        };
        Folder.prototype.sortChildren = function (recursive) {
            var children = this.children;
            if (children) {
                this.children = _.sortBy(children, "title");
                if (recursive) {
                    angular.forEach(children, function (child) { return child.sortChildren(recursive); });
                }
            }
        };
        Folder.prototype.moveChild = function (child) {
            if (child && child.parent !== this) {
                child.detach();
                child.parent = this;
                this.children.push(child);
            }
        };
        Folder.prototype.insertBefore = function (child, referenceFolder) {
            child.detach();
            child.parent = this;
            var idx = _.indexOf((this.children), referenceFolder);
            if (idx >= 0) {
                this.children.splice(idx, 0, child);
            }
        };
        Folder.prototype.insertAfter = function (child, referenceFolder) {
            child.detach();
            child.parent = this;
            var idx = _.indexOf((this.children), referenceFolder);
            if (idx >= 0) {
                this.children.splice(idx + 1, 0, child);
            }
        };
        /**
         * Removes this node from my parent if I have one
         * @method detach
         * @for Folder
         */
        Folder.prototype.detach = function () {
            var _this = this;
            var oldParent = this.parent;
            if (oldParent) {
                var oldParentChildren = oldParent.children;
                if (oldParentChildren) {
                    var idx = oldParentChildren.indexOf(this);
                    if (idx < 0) {
                        _.remove(oldParent.children, function (child) { return child.key === _this.key; });
                    }
                    else {
                        oldParentChildren.splice(idx, 1);
                    }
                }
                this.parent = null;
            }
        };
        /**
         * Searches this folder and all its descendants for the first folder to match the filter
         * @method findDescendant
         * @for Folder
         * @param {Function} filter
         * @return {Folder}
         */
        Folder.prototype.findDescendant = function (filter) {
            if (filter(this)) {
                return this;
            }
            var answer = null;
            angular.forEach(this.children, function (child) {
                if (!answer) {
                    answer = child.findDescendant(filter);
                }
            });
            return answer;
        };
        /**
         * Searches this folder and all its ancestors for the first folder to match the filter
         * @method findDescendant
         * @for Folder
         * @param {Function} filter
         * @return {Folder}
         */
        Folder.prototype.findAncestor = function (filter) {
            if (filter(this)) {
                return this;
            }
            if (this.parent != null) {
                return this.parent.findAncestor(filter);
            }
            else {
                return null;
            }
        };
        return Folder;
    }());
    Core.Folder = Folder;
})(Core || (Core = {}));
;
var Folder = /** @class */ (function (_super) {
    __extends(Folder, _super);
    function Folder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Folder;
}(Core.Folder));
;
var Core;
(function (Core) {
    // interfaces that represent the response from 'list', 
    // TODO should maybe put most of this in jolokia-1.0.d.ts
    // helper functions
    function operationToString(name, args) {
        if (!args || args.length === 0) {
            return name + '()';
        }
        else {
            return name + '(' + args.map(function (arg) {
                if (angular.isString(arg)) {
                    arg = angular.fromJson(arg);
                }
                return arg.type;
            }).join(',') + ')';
        }
    }
    Core.operationToString = operationToString;
})(Core || (Core = {}));
var Log;
(function (Log) {
    var _stackRegex = /\s*at\s+([\w\.$_]+(\.([\w$_]+))*)\((.*)?:(\d+)\).*\[(.*)\]/;
    function formatStackTrace(exception) {
        if (!exception) {
            return '';
        }
        // turn exception into an array
        if (!angular.isArray(exception) && angular.isString(exception)) {
            exception = exception.split('\n');
        }
        if (!angular.isArray(exception)) {
            return '';
        }
        var answer = '<ul class="unstyled">\n';
        exception.forEach(function (line) { return answer += "<li>" + Log.formatStackLine(line) + "</li>\n"; });
        answer += "</ul>\n";
        return answer;
    }
    Log.formatStackTrace = formatStackTrace;
    function formatStackLine(line) {
        var match = _stackRegex.exec(line);
        if (match && match.length > 6) {
            var classAndMethod = match[1];
            var fileName = match[4];
            var line = match[5];
            var mvnCoords = match[6];
            // we can ignore line if its not present...
            if (classAndMethod && fileName && mvnCoords) {
                var className = classAndMethod;
                var idx = classAndMethod.lastIndexOf('.');
                if (idx > 0) {
                    className = classAndMethod.substring(0, idx);
                }
                var link = "#/source/view/" + mvnCoords + "/class/" + className + "/" + fileName;
                if (angular.isDefined(line)) {
                    link += "?line=" + line;
                }
                /*
                        console.log("classAndMethod: " + classAndMethod);
                        console.log("fileName: " + fileName);
                        console.log("line: " + line);
                        console.log("mvnCoords: " + mvnCoords);
                        console.log("Matched " + JSON.stringify(match));
                */
                return "<div class='stack-line'>  at <a href='" + link + "'>" + classAndMethod + "</a>(<span class='fileName'>" + fileName + "</span>:<span class='lineNumber'>" + line + "</span>)[<span class='mavenCoords'>" + mvnCoords + "</span>]</div>";
            }
        }
        var bold = true;
        if (line) {
            line = _.trim(line);
            if (_.startsWith(line, 'at')) {
                line = '  ' + line;
                bold = false;
            }
        }
        if (bold) {
            return '<pre class="stack-line bold">' + line + '</pre>';
        }
        else {
            return '<pre class="stack-line">' + line + '</pre>';
        }
    }
    Log.formatStackLine = formatStackLine;
})(Log || (Log = {}));
/**
 * Module that provides functions related to working with javascript objects
 */
var ObjectHelpers;
(function (ObjectHelpers) {
    /**
     * Convert an array of 'things' to an object, using 'index' as the attribute name for that value
     * @param arr
     * @param index
     * @param decorator
     */
    function toMap(arr, index, decorator) {
        if (!arr || arr.length === 0) {
            return {};
        }
        var answer = {};
        arr.forEach(function (item) {
            if (angular.isObject(item)) {
                answer[item[index]] = item;
                if (angular.isFunction(decorator)) {
                    decorator(item);
                }
            }
        });
        return answer;
    }
    ObjectHelpers.toMap = toMap;
})(ObjectHelpers || (ObjectHelpers = {}));
/// <reference path="urlHelpers.ts"/>
var PluginHelpers;
(function (PluginHelpers) {
    // creates a nice little shortcut function that plugins can use to easily
    // prefix controllers with the plugin name, helps avoid redundancy and typos
    function createControllerFunction(_module, pluginName) {
        return function (name, inlineAnnotatedConstructor) {
            return _module.controller(pluginName + '.' + name, inlineAnnotatedConstructor);
        };
    }
    PluginHelpers.createControllerFunction = createControllerFunction;
    // shorthand function to create a configuration for a route, saves a bit
    // of typing
    function createRoutingFunction(templateUrl) {
        return function (templateName, reloadOnSearch) {
            if (reloadOnSearch === void 0) { reloadOnSearch = true; }
            return {
                templateUrl: UrlHelpers.join(templateUrl, templateName),
                reloadOnSearch: reloadOnSearch
            };
        };
    }
    PluginHelpers.createRoutingFunction = createRoutingFunction;
})(PluginHelpers || (PluginHelpers = {}));
/// <reference path="baseHelpers.ts"/>
var PollHelpers;
(function (PollHelpers) {
    var log = Logger.get("hawtio-core-utils-poll-helpers");
    function setupPolling($scope, updateFunction, period, $timeout, jolokia) {
        if (period === void 0) { period = 2000; }
        if ($scope.$hasPoller) {
            log.debug("scope already has polling set up, ignoring subsequent polling request");
            return;
        }
        $scope.$hasPoller = true;
        if (!$timeout) {
            $timeout = HawtioCore.injector.get('$timeout');
        }
        if (!jolokia) {
            try {
                jolokia = HawtioCore.injector.get('jolokia');
            }
            catch (err) {
                // no jolokia service
            }
        }
        var promise = undefined;
        var name = $scope.name || 'anonymous scope';
        var refreshFunction = function () {
            // log.debug("polling for scope: ", name);
            updateFunction(function () {
                var keepPollingFn = $scope.$keepPolling;
                if (!angular.isFunction(keepPollingFn)) {
                    keepPollingFn = function () {
                        if (!jolokia) {
                            return true;
                        }
                        return jolokia.isRunning();
                    };
                }
                if (keepPollingFn() && $scope.$hasPoller) {
                    promise = $timeout(refreshFunction, period);
                }
            });
        };
        if ($scope.$on) {
            $scope.$on('$destroy', function () {
                log.debug("scope", name, " being destroyed, cancelling polling");
                delete $scope.$hasPoller;
                $timeout.cancel(promise);
            });
            $scope.$on('$routeChangeStart', function () {
                log.debug("route changing, cancelling polling for scope: ", name);
                delete $scope.$hasPoller;
                $timeout.cancel(promise);
            });
        }
        return refreshFunction;
    }
    PollHelpers.setupPolling = setupPolling;
})(PollHelpers || (PollHelpers = {}));
var Core;
(function (Core) {
    var log = Logger.get("hawtio-core-utils");
    /**
    * Parsers the given value as JSON if it is define
    */
    function parsePreferencesJson(value, key) {
        var answer = null;
        if (angular.isDefined(value)) {
            answer = Core.parseJsonText(value, "localStorage for " + key);
        }
        return answer;
    }
    Core.parsePreferencesJson = parsePreferencesJson;
    function initPreferenceScope($scope, localStorage, defaults) {
        angular.forEach(defaults, function (_default, key) {
            $scope[key] = _default['value'];
            var converter = _default['converter'];
            var formatter = _default['formatter'];
            if (!formatter) {
                formatter = function (value) { return value; };
            }
            if (!converter) {
                converter = function (value) { return value; };
            }
            if (key in localStorage) {
                var value = converter(localStorage[key]);
                log.debug("from local storage, setting ", key, " to ", value);
                $scope[key] = value;
            }
            else {
                var value = _default['value'];
                log.debug("from default, setting ", key, " to ", value);
                localStorage[key] = value;
            }
            var watchFunc = _default['override'];
            if (!watchFunc) {
                watchFunc = function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (angular.isFunction(_default['pre'])) {
                            _default.pre(newValue);
                        }
                        var value = formatter(newValue);
                        log.debug("to local storage, setting ", key, " to ", value);
                        localStorage[key] = value;
                        if (angular.isFunction(_default['post'])) {
                            _default.post(newValue);
                        }
                    }
                };
            }
            if (_default['compareAsObject']) {
                $scope.$watch(key, watchFunc, true);
            }
            else {
                $scope.$watch(key, watchFunc);
            }
        });
    }
    Core.initPreferenceScope = initPreferenceScope;
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
    function isValidFunction(workspace, validFn, perspectiveId) {
        return !validFn || validFn(workspace, perspectiveId);
    }
    Core.isValidFunction = isValidFunction;
})(Core || (Core = {}));
/// <reference path="baseHelpers.ts"/>
var SelectionHelpers;
(function (SelectionHelpers) {
    var log = Logger.get("hawtio-core-utils-selection-helpers");
    // these functions deal with adding/using a 'selected' item on a group of objects
    function selectNone(group) {
        group.forEach(function (item) { item['selected'] = false; });
    }
    SelectionHelpers.selectNone = selectNone;
    function selectAll(group, filter) {
        group.forEach(function (item) {
            if (!filter) {
                item['selected'] = true;
            }
            else {
                if (filter(item)) {
                    item['selected'] = true;
                }
            }
        });
    }
    SelectionHelpers.selectAll = selectAll;
    function toggleSelection(item) {
        item['selected'] = !item['selected'];
    }
    SelectionHelpers.toggleSelection = toggleSelection;
    function selectOne(group, item) {
        selectNone(group);
        toggleSelection(item);
    }
    SelectionHelpers.selectOne = selectOne;
    function sync(selections, group, index) {
        group.forEach(function (item) {
            item['selected'] = _.some(selections, function (selection) { return selection[index] === item[index]; });
        });
        return _.filter(group, function (item) { return item['selected']; });
    }
    SelectionHelpers.sync = sync;
    function select(group, item, $event) {
        var ctrlKey = $event.ctrlKey;
        if (!ctrlKey) {
            if (item['selected']) {
                toggleSelection(item);
            }
            else {
                selectOne(group, item);
            }
        }
        else {
            toggleSelection(item);
        }
    }
    SelectionHelpers.select = select;
    function isSelected(item, yes, no) {
        return maybe(item['selected'], yes, no);
    }
    SelectionHelpers.isSelected = isSelected;
    // these functions deal with using a separate selection array
    function clearGroup(group) {
        group.length = 0;
    }
    SelectionHelpers.clearGroup = clearGroup;
    function toggleSelectionFromGroup(group, item, search) {
        var searchMethod = search || _.matches(item);
        if (_.some(group, searchMethod)) {
            _.remove(group, searchMethod);
        }
        else {
            group.push(item);
        }
    }
    SelectionHelpers.toggleSelectionFromGroup = toggleSelectionFromGroup;
    function stringOrBoolean(str, answer) {
        if (angular.isDefined(str)) {
            return str;
        }
        else {
            return answer;
        }
    }
    function nope(str) {
        return stringOrBoolean(str, false);
    }
    function yup(str) {
        return stringOrBoolean(str, true);
    }
    function maybe(answer, yes, no) {
        if (answer) {
            return yup(yes);
        }
        else {
            return nope(no);
        }
    }
    function isInGroup(group, item, yes, no, search) {
        if (!group) {
            return nope(no);
        }
        var searchMethod = search || _.matches(item);
        return maybe(_.some(group, searchMethod), yes, no);
    }
    SelectionHelpers.isInGroup = isInGroup;
    function filterByGroup(group, item, yes, no, search) {
        if (group.length === 0) {
            return yup(yes);
        }
        var searchMethod = search || item;
        if (angular.isArray(item)) {
            return maybe(_.intersection(group, item).length === group.length, yes, no);
        }
        else {
            return maybe(group.any(searchMethod), yes, no);
        }
    }
    SelectionHelpers.filterByGroup = filterByGroup;
    function syncGroupSelection(group, collection, attribute) {
        var newGroup = [];
        if (attribute) {
            group.forEach(function (groupItem) {
                var first = _.find(collection, function (collectionItem) {
                    return groupItem[attribute] === collectionItem[attribute];
                });
                if (first) {
                    newGroup.push(first);
                }
            });
        }
        else {
            group.forEach(function (groupItem) {
                var first = _.find(collection, function (collectionItem) {
                    return _.isEqual(groupItem, collectionItem);
                });
                if (first) {
                    newGroup.push(first);
                }
            });
        }
        clearGroup(group);
        group.push.apply(group, newGroup);
    }
    SelectionHelpers.syncGroupSelection = syncGroupSelection;
    function decorate($scope) {
        $scope.selectNone = selectNone;
        $scope.selectAll = selectAll;
        $scope.toggleSelection = toggleSelection;
        $scope.selectOne = selectOne;
        $scope.select = select;
        $scope.clearGroup = clearGroup;
        $scope.toggleSelectionFromGroup = toggleSelectionFromGroup;
        $scope.isInGroup = isInGroup;
        $scope.viewOnly = false; // true=disable checkmarks
        $scope.filterByGroup = filterByGroup;
    }
    SelectionHelpers.decorate = decorate;
})(SelectionHelpers || (SelectionHelpers = {}));
/// <reference path="coreHelpers.ts"/>
/// <reference path="controllerHelpers.ts"/>
var StorageHelpers;
(function (StorageHelpers) {
    function bindModelToLocalStorage(options) {
        var prefix = options.$scope.name + ':' || '::';
        var storageKey = prefix + options.modelName;
        var toParam = options.to || Core.doNothing;
        var fromParam = options.from || Core.doNothing;
        var toWrapper = function (value) {
            if (angular.isFunction(options.onChange)) {
                options.onChange(value);
            }
            var answer = toParam(value);
            options.localStorage[storageKey] = answer;
            return answer;
        };
        var fromWrapper = function (value) {
            if (value === undefined || value === null) {
                value = options.localStorage[storageKey];
            }
            return fromParam(value);
        };
        var storedValue = fromWrapper(undefined);
        ControllerHelpers.bindModelToSearchParam(options.$scope, options.$location, options.modelName, options.paramName, storedValue || options.initialValue, toWrapper, fromWrapper);
    }
    StorageHelpers.bindModelToLocalStorage = bindModelToLocalStorage;
})(StorageHelpers || (StorageHelpers = {}));
var UI;
(function (UI) {
    UI.scrollBarWidth = null;
    function findParentWith($scope, attribute) {
        if (attribute in $scope) {
            return $scope;
        }
        if (!$scope.$parent) {
            return null;
        }
        // let's go up the scope tree
        return findParentWith($scope.$parent, attribute);
    }
    UI.findParentWith = findParentWith;
    function getIfSet(attribute, $attr, def) {
        if (attribute in $attr) {
            var wantedAnswer = $attr[attribute];
            if (!Core.isBlank(wantedAnswer)) {
                return wantedAnswer;
            }
        }
        return def;
    }
    UI.getIfSet = getIfSet;
    /*
     * Helper function to ensure a directive attribute has some default value
     */
    function observe($scope, $attrs, key, defValue, callbackFunc) {
        if (callbackFunc === void 0) { callbackFunc = null; }
        $attrs.$observe(key, function (value) {
            if (!angular.isDefined(value)) {
                $scope[key] = defValue;
            }
            else {
                $scope[key] = value;
            }
            if (angular.isDefined(callbackFunc) && callbackFunc) {
                callbackFunc($scope[key]);
            }
        });
    }
    UI.observe = observe;
    function getScrollbarWidth() {
        if (!angular.isDefined(UI.scrollBarWidth)) {
            var div = document.createElement('div');
            div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
            div = div.firstChild;
            document.body.appendChild(div);
            UI.scrollBarWidth = div.offsetWidth - div.clientWidth;
            document.body.removeChild(div);
        }
        return UI.scrollBarWidth;
    }
    UI.getScrollbarWidth = getScrollbarWidth;
})(UI || (UI = {}));

angular.module('hawtio-core').run(['$templateCache', function($templateCache) {$templateCache.put('help/help.component.html','<div>\n  <h1>Help</h1>\n  <ul class="nav nav-tabs">\n    <li ng-repeat="topic in $ctrl.topics" ng-class="{active : topic === $ctrl.selectedTopic}">\n      <a href="#" ng-click="$ctrl.onSelectTopic(topic)">{{topic.label}}</a>\n    </li>\n  </ul>\n  <ul class="nav nav-tabs nav-tabs-pf help-secondary-tabs" ng-if="$ctrl.subTopics.length > 1">\n    <li ng-repeat="subTopic in $ctrl.subTopics" ng-class="{active : subTopic === $ctrl.selectedSubTopic}">\n      <a ng-href="#" ng-click="$ctrl.onSelectSubTopic(subTopic)">\n        {{subTopic.label === $ctrl.selectedTopic.label ? \'Home\' : subTopic.label}}\n      </a>\n    </li>\n  </ul>\n  <div ng-bind-html="$ctrl.html"></div>\n</div>\n');
$templateCache.put('navigation/templates/layoutFull.html','<div ng-view class="nav-ht nav-ht-full-layout"></div>');
$templateCache.put('navigation/templates/layoutTest.html','<div>\n  <h1>Test Layout</h1>\n  <div ng-view>\n\n\n  </div>\n</div>\n\n\n');
$templateCache.put('navigation/templates/navItem.html','<li class="list-group-item" \n    ng-class="{ active: item.isSelected(), \n                \'secondary-nav-item-pf\': item.tabs,\n                \'is-hover\': item.isHover }" \n    ng-if="item.isValid === undefined || item.isValid()"\n    ng-hide="item.hide()"\n    ng-mouseenter="$ctrl.onHover(item)"\n    ng-mouseleave="$ctrl.onUnHover(item)"\n    data-target="#{{item.id}}-secondary">\n  <a ng-href="{{item.href()}}" ng-click="item.click($event)">\n    <span class="list-group-item-value">\n      <ng-bind-html ng-bind-html="item.title()"></ng-bind-html>\n    </span>\n  </a>\n  <div id="#{{item.id}}-secondary" class="nav-pf-secondary-nav nav-hawtio-secondary-nav" ng-if="item.tabs">\n    <div class="nav-item-pf-header">\n      <ng-bind-html ng-bind-html="item.title()"></ng-bind-html>\n    </div>\n    <ul class="list-group" item="item" hawtio-sub-tabs></ul>\n  </div>\n</li>\n');
$templateCache.put('navigation/templates/subTabHeader.html','<li class="header">\n  <a href=""><strong>{{item.title()}}</strong></a>\n</li>\n');
$templateCache.put('navigation/templates/welcome.html','<div ng-controller="HawtioNav.WelcomeController"></div>\n');
$templateCache.put('preferences/logging-preferences/logging-preferences.html','<div ng-controller="PreferencesLoggingController">\n  <form class="form-horizontal logging-preferences-form">\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-buffer">\n        Log buffer\n        <span class="pficon pficon-info" data-toggle="tooltip" data-placement="top" title="Number of log statements to keep in the console"></span>\n      </label>\n      <div class="col-md-6">\n        <input type="number" id="log-buffer" class="form-control" ng-model="logBuffer" ng-blur="onLogBufferChange(logBuffer)">\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-level">Global log level</label>\n      <div class="col-md-6">\n        <select id="log-level" class="form-control" ng-model="logLevel"\n                ng-options="logLevel.name for logLevel in availableLogLevels track by logLevel.name"\n                ng-change="onLogLevelChange(logLevel)">\n        </select>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-buffer">Child loggers</label>\n      <div class="col-md-6">\n        <div class="form-group" ng-repeat="childLogger in childLoggers track by childLogger.name">\n          <label class="col-md-4 control-label child-logger-label" for="log-level">\n            {{childLogger.name}}\n          </label>\n          <div class="col-md-8">\n            <select id="log-level" class="form-control child-logger-select" ng-model="childLogger.filterLevel"\n                    ng-options="logLevel.name for logLevel in availableLogLevels track by logLevel.name"\n                    ng-change="onChildLoggersChange(childLoggers)">\n            </select>\n            <button type="button" class="btn btn-default child-logger-delete-button" ng-click="removeChildLogger(childLogger)">\n              <span class="pficon pficon-delete"></span>\n            </button>\n          </div>\n        </div>\n        <div>\n          <div class="dropdown">\n            <button class="btn btn-default dropdown-toggle" type="button" id="addChildLogger" data-toggle="dropdown">\n              Add\n              <span class="caret"></span>\n            </button>\n            <ul class="dropdown-menu" role="menu" aria-labelledby="addChildLogger">\n              <li role="presentation" ng-repeat="availableChildLogger in availableChildLoggers track by availableChildLogger.name">\n                <a role="menuitem" tabindex="-1" href="#" ng-click="addChildLogger(availableChildLogger)">\n                  {{ availableChildLogger.name }}\n                </a>\n              </li>\n            </ul>\n          </div>          \n        </div>\n      </div>\n    </div>\n  </form>\n</div>\n');
$templateCache.put('preferences/preferences-home/preferences-home.html','<div ng-controller="PreferencesHomeController">\n  <button class="btn btn-primary pull-right" ng-click="close()">Close</button>\n  <h1>\n    Preferences\n  </h1>\n  <hawtio-tabs tabs="tabs" active-tab="getTab(pref)" on-change="setPanel(tab)"></hawtio-tabs>\n  <div ng-include="getPrefs(pref)"></div>\n</div>\n');
$templateCache.put('preferences/reset-preferences/reset-preferences.html','<div ng-controller="ResetPreferencesController">\n  <div class="alert alert-success preferences-reset-alert" ng-if="showAlert">\n    <span class="pficon pficon-ok"></span>\n    Settings reset successfully!\n  </div>\n  <h3>Reset settings</h3>\n  <p>\n    Clear all custom settings stored in your browser\'s local storage and reset to defaults.\n  </p>\n  <p>\n    <button class="btn btn-danger" ng-click="doReset()">Reset settings</button>\n  </p>\n</div>');
$templateCache.put('help/help.md','## Plugin Help\n\nBrowse the available help topics for plugin specific documentation using the help navigation bar.\n\n### Further Reading\n\n- [hawtio](http://hawt.io "hawtio") website\n- Chat with the hawtio team on IRC by joining **#hawtio** on **irc.freenode.net**\n- Help improve [hawtio](http://hawt.io "hawtio") by [contributing](http://hawt.io/contributing/index.html)\n- [hawtio on github](https://github.com/hawtio/hawtio)\n');
$templateCache.put('preferences/help.md','## Preferences\n\nThe preferences page is used to configure application preferences and individual plugin preferences.\n\nThe preferences page is accessible by clicking the user icon (<i class=\'fa pficon-user\'></i>) in the main navigation bar,\nand then by choosing the preferences sub menu option.\n');}]);