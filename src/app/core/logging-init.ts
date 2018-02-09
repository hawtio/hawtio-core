
namespace Bootstrap {

  // hawtio log initialization
  // globals Logger window console document localStorage $ angular jQuery navigator Jolokia

  Logger.setLevel(Logger.INFO);
  Logger.storagePrefix = 'hawtio';

  Logger.oldGet = Logger.get;
  Logger.loggers = {};
  Logger.get = (name) => {
    let answer = Logger.oldGet(name);
    Logger.loggers[name] = answer;
    return answer;
  };

  // we'll default to 100 statements I guess...
  window['LogBuffer'] = 100;

  if ('localStorage' in window) {
    if (!('logLevel' in window.localStorage)) {
      window.localStorage['logLevel'] = JSON.stringify(Logger.INFO);
    }
    let logLevel = Logger.DEBUG;
    try {
      logLevel = JSON.parse(window.localStorage['logLevel']);
    } catch (e) {
      console.error("Failed to parse log level setting: ", e);
    }
    Logger.setLevel(logLevel);
    if ('showLog' in window.localStorage) {
      let showLog = window.localStorage['showLog'];
      if (showLog === 'true') {
        let container = document.getElementById("log-panel");
        if (container) {
          container.setAttribute("style", "bottom: 50%;");
        }
      }
    }
    if ('logBuffer' in window.localStorage) {
      let logBuffer = window.localStorage['logBuffer'];
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

  let consoleLogger = null;

  if ('console' in window) {
    window['JSConsole'] = window.console;
    consoleLogger = function (messages, context) {
      let MyConsole = window['JSConsole'];
      let hdlr = MyConsole.log;
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
  Logger.getType = (obj) => _.toString(obj).slice(8, -1);

  Logger.isError = (obj) => obj && Logger.getType(obj) === 'Error';

  Logger.isArray = (obj) => obj && Logger.getType(obj) === 'Array';

  Logger.isObject = (obj) => obj && Logger.getType(obj) === 'Object';

  Logger.isString = (obj) => obj && Logger.getType(obj) === 'String';

  window['logInterceptors'] = [];

  Logger.formatStackTraceString = (stack) => {
    let lines = stack.split("\n");
    if (lines.length > 100) {
      // too many lines, let's snip the middle so the browser doesn't bail
      let start = 20;
      let amount = lines.length - start * 2;
      lines.splice(start, amount, '>>> snipped ' + amount + ' frames <<<');
    }
    let stackTrace = "<div class=\"log-stack-trace\">\n";
    for (let j = 0; j < lines.length; j++) {
      let line = lines[j];
      if (line.trim().length === 0) {
        continue;
      }
      stackTrace = stackTrace + "<p>" + line + "</p>\n";
    }
    stackTrace = stackTrace + "</div>\n";
    return stackTrace;
  };


  Logger.setHandler((messages, context) => {
    let node = undefined;
    let panel = undefined;
    let container = document.getElementById("hawtio-log-panel");
    if (container) {
      panel = document.getElementById("hawtio-log-panel-statements");
      node = document.createElement("li");
    }
    let text = "";
    let postLog: (() => void)[] = [];
    // try and catch errors logged via console.error(e.toString) and reformat
    if (context['level'].name === 'ERROR' && messages.length === 1) {
      if (Logger.isString(messages[0])) {
        let message = messages[0];
        let messageSplit = message.split(/\n/);
        if (messageSplit.length > 1) {
          // we may have more cases that require normalizing, so a more flexible solution
          // may be needed
          let lookFor = "Error: Jolokia-Error: ";
          if (messageSplit[0].search(lookFor) === 0) {
            let msg = messageSplit[0].slice(lookFor.length);
            window['JSConsole'].info("msg: ", msg);
            try {
              let errorObject = JSON.parse(msg);
              let error = new Error();
              error.message = errorObject['error'];
              error.stack = errorObject['stacktrace'].replace("\\t", "&nbsp;&nbsp").replace("\\n", "\n");
              messages = [error];
            } catch (e) {
              // we'll just bail and let it get logged as a string...
            }
          } else {
            let error = new Error();
            error.message = messageSplit[0];
            error.stack = message;
            messages = [error];
          }
        }
      }
    }
    let scroll = false;
    if (node) {
      for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        if (Logger.isArray(message) || Logger.isObject(message)) {
          let obj = "";
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
            postLog.push(() => {
              let stackTrace = Logger.formatStackTraceString(message['stack']);
              let logger = context.name ? Logger.get(context.name) : Logger;
              logger.info("Stack trace:", stackTrace);
            });
          }
        } else {
          text = text + message;
        }
      }
      if (context.name) {
        text = `[<span class="green">${context.name}</span>] ${text}`;
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
    let interceptors = window['logInterceptors'];
    for (let i = 0; i < interceptors.length; i++) {
      interceptors[i](context.level.name, text);
    }

    postLog.forEach((func) => func());
  });

}
