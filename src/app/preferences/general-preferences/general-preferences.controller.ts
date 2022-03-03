/// <reference path="general-preferences.service.ts"/>

namespace Core {

  export function GeneralPreferencesController($scope, generalPreferencesService: GeneralPreferencesService) {
    'ngInject';

    const onSwitchChange = (_event, state) => {
      generalPreferencesService.setDefaultVerticalNavState(state ? 'show' : 'hide');
    };

    (jQuery("#general-preferences-form-vertical-nav-switch") as any).bootstrapSwitch({
      onText: 'Show',
      offText: 'Hide',
      state: generalPreferencesService.getDefaultVerticalNavState() === 'show',
      onSwitchChange: onSwitchChange
    });
  }

}
