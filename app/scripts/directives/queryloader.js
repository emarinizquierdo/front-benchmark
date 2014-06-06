'use strict';

angular.module('bbvaBenchmarkApp')
.directive('queryLoader', function () {
	return {
		template: "<div class='query-loader'><span class='loading glyphicon glyphicon-refresh' ng-show='loading'></span><div class='alert alert-danger' ng-show='error'>{{errorMessage}}</div><div class='visualizator' ng-hide='loading || error'></div></div>",
		restrict: 'A',
		scope : {
			queryConfig : '='
		},
		replace:false,
		controller : function($rootScope, $scope, $element, Utils){

			$scope.loading = false;
			$scope.error = false;
			$scope.errorMessage;

			$scope.$watch('queryConfig', _handleQuery);

			function _handleQuery( p_new ){
				
				if(!p_new.query || !$rootScope.authenticated){
					return false;
				}

				$scope.error = false;
				$scope.loading = true;
				var _projectID = p_new.projectId;

				var request = gapi.client.bigquery.jobs.query({
					'projectId': _projectID,
					'timeoutMs': '30000',
					'query': p_new.query					
				});

				request.execute(function(response) {

					if(response.totalRows == 0){
						$scope.errorMessage = "There are not results for this query";
						$scope.error = true;
						$scope.loading = false;
						if(!$scope.$$phase){
							$scope.$apply();
						}
						return;
					}

					if(response.error){
						$scope.errorMessage = response.error.message;
						$scope.error = true;
						$scope.loading = false;
						if(!$scope.$$phase){
							$scope.$apply();
						}
						return;
					}
					
					$scope.loading = false;
					if(!$scope.$$phase){
						$scope.$apply();
					}
					var data = Utils.parseToDataTable(response);					
					p_new.callback(data, $element.find(".visualizator")[0]);					
				});
			}

		},
		link: function postLink(scope, element, attrs) {
			element.find(".visualizator")[0].style.width = element[0].style.width;
			element.find(".visualizator")[0].style.height = element[0].style.height;
		}
	};
});
