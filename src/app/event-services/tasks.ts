namespace Core {

  const log: Logging.Logger = Logger.get("hawtio-core-tasks");

  export type TaskMap = {
    [name: string]: () => void;
  }

  export type ParameterizedTaskMap = {
    [name: string]: (...params: any[]) => void;
  }

  export class Tasks {

    protected tasks: TaskMap = {};
    protected tasksExecuted: boolean = false;

    constructor(protected name: string) {
    }

    addTask(name: string, task: () => void): Tasks {
      this.tasks[name] = task;
      if (this.tasksExecuted) {
        this.executeTask(name, task);
      }
      return this;
    }

    execute(callback?: () => void): void {
      log.debug("Executing tasks:", this.name);
      if (this.tasksExecuted) {
        return;
      }
      _.forOwn(this.tasks, (task, name) => this.executeTask(name, task));
      this.tasksExecuted = true;
      if (!_.isNil(callback)) {
        callback();
      }
    }

    private executeTask(name: string, task: () => void): void {
      if (_.isNull(task)) {
        return;
      }
      log.debug("Executing task:", name);
      try {
        task();
      } catch (error) {
        log.debug("Failed to execute task:", name, "error:", error);
      }
    }

    reset(): void {
      this.tasksExecuted = false;
    }
  }

  export class ParameterizedTasks extends Tasks {

    protected tasks: ParameterizedTaskMap = {};

    constructor(name: string) {
      super(name);
    }

    addTask(name: string, task: (...params: any[]) => void): Tasks {
      this.tasks[name] = task;
      return this;
    }

    execute(...params: any[]): void {
      log.debug("Executing tasks:", this.name);
      if (this.tasksExecuted) {
        return;
      }
      _.forOwn(this.tasks, (task, name) => this.executeParameterizedTask(name, task, params));
      this.tasksExecuted = true;
      this.reset();
    }

    private executeParameterizedTask(name: string, task: () => void, params: any[]): void {
      if (_.isNull(task)) {
        return;
      }
      log.debug("Executing task:", name, "with parameters:", params);
      try {
        task.apply(task, params);
      } catch (e) {
        log.debug("Failed to execute task:", name, "error:", e);
      }
    }
  }

}
