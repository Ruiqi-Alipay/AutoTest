var autotestApp = angular.module("autotestApp");

autotestApp.controller("editorController", function($scope, $rootScope, $http, dataService) {
	var findItemIndex = function(data) {
		for (var index = 0; index < $scope.scripts.length; index++) {
			if ($scope.scripts[index]._id === data._id) {
				return index;
			}
		}
	};
	var parseLoadScript = function(jsonObject) {
		$scope.selectScript = jsonObject;
		var resultArray = [];

		var combinePramsKey;
		for (var index in jsonObject.rawParameters) {
			if (jsonObject.rawParameters[index].combineNum > 1) {
				combinePramsKey = jsonObject.rawParameters[index].destParam;
			}
		}

		for (var index in jsonObject.rawDatas) {
			var data = jsonObject.rawDatas[index];
    		if (combinePramsKey) {
    			if (data[combinePramsKey].indexOf(',') > 0) {
    				var values = data[combinePramsKey].split(',');
    				for (var i in values) {
    					var newItem = {};
    					jQuery.extend(newItem, data);
    					newItem[combinePramsKey] = values[i].trim();
    					resultArray.push(newItem);
    				}
    			} else {
    				resultArray.push(data);
    			}
    		} else {
    			resultArray.push(data);
    		}
		}
		var convertedDatas = JSON.stringify(resultArray);
		for (var i = 0; i < jsonObject.rawParameters.length; i++) {
			convertedDatas = convertedDatas.replace(new RegExp(jsonObject.rawParameters[i].destParam, 'g'),
								jsonObject.rawParameters[i].srcParam);
		}
		$scope.rawData = convertedDatas;
	};

	$scope.rawData = "";
	$scope.selectScript = {};
	$scope.scripts = dataService.getServerScript();
	$scope.tabSelect = 1;

	var seletIndex = dataService.getSelectIndex();
	if (seletIndex >= 0) {
		var jsonObject = JSON.parse($scope.scripts[seletIndex].content);
		parseLoadScript(jsonObject);
	}

	$scope.newScript = function() {

	};

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
		parseLoadScript(jsonObject);
	};

	$scope.saveScript = function() {
		var index = dataService.getSelectIndex();
		var script = index >= 0 ? $scope.scripts[index] : {};
		
		script.title = $scope.selectScript.category;
		script.content = JSON.stringify($scope.selectScript);

		$http.post('/api/testscript', script).success(function(data){
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
		var script = $scope.selectScript;
		var rawData = $scope.rawData;
		if (script.rawParameters) {
			if (!rawData) {
				$rootScope.$broadcast('toastMessage', '配置测试数据参数时请同时填写测试数据！');
				return;
			}

			for (index = 0; index < script.rawParameters.length; index++) {
				var parameter = script.rawParameters[index];
				if (rawData.indexOf(parameter.srcParam) < 0) {
					$rootScope.$broadcast('toastMessage', "测试数据参数：" + parameter.srcParam + " 在测试数据中没有找到！");
					return;
				}
				if (rawData.indexOf(parameter.rawParamValue) < 0) {
					$rootScope.$broadcast("测试数据参数：" + parameter.srcParam + " 的值：" + parameter.rawParamValue + " 在测试数据中没有找到！");
					return;
				}
			}
		}

		$scope.selectScript.rawDatas = [];
		var rawData = $scope.rawData;
		var rawParamArray = $scope.selectScript.rawParameters;
		for (var paramIndex = 0; paramIndex < rawParamArray.length; paramIndex++) {
			var configParam = rawParamArray[paramIndex];
			var textLength = configParam.srcParam.length;
			configParam.valuelength = configParam.rawParamValue.length;
			var gapEnd = rawData.indexOf(configParam.rawParamValue);
			var subSourceData = rawData.slice(0, gapEnd);
			var gapStart = subSourceData.lastIndexOf(configParam.srcParam);
			configParam.gapLength = gapEnd - gapStart - textLength;

			var valueArray = [];
			for (var index = rawData.indexOf(configParam.srcParam); index >= 0; index = rawData
					.indexOf(configParam.srcParam, index + 1)) {
				var start = index + textLength + parseInt(configParam.gapLength);
				var end = start + parseInt(configParam.valuelength);
				valueArray.push(rawData.slice(start, end));
			}

			var arrayIndex = 0;
			for (var index = 0; index < valueArray.length; index+=(parseInt(configParam.combineNum))) {
				var newItem = $scope.selectScript.rawDatas[arrayIndex];
				if (!newItem) {
					if (paramIndex != 0) {
						continue;
					}
					
					newItem = {};
					$scope.selectScript.rawDatas[arrayIndex] = newItem;
				}

				var value = valueArray[index];
				for (var count = 1; count < configParam.combineNum; count++) {
					value += (',' + valueArray[index + count]);
				}

				newItem[configParam.destParam] = value;
				arrayIndex++;
			}
		}

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
		var files = event.target.files;
        var file = files[0];
        var reader = new FileReader();

	    // If we use onloadend, we need to check the readyState.
	    reader.onloadend = function(evt) {
	      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	        var result = evt.target.result;
	        var jsonObject = JSON.parse(result);
	        if (jsonObject) {
	        	$scope.$apply(function() {
	        		parseLoadScript(jsonObject);
	        	});
	        }
	      }
	    };

	    reader.readAsText(file);
	};
});