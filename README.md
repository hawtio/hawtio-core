# Hawtio Core

This package contains the core parts of the **[Hawtio](http://hawt.io)** web console.

hawtio-core features include:

1. [Plugins](#plugins)
2. [Routing and navigation](#routing-and-navigation)
3. [Help documentation](#help-documentation)
4. [UI extensions](#ui-extensions)
5. [Template caching](#template-caching)

## Plugins

### Registering inline plugins

Register any AngularJS modules you want to load using `hawtioPluginLoader` in your code. For example:

```javascript
  export const myModule = angular
    .module('my-module', [])
    .name;

  hawtioPluginLoader.addModule(myModule);
```

By default hawtio-core already adds `ng`, `ng-route` and `ng-sanitize`.

### Registering plugins dynamically

Plugins can also be dynamically discovered by registering URLs to check with `hawtioPluginLoader.addUrl()`. The URL should return a map of json objects that contain scripts for the plugin loader to load. For example:

```json
{
  "some_plugin": {
    "Name": "dummy",
    "Context": "/hawtio",
    "Scripts": [
      "test.js"
    ]
  }
}
```

Where we've the following attributes:

* **Name** - The name of the plugin
* **Scripts** - An array of script files that should be loaded
* **Context** - the top level context under which all scripts reside

Remove any ng-app annotation from your HTML template, hawtio-core manually bootstraps AngularJS.

## Routing and navigation

In your Hawtio plugin you can configure your routes and the navigation bar in one go. For example:

```javascript
  var tab = undefined;
  var module = angular.module("MyAwesomePlugin", []);

  // configure our tabs and routing
  module.config(['$routeProvider', 'HawtioNavBuilderProvider', function($routeProvider, builder) {
    tab = builder.create()
            .id("MyTab")
            .title(function () { return "Hello"; })
            .href(function () { return "/test1"l })
            .subPath("World!", "page1", "partials/page1.html")
            .build();
    builder.configureRouting($routeProvider, tab);
  }]);

  // add our tabs to the nav bar
  module.run(["HawtioNav", function(HawtioNav) {
    HawtioNav.add(tab);
  }]);

  hawtioPluginLoader.addModule("MyAwesomePlugin");
```

You can also configure your routes separately for more control and configure the tabs in your module's run method. For example:

```javascript
  var module = angular.module("MyAwesomePlugin", []);
  // configure routing...
  module.config(['$routeProvider', function($routeProvider) {
    /// snip
  }]);

  module.run(["HawtioNav", function(HawtioNav) {
    // get a builder object to create nav objects
    var builder = HawtioNav.builder();

    // Create a subtab
    var subTab = builder.id('fooSubTab')
                        .rank(30)
                        .href(function() { return '/foo/bar'; })
                        .title(function() { return 'My Sub Tab'; })
                        .build();

    // Create a top-level tab
    var tab = builder.id('foo')
                     .rank(10)
                     .href(function() { return '/foo'; })
                     .isValid(function() { return true; })
                     .title(function() { return 'My Tab'; })
                     .tabs(subTab);
                     .build();

    // Add to the nav bar
    HawtioNav.add(tab);
  }]);
```

Tabs can also influence what the initial page/route will be by adding a 'defaultPage' attribute. For example:

```javascript
  var module = angular.module("MyAwesomePlugin", []);
  // configure routing...
  module.config(['$routeProvider', function($routeProvider) {
    /// snip
  }]);

  module.run(["HawtioNav", function(HawtioNav) {
    // get a builder object to create nav objects
    var builder = HawtioNav.builder();

    // Create a subtab
    var subTab = builder.id('fooSubTab')
                        .href(function() { return '/foo/bar'; })
                        .title(function() { return 'My Sub Tab'; })
                        .build();

    // Create a top-level tab
    var tab = builder.id('foo')
                     .defaultPage({
                       rank: 30, // rank is used to handle multiple default pages, higher values win
                       isValid: (yes, no) => { // isValid is used to test if a page can be the default page or not.  You need to call either the yes or no function passed in based on some criteria, can be async.
                         if (someKindOfTest) {
                           yes();
                         } else {
                           no();
                         }
                       }
                     })
                     .href(function() { return '/foo'; })
                     .isValid(function() { return true; })
                     .title(function() { return 'My Tab'; })
                     .tabs(subTab);
                     .build();

    // Add to the nav bar
    HawtioNav.add(tab);
  }]);
```

## Help documentation

Plugins can register their associated help documentation via the `helpRegistry` service. Just inject it into a run block and add your custom documentation written in Markdown. For example:

```javascript
myModule.run(['helpRegistry', function(helpRegistry) {
  helpRegistry.addUserDoc('myName', 'path/to/my/doc.md');
}
```

## UI extensions

An extension registration service and a rendering directive are provided to extend the UI. The extension points are named locations in the UI and plugins can register callbacks to produce the HTML that will be added to the DOM.

### Register an extension point callback

In your Hawtio plugin you can register an extension point callback like:

```javascript
  var module = angular.module("MyAwesomePlugin", []);

  module.config(['HawtioExtension', function(HawtioExtension) {
    // Register an extension point callback that returns a string.
    // When a string is returned it will NOT be converted to HTML
    // but will be added as a text node.
    HawtioExtension.add("someExtensionPoint", function(scope){
      return "Some important text!";
    });

    // Register an extension point callback that returns a DOM element
    // When a DOM element is returned it will be appended to the containing
    // <div> of the extension point
    HawtioExtension.add("someExtensionPoint", function(scope){
      var div = document.createElement("div");
      div.className = "awesome";
      div.appendChild(document.createTextNode("I can add stuff!"));

      return div;
    });

    // Register an extension point callback that returns null.
    // Use this if you do not need to append something directly to the extension
    // point but want to make sure some javascript is run when that extension point
    // is rendered.
    HawtioExtension.add("someExtensionPoint", function(scope){
      // some javascript here that does whatever you want
      return null;
    });
  }]);

  hawtioPluginLoader.addModule("MyAwesomePlugin");
```

It is important to note that currently callbacks are rendered in the order they were registered.  In the future we may extend the registration API to include a priority.

### Render an extension point

Any plugin can choose to render all the registered callbacks for an extension point.

#### Using the directive in an angular template (recommended)

```html
<div>
  <h1>Some HTML template for my module</h1>
  <hawtio-extension name="someExtensionPoint"></hawtio-extension>
</div>
```

#### Using the render API

Using the directive method above is recommended in most cases, but does pass down whatever
the current scope is into the callbacks so that they have the same data available to them.
If you want to restrict the data passed down to the callbacks then you can call the service's
render API directly.

```javascript
// Where element is the DOM node that the results of all the callbacks
// will be appended to, and scope is whatever data you want to make available
// to the callbacks.
HawtioExtension.render(extensionPointName, element, scope);
```

## Template caching

Hawtio Core wraps/extends the existing $templateCache and $templateRequest services from AngularJS. If you embed all of your templates into the $templateCache service, then use this functionality to ensure that $templateRequest doesn't try and fetch templates from your server, especially when you've a lot of plugins and templates.
