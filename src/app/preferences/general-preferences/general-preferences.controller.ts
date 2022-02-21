namespace Core{
    export function GeneralPreferencesController($scope,GeneralPreferencesService : GeneralPreferencesService)
    {
        'ngInject';

        $scope.availableVerticalNavs = ["OFF","ON"];
        $scope.current_state =  GeneralPreferencesService.getVerticalnavstate();
        $scope.onToggleChange = current_state =>{
            GeneralPreferencesService.setVerticalnavstate(current_state);
        }
        
    }
}