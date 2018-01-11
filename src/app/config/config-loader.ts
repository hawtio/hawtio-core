namespace Core {

  export function configLoader(next) {
    log.info('Loading hawtconfig.json...');
    
    $.getJSON('hawtconfig.json')
      .done(config => {
        window['hawtconfig'] = config;
        log.info('hawtconfig.json loaded');
      })
      .fail((jqxhr, textStatus, errorThrown) => {
        log.error(`Error fetching 'hawtconfig.json'. Status: '${textStatus}'. Error: '${errorThrown}'`);
      })
      .always(() => {
        next();
      });
  }

}