'use strict';

angular.module('bbvaBenchmarkApp')
.controller('SidebarCtrl', function ($scope, $location) {
    $scope.menu = [{
		'title': 'Dashboard',
		'link': '/'
    },
    {
		'title': 'GHPD2 Summary',
		'link': '/ghpd2Summary'
    },
    {
        'title': 'Query Table',
        'link': '/querytable'
    },
    {
        'title': 'Help',
        'link': '/help'
    }];
    
    $scope.isActive = function(route) {
    	return route === $location.path();
    };

});
