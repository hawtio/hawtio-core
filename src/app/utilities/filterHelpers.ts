/// <reference path="baseHelpers.ts"/>

namespace FilterHelpers {

  export var log:Logging.Logger = Logger.get("FilterHelpers");

  export function search(object:any, filter:string, maxDepth = -1, and = true):boolean {
    var f = filter.split(" ");
    var matches = _.filter(f, (f) => searchObject(object, f, maxDepth));
    if (and) {
      return matches.length === f.length;
    } else {
      return matches.length > 0;
    }
  }

  /**
   * Tests if an object contains the text in "filter".  The function
   * only checks the values in an object and ignores keys altogether,
   * can also work with strings/numbers/arrays
   * @param object
   * @param filter
   * @returns {boolean}
   */
  export function searchObject(object:any, filter:string, maxDepth = -1, depth = 0):boolean {
    // avoid inifinite recursion...
    if ((maxDepth > 0 && depth >= maxDepth) || depth > 50) {
      return false;
    }
    var f = filter.toLowerCase();
    var answer = false;
    if (angular.isString(object)) {
      answer = (<string>object).toLowerCase().indexOf(f) !== -1;
    } else if (angular.isNumber(object)) {
      answer = ("" + object).toLowerCase().indexOf(f) !== -1;
    } else if (angular.isArray(object)) {
      answer = _.some(object, (item) => searchObject(item, f, maxDepth, depth + 1));
    } else if (angular.isObject(object)) {
      answer = searchObject(_.values(object), f, maxDepth, depth);
    }
    return answer;
  }

}
