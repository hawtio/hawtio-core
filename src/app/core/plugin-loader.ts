namespace Core {

  /*
  * Plugin loader and discovery mechanism for hawtio
  */
  export class PluginLoader {

    private log = Logger.get('hawtio-loader');
    private bootstrapEl = document.documentElement;
    private loaderCallback = null;

    /**
     * List of URLs that the plugin loader will try and discover
     * plugins from
     * @type {Array}
     */
    private urls = [];

    /**
     * Holds all of the angular modules that need to be bootstrapped
     * @type {Array}
     */
    private modules = [];

    /**
     * Tasks to be run before bootstrapping, tasks can be async.
     * Supply a function that takes the next task to be
     * executed as an argument and be sure to call the passed
     * in function.
     *
     * @type {Array}
     */
    private tasks = [];

    constructor() {
      this.setLoaderCallback({
        scriptLoaderCallback: function (self, total, remaining) {
          this.log.debug("Total scripts: ", total, " Remaining: ", remaining);
        },
        urlLoaderCallback: function (self, total, remaining) {
          this.log.debug("Total URLs: ", total, " Remaining: ", remaining);
        }
      });
    }

    /**
     * Set the HTML element that the plugin loader will pass to angular.bootstrap
     */
    setBootstrapElement(el) {
      this.log.debug("Setting bootstrap element to: ", el);
      this.bootstrapEl = el;
    }

    /**
     * Get the HTML element used for angular.bootstrap
     */
    getBootstrapElement() {
      return this.bootstrapEl;
    }

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
    registerPreBootstrapTask(task, front?) {
      if (angular.isFunction(task)) {
        this.log.debug("Adding legacy task");
        task = {
          task: task
        };
      }

      if (!task.name) {
        task.name = 'unnamed-task-' + (this.tasks.length + 1);
      }

      if (task.depends && !angular.isArray(task.depends) && task.depends !== '*') {
        task.depends = [task.depends];
      }

      if (!front) {
        this.tasks.push(task);
      } else {
        this.tasks.unshift(task);
      }
    };

    /**
     * Add an angular module to the list of modules to bootstrap
     */
    addModule(module) {
      this.log.debug("Adding module: " + module);
      this.modules.push(module);
    };

    /**
     * Add a URL for discovering plugins.
     */
    addUrl(url) {
      this.log.debug("Adding URL: " + url);
      this.urls.push(url);
    };

    /**
     * Return the current list of configured modules
     */
    getModules() {
      return this.modules;
    };

    /**
     * Set a callback to be notified as URLs are checked and plugin 
     * scripts are downloaded
     */
    setLoaderCallback(cb) {
      this.loaderCallback = cb;
      // log.debug("Setting callback to : ", this.loaderCallback);
    };

    private intersection(search, needle) {
      if (!angular.isArray(needle)) {
        needle = [needle];
      }
      //this.log.debug("Search: ", search);
      //this.log.debug("Needle: ", needle);
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

    /**
     * Downloads plugins at any configured URLs and bootstraps the app
     */
    loadPlugins(callback) {

      var lcb = this.loaderCallback;

      var plugins = {};

      var urlsToLoad = this.urls.length;
      var totalUrls = urlsToLoad;

      var bootstrap = () => {
        var executedTasks = [];
        var deferredTasks = [];

        var bootstrapTask = {
          name: 'Hawtio Bootstrap',
          depends: '*',
          runs: 0,
          task: (next) => {
            function listTasks() {
              deferredTasks.forEach(function (task) {
                this.log.info("  name: " + task.name + " depends: ", task.depends);
              });
            }
            if (deferredTasks.length > 0) {
              this.log.info("tasks yet to run: ");
              listTasks();
              bootstrapTask.runs = bootstrapTask.runs + 1;
              this.log.info("Task list restarted : ", bootstrapTask.runs, " times");
              if (bootstrapTask.runs === 5) {
                this.log.info("Orphaned tasks: ");
                listTasks();
                deferredTasks.length = 0;
              } else {
                deferredTasks.push(bootstrapTask);
              }
            }
            this.log.debug("Executed tasks: ", executedTasks);
            next();
          }
        }

        this.registerPreBootstrapTask(bootstrapTask);

        var executeTask = () => {
          var tObj = null;
          var tmp = [];
          // if we've executed all of the tasks, let's drain any deferred tasks
          // into the regular task queue
          if (this.tasks.length === 0) {
            tObj = deferredTasks.shift();
          }
          // first check and see what tasks have executed and see if we can pull a task
          // from the deferred queue
          while (!tObj && deferredTasks.length > 0) {
            var task = deferredTasks.shift();
            if (task.depends === '*') {
              if (this.tasks.length > 0) {
                tmp.push(task);
              } else {
                tObj = task;
              }
            } else {
              var intersect = this.intersection(executedTasks, task.depends);
              if (intersect.length === task.depends.length) {
                tObj = task;
              } else {
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
            tObj = this.tasks.shift();
          }
          // check if task has dependencies
          if (tObj && tObj.depends && this.tasks.length > 0) {
            this.log.debug("Task '" + tObj.name + "' has dependencies: ", tObj.depends);
            if (tObj.depends === '*') {
              if (this.tasks.length > 0) {
                this.log.debug("Task '" + tObj.name + "' wants to run after all other tasks, deferring");
                deferredTasks.push(tObj);
                executeTask();
                return;
              }
            } else {
              var intersect = this.intersection(executedTasks, tObj.depends);
              if (intersect.length != tObj.depends.length) {
                this.log.debug("Deferring task: '" + tObj.name + "'");
                deferredTasks.push(tObj);
                executeTask();
                return;
              }
            }
          }
          if (tObj) {
            this.log.debug("Executing task: '" + tObj.name + "'");
            //this.log.debug("ExecutedTasks: ", executedTasks);
            var called = false;
            var next = function () {
              if (next['notFired']) {
                next['notFired'] = false;
                executedTasks.push(tObj.name);
                setTimeout(executeTask, 1);
              }
            }
            next['notFired'] = true;
            tObj.task(next);
          } else {
            this.log.debug("All tasks executed");
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
              this.log.debug("Fetching script: ", scriptName);
              $.ajaxSetup({ async: false });
              $.getScript(scriptName)
                .done(function (textStatus) {
                  this.log.debug("Loaded script: ", scriptName);
                })
                .fail(function (jqxhr, settings, exception) {
                  this.log.info("Failed loading script: \"", exception.message, "\" (<a href=\"", scriptName, ":", exception.lineNumber, "\">", scriptName, ":", exception.lineNumber, "</a>)");
                })
                .always(scriptLoaded);
            });
          });
        } else {
          // no scripts to load, so just do the callback
          $.ajaxSetup({ async: true });
          bootstrap();
        }
      };

      if (urlsToLoad === 0) {
        loadScripts();
      } else {
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

        $.each(this.urls, function (index, url) {

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
            } catch (Exception) {
              // console.error("Error fetching data: " + Exception);
            }
            urlLoaded();
          } else {

            this.log.debug("Trying url: ", url);

            $.get(url, function (data) {
              if (angular.isString(data)) {
                try {
                  data = angular.fromJson(data);
                } catch (error) {
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

    /**
     * Dumps the current list of configured modules and URLs to the console
     */
    debug() {
      this.log.debug("urls and modules");
      this.log.debug(this.urls);
      this.log.debug(this.modules);
    };

  }

}
