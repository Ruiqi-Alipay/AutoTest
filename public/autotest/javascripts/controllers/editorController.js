var autotestApp = angular.module("autotestApp");

autotestApp.controller("editorController", function($scope, $rootScope, $http, dataService) {
	$scope.selectScript = {};
	$scope.scripts = dataService.getServerScript();
	$scope.tabSelect = 1;

	var seletIndex = dataService.getSelectIndex();
	if (seletIndex >= 0) {
		var jsonObject = JSON.parse($scope.scripts[seletIndex].content);
		$scope.selectScript = jsonObject;
	}

	$scope.loadScriptFromLocal = function() {
		dataService.setSelectIndex(-1);
		var pom = document.createElement('input');
		pom.setAttribute('type', 'file');
		pom.setAttribute('accept', '.json');
		pom.setAttribute('onchange', "angular.element(document.getElementById('viewRoot')).scope().localReadFile(this)");
		pom.click();
	};

	$scope.loadScriptFromServer = function(index) {
		dataService.setSelectIndex(index);
		var jsonObject = JSON.parse($scope.scripts[index].content);
		$scope.selectScript = jsonObject;
	};

	$scope.saveScript = function() {
		var index = dataService.getSelectIndex();
		var script = index >= 0 ? $scope.scripts[index] : {};
		
		script.title = $scope.selectScript.category;
		script.content = JSON.stringify($scope.selectScript);

		$http.post('/autotest/api/testscript', script).success(function(data){
	    	if (data) {
	    		if (index >= 0) {
	    			$scope.scripts[index] = data;
	    		} else {
	    			$scope.scripts.push(data);
	    			dataService.setSelectIndex($scope.scripts.length - 1);
	    		}
	    	}
	    	$rootScope.$broadcast('toastMessage', '保存成功');
	  	}).error(function(data, status, headers, config) {
	  		$rootScope.$broadcast('toastMessage', '保存失败：' + data);
	  	});
	};

	$scope.downloadScript = function() {
		var saveFileContent = JSON.stringify($scope.selectScript);
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveFileContent));
		pom.setAttribute('download', $scope.selectScript.category + ".json");
		pom.click();
	};

	$scope.scriptListItemAdd = function(itemName, index) {
		var newItem;
		if (itemName === "rawParameters") {
			newItem = {
				srcParam: "",
				rawParamValue: "",
				destParam: "",
				combineNum: 1
			};
		} else if (itemName === "parameters") {
			newItem = {
				name: "",
				value: ""
			};
		} else if (itemName === "rollback" || itemName === "actions"){
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
			$scope.selectScript[itemName].splice(index, 0, newItem);
		} else {
			if (!$scope.selectScript[itemName]) {
				$scope.selectScript[itemName] = [];
			}
			$scope.selectScript[itemName].push(newItem);
		}
	}

	$scope.scriptListItemDelete = function(itemName, index) {
		$scope.selectScript[itemName].splice(index, 1);
	}

	$scope.localReadFile = function(event) {
		var files = event.files;
        var file = files[0];
        var reader = new FileReader();

	    // If we use onloadend, we need to check the readyState.
	    reader.onloadend = function(evt) {
	      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	        var result = evt.target.result;
	        var jsonObject = JSON.parse(result);
	        if (jsonObject) {
	        	$scope.$apply(function() {
	        		$scope.selectScript = jsonObject;
	        	});
	        }
	      }
	    };

	    reader.readAsText(file);
	};
});