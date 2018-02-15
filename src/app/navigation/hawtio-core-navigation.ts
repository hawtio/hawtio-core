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

namespace HawtioMainNav {

  function trimLeading(text, prefix) {
    if (text && prefix) {
      if (_.startsWith(text, prefix) || text.indexOf(prefix) === 0) {
        return text.substring(prefix.length);
      }
    }
    return text;
  }

  export const pluginName = 'hawtio-core-nav';
  const log = Logger.get(pluginName);

  // Actions class with some pre-defined actions
  export class Actions {
    static ADD = 'hawtio-main-nav-add';
    static REMOVE = 'hawtio-main-nav-remove';
    static CHANGED = 'hawtio-main-nav-change';
    static REDRAW = 'hawtio-main-nav-redraw';
  }

  export class Registry {

    items = [];
    root;

    constructor(root) {
      this.root = root;
    }

    builder() {
      return new NavItemBuilder();
    }

    add(item) {
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
    }

    remove(search) {
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
    }

    iterate(iterator) {
      this.items.forEach(iterator);
    }

    selected() {
      var valid = _.filter(this.items, function (item) {
        if (!item['isValid']) {
          return true;
        }
        return item['isValid']()
      });
      var answer = _.find(valid, function (item) {
        if (!item['isSelected']) {
          return false;
        }
        return item['isSelected']();
      });
      return answer;
    }

    on(action, key, fn) {
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
          var event = new CustomEvent(Actions.REDRAW, {
            detail: {
              text: ''
            }
          });
          this.root.dispatchEvent(event);
          break;
        default:
      }
    }

  }

  // Factory for registry, used to create angular service
  export function createRegistry(root) {
    return new Registry(root);
  }

  function join(...args) {
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

  export interface NavItem {
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

  export interface DefaultPageRanking {
    rank: number;
    isValid: (yes: () => void, no: () => void) => void;
  }

  export interface AttributeMap {
    [name: string]: string;
  }

  // Class NavItemBuilderImpl
  export class NavItemBuilder {

    private self: NavItem = {
      id: ''
    };

    id(id) {
      this.self.id = id;
      return this;
    }

    rank(rank) {
      this.self.rank = rank;
      return this;
    }

    title(title) {
      this.self.title = title;
      return this;
    }

    tooltip(tooltip) {
      this.self.tooltip = tooltip;
      return this;
    }

    page(page) {
      this.self.page = page;
      return this;
    }

    reload(reload) {
      this.self.reload = reload;
      return this;
    }

    attributes(attributes) {
      this.self.attributes = attributes;
      return this;
    }

    linkAttributes(attributes) {
      this.self.linkAttributes = attributes;
      return this;
    }

    context(context) {
      this.self.context = context;
      return this;
    }

    href(href) {
      this.self.href = href;
      return this;
    }

    click(click) {
      this.self.click = click;
      return this;
    }

    isSelected(isSelected) {
      this.self.isSelected = isSelected;
      return this;
    }

    isValid(isValid) {
      this.self.isValid = isValid;
      return this;
    }

    show(show) {
      this.self.show = show;
      return this;
    }

    template(template) {
      this.self.template = template;
      return this;
    }

    defaultPage(defaultPage) {
      this.self.defaultPage = defaultPage;
      return this;
    }

    tabs(item) {
      var items = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
      }
      this.self.tabs = _.union(this.self.tabs, [item], items);
      return this;
    }

    subPath(title: string, path: string, page?: string, rank?: number, reload?: boolean, isValid?: boolean) {
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
    }

    build(): NavItem {
      var answer = _.cloneDeep(this.self);
      this.self = {
        id: ''
      };
      return answer;
    };

  }

  // Factory functions
  export function createBuilder(): NavItemBuilder {
    return new NavItemBuilder();
  };

  // Plugin initialization
  export const _module = angular.module(pluginName, ['ngRoute']);

  _module.constant('layoutFull', 'navigation/templates/layoutFull.html');

  _module.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: true
    });
    $routeProvider.otherwise({ templateUrl: 'navigation/templates/welcome.html' });
  }]);

  _module.controller('HawtioNav.WelcomeController', welcomeController);

  function welcomeController($scope, $location, WelcomePageRegistry, HawtioNav, $timeout, documentBase: string): void {
    'ngInject';

    let backoffPeriod = 500;
    let locationChanged = false;
    $scope.$on("$locationChangeStart", function (event, next, current) {
      locationChanged = true;
    });

    function gotoNavItem(item) {
      if (item && item.href) {
        var href = trimLeading(item.href(), documentBase);
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
      } else if (!locationChanged) {
        log.debug('No default nav available, backing off for', backoffPeriod, 'ms');
        $timeout(gotoBestCandidateNav, backoffPeriod);
        backoffPeriod *= 1.25;
      }
    }

    function gotoBestCandidateNav() {
      var search = $location.search();
      if (search.tab) {
        var tab = search.tab;
        var selected;
        HawtioNav.iterate(function (item) {
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
          } else {
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
        } else {
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
          } catch (err) {
            log.debug("Failed to eval item: ", item.id, " error: ", err);
            no();
          }
        } else {
          evalCandidates(remaining);
        }
      }
      evalCandidates(candidates);
    }
    $timeout(gotoBestCandidateNav, 500);
  }

  _module.controller('HawtioNav.ViewController', viewController);

  function viewController($scope, $route, $location, layoutFull, viewRegistry, documentBase: string): void {
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
                  } else {
                    answer = undefined;
                  }
                }
              });
            }
          } catch (e) {
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
          } catch (e) {
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

  _module.run(configureHtmlBase);

  function configureHtmlBase(HawtioNav, $rootScope, $route, documentBase: string): void {
    'ngInject';
    HawtioNav.on(Actions.CHANGED, "$apply", (item) => {
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    });

    let href = documentBase;

    let applyBaseHref = (item) => {
      if (!item.preBase) {
        item.preBase = item.href;
        item.href = () => {
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
    HawtioNav.on(Actions.ADD, "htmlBaseRewriter", (item) => {
      if (item.href) {
        applyBaseHref(item);
        _.forEach(item.tabs, applyBaseHref);
      }
    });
    HawtioNav.on(Actions.ADD, "$apply", (item) => {
      let oldClick = item.click;
      item.click = ($event) => {
        if (!($event instanceof jQuery.Event)) {
          try {
            if (!$rootScope.$$phase) {
              $rootScope.$apply();
            }
          } catch (e) {
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
          } else {
            answer = subTab === item.id;
          }
        } else {
          if (!mainTab) {
            answer = _.startsWith(path, itemPath);
          } else {
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
    } else {
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
    } else {
      collection.splice(index, 0, item);
    }
  }

  _module.directive('hawtioSubTabs', ['$templateCache', '$compile', function ($templateCache, $compile) {
    return {
      restrict: 'A',
      scope: {
        item: '<'
      },
      link: function (scope: any, element) {
        var rankedTabs = sortByRank(scope.item.tabs);
        rankedTabs.forEach(function (item) {
          drawNavItem($templateCache, $compile, scope, element, item);
        });
      }
    };
  }]);

  _module.directive("hawtioMainNav", ["HawtioNav", "$templateCache", "$compile", "$location", "$rootScope", function (HawtioNav, $templateCache, $compile, $location, $rootScope) {
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

  export class BuilderFactory {

    $get() {
      return {};
    }

    create(): NavItemBuilder {
      return createBuilder();
    }

    join(...paths): string {
      return join(...paths);
    }

    setRoute($routeProvider, tab) {
      log.debug("Setting route: ", tab.href(), " to template URL: ", tab['page']());
      var config = {
        templateUrl: tab['page']()
      };
      if (!_.isUndefined(tab['reload'])) {
        config['reloadOnSearch'] = tab['reload'];
      }
      $routeProvider.when(tab.href(), config);
    }

    configureRouting($routeProvider: angular.route.IRouteProvider, tab: NavItem): any {
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
      } else {
        this.setRoute($routeProvider, tab);
      }
      if (tab.tabs) {
        tab.tabs.forEach(tab => this.setRoute($routeProvider, tab));
      }
    }

  }

  // provider so it's possible to get a nav builder in _module.config()
  _module.provider('HawtioNavBuilder', BuilderFactory);

  _module.factory('HawtioPerspective', [function () {
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

  _module.factory('WelcomePageRegistry', [function () {
    return {
      pages: []
    };
  }]);

  _module.factory('HawtioNav', ['$window', '$rootScope', function ($window, $rootScope) {
    var registry = createRegistry(window);
    return registry;
  }]);

  _module.component('hawtioVerticalNav', {
    templateUrl: 'navigation/templates/verticalNav.html',
    controller: function () {
      this.showSecondaryNav = false;
      this.onHover = function (item) {
        if (item.tabs && item.tabs.length > 0) {
          item.isHover = true;
          this.showSecondaryNav = true;
        }
      }
      this.onUnHover = function (item) {
        if (this.showSecondaryNav) {
          item.isHover = false;
          this.showSecondaryNav = false;
        }
      }
    }
  });

}
