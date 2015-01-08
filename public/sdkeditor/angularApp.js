
var app = angular.module("editorApp", ['ngRoute', 'console', 'mobile-simulater']);

app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'templates/editor-page.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

app.controller("mainController", function($scope, $rootScope, $http, dataService) {

	$scope.onMainFormSelected = function() {
		dataService.selectForm(-1);
	};
	$scope.onActionSelected = function(index) {
		dataService.selectForm(index);
	};
	$scope.onNewAction = function() {
		dataService.createNewAction();
	};
	$scope.$on('sdk:newScriptLoaded', function(event) {
		$scope.appState.tabSelect = 1;
	});
	$scope.deleteAction = function() {
		dataService.deleteAction();
	};
    $scope.$on('sdk:panelSelectionChange', function(event) {
        $scope.selectedIndex = dataService.getSelectedFormIndex();
    });
});