autotestApp.controller("downloadController", function($scope) {

	$scope.downloadFile = function(what) {
		var script = $scope.selectScript;
		var rawData = $scope.rawData;
		if (script.rawParameters) {
			if (!rawData) {
				toastMessage("配置测试数据参数时请同时填写测试数据！");
				return;
			}

			for (index = 0; index < script.rawParameters.length; index++) {
				var parameter = script.rawParameters[index];
				if (rawData.indexOf(parameter.srcParam) < 0) {
					toastMessage("测试数据参数：" + parameter.srcParam + " 在测试数据中没有找到！");
					return;
				}
				if (rawData.indexOf(parameter.rawParamValue) < 0) {
					toastMessage("测试数据参数：" + parameter.srcParam + " 的值：" + parameter.rawParamValue + " 在测试数据中没有找到！");
					return;
				}
			}
		}

		var saveFileName;
		var saveFileContent;
		if (what === "SCRIPT") {
			saveFileName = $scope.selectScript.category + ".json";

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

			saveFileContent = JSON.stringify($scope.selectScript);
		}

		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveFileContent));
		pom.setAttribute('download', saveFileName);
		pom.click();
	};

	var toastMessage = function(message) {
		$scope.toastMessage = message;
		$('#toastDialog').modal('show');
	}
});