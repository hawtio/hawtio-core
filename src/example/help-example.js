angular.module("hawtio-help")
  .run(['helpRegistry', function (helpRegistry) {
    helpRegistry.addUserDoc('camel', 'help/example/camel.md');
    helpRegistry.addUserDoc('activemq', 'help/example/activemq.md');
    helpRegistry.addUserDoc('osgi', 'help/example/osgi.md');
  }]);
