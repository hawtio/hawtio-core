namespace HawtioCompile {

  const pluginName = 'hawtio-compile';
  const log: Logging.Logger = Logger.get(pluginName);

  export const _module = angular
    .module(pluginName, [])
    .run(() => {
      log.debug("Module loaded");
    })
    .directive('compile', ['$compile', ($compile) => {
      return (scope, element, attrs) => {
        scope.$watch(
          (scope) => {
            // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          (value) => {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
    }]);

  hawtioPluginLoader.addModule(pluginName);

}
