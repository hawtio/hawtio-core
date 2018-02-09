var pluginName = 'example-minimal';

var minimalComponent = {
  template: '<h1>Minimal Example</h1><p>{{$ctrl.message}}</p>',
  controller: function () {
    this.message = "Hello.";
  }
};

var minimalPluginModule = angular
  .module(pluginName, [])
  .component('minimalExample', minimalComponent)
  .name;

hawtioPluginLoader.addModule(pluginName);
