
var Test;
(function (Test) {
    // simple test plugin for messing with the nav bar
    Test.pluginName = 'example';
    Test.templatePath = 'example/html';
    var log = Test.log = Logger.get(Test.pluginName);
    Test._module = angular.module(Test.pluginName, []);
    var tab = null;
    var tab2 = null;
    var tabs = [];
    
    Test._module.config(['$routeProvider', 'HawtioNavBuilderProvider', '$locationProvider', function ($routeProvider, builder, $locationProvider) {
        $locationProvider.html5Mode(true);
        tab = builder.create()
                     .id(Test.pluginName)
                     .title(function () { return "Test"; })
                     .tooltip(function () { return "This is the tooltip"; })
                     .rank(10)
                     .href(function () { return "/test1"; })
                     .subPath("Sub Page 1", "page1", builder.join(Test.templatePath, 'page1.html'), 1)
                     .subPath("Sub Page 2", "page2", builder.join(Test.templatePath, 'page2.html'), 4)
                     .subPath("Sub Page 3", "page3", builder.join(Test.templatePath, 'page3.html'), 2)
                     .build();

        tab2 = builder.create()
                      .id(builder.join(Test.pluginName, '2'))
                      .rank(15)
                      .title(function () { return "Test2"; })
                      .tooltip(function () { return "This is the tooltip for test2"; })
                      .href(function () { return "/test2"; })
                      .page(function () { return builder.join(Test.templatePath, 'page1.html'); })
                      .build();

        var positions = {
          '1': 15,
          '2': 15,
          '3': 55,
          '4': 65 
        };

        ['1', '2', '3', '4'].forEach(function(index) {
          tabs.push(builder.create()
                           .id(builder.join('test', index))
                           .rank(positions[index])
                           .title( function() { return 'Test ' + index; })
                           .href( function() { return '/many/' + index; })
                           .build());
        });

        console.log("Tabs:", tabs);


        builder.configureRouting($routeProvider, tab);
        builder.configureRouting($routeProvider, tab2);
        $routeProvider.when('/many/:index', { templateUrl: builder.join(Test.templatePath, 'page1.html') });

        // Manually configured route
        $routeProvider.when('/foo', { redirectTo: '/foo/bar' });
        $routeProvider.when('/foo/bar', { templateUrl: builder.join(Test.templatePath, 'page1.html') });
        $routeProvider.when('/foo/barBaz', { templateUrl: builder.join(Test.templatePath, 'page2.html') });
    }]);

    Test._module.run(["viewRegistry", "HawtioNav", "$interval", '$templateCache', function (
      viewRegistry, HawtioNav, $interval, $templateCache) {

      viewRegistry['foo'] = 'templates/main-nav/layoutTest.html';
      Test.log.debug('loaded');
      tab.tabs.push({
        id: 'test',
        title: function() { return 'you should not see me!'; },
        href: function() { return '/foo'; },
        isValid: function() { return valid; },
      });
      tab.defaultPage = {
        rank: 10,
        isValid: function(yes, no) {
          setTimeout(function() {
            no();
          }, 50);
        }
      };
      tab2.defaultPage = {
        rank: 20,
        isValid: function(yes, no) {
          setTimeout(function() {
            no();
          }, 1000);
        }
      };
      HawtioNav.add(tab);
      HawtioNav.add(tab2);
      tabs.forEach(function(tab) { HawtioNav.add(tab); });
      var builder = HawtioNav.builder();
      var subTab1 = builder.id('fooSubTab1')
                          .href(function() { return '/foo/bar'; })
                          .title(function() { return 'My Sub Tab 2'; })
                          .show(function () { return true; })
                          .build();
      var subTab2 = builder.id('fooSubTab2')
                          .href(function() { return '/foo/barBaz'; })
                          .title(function() { return 'My Sub Tab 2'; })
                          .build();
      var tab3 = builder.id('foo')
                        .defaultPage({
                          rank: 40,
                          isValid: function(yes, no) {
                            setTimeout(function() {
                              no();
                            }, 50);
                          }
                        })
                        .href(function() { return '/foo'; })
                        .title(function() { return 'My Tab'; })
                        .tabs(subTab1, subTab2)
                        .build();
      HawtioNav.add(tab3);
      var valid = true;
      $interval(function() { 
        log.debug("Interval fired!"); 
        valid = !valid;
      }, 1000);

      /*
      HawtioNav.add(builder.id('Blinky')
                      .title(function() { return 'Blinky' })
                      .href(function() { return '/'; })
                      .isValid(function() { return valid })
                      .build());
                      */
      /*
      HawtioNav.add(builder.id('PullRightLink')
                           .title(function() { return 'github'; })
                           .href(function() { return 'http://github.com'; })
                           .attributes({
                             'class': 'pull-right'
                           })
                           .linkAttributes({
                             'target': '_blank' 
                           }).build());
                           */

    $templateCache.put('example/html/page1.html', '<h1>Page 1</h1>');
    $templateCache.put('example/html/page2.html', '<h1>Page 2</h1>');
    $templateCache.put('example/html/page3.html', '<h1>Page 3</h1>');
    
    }]);
    hawtioPluginLoader.addModule(Test.pluginName);
})(Test || (Test = {}));
