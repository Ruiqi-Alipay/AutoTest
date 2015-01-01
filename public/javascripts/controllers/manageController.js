var autotestApp = angular.module("autotestApp");

autotestApp.controller("manageController", function($scope, $http, $location, dataService) {
	$scope.scripts = dataService.getServerScript();

	$scope.editScript = function(index) {
		dataService.setSelectIndex(index);
		$location.path('/');
	};

	$scope.deleteScript = function(index) {
		var deleteItem = dataService.deleteAtindex(index);
		$http.delete('/api/testscript/' + deleteItem[0]._id).success(function(data){
	    	if (data) {
	    		
	    	}
	  	});
	};

	$scope.downloadScript = function(index) {
		dataService.downloadScript(index);
	};
});