'use strict';

angular.module('bbvaBenchmarkApp')
.controller('QuerytableCtrl', function ($scope, $http) {

	// User Submitted Variables
    var _projectID = '604614689115';
    $scope.table1Config = {};
    $scope.query = "SELECT * FROM [publicdata:samples.github_timeline] LIMIT 100";

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
