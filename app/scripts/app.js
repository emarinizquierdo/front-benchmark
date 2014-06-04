'use strict';

angular.module('bbvaBenchmarkApp', [
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/main',
      controller: 'MainCtrl'
    })
    .when('/bigquery', {
      templateUrl: 'partials/bigquery',
      controller: 'BigqueryCtrl'
    })
    .when('/ghpd2Summary', {
      templateUrl: 'partials/ghpd2summary',
      controller: 'Ghpd2summaryCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
    
  $locationProvider.html5Mode(true);

}).run(function($rootScope){

  var _auxUrlTargets = JSON.parse(localStorage.getItem("urlTargets"));

  $rootScope.urlTargets = _auxUrlTargets || [];

});