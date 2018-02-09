namespace Core {

  /*
  * Plugin loader and discovery mechanism for hawtio
  */
  export class PluginLoader {

    private bootstrapEl: HTMLElement = document.documentElement;
    private loaderCallback = null;

    /**
     * List of URLs that the plugin loader will try and discover
     * plugins from
     */
    private urls: string[] = [];

    /**
     * Holds all of the angular modules that need to be bootstrapped
     */
    private modules: string[] = [];

    /**
     * Tasks to be run before bootstrapping, tasks can be async.
     * Supply a function that takes the next task to be
     * executed as an argument and be sure to call the passed
     * in function.
     */
    private tasks = [];

    constructor() {
      this.setLoaderCallback({
        scriptLoaderCallback: (self, total, remaining) => {
          log.debug("Total scripts:", total, "Remaining:", remaining);
        },
        urlLoaderCallback: (self, total, remaining) => {
          log.debug("Total URLs:", total, "Remaining:", remaining);
        }
      });
    }

    /**
     * Set the HTML element that the plugin loader will pass to angular.bootstrap
     */
    setBootstrapElement(el: HTMLElement): void {
      log.debug("Setting bootstrap element to:", el);
      this.bootstrapEl = el;
    }

    /**
     * Get the HTML element used for angular.bootstrap
     */
    getBootstrapElement(): HTMLElement {
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
    registerPreBootstrapTask(task, front?): void {
      if (angular.isFunction(task)) {
        log.debug("Adding legacy task");
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
    }

    /**
     * Add an angular module to the list of modules to bootstrap
     */
    addModule(module: string): void {
      log.debug("Adding module:", module);
      this.modules.push(module);
    };

    /**
     * Add a URL for discovering plugins.
     */
    addUrl(url: string): void {
      log.debug("Adding URL:", url);
      this.urls.push(url);
    };

    /**
     * Return the current list of configured modules
     */
    getModules(): string[] {
      return this.modules;
    }

    /**
     * Set a callback to be notified as URLs are checked and plugin 
     * scripts are downloaded
     */
    setLoaderCallback(cb): void {
      this.loaderCallback = cb;
    }

    private intersection(search, needle) {
      if (!angular.isArray(needle)) {
        needle = [needle];
      }
      let answer = [];
      needle.forEach((n) => {
        search.forEach((s) => {
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
    loadPlugins(callback): void {

      let lcb = this.loaderCallback;

      let plugins = {};

      let urlsToLoad = this.urls.length;
      let totalUrls = urlsToLoad;

      let bootstrap = () => {
        let executedTasks = [];
        let deferredTasks = [];

        let bootstrapTask = {
          name: 'Hawtio Bootstrap',
          depends: '*',
          runs: 0,
          task: (next) => {
            function listTasks() {
              deferredTasks.forEach(function (task) {
                log.info("  name:", task.name, "depends:", task.depends);
              });
            }
            if (deferredTasks.length > 0) {
              log.info("tasks yet to run:");
              listTasks();
              bootstrapTask.runs = bootstrapTask.runs + 1;
              log.info("Task list restarted:", bootstrapTask.runs, "times");
              if (bootstrapTask.runs === 5) {
                log.info("Orphaned tasks:");
                listTasks();
                deferredTasks.length = 0;
              } else {
                deferredTasks.push(bootstrapTask);
              }
            }
            log.debug("Executed tasks:", executedTasks);
            next();
          }
        }

        this.registerPreBootstrapTask(bootstrapTask);

        let executeTask = () => {
          let tObj = null;
          let tmp = [];
          // if we've executed all of the tasks, let's drain any deferred tasks
          // into the regular task queue
          if (this.tasks.length === 0) {
            tObj = deferredTasks.shift();
          }
          // first check and see what tasks have executed and see if we can pull a task
          // from the deferred queue
          while (!tObj && deferredTasks.length > 0) {
            let task = deferredTasks.shift();
            if (task.depends === '*') {
              if (this.tasks.length > 0) {
                tmp.push(task);
              } else {
                tObj = task;
              }
            } else {
              let intersect = this.intersection(executedTasks, task.depends);
              if (intersect.length === task.depends.length) {
                tObj = task;
              } else {
                tmp.push(task);
              }
            }
          }
          if (tmp.length > 0) {
            tmp.forEach((task) => deferredTasks.push(task));
          }
          // no deferred tasks to execute, let's get a new task
          if (!tObj) {
            tObj = this.tasks.shift();
          }
          // check if task has dependencies
          if (tObj && tObj.depends && this.tasks.length > 0) {
            log.debug("Task '" + tObj.name + "' has dependencies:", tObj.depends);
            if (tObj.depends === '*') {
              if (this.tasks.length > 0) {
                log.debug("Task '" + tObj.name + "' wants to run after all other tasks, deferring");
                deferredTasks.push(tObj);
                executeTask();
                return;
              }
            } else {
              let intersect = this.intersection(executedTasks, tObj.depends);
              if (intersect.length != tObj.depends.length) {
                log.debug("Deferring task: '" + tObj.name + "'");
                deferredTasks.push(tObj);
                executeTask();
                return;
              }
            }
          }
          if (tObj) {
            log.debug("Executing task: '" + tObj.name + "'");
            //log.debug("ExecutedTasks: ", executedTasks);
            let called = false;
            let next = () => {
              if (next['notFired']) {
                next['notFired'] = false;
                executedTasks.push(tObj.name);
                setTimeout(executeTask, 1);
              }
            }
            next['notFired'] = true;
            tObj.task(next);
          } else {
            log.debug("All tasks executed");
            setTimeout(callback, 1);
          }
        };
        setTimeout(executeTask, 1);
      };

      let loadScripts = () => {

        // keep track of when scripts are loaded so we can execute the callback
        let loaded = 0;
        $.each(plugins, function (key, data) {
          loaded = loaded + data.Scripts.length;
        });

        let totalScripts = loaded;

        let scriptLoaded = function () {
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
          $.each(plugins, (key, data) => {

            data.Scripts.forEach((script) => {
              let scriptName = data.Context + "/" + script;
              log.debug("Fetching script: ", scriptName);
              $.ajaxSetup({ async: false });
              $.getScript(scriptName)
                .done((textStatus) => {
                  log.debug("Loaded script:", scriptName);
                })
                .fail((jqxhr, settings, exception) => {
                  log.info("Failed loading script: \"", exception.message, "\" (<a href=\"", scriptName, ":", exception.lineNumber, "\">", scriptName, ":", exception.lineNumber, "</a>)");
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
        let urlLoaded = function () {
          urlsToLoad = urlsToLoad - 1;
          if (lcb) {
            lcb.urlLoaderCallback(lcb, totalUrls, urlsToLoad + 1);
          }
          if (urlsToLoad === 0) {
            loadScripts();
          }
        };

        let regex = new RegExp(/^jolokia:/);

        $.each(this.urls, function (index, url) {

          if (regex.test(url)) {
            let parts = url.split(':');
            parts = parts.reverse();
            parts.pop();

            url = parts.pop();
            let attribute = parts.reverse().join(':');
            let jolokia = new Jolokia(url);

            try {
              let data = jolokia.getAttribute(attribute, null);
              $.extend(plugins, data);
            } catch (Exception) {
              // ignore
            }
            urlLoaded();
          } else {

            log.debug("Trying url:", url);

            $.get(url, (data) => {
              if (angular.isString(data)) {
                try {
                  data = angular.fromJson(data);
                } catch (error) {
                  // ignore this source of plugins
                  return;
                }
              }
              $.extend(plugins, data);
            }).always(function () {
              urlLoaded();
            });
          }
        });
      }
    }

    /**
     * Dumps the current list of configured modules and URLs to the console
     */
    debug(): void {
      log.debug("urls and modules");
      log.debug(this.urls);
      log.debug(this.modules);
    };

  }

}
