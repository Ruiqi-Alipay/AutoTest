var autotestApp = angular.module("autotestApp");

autotestApp.controller("manageController", function($scope, $http, $location, dataService) {
	$scope.scripts = dataService.getServerScript();

	$scope.editScript = function(index) {
		dataService.setSelectIndex(index);
		$location.path('/');
	};

	$scope.deleteScript = function(index) {
		dataService.deleteScript(index);
	};

	$scope.downloadScript = function(index) {
		dataService.downloadScript(index);
	};
});