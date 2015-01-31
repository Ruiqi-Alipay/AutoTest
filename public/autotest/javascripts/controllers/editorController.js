var autotestApp = angular.module("autotestApp");

autotestApp.controller("editorController", function($scope, dataService) {
	$scope.appContext.tabSelect = 1;

	var refresh = function(scriptType) {
		$scope.context = {};
		$scope.configScripts = dataService.getConfigScripts();
		$scope.folderList = dataService.getFolderList();
		$scope.folderIdMap = dataService.getFolderIdToTitleMap();
		$scope.selectedScript = dataService.getSelectScript();
		if ($scope.selectedScript) {
			$scope.nextItem = dataService.getNextScript();
			$scope.previousItem = dataService.getPreviousScript();
			$scope.context.loading = true;
			dataService.getServerScriptById($scope.selectedScript._id, function(script) {
				$scope.context.loading = false;
				$scope.script = JSON.parse(script.content);
				if (!$scope.script.type) {
					$scope.script.type = 'Script';
				}
			});
		} else {
			$scope.nextItem = undefined;
			$scope.previousItem = undefined;
			$scope.script = {
				type: scriptType
			};
		}
	}

	$scope.nextScript = function() {
		dataService.setSelectScript($scope.nextItem.folderId, $scope.nextItem.index);
		refresh('Script');
	};

	$scope.previousScirpt = function() {
		dataService.setSelectScript($scope.previousItem.folderId, $scope.previousItem.index);
		refresh('Script');
	};

    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.getConfigScriptTitle = function(id) {
    	for (var index in $scope.configScripts) {
    		var value = $scope.configScripts[index];
    		if (value._id == id) {
    			return value.title;
    		}
    	}
    };

    $scope.startSaveScript = function(saveType) {
    	$scope.context.saveType = saveType;
    };

    $scope.newScript = function(scriptType) {
    	dataService.setSelectScript();
    	refresh(scriptType);
    };

	$scope.saveScript = function() {
		dataService.saveScript($scope.script, $scope.context.saveType, function(position) {
			if (position) {
				dataService.setSelectScript(position.folderId, position.index);
				refresh('Script');
			}
		});
	};

	$scope.scriptListItemAdd = function(itemName, index) {
		var newItem;
		if (itemName === "parameters") {
			newItem = {
				name: "",
				value: ""
			};
		} else if (itemName === "rollbackActions" || itemName === "actions"){
			newItem = {
				type: "点击",
				target: "",
				param: ""
			};
		} else {
			newItem = {
				type: "单元",
				target: "",
				param: ""
			};
		}

		if (!newItem) {
			return;
		}

		if (index >= 0) {
			$scope.script[itemName].splice(index, 0, newItem);
		} else {
			if (!$scope.script[itemName]) {
				$scope.script[itemName] = [];
			}
			$scope.script[itemName].push(newItem);
		}
	}

	$scope.scriptListItemDelete = function(itemName, index) {
		$scope.script[itemName].splice(index, 1);
	}

	refresh('Script');
});