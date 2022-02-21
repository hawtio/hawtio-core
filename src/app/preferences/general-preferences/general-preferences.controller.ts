namespace Core{
    export function GeneralPreferencesController($scope,GeneralPreferencesService : GeneralPreferencesService)
    {
        'ngInject';

        $scope.availableVerticalNavs = {
            availableOptions: [
              {id: '1', name: 'ON'},
              {id: '0', name: 'OFF'},
            ],
            selectedOption: {id: '1', name: 'ON'} 
            };
            
        $scope.onToggleChange = function(){
          GeneralPreferencesService.setVerticalnavstate($scope.availableVerticalNavs.selectedOption.name);
        }
        
    }
}