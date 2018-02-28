/// <reference path="coreHelpers.ts" />

declare var humanizeDuration:any;
declare var humandate:any;

namespace CoreFilters {
  var pluginName = 'hawtio-core-filters';
  var _module = angular.module(pluginName, []);

  _module.filter("valueToHtml", () => Core.valueToHtml);
  _module.filter('humanize', () => Core.humanizeValue);
  _module.filter('humanizeMs', () => Core.humanizeMilliseconds);
  _module.filter('maskPassword', () => Core.maskPassword);

  // relativeTime was the first humanize filter for dates,
  // let's maybe also add a 'humanizeDate' filter to match
  // up with 'humanizeDuration'
  var relativeTimeFunc = (date) => {
    return humandate.relativeTime(date);
  };

  // Turn a date into a relative time from right now
  _module.filter('relativeTime', () => {
    return relativeTimeFunc;
  });

  _module.filter('humanizeDate', () => {
    return relativeTimeFunc;
  });

  // Output a duration in milliseconds in a human-readable format
  _module.filter('humanizeDuration', () => {
    return (duration) => {
      return humanizeDuration(duration, { round: true });
    }
  });


  hawtioPluginLoader.addModule(pluginName);

}
