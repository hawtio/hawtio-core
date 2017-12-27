namespace Core {

  export class PreferencesService {

    constructor(private $window: ng.IWindowService) {
      'ngInject';
    }

    saveLocationUrl(url: string) {
      this.$window.sessionStorage.setItem('lastUrl', url);
    }

    restoreLocation($location: ng.ILocationService) {
      const url = this.$window.sessionStorage.getItem('lastUrl');
      $location.url(url);
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
    bindModelToSearchParam($scope, $location, modelName: string, paramName: string, initialValue?: any, to?: (value: any) => any, from?: (value: any) => any) {
      if (!(modelName in $scope)) {
        $scope[modelName] = initialValue;
      }

      var toConverter = to || (value => value);
      var fromConverter = from || (value => value);

      function currentValue() {
        return fromConverter($location.search()[paramName] || initialValue);
      }

      var value = currentValue();
      this.pathSet($scope, modelName, value);

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
     * Navigates the given set of paths in turn on the source object
     * and updates the last path value to the given newValue
     *
     * @method pathSet
     * @for Core
     * @static
     * @param {Object} object the start object to start navigating from
     * @param {Array} paths an array of path names to navigate or a string of dot separated paths to navigate
     * @param {Object} newValue the value to update
     * @return {*} the last step on the path which is updated
     */
    pathSet(object: any, paths: any, newValue: any) {
      var pathArray = (angular.isArray(paths)) ? paths : (paths || "").split(".");
      var value = object;
      var lastIndex = pathArray.length - 1;
      angular.forEach(pathArray, (name, idx) => {
        var next = value[name];
        if (idx >= lastIndex || !angular.isObject(next)) {
          next = (idx < lastIndex) ? {} : newValue;
          value[name] = next;
        }
        value = next;
      });
      return value;
    }

  }

}
