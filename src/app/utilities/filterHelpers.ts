/// <reference path="baseHelpers.ts"/>

namespace FilterHelpers {

  export const log: Logging.Logger = Logger.get("hawtio-core-utils-filter-helpers");

  export function search(object: any, filter: string, maxDepth = -1, and = true): boolean {
    let f = filter.split(" ");
    let matches = _.filter(f, (f) => searchObject(object, f, maxDepth));
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
  export function searchObject(object: any, filter: string, maxDepth = -1, depth = 0): boolean {
    // avoid inifinite recursion...
    if ((maxDepth > 0 && depth >= maxDepth) || depth > 50) {
      return false;
    }
    let f = filter.toLowerCase();
    let answer = false;
    if (angular.isString(object)) {
      answer = (object as string).toLowerCase().indexOf(f) !== -1;
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
