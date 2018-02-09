var log = Logger.get('test-code');
log.setLevel(Logger.DEBUG);

// Simple task that's just a function, no name, no dependencies
hawtioPluginLoader.registerPreBootstrapTask(function (next) {
  next();
});

// A task that requires some other task to run first
hawtioPluginLoader.registerPreBootstrapTask({
  name: "AsyncDependantTask",
  depends: ["AsyncTask"],
  task: function (next) {
    log.info("Async task ran...");
    next();
  }
});

// setBootstrapElement can be used to change what element will be passed to angular.bootstrap
hawtioPluginLoader.registerPreBootstrapTask({
  name: "ChangeBootstrapEl",
  task: function (next) {
    hawtioPluginLoader.setBootstrapElement(document.body);
    next();
  }
});

// another simple task, does nothing, not sure why there's a duplicate here :-)
hawtioPluginLoader.registerPreBootstrapTask(function (next) {
  next();
}, true);

// Another dependent task, this one is async, the task list continues once the timeout completes
hawtioPluginLoader.registerPreBootstrapTask({
  name: "AsyncTask",
  depends: ["ParentTask1"],
  task: function (next) {
    log.info("Async task loading");
    setTimeout(function () {
      log.info("Async task executing");
      next();
    }, 1000);
    log.info("Async task exiting");
  }
});

// Task that depends on a couple other tasks
hawtioPluginLoader.registerPreBootstrapTask({
  name: 'other-child',
  depends: ['child-task', 'unnamed-task-2'],
  task: function (next) {
    next();
  }
});

// Task that depends on another task that isn't actually defined, winds up being orphaned and not executed
hawtioPluginLoader.registerPreBootstrapTask({
  name: "Bunk Task 1",
  depends: ['pastry'],
  task: function (next) {
    next();
  }
});
hawtioPluginLoader.registerPreBootstrapTask({
  name: "child-task",
  depends: ["ParentTask1"],
  task: function (next) {
    next();
  }
});
hawtioPluginLoader.registerPreBootstrapTask({
  name: "Named Task",
  task: function (next) {
    next();
  }
});
hawtioPluginLoader.registerPreBootstrapTask({
  name: "ParentTask1",
  task: function (next) {
    next();
  }
});
// these won't get executed, they depend on tasks that
// haven't been registered
hawtioPluginLoader.registerPreBootstrapTask({
  name: "Bunk Task 2",
  depends: ['foo', 'bar'],
  task: function (next) {
    next();
  }
});
