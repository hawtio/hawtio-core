/// <reference path="logging-init.ts"/>
/// <reference path="plugin-loader.ts"/>

/*
 * Plugin loader and discovery mechanism for hawtio
 */
const hawtioPluginLoader = new Core.PluginLoader();

// Hawtio core plugin responsible for bootstrapping a hawtio app
let HawtioCore: HawtioCore = (function () {
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

  let HawtioCore = new HawtioCoreClass();

  /**
   * This plugin's name and angular module
   */
  HawtioCore.pluginName = "hawtio-core";
  /**
   * This plugins logger instance
   */
  let log = Logger.get(HawtioCore.pluginName);

  let _module = angular
    .module(HawtioCore.pluginName, []);

  _module.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);

  _module.run(['documentBase', function (documentBase) {
    log.debug("loaded");
  }]);

  let dummyLocalStorage = {
    length: 0,
    key: function (index) { return undefined; },
    getItem: function (key) { return dummyLocalStorage[key]; },
    setItem: function (key, data) { dummyLocalStorage[key] = data; },
    removeItem: function (key) {
      let removed = dummyLocalStorage[key];
      delete dummyLocalStorage[key];
      return removed;
    },
    clear: function () {

    }
  };
  HawtioCore.dummyLocalStorage = dummyLocalStorage;

  HawtioCore.documentBase = () => {
    let base = $('head').find('base');
    let answer = '/'
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
    let answer = $window.toastr;
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

      let match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
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
      let matched = jQuery['uaMatch'](navigator.userAgent);
      let browser = {};

      if (matched.browser) {
        browser[matched.browser] = true;
        browser['version'] = matched.version;
      }

      // Chrome is Webkit, but Webkit is also Safari.
      if (browser['chrome']) {
        browser['webkit'] = true;
      } else if (browser['webkit']) {
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

      let bootstrapEl = hawtioPluginLoader.getBootstrapElement();
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
