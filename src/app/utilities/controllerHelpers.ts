namespace ControllerHelpers {

  const log: Logging.Logger = Logger.get("ControllerHelpers");

  export function createClassSelector(config: any): (selection: any, model: any) => string {
    return (selector: string, model: any): string => {
      if (selector === model && selector in config) {
        return config[selector];
      }
      return '';
    }
  }

  export function createValueClassSelector(config: any): (model: any) => string {
    return (model: any): string => {
      if (model in config) {
        return config[model]
      } else {
        return '';
      }
    }
  }

  /**
   * Binds a $location.search() property to a model on a scope; so that its initialised correctly on startup
   * and its then watched so as the model changes, the $location.search() is updated to reflect its new value
   * @method bindModelToSearchParam
   * @for Core
   * @static
   * @param {*} $scope
   * @param {ng.ILocationService} $location
   * @param {String} modelName
   * @param {String} paramName
   * @param {Object} initialValue
   */
  export function bindModelToSearchParam($scope, $location, modelName: string, paramName: string,
    initialValue?: any, to?: (value: any) => any, from?: (value: any) => any): void {

    if (!(modelName in $scope)) {
      $scope[modelName] = initialValue;
    }

    let toConverter = to || Core.doNothing
    let fromConverter = from || Core.doNothing;

    function currentValue() {
      return fromConverter($location.search()[paramName] || initialValue);
    }

    let value = currentValue();
    Core.pathSet($scope, modelName, value);

    $scope.$watch(modelName, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        if (newValue !== undefined && newValue !== null) {
          $location.search(paramName, toConverter(newValue));
        } else {
          $location.search(paramName, '');
        }
      }
    });
  }

  /**
   * For controllers where reloading is disabled via "reloadOnSearch: false" on the registration; lets pick which
   * query parameters need to change to force the reload. We default to the JMX selection parameter 'nid'
   * @method reloadWhenParametersChange
   * @for Core
   * @static
   * @param {Object} $route
   * @param {*} $scope
   * @param {ng.ILocationService} $location
   * @param {string[]} parameters
   */
  export function reloadWhenParametersChange($route: any, $scope, $location: ng.ILocationService,
    parameters: string[] = ["nid"]): void {
    let initial = angular.copy($location.search());
    $scope.$on('$routeUpdate', () => {
      // lets check if any of the parameters changed
      let current = $location.search();
      let changed = [];
      angular.forEach(parameters, (param) => {
        if (current[param] !== initial[param]) {
          changed.push(param);
        }
      });
      if (changed.length) {
        log.debug("Reloading page due to change to parameters:", changed);
        $route.reload();
      }
    });
  }



}
