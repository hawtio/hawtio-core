/// <reference path="plugin-loader.ts"/>

// hawtio log initialization
/* globals Logger window console document localStorage $ angular jQuery navigator Jolokia */
(function() {
  'use strict';

  Logger.setLevel(Logger.INFO);
  Logger.storagePrefix = 'hawtio';

  Logger.oldGet = Logger.get;
  Logger.loggers = {};
  Logger.get = function(name) {
    var answer = Logger.oldGet(name);
    Logger.loggers[name] = answer;
    return answer;
  };

  // we'll default to 100 statements I guess...
  window['LogBuffer'] = 100;

  debugger;
  if ('localStorage' in window) {
    if (!('logLevel' in window.localStorage)) {
      window.localStorage['logLevel'] = JSON.stringify(Logger.INFO);
    }
    var logLevel = Logger.DEBUG;
    try {
      logLevel = JSON.parse(window.localStorage['logLevel']);
    } catch (e) {
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
    } else {
      window.localStorage['logBuffer'] = window['LogBuffer'];
    }
    if ('childLoggers' in window.localStorage) {
      try {
        const childLoggers: Logging.ChildLogger[] = JSON.parse(localStorage['childLoggers']);
        childLoggers.forEach(childLogger => {
          Logger.get(childLogger.name).setLevel(childLogger.filterLevel);
        });
      } catch (e) {
      }
    }
  }

  var consoleLogger = null;

  if ('console' in window) {
    window['JSConsole'] = window.console;
    consoleLogger = function(messages, context) {
      var MyConsole = window['JSConsole'];
      var hdlr = MyConsole.log;
      // Prepend the logger's name to the log message for easy identification.
      if (context.name) {
        messages[0] = "[" + context.name + "] " + messages[0];
      }
      // Delegate through to custom warn/error loggers if present on the console.
      if (context.level === Logger.WARN && 'warn' in MyConsole) {
        hdlr = MyConsole.warn;
      } else if (context.level === Logger.ERROR && 'error' in MyConsole) {
        hdlr = MyConsole.error;
      } else if (context.level === Logger.INFO && 'info' in MyConsole) {
        hdlr = MyConsole.info;
      }
      if (hdlr && hdlr.apply) {
        try {
          hdlr.apply(MyConsole, messages);
        } catch (e) {
          MyConsole.log(messages);
        }
      }
    };
  }

  // keep these hidden in the Logger object
  Logger.getType = function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  };

  Logger.isError = function(obj) {
    return obj && Logger.getType(obj) === 'Error';
  };

  Logger.isArray = function (obj) {
    return obj && Logger.getType(obj) === 'Array';
  };

  Logger.isObject = function (obj) {
    return obj && Logger.getType(obj) === 'Object';
  };

  Logger.isString = function(obj) {
    return obj && Logger.getType(obj) === 'String';
  };

  window['logInterceptors'] = [];

  Logger.formatStackTraceString = function(stack) {
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


  Logger.setHandler(function(messages, context) {
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
            } catch (e) {
              // we'll just bail and let it get logged as a string...
            }
          } else {
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
          var obj = "" ;
          try {
            obj = '<pre data-language="javascript">' + JSON.stringify(message, null, 2) + '</pre>';
          } catch (error) {
            obj = message + " (failed to convert) ";
            // silently ignore, could be a circular object...
          }
          text = text + obj;
        } else if (Logger.isError(message)) {
          if ('message' in message) {
            text = text + message['message'];
          }
          if ('stack' in message) {
            postLog.push(function() {
              var stackTrace = Logger.formatStackTraceString(message['stack']);
              var logger = context.name ? Logger.get(context.name) : Logger;
              logger.info("Stack trace: ", stackTrace);
            });
          }
        } else {
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
const hawtioPluginLoader = new Hawtio.PluginLoader();

// Hawtio core plugin responsible for bootstrapping a hawtio app
var HawtioCore: HawtioCore = (function () {
    'use strict';

    function HawtioCoreClass() {

    }

    /**
     * The app's injector, set once bootstrap is completed
     */
    Object.defineProperty(HawtioCoreClass.prototype, "injector", {
      get: function() {
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
      key: function(index) { return undefined; },
      getItem: function (key) { return dummyLocalStorage[key]; },
      setItem: function (key, data) { dummyLocalStorage[key] = data; },
      removeItem: function(key) {
        var removed = dummyLocalStorage[key];
        delete dummyLocalStorage[key];
        return removed;
      },
      clear: function() {

      }
    };
    HawtioCore.dummyLocalStorage = dummyLocalStorage;

    HawtioCore.documentBase = function() {
      var base = $('head').find('base');
      var answer = '/'
      if (base && base.length > 0) {
        answer = base.attr('href');
      } else {
        log.warn("Document is missing a 'base' tag, defaulting to '/'");
      }
      //log.debug("Document base: ", answer);
      return answer;
    }

    /**
     * services, mostly stubs
     */
    // localStorage service, returns a dummy impl
    // if for some reason it's not in the window
    // object
    _module.factory('localStorage', function() {
      return window.localStorage || dummyLocalStorage;
    });

    // Holds the document base so plugins can easily
    // figure out absolute URLs when needed
    _module.factory('documentBase', function() {
      return HawtioCore.documentBase();
    });


    // Holds a mapping of plugins to layouts, plugins use 
    // this to specify a full width view, tree view or their 
    // own custom view
    _module.factory('viewRegistry', function() {
      return {};
    });

    // Placeholder service for the help registry
    _module.factory('helpRegistry', function() {
      return {
        addUserDoc: function() {},
        addDevDoc: function() {},
        addSubTopic: function() {},
        getOrCreateTopic: function() { return undefined; },
        mapTopicName: function() { return undefined; },
        mapSubTopicName: function() { return undefined; },
        getTopics: function() { return undefined; },
        disableAutodiscover: function() {},
        discoverHelpFiles: function() {}
      };
    });

    // Placeholder service for the preferences registry
    _module.factory('preferencesRegistry', function() {
      return {
        addTab: function() {},
        getTab: function() { return undefined; },
        getTabs: function() { return undefined; }
      };
    });

    // Placeholder service for the page title service
    _module.factory('pageTitle', function() {
      return {
        addTitleElement: function() {},
        getTitle: function() { return undefined; },
        getTitleWithSeparator: function() { return undefined; },
        getTitleExcluding: function() { return undefined; },
        getTitleArrayExcluding: function() { return undefined; }
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

    _module.factory('HawtioDashboard', function() {
      return {
        hasDashboard: false,
        inDashboard: false,
        getAddLink: function() {
          return '';
        }
      }; 
    });

    // Placeholder user details service
    _module.factory('userDetails', function() {
      return {
        logout: function() {
          log.debug("Dummy userDetails.logout()");
        }
      };
    });

    // bootstrap the app
    $(function () {

      jQuery['uaMatch'] = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
          /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
          /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
          /(msie) ([\w.]+)/.exec( ua ) ||
          ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
          [];

        return {
          browser: match[ 1 ] || "",
          version: match[ 2 ] || "0"
        };
      };

      // Don't clobber any existing jQuery['browser'] in case it's different
      if ( !jQuery['browser'] ) {
        var matched = jQuery['uaMatch']( navigator.userAgent );
        var browser = {};

        if ( matched.browser ) {
          browser[ matched.browser ] = true;
          browser['version'] = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if ( browser['chrome'] ) {
          browser['webkit'] = true;
        } else if ( browser['webkit'] ) {
          browser['safari'] = true;
        }

        jQuery['browser'] = browser;
      }

      if (window['ng'] && window['ng']['upgrade']) {
        // Create this here so that plugins can use pre-bootstrap tasks
        // to add providers
        HawtioCore.UpgradeAdapter = new ng['upgrade'].UpgradeAdapter();
      }
      
      hawtioPluginLoader.loadPlugins(function() {

        if (HawtioCore.injector || HawtioCore.UpgradeAdapterRef) {
          log.debug("Application already bootstrapped");
          return;
        }

        var bootstrapEl = hawtioPluginLoader.getBootstrapElement();
        log.debug("Using bootstrap element: ", bootstrapEl);

        // bootstrap in hybrid mode if angular2 is detected
        if (HawtioCore.UpgradeAdapter) {
          log.debug("ngUpgrade detected, bootstrapping in Angular 1/2 hybrid mode");
          HawtioCore.UpgradeAdapterRef = HawtioCore.UpgradeAdapter.bootstrap(bootstrapEl,
            hawtioPluginLoader.getModules(), { strictDi: true });
          HawtioCore._injector = HawtioCore.UpgradeAdapterRef.ng1Injector;
        } else {
          HawtioCore._injector = angular.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), {
            strictDi: true
          });
        }

        log.debug("Bootstrapped application");
      });
    });
    return HawtioCore;
})();

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
  dummyLocalStorage:WindowLocalStorage;
  /**
   * Function that returns the base href attribute
   */
  documentBase(): string;

  /**
   * If angular2 is installed, this will be an instance of an ng.upgrade.UpgradeAdapter
   */
  UpgradeAdapter:any;

  /**
   * This will be a reference to the value returned from UpgradeAdapter.bootstrap(),
   * which contains the angular1 injector (As well as the angular2 root injector)
   */
  UpgradeAdapterRef:any;

}
