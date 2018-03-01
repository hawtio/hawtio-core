angular.module("hawtio-help")
  .run(['helpRegistry', '$templateCache', function (helpRegistry, $templateCache) {
    helpRegistry.addUserDoc('camel', 'help/example/camel.md');
    helpRegistry.addUserDoc('activemq', 'help/example/activemq.md');
    helpRegistry.addUserDoc('osgi', 'help/example/osgi.md');
    $templateCache.put('help/example/activemq.md','## ActiveMQ\n\nTest documentation for ActiveMQ\n');
    $templateCache.put('help/example/camel.md','## Camel\n\nTest documentation for camel\n');
    $templateCache.put('help/example/osgi.md','## OSGi\n\nTest documentation for OSGi\n');
  }]);
