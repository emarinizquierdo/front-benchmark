'use strict';

angular.module('bbvaBenchmarkApp')
.controller('MainCtrl', function ($rootScope, $scope, $http, Utils) {
	
	// User Submitted Variables
    var _projectID = $rootScope.projectId;
    var _table = "[bbva-ida:hwpd.requests]";

    $scope.table1Config = {};
    $scope.table2Config = {};
    $scope.table3Config = {};
    $scope.table4Config = {};

    $scope.whereClause01 = "";

	$scope.launchBigQuery = function() {

		var _auxQuery = "SELECT mt1.url as inicio, mt2.url as fin, ROUND(ABS(AVG(mt2.startedDateTime - mt1.startedDateTime))) as diferencia ";
		_auxQuery += "FROM (SELECT * FROM " + _table + " WHERE ( ";

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "url = '" + $rootScope.urlTargets[0] + "'";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length; _i++){
			_auxQuery += "OR url = '" + $rootScope.urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

		_auxQuery += ") as mt1 CROSS JOIN ( SELECT * FROM " + _table + " WHERE ( ";

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "url = '" + $rootScope.urlTargets[0] + "'";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length; _i++){
			_auxQuery += "OR url = '" + $rootScope.urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

    	_auxQuery += ") as mt2 WHERE ";
		_auxQuery += "mt1.url != mt2.url AND mt1.batchId = mt2.batchId AND ( ";
		

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "( mt1.url = '" + $rootScope.urlTargets[0] + "' AND mt2.url = '" + $rootScope.urlTargets[1] + "' )";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length - 1; _i++){
			_auxQuery += "OR ( mt1.url = '" + $rootScope.urlTargets[_i] + "' AND mt2.url = '" + $rootScope.urlTargets[_i + 1] + "' )";
		}

		_auxQuery += ") GROUP BY inicio,fin";

		$scope.table1Config = {
			  projectId : _projectID
			, query : _auxQuery
			, callback : _table1ConfigCallback
		};

		function _table1ConfigCallback( p_data, p_element ){
			var visualization = new google.visualization.BarChart(p_element);
			var myView = new google.visualization.DataView(p_data)
			myView.setColumns([0,2]);
			visualization.draw(myView, {curveType: 'function'});
/*
			var table = new google.visualization.Table(document.getElementById('tablespreadsheet'));
			table.draw(p_data);*/

		}

    }

    $scope.launchBigQueryByHours = function() {

		var _auxQuery = "SELECT mt1.url as inicio, mt2.url as fin, (INTEGER(mt1.startedDateTime/(1000*60*60))%24 + 2) as hour, ROUND(ABS(AVG(mt2.startedDateTime - mt1.startedDateTime))) as diferencia ";
		_auxQuery += "FROM (SELECT * FROM " + _table + " WHERE ( ";

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "url = '" + $rootScope.urlTargets[0] + "'";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length; _i++){
			_auxQuery += "OR url = '" + $rootScope.urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

		_auxQuery += ") as mt1 CROSS JOIN ( SELECT * FROM " + _table + " WHERE ( ";

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "url = '" + $rootScope.urlTargets[0] + "'";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length; _i++){
			_auxQuery += "OR url = '" + $rootScope.urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

    	_auxQuery += ") as mt2 WHERE ";
		_auxQuery += "mt1.url != mt2.url AND mt1.batchId = mt2.batchId AND ( ";
		

		if($rootScope.urlTargets.length > 0){
			_auxQuery += "( mt1.url = '" + $rootScope.urlTargets[0] + "' AND mt2.url = '" + $rootScope.urlTargets[1] + "' )";
		}

		for(var _i = 1; _i < $rootScope.urlTargets.length - 1; _i++){
			_auxQuery += "OR ( mt1.url = '" + $rootScope.urlTargets[_i] + "' AND mt2.url = '" + $rootScope.urlTargets[_i + 1] + "' )";
		}

		_auxQuery += ") GROUP BY inicio, fin, hour";

		$scope.table4Config = {
			  projectId : _projectID
			, query : _auxQuery
			, callback : _table4ConfigCallback
		};

		function _table4ConfigCallback( p_data, p_element ){

			var _aux = _pivot(p_data, 0, 2);
			var visualization = new google.visualization.LineChart(p_element);
			visualization.draw(_aux, {curveType: 'function'});

		}

    }

    $scope.launchBigQueryWeightResources = function() {

		var _auxQuery = "SELECT url, AVG(time) as Average_Time FROM " + _table + " ";

		if($scope.whereClause01.length > 0){
			_auxQuery += "WHERE " + $scope.whereClause01;
		}

		_auxQuery += "GROUP BY url, ORDER BY Average_Time DESC LIMIT 10";

		$scope.table3Config = {
			  projectId : _projectID
			, query : _auxQuery
			, callback : _table3ConfigCallback
		};

		function _table3ConfigCallback( p_data, p_element ){
			var visualization = new google.visualization.BarChart(p_element);
			var myView = new google.visualization.DataView(p_data)
			myView.setColumns([0,1]);
			visualization.draw(myView, {curveType: 'function'});
		}

    }

    $scope.launchBigQueryByMimeType = function() {

		var _auxQuery = "SELECT mimeType, AVG(time) FROM " + _table + " ";

		if($scope.whereClause01.length > 0){
			_auxQuery += "WHERE " + $scope.whereClause01;
		}

		_auxQuery += "GROUP BY mimeType";

		$scope.table2Config = {
			  projectId : _projectID
			, query : _auxQuery
			, callback : _table2ConfigCallback
		};

		function _table2ConfigCallback( p_data, p_element ){
			var visualization = new google.visualization.PieChart(p_element);
			var myView = new google.visualization.DataView(p_data)
			myView.setColumns([0,1]);
			visualization.draw(myView, {curveType: 'function'});
		}

    }

    if($rootScope.urlTargets.length > 1){
    	$scope.launchBigQuery();
    	$scope.launchBigQueryByHours();
    }

    $scope.launchBigQueryWeightResources();
    $scope.launchBigQueryByMimeType();

    $scope.refreshVisualizations = function(){
    	$scope.launchBigQuery();
    	$scope.launchBigQueryByHours();
    	$scope.launchBigQueryWeightResources();
    	$scope.launchBigQueryByMimeType();
    };

    $scope.$watch('whereClause01', $scope.refreshVisualizations);

    var _pivot = function (dataTable, p_indexColumnPivot, p_indexColumnPivot2) {

	    var distinctValues = dataTable.getDistinctValues(p_indexColumnPivot);
	    
	    var viewColumns = [p_indexColumnPivot2];
	    var groupColumns = [];

	    var _cleanAvg = function(p_data){
    		var _auxData = p_data.filter(Boolean);        
    		return google.visualization.data.avg(_auxData)
		}

	    for (var i = 0; i < distinctValues.length; i++) {
	        viewColumns.push({
	            type: 'number',
	            label: distinctValues[i],
	            calc: (function (x) {
	                return function (dt, row) {		                   
	                    return (dt.getValue(row, p_indexColumnPivot) == x) ? dt.getValue(row, 3) : null;
	                }
	            })(distinctValues[i])
	        });
	        groupColumns.push({
	            column: i+1,
	            type: 'number',
	            label: distinctValues[i],
	            aggregation: _cleanAvg
	        });
	    }
	    
	    var view = new google.visualization.DataView(dataTable);
	    view.setColumns(viewColumns);
	    
	    var pivotedData = google.visualization.data.group(view, [0], groupColumns);

	    return pivotedData;
    };

});
