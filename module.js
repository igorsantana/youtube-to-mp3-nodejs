define(function(require) {

  require('app/modules/configuration/evolusom/services/module');
  require('angular-ui-router');

  return require('angular').module('app.evolusom.controllers', ['app.evolusom.services', 'ui.router', 'anymarket.extras'])
    .controller('BaseController', require('app/modules/configuration/evolusom/controllers/BaseController'))
});
