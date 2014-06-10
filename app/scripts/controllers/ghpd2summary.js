'use strict';

angular.module('bbvaBenchmarkApp')
  .controller('Ghpd2summaryCtrl', function ($rootScope, $scope, $http) {
    // User Submitted Variables
    var _projectID = $rootScope.projectId;
    var _table = "[bbva-ida:hwpd.requests]";

    var _GHPD2urlTargets = [];
    _GHPD2urlTargets[0] = "http://intranet.bbva.com/";
    _GHPD2urlTargets[1] = "https://community.grupobbva.com/KSNI/mult/css/estilos.css";
	_GHPD2urlTargets[2] = "https://bbva-intranet.appspot.com/a/bbva.com/home.jsp";
	_GHPD2urlTargets[3] = "https://bbva-hpd2.appspot.com/a/bbva.com";
	_GHPD2urlTargets[4] = "https://bbva-hpdwidgets.appspot.com/app/widgets/weatherwidget/scripts/scripts.js";

	$scope.GHPD2urlTargetsMapping = [];
	$scope.GHPD2urlTargetsMapping[0] = { name : "DNS Lookup" };
	$scope.GHPD2urlTargetsMapping[1] = { name : "Community KSNI" };
	$scope.GHPD2urlTargetsMapping[2] = { name : "GHPD 1" };
	$scope.GHPD2urlTargetsMapping[3] = { name : "HPD2" };


    $scope.table1Config = {};
    $scope.table2Config = {};
    $scope.table3Config = {};
    $scope.table4Config = {};
    $scope.table5Config = {};
    $scope.table6Config = {};

    $scope.whereClause01 = "";

    $scope.intervals = [
		    	{id:1, name: $scope.GHPD2urlTargetsMapping[0].name, value: 0}, {id:2, name: $scope.GHPD2urlTargetsMapping[1].name, value:1}, {id:3, name: $scope.GHPD2urlTargetsMapping[2].name, value: 2},
		    	{id:4, name: $scope.GHPD2urlTargetsMapping[3].name, value: 3}, {id:5}
		    ];

	$scope.selectedInterval = {};
	$scope.selectedInterval.value = 0;
	$scope.countryVisualization = {};

	$scope.resourceTime = "50000";

	$scope.launchBigQuery = function() {

		var _auxQuery = "SELECT mt1.url as inicio, mt2.url as fin, ROUND(ABS(AVG(mt2.startedDateTime - mt1.startedDateTime))) as diferencia ";
		_auxQuery += "FROM (SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

		_auxQuery += ") as mt1 CROSS JOIN ( SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

    	_auxQuery += ") as mt2 WHERE ";
		_auxQuery += "mt1.url != mt2.url AND mt1.batchId = mt2.batchId AND ( ";
		

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "( mt1.url = '" + _GHPD2urlTargets[0] + "' AND mt2.url = '" + _GHPD2urlTargets[1] + "' )";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length - 1; _i++){
			_auxQuery += "OR ( mt1.url = '" + _GHPD2urlTargets[_i] + "' AND mt2.url = '" + _GHPD2urlTargets[_i + 1] + "' )";
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

			for(var _i=0; _i < myView.n.zf.length; _i++){
				if(myView.n.zf[_i].c[0].v == _GHPD2urlTargets[0]) myView.n.zf[_i].c[0].v = $scope.GHPD2urlTargetsMapping[0].name;
				if(myView.n.zf[_i].c[0].v == _GHPD2urlTargets[1]) myView.n.zf[_i].c[0].v = $scope.GHPD2urlTargetsMapping[1].name;
				if(myView.n.zf[_i].c[0].v == _GHPD2urlTargets[2]) myView.n.zf[_i].c[0].v = $scope.GHPD2urlTargetsMapping[2].name;
				if(myView.n.zf[_i].c[0].v == _GHPD2urlTargets[3]) myView.n.zf[_i].c[0].v = $scope.GHPD2urlTargetsMapping[3].name;
			}

			visualization.draw(myView, {curveType: 'function'});
/*
			var table = new google.visualization.Table(document.getElementById('tablespreadsheet'));
			table.draw(p_data);*/

		}

    }

    $scope.launchBigQueryByHours = function() {

		var _auxQuery = "SELECT mt1.url as inicio, mt2.url as fin, (INTEGER(mt1.startedDateTime/(1000*60*60))%24 + 2) as hour, ROUND(ABS(AVG(mt2.startedDateTime - mt1.startedDateTime))) as diferencia, count(*) ";
		_auxQuery += "FROM (SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

		_auxQuery += ") as mt1 CROSS JOIN ( SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

    	_auxQuery += ") as mt2 WHERE ";
		_auxQuery += "mt1.url != mt2.url AND mt1.batchId = mt2.batchId AND ( ";
		

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "( mt1.url = '" + _GHPD2urlTargets[0] + "' AND mt2.url = '" + _GHPD2urlTargets[1] + "' )";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length - 1; _i++){
			_auxQuery += "OR ( mt1.url = '" + _GHPD2urlTargets[_i] + "' AND mt2.url = '" + _GHPD2urlTargets[_i + 1] + "' )";
		}

		_auxQuery += ") GROUP BY inicio, fin, hour";

		$scope.table4Config = {
			  projectId : _projectID
			, query : _auxQuery
			, callback : _table4ConfigCallback
		};

		function _table4ConfigCallback( p_data, p_element ){

			var _aux = _pivot(p_data, 0, 2);

			var _tableByHours = _aux.pivotedTable;
			var _countedTargets = _aux.countTable;

			var visualization = new google.visualization.LineChart(p_element);

			for(var _i=0; _i < _tableByHours.Af.length; _i++){
				if(_tableByHours.Af[_i].label == _GHPD2urlTargets[0]) _tableByHours.Af[_i].label = $scope.GHPD2urlTargetsMapping[0].name;
				if(_tableByHours.Af[_i].label == _GHPD2urlTargets[1]) _tableByHours.Af[_i].label = $scope.GHPD2urlTargetsMapping[1].name;
				if(_tableByHours.Af[_i].label == _GHPD2urlTargets[2]) _tableByHours.Af[_i].label = $scope.GHPD2urlTargetsMapping[2].name;
				if(_tableByHours.Af[_i].label == _GHPD2urlTargets[3]) _tableByHours.Af[_i].label = $scope.GHPD2urlTargetsMapping[3].name;
			}

			for(var _i=0; _i < _countedTargets.zf.length; _i++){
				if(_countedTargets.zf[_i].c[0].v == _GHPD2urlTargets[0]) $scope.GHPD2urlTargetsMapping[0].count = _countedTargets.zf[_i].c[1].v;
				if(_countedTargets.zf[_i].c[0].v == _GHPD2urlTargets[1]) $scope.GHPD2urlTargetsMapping[1].count = _countedTargets.zf[_i].c[1].v;
				if(_countedTargets.zf[_i].c[0].v == _GHPD2urlTargets[2]) $scope.GHPD2urlTargetsMapping[2].count = _countedTargets.zf[_i].c[1].v;
				if(_countedTargets.zf[_i].c[0].v == _GHPD2urlTargets[3]) $scope.GHPD2urlTargetsMapping[3].count = _countedTargets.zf[_i].c[1].v;
			}

			if(!$scope.$$phase){
				$scope.$apply();
			}

			visualization.draw(_tableByHours, {curveType: 'function'});

		}

    }

    $scope.launchBigQueryByConnection = function() {

		var _auxQuery = "SELECT mt1.url as inicio, mt2.url as fin, mt1.network, ROUND(ABS(AVG(mt2.startedDateTime - mt1.startedDateTime))) as diferencia, count(*) ";
		_auxQuery += "FROM (SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

		_auxQuery += ") as mt1 CROSS JOIN ( SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

    	_auxQuery += ") as mt2 WHERE ";
		_auxQuery += "mt1.url != mt2.url AND mt1.batchId = mt2.batchId AND ( ";
		

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "( mt1.url = '" + _GHPD2urlTargets[0] + "' AND mt2.url = '" + _GHPD2urlTargets[1] + "' )";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length - 1; _i++){
			_auxQuery += "OR ( mt1.url = '" + _GHPD2urlTargets[_i] + "' AND mt2.url = '" + _GHPD2urlTargets[_i + 1] + "' )";
		}

		_auxQuery += ") GROUP BY inicio, fin, mt1.network";

		$scope.table5Config = {
			  projectId : _projectID
			, query : _auxQuery
			, callback : _table5ConfigCallback
		};

		function _table5ConfigCallback( p_data, p_element ){

			var _aux = _pivot(p_data, 0, 2).pivotedTable;

			var visualization = new google.visualization.BarChart(p_element);

			for(var _i=0; _i < _aux.Af.length; _i++){
				if(_aux.Af[_i].label == _GHPD2urlTargets[0]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[0].name;
				if(_aux.Af[_i].label == _GHPD2urlTargets[1]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[1].name;
				if(_aux.Af[_i].label == _GHPD2urlTargets[2]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[2].name;
				if(_aux.Af[_i].label == _GHPD2urlTargets[3]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[3].name;
			}

			visualization.draw(_aux, {curveType: 'function', isStacked: true});

		}

    }

    $scope.launchBigQueryWeightResources = function() {

		var _auxQuery = "SELECT url, AVG(time) as Average_Time FROM " + _table + " ";

		if($scope.whereClause01.length > 0){
			_auxQuery += "WHERE " + $scope.whereClause01;
		}

		if($scope.whereClause01.length <= 0){
			_auxQuery += "WHERE time < " + $scope.resourceTime + " ";
		}else{
			_auxQuery += " AND time < " + $scope.resourceTime + " ";
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

    $scope.launchBigQueryByCountry = function() {

		var _auxQuery = "SELECT mt1.url as inicio, mt2.url as fin, mt1.country, ROUND(ABS(AVG(mt2.startedDateTime - mt1.startedDateTime))) as diferencia, count(*) ";
		_auxQuery += "FROM (SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

		_auxQuery += ") as mt1 CROSS JOIN ( SELECT * FROM " + _table + " WHERE ( ";

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "url = '" + _GHPD2urlTargets[0] + "'";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length; _i++){
			_auxQuery += "OR url = '" + _GHPD2urlTargets[_i] + "'";
		}

		_auxQuery += " ) ";

		if($scope.whereClause01.length > 0){
			_auxQuery += " AND " + $scope.whereClause01;
		}

    	_auxQuery += ") as mt2 WHERE ";
		_auxQuery += "mt1.url != mt2.url AND mt1.batchId = mt2.batchId AND ( ";
		

		if(_GHPD2urlTargets.length > 0){
			_auxQuery += "( mt1.url = '" + _GHPD2urlTargets[0] + "' AND mt2.url = '" + _GHPD2urlTargets[1] + "' )";
		}

		for(var _i = 1; _i < _GHPD2urlTargets.length - 1; _i++){
			_auxQuery += "OR ( mt1.url = '" + _GHPD2urlTargets[_i] + "' AND mt2.url = '" + _GHPD2urlTargets[_i + 1] + "' )";
		}

		_auxQuery += ") GROUP BY inicio, fin, mt1.country";

		$scope.table6Config = {
			  projectId : _projectID
			, query : _auxQuery
			, callback : _table6ConfigCallback
		};

		function _table6ConfigCallback( p_data, p_element ){

			var _aux = _pivot(p_data, 0, 2).pivotedTable;

			var visualization = new google.visualization.GeoChart(p_element);

			for(var _i=0; _i < _aux.Af.length; _i++){
				if(_aux.Af[_i].label == _GHPD2urlTargets[0]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[0].name;
				if(_aux.Af[_i].label == _GHPD2urlTargets[1]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[1].name;
				if(_aux.Af[_i].label == _GHPD2urlTargets[2]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[2].name;
				if(_aux.Af[_i].label == _GHPD2urlTargets[3]) _aux.Af[_i].label = $scope.GHPD2urlTargetsMapping[3].name;
			}

			$scope.countryVisualization.data = _aux;
			$scope.countryVisualization.dom = p_element;

			$scope.renderCountryReport( );		

		}

    }

    $scope.renderCountryReport = function( ){
    	if(!$scope.countryVisualization.dom) return;
    	var visualization = new google.visualization.GeoChart($scope.countryVisualization.dom);
    	var view = new google.visualization.DataView($scope.countryVisualization.data);
	    view.setColumns([0, $scope.selectedInterval.value + 1]);
	    visualization.draw(view, {colorAxis: {colors: ['#34BA36', '#CE3D20'] }, isStacked: true});
    }

    if(_GHPD2urlTargets.length > 1){
    	$scope.launchBigQuery();
    	$scope.launchBigQueryByHours();
    	$scope.launchBigQueryByConnection();
    	$scope.launchBigQueryByCountry();
    }

    $scope.launchBigQueryWeightResources();
    $scope.launchBigQueryByMimeType();

    $scope.refreshVisualizations = function(){
    	$scope.launchBigQuery();
    	$scope.launchBigQueryByHours();
    	$scope.launchBigQueryByConnection();
    	$scope.launchBigQueryWeightResources();
    	$scope.launchBigQueryByMimeType();
    	$scope.launchBigQueryByCountry();
    };

    $scope.$watch('whereClause01', $scope.refreshVisualizations);
    $scope.$watch('selectedInterval', $scope.renderCountryReport);

    var _pivot = function (dataTable, p_indexColumnPivot, p_indexColumnPivot2) {

	    var distinctValues = dataTable.getDistinctValues(p_indexColumnPivot);
	    
	    var viewColumns = [p_indexColumnPivot2];
	    var groupColumns = [];
	    var groupCountColumns = [];

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
	    
	    groupCountColumns.push({
            column: 4,
            type: 'number',
            label: 'items',
            aggregation: google.visualization.data.sum
        });

	    var view = new google.visualization.DataView(dataTable);
	    view.setColumns(viewColumns);
	    
	    var pivotedData = google.visualization.data.group(view, [0], groupColumns);
	    var pivotedDataCount = google.visualization.data.group(dataTable, [0], groupCountColumns);

	    return { pivotedTable : pivotedData, countTable: pivotedDataCount };
    };

});
