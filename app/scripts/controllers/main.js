'use strict';

angular.module('bbvaBenchmarkApp')
.controller('MainCtrl', function ($rootScope, $scope, $http, Utils) {
	
	// User Submitted Variables
    var _projectID = $rootScope.projectId;
    $scope.table1Config = {};

	$scope.launchBigQuery = function() {

		var _auxQuery = "SELECT mt1.repository_url as inicio, mt2.repository_url as fin, AVG(mt2.repository_size - mt1.repository_size) as diferencia ";
		_auxQuery += "FROM (SELECT * FROM [publicdata:samples.github_timeline] WHERE ";

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "repository_url = '" + $rootScope.urlTargets[0] + "'";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length; _i++){
			_auxQuery += "OR repository_url = '" + $rootScope.urlTargets[_i] + "'";
		}

		_auxQuery += ") as mt1 CROSS JOIN ( SELECT * FROM [publicdata:samples.github_timeline] WHERE ";

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "repository_url = '" + $rootScope.urlTargets[0] + "'";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length; _i++){
			_auxQuery += "OR repository_url = '" + $rootScope.urlTargets[_i] + "'";
		}

    	_auxQuery += ") as mt2 WHERE ";
		_auxQuery += "mt1.repository_url != mt2.repository_url AND ( ";
		

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "( mt1.repository_url = '" + $rootScope.urlTargets[0] + "' AND mt2.repository_url = '" + $rootScope.urlTargets[1] + "' )";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length - 1; _i++){
			_auxQuery += "OR ( mt1.repository_url = '" + $rootScope.urlTargets[_i] + "' AND mt2.repository_url = '" + $rootScope.urlTargets[_i + 1] + "' )";
		}

		_auxQuery += ") GROUP BY inicio,fin";

		$scope.table1Config = {
			  projectId : _projectID
			, query : _auxQuery//'SELECT repository_url, repository_size FROM [publicdata:samples.github_timeline] LIMIT 100;'
			, callback : _table1ConfigCallback
		};

		function _table1ConfigCallback( p_data, p_element ){
			var visualization = new google.visualization.BarChart(p_element);
			var myView = new google.visualization.DataView(p_data)
			myView.setColumns([0,2]);
			visualization.draw(myView, {title: 'bottom', curveType: 'function'});

			var table = new google.visualization.Table(document.getElementById('tablespreadsheet'));
			table.draw(p_data);

		}

    }

    if($rootScope.urlTargets.length > 1){
    	$scope.launchBigQuery();
    }


});
