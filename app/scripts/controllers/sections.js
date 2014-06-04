'use strict';

angular.module('bbvaBenchmarkApp')
.controller('SectionsCtrl', function ($rootScope, $scope, $http) {

    $scope.addTarget = function( p_data ){
    	$rootScope.urlTargets.push(p_data);
    	_refreshLSB($rootScope.urlTargets);
    	$scope.auxTarget = "";
    }

    $scope.deleteTarget = function( p_index ){
    	$rootScope.urlTargets.splice(p_index,1);
    	_refreshLSB($rootScope.urlTargets);
    }

    $scope.updateTarget = function( value, p_index ){
        $rootScope.urlTargets[p_index] = value;
        _refreshLSB($rootScope.urlTargets);
    }
    function _refreshLSB( p_data ){
    	localStorage.setItem("urlTargets", JSON.stringify(p_data));
    }

});
