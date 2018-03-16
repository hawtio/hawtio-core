/// <reference path="baseHelpers.ts"/>

namespace UrlHelpers {

  const log: Logging.Logger = Logger.get("hawtio-core-utils-url-helpers");

  /**
   * Returns the URL without the starting '#' if it's there
   * @param url
   * @returns {string}
   */
  export function noHash(url: string): string {
    if (url && _.startsWith(url, '#')) {
      return url.substring(1);
    } else {
      return url;
    }
  }

  export function extractPath(url: string): string {
    if (url.indexOf('?') !== -1) {
      return url.split('?')[0];
    } else {
      return url;
    }
  }

  /**
   * Returns whether or not the context is in the supplied URL.  If the search string starts/ends with '/' then the entire URL is checked.  If the search string doesn't start with '/' then the search string is compared against the end of the URL.  If the search string starts with '/' but doesn't end with '/' then the start of the URL is checked, excluding any '#'
   * @param url
   * @param thingICareAbout
   * @returns {boolean}
   */
  export function contextActive(url: string, thingICareAbout: string): boolean {
    let cleanUrl = extractPath(url);
    if (_.endsWith(thingICareAbout, '/') && _.startsWith(thingICareAbout, "/")) {
      return cleanUrl.indexOf(thingICareAbout) > -1;
    }
    if (_.startsWith(thingICareAbout, "/")) {
      return _.startsWith(noHash(cleanUrl), thingICareAbout);
    }
    return _.endsWith(cleanUrl, thingICareAbout);
  }

  /**
   * Joins the supplied strings together using '/', stripping any leading/ending '/'
   * from the supplied strings if needed, except the first and last string
   * @returns {string}
   */
  export function join(...paths: string[]) {
    let tmp = [];
    let length = paths.length - 1;
    paths.forEach((path, index) => {
      if (Core.isBlank(path)) {
        return;
      }
      if (path === '/') {
        tmp.push('');
        return;
      }
      if (index !== 0 && path.match(/^\//)) {
        path = path.slice(1);
      }
      if (index !== length && path.match(/\/$/)) {
        path = path.slice(0, path.length - 1);
      }
      if (!Core.isBlank(path)) {
        tmp.push(path);
      }
    });
    let rc = tmp.join('/');
    return rc
  }

  export function parseQueryString(text?: string): any {
    let uri = new URI(text);
    return URI.parseQuery(uri.query());
  }

  /**
   * Apply a proxy to the supplied URL if the jolokiaUrl is using the proxy, or if the URL is for a a different host/port
   * @param jolokiaUrl
   * @param url
   * @returns {*}
   */
  export function maybeProxy(jolokiaUrl: string, url: string) {
    if (jolokiaUrl && _.startsWith(jolokiaUrl, 'proxy/')) {
      log.debug("Jolokia URL is proxied, applying proxy to:", url);
      return join('proxy', url);
    }
    let origin = window.location['origin'];
    if (url && (_.startsWith(url, 'http') && !_.startsWith(url, origin))) {
      log.debug("Url doesn't match page origin:", origin, "applying proxy to:", url);
      return join('proxy', url);
    }
    log.debug("No need to proxy:", url);
    return url;
  }

  /**
   * Escape any colons in the URL for ng-resource, mostly useful for handling proxified URLs
   * @param url
   * @returns {*}
   */
  export function escapeColons(url: string): string {
    let answer = url;
    if (_.startsWith(url, 'proxy')) {
      answer = url.replace(/:/g, '\\:');
    } else {
      answer = url.replace(/:([^\/])/, '\\:$1');
    }
    return answer;
  }

}
