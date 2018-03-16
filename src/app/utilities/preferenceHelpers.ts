namespace Core {

  const log: Logging.Logger = Logger.get("Core");

  /**
  * Parsers the given value as JSON if it is define
  */
  export function parsePreferencesJson(value, key): any {
    let answer = null;
    if (angular.isDefined(value)) {
      answer = Core.parseJsonText(value, "localStorage for " + key);
    }
    return answer;
  }

  export function initPreferenceScope($scope, localStorage, defaults): void {
    angular.forEach(defaults, (_default, key) => {
      $scope[key] = _default['value'];
      let converter = _default['converter'];
      let formatter = _default['formatter'];
      if (!formatter) {
        formatter = (value) => { return value; };
      }
      if (!converter) {
        converter = (value) => { return value; };
      }
      if (key in localStorage) {
        let value = converter(localStorage[key]);
        log.debug("from local storage, setting ", key, " to ", value);
        $scope[key] = value;
      } else {
        let value = _default['value'];
        log.debug("from default, setting ", key, " to ", value);
        localStorage[key] = value;
      }

      let watchFunc = _default['override'];
      if (!watchFunc) {
        watchFunc = (newValue, oldValue) => {
          if (newValue !== oldValue) {
            if (angular.isFunction(_default['pre'])) {
              _default.pre(newValue);
            }

            let value = formatter(newValue);
            log.debug("to local storage, setting ", key, " to ", value);
            localStorage[key] = value;

            if (angular.isFunction(_default['post'])) {
              _default.post(newValue);
            }
          }
        }
      }
      if (_default['compareAsObject']) {
        $scope.$watch(key, watchFunc, true);
      } else {
        $scope.$watch(key, watchFunc);
      }
    });
  }

  /**
   * Returns true if there is no validFn defined or if its defined
   * then the function returns true.
   *
   * @method isValidFunction
   * @for Perspective
   * @param {Core.Workspace} workspace
   * @param {Function} validFn
   * @param {string} perspectiveId
   * @return {boolean}
   */
  export function isValidFunction(workspace, validFn, perspectiveId): boolean {
    return !validFn || validFn(workspace, perspectiveId);
  }


}
