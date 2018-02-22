/// <reference path="tasks.ts"/>

namespace Core {

  export const eventServicesModule = angular
    .module('hawtio-core-event-services', [])
    // service to register tasks that should happen when the URL changes
    .factory('locationChangeStartTasks', () => new ParameterizedTasks('LocationChangeStartTasks'))
    // service to register stuff that should happen when the user logs in
    .factory('postLoginTasks', () => new Tasks('PostLogin'))
    // service to register stuff that should happen when the user logs out
    .factory('preLogoutTasks', () => new Tasks('PreLogout'))
    // service to register stuff that should happen after the user logs out
    .factory('postLogoutTasks', () => new Tasks('PostLogout'))
    .run(initializeTasks)
    .name;

  function initializeTasks(
    $rootScope: ng.IRootScopeService,
    locationChangeStartTasks: ParameterizedTasks,
    postLoginTasks: Tasks,
    preLogoutTasks: Tasks,
    postLogoutTasks: Tasks): void {
    'ngInject';

    // Reset pre/post-logout tasks after login
    postLoginTasks
      .addTask("ResetPreLogoutTasks", () => preLogoutTasks.reset())
      .addTask("ResetPostLogoutTasks", () => postLogoutTasks.reset());

    // Reset pre-login tasks before logout
    preLogoutTasks
      .addTask("ResetPostLoginTasks", () => postLoginTasks.reset());

    $rootScope.$on('$locationChangeStart', ($event, newUrl, oldUrl) =>
      locationChangeStartTasks.execute($event, newUrl, oldUrl));

    log.debug("Event services loaded");
  }

}
