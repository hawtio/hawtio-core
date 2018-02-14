namespace Core {

  export type PluginLoaderCallback = {
    scriptLoaderCallback: (self: PluginLoaderCallback, total: number, remaining: number) => void,
    urlLoaderCallback: (self: PluginLoaderCallback, total: number, remaining: number) => void
  }

  /**
   * Task to be run before bootstrapping
   * 
   * name: the task name
   * depends: an array of task names this task needs to have executed first,
   *          or '*'
   * task: the function to be executed with 1 argument, which is a function
   *       that will execute the next task in the queue
   */
  export type PreBootstrapTask = {
    name?: string,
    depends?: string | string[],
    task: (next: () => void) => void
  }

  export type HawtioPlugin = {
    Name: string,
    Context: string,
    Domain: string,
    Scripts: string[]
  }

  export type HawtioPlugins = {
    [key: string]: HawtioPlugin
  }

  /*
  * Plugin loader and discovery mechanism for hawtio
  */
  export class PluginLoader {

    private bootstrapEl: HTMLElement = document.documentElement;
    private loaderCallback: PluginLoaderCallback = null;

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
    private tasks: PreBootstrapTask[] = [];

    private runs: number = 0;
    private executedTasks: string[] = [];
    private deferredTasks: PreBootstrapTask[] = [];

    private readonly bootstrapTask: PreBootstrapTask = {
      name: 'Hawtio Bootstrap',
      depends: '*',
      task: (next) => {
        if (this.deferredTasks.length > 0) {
          log.info("Tasks yet to run:");
          this.listTasks(this.deferredTasks);
          this.runs = this.runs + 1;
          log.info("Task list restarted:", this.runs, "times");
          if (this.runs === 5) {
            log.info("Orphaned tasks:");
            this.listTasks(this.deferredTasks);
            this.deferredTasks.length = 0;
          } else {
            this.deferredTasks.push(this.bootstrapTask);
          }
        }
        log.debug("Executed tasks:", this.executedTasks);
        next();
      }
    }

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
    setBootstrapElement(el: HTMLElement): PluginLoader {
      log.debug("Setting bootstrap element to:", el);
      this.bootstrapEl = el;
      return this;
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
     * 'task' can either be a simple function or a PreBootstrapTask object
     */
    registerPreBootstrapTask(
      task: (() => void) | PreBootstrapTask,
      front?: boolean): PluginLoader {
      let taskToAdd: PreBootstrapTask;
      if (angular.isFunction(task)) {
        log.debug("Adding legacy task");
        taskToAdd = {
          task: task
        };
      } else {
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
      } else {
        this.tasks.unshift(taskToAdd);
      }

      return this;
    }

    /**
     * Add an angular module to the list of modules to bootstrap
     */
    addModule(module: string): PluginLoader {
      log.debug("Adding module:", module);
      this.modules.push(module);
      return this;
    };

    /**
     * Add a URL for discovering plugins.
     */
    addUrl(url: string): PluginLoader {
      log.debug("Adding URL:", url);
      this.urls.push(url);
      return this;
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
    setLoaderCallback(callback: PluginLoaderCallback): PluginLoader {
      this.loaderCallback = callback;
      return this;
    }

    /**
     * Downloads plugins at any configured URLs and bootstraps the app
     */
    loadPlugins(callback: () => void): void {
      let plugins: HawtioPlugins = {};

      let urlsToLoad = this.urls.length;
      let totalUrls = urlsToLoad;

      if (urlsToLoad === 0) {
        this.loadScripts(plugins, callback);
        return;
      }

      let urlLoaded = () => {
        urlsToLoad = urlsToLoad - 1;
        if (this.loaderCallback) {
          this.loaderCallback.urlLoaderCallback(this.loaderCallback, totalUrls, urlsToLoad + 1);
        }
        if (urlsToLoad === 0) {
          this.loadScripts(plugins, callback);
        }
      };

      let regex = new RegExp(/^jolokia:/);

      this.urls.forEach((url, index) => {

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
          }).always(() => urlLoaded());
        }
      });
    }

    private loadScripts(plugins: HawtioPlugins, callback: () => void) {

      // keep track of when scripts are loaded so we can execute the callback
      let loaded = 0;
      _.forOwn(plugins, (data, key) => {
        loaded = loaded + data.Scripts.length;
      });

      let totalScripts = loaded;

      let scriptLoaded = () => {
        $.ajaxSetup({ async: true });
        loaded = loaded - 1;
        if (this.loaderCallback) {
          this.loaderCallback.scriptLoaderCallback(this.loaderCallback, totalScripts, loaded + 1);
        }
        if (loaded === 0) {
          this.bootstrap(callback);
        }
      };

      if (loaded > 0) {
        _.forOwn(plugins, (data, key) => {

          data.Scripts.forEach((script) => {
            let scriptName = data.Context + "/" + script;
            log.debug("Fetching script:", scriptName);
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
        this.bootstrap(callback);
      }
    };

    private bootstrap(callback: () => void): void {
      this.registerPreBootstrapTask(this.bootstrapTask);
      setTimeout(() => this.executeTasks(callback), 1);
    }

    private executeTasks(callback: () => void): void {
      let taskObject: PreBootstrapTask = null;
      let tmp: PreBootstrapTask[] = [];
      // if we've executed all of the tasks, let's drain any deferred tasks
      // into the regular task queue
      if (this.tasks.length === 0) {
        taskObject = this.deferredTasks.shift();
      }
      // first check and see what tasks have executed and see if we can pull a task
      // from the deferred queue
      while (!taskObject && this.deferredTasks.length > 0) {
        let task = this.deferredTasks.shift();
        if (task.depends === '*') {
          if (this.tasks.length > 0) {
            tmp.push(task);
          } else {
            taskObject = task;
          }
        } else {
          let intersect = this.intersection(this.executedTasks, task.depends);
          if (intersect.length === task.depends.length) {
            taskObject = task;
          } else {
            tmp.push(task);
          }
        }
      }
      if (tmp.length > 0) {
        tmp.forEach((task) => this.deferredTasks.push(task));
      }
      // no deferred tasks to execute, let's get a new task
      if (!taskObject) {
        taskObject = this.tasks.shift();
      }
      // check if task has dependencies
      if (taskObject && taskObject.depends && this.tasks.length > 0) {
        log.debug("Task '" + taskObject.name + "' has dependencies:", taskObject.depends);
        if (taskObject.depends === '*') {
          if (this.tasks.length > 0) {
            log.debug("Task '" + taskObject.name + "' wants to run after all other tasks, deferring");
            this.deferredTasks.push(taskObject);
            this.executeTasks(callback);
            return;
          }
        } else {
          let intersect = this.intersection(this.executedTasks, taskObject.depends);
          if (intersect.length != taskObject.depends.length) {
            log.debug("Deferring task: '" + taskObject.name + "'");
            this.deferredTasks.push(taskObject);
            this.executeTasks(callback);
            return;
          }
        }
      }
      if (taskObject) {
        log.debug("Executing task: '" + taskObject.name + "'");
        let called = false;
        let next = () => {
          if (next['notFired']) {
            next['notFired'] = false;
            this.executedTasks.push(taskObject.name);
            setTimeout(() => this.executeTasks(callback), 1);
          }
        }
        next['notFired'] = true;
        taskObject.task(next);
      } else {
        log.debug("All tasks executed");
        setTimeout(callback, 1);
      }
    }

    private listTasks(tasks): void {
      tasks.forEach((task) =>
        log.info("  name:", task.name, "depends:", task.depends));
    }

    private intersection(search: string[], needle: string | string[]): string[] {
      if (!Array.isArray(needle)) {
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
     * Dumps the current list of configured modules and URLs to the console
     */
    debug(): void {
      log.debug("urls and modules");
      log.debug(this.urls);
      log.debug(this.modules);
    };

  }

}
