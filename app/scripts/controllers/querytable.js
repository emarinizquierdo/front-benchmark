'use strict';

angular.module('bbvaBenchmarkApp')
.controller('QuerytableCtrl', function ($rootScope, $scope, $http) {

	// User Submitted Variables
    var _projectID = $rootScope.projectId;
    $scope.table1Config = {};
    $scope.query = "SELECT * FROM [bbva-ida:hwpd.requests] LIMIT 100";

	$scope.launchBigQuery = function() {

		$scope.table1Config = {
			  projectId : _projectID
			, query : $scope.query
			, callback : _QueryCallback01
		};

		function _QueryCallback01( p_data, p_element ){
			var table = new google.visualization.Table(p_element);
			table.draw(p_data);
		}

    }

});
