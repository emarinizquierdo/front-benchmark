'use strict';

angular.module('bbvaBenchmarkApp')
  .controller('BigqueryCtrl', function ($rootScope, $scope, $location) {
   	
  // User Submitted Variables
  var _projectId = '824271639318';
  $rootScope.projectId = _projectId;
  //var _clientId = '604614689115-5f8a5ume1dvbj2hi3tpjhm1rb4urh936.apps.googleusercontent.com';
  var _clientId = '305184630124-1cgkib7plmnkh7euv1pkn3lv91icvv36@developer.gserviceaccount.com';

  var _config = {
    'client_id': _clientId,
    'scope': 'https://www.googleapis.com/auth/bigquery'
  };

  $scope.auth = function() {
    gapi.auth.authorize(_config, function() {
      gapi.client.load('bigquery', 'v2', function(){
        $rootScope.authenticated = true;
        $location.path("/main");
        $scope.$apply();
      });
        
    });
  }

      
  });
