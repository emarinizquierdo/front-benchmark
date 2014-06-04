'use strict';

angular.module('bbvaBenchmarkApp')
.controller('MainCtrl', function ($scope, $http, Utils) {
	
	// User Submitted Variables
    var _projectID = '604614689115';
    $scope.table1Config = {};

	$scope.launchBigQuery = function() {

		$scope.table1Config = {
			  projectId : _projectID
			, query : 'SELECT weight_pounds, father_age FROM [publicdata:samples.natality] LIMIT 100;'
			, schema : [['float', 'year'],['integer', 'weight']]
			, callback : _table1ConfigCallback
		};

		function _table1ConfigCallback( p_data, p_element ){
			var visualization = new google.visualization.LineChart(p_element);
			visualization.draw(p_data, {title: 'bottom', curveType: 'function'});
		}

    }

/*
var query = new google.visualization.Query('https://docs.google.com/a/bbva.com/spreadsheets/d/1Ar1vOjwdiMZDwsrCJ-tN7gGxaFMlf_h6D5Z9381XNp8/edit#gid=1727861092');
var query2 = new google.visualization.Query('https://docs.google.com/a/bbva.com/spreadsheets/d/1Ar1vOjwdiMZDwsrCJ-tN7gGxaFMlf_h6D5Z9381XNp8/edit#gid=1727861092');
var query3 = new google.visualization.Query('https://docs.google.com/a/bbva.com/spreadsheets/d/1SDZPofinjAoVdVCQ8EQCMkdbYoGwFjZhgvgC_k9zi0Y/edit#gid=333484075');

$scope.limit = 100;
$scope.conecctionType = 'wifi';

$scope.limit2 = 100;
$scope.conecctionType2 = 'wifi';

	$scope.launchQuery = function(){
	// Apply query language statement.

		query.setQuery("SELECT E, AVG(D) WHERE H CONTAINS '" + $scope.conecctionType + "' AND D > " + $scope.limit + " GROUP BY E");
		// Send the query with a callback function.
		query.send(handleQueryResponse);
		
	}


	$scope.launchQuery2 = function(){
		query2.setQuery("SELECT I, AVG(D) WHERE H CONTAINS '" + $scope.conecctionType2 + "' AND D > " + $scope.limit2 + " GROUP BY I PIVOT E");
		// Send the query with a callback function.
		query2.send(handleQueryResponse2);
	}

	$scope.launchQuery3 = function(){
		var _query = "SELECT mt1.BatchId, mt1.url as inicio, mt2.url as fin,	mt2.time - mt1.time AS diferencia ";
		_query += "FROM Table1 mt1 LEFT JOIN Table1 mt2 ON ( mt2.url = 'bbva_inicio' OR mt2.url = 'ksni_inicio' )";
		_query += "WHERE mt1.url = 'ksni_inicio' AND mt1.url != mt2.url AND mt1.BatchId = mt2.BatchId";

		query3.setQuery(_query);
		// Send the query with a callback function.
		query3.send(handleQueryResponse3);
	}
 

function handleQueryResponse(response) {
	if (response.isError()) {
		//alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

    var data = response.getDataTable();
    var visualization = new google.visualization.BarChart(document.getElementById('table'));
    visualization.draw(data, {legend: 'bottom'});
}

function handleQueryResponse2(response) {
	if (response.isError()) {
		//alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

    var data = response.getDataTable();
    data.removeRow(0);
    var visualization = new google.visualization.LineChart(document.getElementById('table1'));
    visualization.draw(data, {title: 'bottom', curveType: 'function'});
}

$scope.$watch('limit', $scope.launchQuery);
$scope.$watch('limit2', $scope.launchQuery2);
*/
});
