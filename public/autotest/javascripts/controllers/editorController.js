var autotestApp = angular.module("autotestApp");

autotestApp.controller("editorController", function($scope, dataService) {
	$scope.appContext.tabSelect = 1;
	$scope.configScripts = dataService.getConfigScripts();
	$scope.folderList = dataService.getFolderList();
	$scope.folderIdMap = dataService.getFolderIdToTitleMap();
	$scope.context = {};

	var selected = dataService.getSelectScript();
	if (selected) {
		$scope.context.loading = true;
		dataService.getServerScriptById(selected._id, function(script) {
			$scope.context.loading = false;
			$scope.script = JSON.parse(script.content);
			if (!$scope.script.type) {
				$scope.script.type = 'Script';
			}
		});
	} else {
		$scope.script = {
			type: 'Script'
		};
	}

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
    	$scope.script = {
			type: scriptType
    	};
    	dataService.setSelectScript();
    };

	$scope.saveScript = function() {
		dataService.saveScript($scope.script, $scope.context.saveType);
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
});