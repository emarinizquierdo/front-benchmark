'use strict';

angular.module('bbvaBenchmarkApp')
  .controller('BigqueryCtrl', function ($rootScope, $scope, $location) {
   	
  // User Submitted Variables
  var _clientId = '604614689115-5f8a5ume1dvbj2hi3tpjhm1rb4urh936.apps.googleusercontent.com';

  var _config = {
    'client_id': _clientId,
    'scope': 'https://www.googleapis.com/auth/bigquery'
  };

  $scope.auth = function() {
    gapi.auth.authorize(_config, function() {
      gapi.client.load('bigquery', 'v2');
        $rootScope.authenticated = true;
        $location.path("/main");
        $scope.$apply();
    });
  }

      
  });
