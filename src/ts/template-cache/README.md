# hawtio-template-cache

A module that wraps/extends the existing $templateCache and $templateRequest services from angular.  Use this module when you embed all of your templates into the $templateCache service, then use this plugin to ensure that $templateRequest doesn't try and fetch templates from your server, especially when you've a lot of plugins and templates.
