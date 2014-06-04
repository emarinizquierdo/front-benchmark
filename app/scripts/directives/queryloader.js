'use strict';

angular.module('bbvaBenchmarkApp')
.directive('queryLoader', function () {
	return {
		template: "<div class='query-loader'><span class='loading glyphicon glyphicon-refresh' ng-show='loading'></span><div class='visualizator' ng-hide='loading'></div></div>",
		restrict: 'A',
		scope : {
			queryConfig : '='
		},
		replace:false,
		controller : function($rootScope, $scope, $element, Utils){

			$scope.loading = false;

			$scope.$watch('queryConfig', _handleQuery);

			function _handleQuery( p_new ){
				
				if(!p_new.query || !$rootScope.authenticated){
					return false;
				}

				$scope.loading = true;
				var _projectID = p_new.projectId;

				var request = gapi.client.bigquery.jobs.query({
					'projectId': _projectID,
					'timeoutMs': '30000',
					'query': p_new.query					
				});

				request.execute(function(response) {
					$scope.loading = false;
					if(!$scope.$$phase){
						$scope.$apply();
					}
					var data = Utils.parseToDataTable(response, p_new.schema);					
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
