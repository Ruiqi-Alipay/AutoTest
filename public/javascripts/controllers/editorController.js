var autotestApp = angular.module("autotestApp");

autotestApp.controller("editorController", function($scope, dataService) {
	$scope.rawData = "";
	$scope.toastMessage = "";
	$scope.selectScript = {};

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

	$scope.selectScriptFile = function(event) {
		var files = event.target.files;
        var file = files[0];
	        var reader = new FileReader();

		    // If we use onloadend, we need to check the readyState.
		    reader.onloadend = function(evt) {
		      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
		        var result = evt.target.result;
		        var jsonObject = JSON.parse(result);
		        if (jsonObject != null) {
		        	$scope.$apply(function() {
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
		        	});
		        }
		      }
		    };

		    reader.readAsText(file);
	};
});