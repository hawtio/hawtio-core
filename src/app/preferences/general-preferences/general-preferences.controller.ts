/// <reference path="general-preferences.service.ts"/>

namespace Core{
    export function GeneralPreferencesController($scope, generalPreferencesService: GeneralPreferencesService)
    {
        'ngInject';

        $scope.availableVerticalNavs = [{
            id: 0,
            name: 'OFF'        
        },{
                id: 1,
                name: 'ON'
          }];

    }
}