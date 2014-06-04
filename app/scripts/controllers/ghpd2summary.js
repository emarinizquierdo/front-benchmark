'use strict';

angular.module('bbvaBenchmarkApp')
  .controller('Ghpd2summaryCtrl', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });
