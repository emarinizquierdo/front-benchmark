'use strict';

angular.module('bbvaBenchmarkApp')
  .directive('filters', function () {
	return {
		templateUrl: "views/partials/filters.html",
		restrict: 'A',
		scope : {
			queryConfig : '='
		},
		replace:false,
		controller : function($scope, $element, Utils){

			$scope.startTimeFilter = new Date();
			$scope.endTimeFilter = new Date();
			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};
			$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			$scope.format = $scope.formats[0];

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

		},
		link: function postLink(scope, element, attrs) {
			
		}
	};
});
