var autotestApp = angular.module("autotestApp");

autotestApp.controller("manageController", function($scope, $location, dataService) {
	$scope.appContext.tabSelect = 2;
	$scope.scriptByFolder = dataService.getScriptFolderMap();
	$scope.folderList = dataService.getFolderList();

	$scope.editScript = function(folderId, index) {
		dataService.setSelectScript(folderId, index);
		$location.path('/');
	};

	$scope.deleteScript = function(folderId, index) {
		dataService.deleteScript(folderId, index);
	};

	$scope.downloadScript = function(folderId, index) {
		dataService.downloadScript(folderId, index);
	};

	$scope.editFolder = function(index) {
		$scope.selectFolder = $scope.folderList[index];
		$scope.tempTitle = $scope.selectFolder.title;
	};

	$scope.newFolder = function() {
		$scope.selectFolder = {};
		$scope.tempTitle = '';
	};

	$scope.saveFolder = function() {
		$scope.selectFolder.title = $scope.tempTitle;
		dataService.newEditFolder($scope.selectFolder);
	};

	$scope.deleteFolder = function(index) {
		dataService.deleteFolder($scope.folderList[index]);
	};
});