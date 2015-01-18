var autotestApp = angular.module("autotestApp");

autotestApp.controller("reportManageController", function($scope, $http, $location, dataService) {
	$scope.reports = dataService.getServerReport();

	$scope.editReport = function(index) {
		dataService.setSelectIndex(index);
		$location.path('/report');
	};

	$scope.deleteScript = function(index) {
		$http.delete('/autotest/api/testreport/' + reports[index]._id).success(function(data){

	  	});
	};

	$scope.downloadScript = function(index) {
		dataService.downloadReport(index);
	};
});