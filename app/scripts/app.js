'use strict';

angular.module('bbvaBenchmarkApp', [
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.multiselect',
  'uiSlider'
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
    .when('/help', {
      templateUrl: 'partials/help',
      controller: 'HelpCtrl'
    })
    .when('/querytable', {
      templateUrl: 'partials/querytable',
      controller: 'QuerytableCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
    
  $locationProvider.html5Mode(true);

}).run(function($rootScope, $location){

  var _auxUrlTargets = JSON.parse(localStorage.getItem("urlTargets"));

  $rootScope.urlTargets = _auxUrlTargets || [];

  $rootScope.$on('$routeChangeStart', function (event, next) {
    if(next.$$route && next.$$route.originalPath == "/help"){
      return
    }
    if (!$rootScope.authenticated) {
      $location.path('/bigquery');
    }
  });

});