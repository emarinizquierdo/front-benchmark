'use strict';

angular.module('bbvaBenchmarkApp')
.controller('GauthCtrl', function ($rootScope, $scope, $location) {
	if(!$rootScope.authenticated){
		$location.path("/bigquery");
	}
});
