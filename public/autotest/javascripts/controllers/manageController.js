var autotestApp = angular.module("autotestApp");

autotestApp.controller("manageController", function($scope, $location, dataService) {
	$scope.appContext.tabSelect = 2;
	$scope.scriptByFolder = dataService.getScriptFolderMap();
	$scope.folderList = dataService.getFolderList();
	$scope.scriptSort = {
		sort: '首字母 A-Z',
		sortList: ['首字母 A-Z', '首字母 Z-A', '最近跟新', '最久更新']
	}

	var deleteFolderIndex;
	var deleteScriptIndex;

	$scope.sortTypeChange = function(sortType) {
		$scope.scriptSort.sort = sortType;
		dataService.sortScriptList(sortType);
	};

	$scope.editScript = function(folderId, index) {
		dataService.setSelectScript(folderId, index);
		$location.path('/');
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

	$scope.deleteScript = function(folderIndex, scriptIndex) {
		deleteFolderIndex = folderIndex;
		deleteScriptIndex = scriptIndex;

		if (scriptIndex >= 0) {
			var folder = $scope.folderList[folderIndex];
			var scripts = $scope.scriptByFolder[folder._id];
			var deleteScript = scripts[scriptIndex];

			$scope.configTitle = '删除脚本';
			$scope.configMessage = '确认删除脚本：' + deleteScript.title;
		} else {
			var folder = $scope.folderList[folderIndex];
			$scope.configTitle = '删除分组';
			$scope.configMessage = '确认删除分组：' + folder.title;
		}
	};

	$scope.confirmDeleteScript = function() {
		if (deleteScriptIndex >= 0) {
			dataService.deleteScript($scope.folderList[deleteFolderIndex]._id, deleteScriptIndex);
		} else {
			dataService.deleteFolder($scope.folderList[deleteFolderIndex]);
		}
	};

});