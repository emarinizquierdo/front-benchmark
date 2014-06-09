'use strict';

angular.module('bbvaBenchmarkApp')
  .directive('filters', function () {
	return {
		templateUrl: "views/partials/filters.html",
		restrict: 'A',
		scope : {
			  queryConfig : '='
			, whereClause : '='
		},
		replace:false,
		controller : function($scope, $element, Utils){

			$scope.enableFilters = false;
			$scope.enableFiltersMessage = ($scope.enableFilters) ? "Disable Filters" : "Enable Filters";
			$scope.whereClause = "";

			var date = new Date();
			$scope.startTimeFilter = new Date(date.getFullYear(), date.getMonth(), 1);
			$scope.endTimeFilter = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};
			$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			$scope.format = $scope.formats[0];

		    $scope.connectionTypes = [{id:1, name: 'wifi', value: 'wifi'}, {id:2, name: 'redbbva', value:'redbbva'}, {id:3, name: 'ethernet (red externa)', value:'ethernet'}];
		    $scope.selectedConnectionType = [];

		    $scope.mimetypes = [{id:1, name: 'Images', value: 'image'}, {id:2, name: 'Javascript', value:'script'}, {id:3, name: 'Stylesheet', value: 'stylesheet'},
		    	{id:4, name: 'XMLHTTP Requests', value: 'xmlhttprequest'}, {id:5, name: 'Objects', value:'object'}, {id:6, name: 'Other', value: 'other'}
		    ];
		    $scope.selectedMimetype = [];

		    $scope.countries = [
		    	{id:1, name: 'Spain', value: 'spain'}, {id:2, name: 'Portugal', value:'portugal'}, {id:3, name: 'USA', value: 'usa'},
		    	{id:4, name: 'Mexico', value: 'mexico'}, {id:5, name: 'Colombia', value: 'colombia'}, {id:6, name: 'Chile', value: 'chile'},
		    	{id:7, name: 'Peru', value: 'peru'}, {id:8, name: 'Paraguay', value: 'paraguay'}, {id:9, name: 'Argentina', value: 'argentina'},
		    	{id:10, name: 'Venezuela', value: 'venezuela'}, {id:11, name: 'Uruguay', value: 'uruguay'}
		    ];
		    $scope.selectedCountry = [];
		    $scope.spainSelected = false;

		    $scope.workplaces = [
		    	{id:1, name: 'Azca', value: 'azca'}, {id:2, name: 'Manoteras', value: 'manoteras'}, {id:3, name: 'Ciudad BBVA', value: 'ciudadbbva'},
		    	{id:4, name: 'Tablas I', value: 'tablasi'}, {id:5, name: 'Tablas II', value: 'tablasii'}, {id:6, name: 'Vaguada', value: 'vaguada'}
		    ];

		    $scope.selectedWorkplace = [];

			$scope.collapse = function(){
				$element.find(".containerCollapsable").collapse('toggle');
			}

			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();

				$scope.opened = true;
			};

			$scope.openEnd = function($event) {
				$event.preventDefault();
				$event.stopPropagation();

				$scope.openedEnd = true;
			};

			var _updateFilter = function(){

				var _whereClause = "";
				var _countryClause = "";
				var _connectionClause = "";
				var _mimeTypeClause = "";
				var _workplaceClause = "";

				for(var _i = 0; _i < $scope.selectedConnectionType.length; _i++){
					if(_connectionClause.length > 0)	_connectionClause += "OR ";
					_connectionClause += "network = '" + $scope.selectedConnectionType[_i].value + "' ";
				}				
				if(_connectionClause.length > 0)	_whereClause += "( " + _connectionClause + " ) ";

				for(var _i = 0; _i < $scope.selectedCountry.length; _i++){
					if(_countryClause.length > 0)	_countryClause += "OR ";
					_countryClause += "country = '" + $scope.selectedCountry[_i].value + "' ";
				}
				if(_countryClause.length > 0){
					if(_whereClause.length > 0) _whereClause += "AND ";
					_whereClause += "( " + _countryClause + " ) ";
				}

				for(var _i = 0; _i < $scope.selectedMimetype.length; _i++){
					if(_mimeTypeClause.length > 0)	_mimeTypeClause += "OR ";
					_mimeTypeClause += "mimeType = '" + $scope.selectedMimetype[_i].value + "' ";
				}
				if(_mimeTypeClause.length > 0){
					if(_whereClause.length > 0) _whereClause += "AND ";
					_whereClause += "( " + _mimeTypeClause + " ) ";
				}

				for(var _i = 0; _i < $scope.selectedWorkplace.length; _i++){
					if(_workplaceClause.length > 0)	_workplaceClause += "OR ";
					_workplaceClause += "building = '" + $scope.selectedWorkplace[_i].value + "' ";
				}
				if(_workplaceClause.length > 0){
					if(_whereClause.length > 0) _whereClause += "AND ";
					_whereClause += "( " + _workplaceClause + " ) ";
				}

				if(_whereClause.length > 0) _whereClause += "AND ";
				_whereClause += "( startedDateTime >= " + $scope.startTimeFilter.getTime() + " AND startedDateTime <= " + $scope.endTimeFilter.getTime() +" ) ";

				if($scope.userFilter && $scope.userFilter.length > 0){
					if(_whereClause.length > 0) _whereClause += "AND ";
					_whereClause += "( userId = " + $scope.userFilter + " ) ";
				}

				if($scope.enableFilters){
					$scope.whereClause = _whereClause;
				}else{
					$scope.whereClause = "";
				}

			}

			$scope.enableFiltersAction = function(){
				$scope.enableFilters = !$scope.enableFilters;
				$scope.enableFiltersMessage = ($scope.enableFilters) ? "Disable Filters" : "Enable Filters";
			}

			$scope.$watch('selectedCountry', function(p_new){	
				var _auxSpainSelected = false;
				for(var _i = 0; _i < p_new.length; _i++){
					if(p_new[_i].name == "Spain"){
						_auxSpainSelected = true;
					}
				}

				if(!_auxSpainSelected){
					$scope.selectedWorkplace = [];
				}

				$scope.spainSelected = _auxSpainSelected;

				_updateFilter();
			})

			$scope.$watch('selectedWorkplace', _updateFilter);
			$scope.$watch('selectedConnectionType', _updateFilter);			
			$scope.$watch('selectedMimetype', _updateFilter);
			$scope.$watch('startTimeFilter', _updateFilter);
			$scope.$watch('endTimeFilter', _updateFilter);
			$scope.$watch('userFilter', _updateFilter);
			$scope.$watch('enableFilters', _updateFilter);

		},
		link: function postLink(scope, element, attrs) {
			
		}
	};
});
