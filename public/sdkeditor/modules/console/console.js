var console = angular.module('console', ['data-center', 'property-panel', 'module-panel']);

console.directive('console', function ($rootScope, restService, dataService) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		templateUrl: 'modules/console/templates/console.html',
		link: function(scope, element, attr) {
			scope.scripts = [];
			scope.actionList = dataService.getActionFragments();

			restService.listServerScripts(
				function(array) {
					scope.scripts = array;
				},
				function(error) {
					$rootScope.$broadcast('notification:toast', '错误:' + error);
				}
			);

			scope.$on('dataService:newScriptLoaded', function(event) {

			});

			scope.saveScript = function() {
				if (!scope.scriptName) {
					$rootScope.$broadcast('notification:toast', '脚本名不可为空');
					return;
				}

				var script = scope.selectScript;
				if (!script) {
					script = {};
				}
				
				script.title = scope.scriptName,
				script.content = JSON.stringify(dataService.assembleScript());

				restService.saveScript(
					function(data) {
				    	if (data) {
				    		if (!scope.selectScript) {
				    			scope.scripts.push(data);
				    			scope.selectScript = data;
				    		}
				    	}
				    	$rootScope.$broadcast('notification:toast', '保存成功');
					},
					function(error) {
						$rootScope.$broadcast('notification:toast', '保存失败：' + error);
					}
				);
			};
			scope.deleteScript = function() {
				restService.deleteScript(scope.selectScript._id,
					function() {
						var index = scope.scripts.indexOf(scope.selectScript);
			    		scope.scripts.splice(index, 1);
			    		scope.selectScript = undefined;
			    		dataService.loadNewScript();
			    		$rootScope.$broadcast('notification:toast', '删除成功');
					}, function(error) {
						$rootScope.$broadcast('notification:toast', '删除失败: ' + error);
					}
				);
			};
			scope.loadFromServer = function(index) {
				scope.selectScript = scope.scripts[index];
				scope.scriptName = scope.selectScript.title;
			    var jsonObject = JSON.parse(scope.selectScript.content);
			    if (jsonObject) {
			        dataService.loadNewScript(jsonObject);
			    }
			};
			scope.loadFromLocal = function() {
				scope.selectScript = undefined;
				var pom = document.createElement('input');
				pom.setAttribute('type', 'file');
				pom.setAttribute('accept', '.json');
				pom.setAttribute('onchange', "angular.element(document.getElementById('consoleId')).scope().localReadFile(this)");
				pom.click();
			};
			scope.newScript = function() {
				scope.selectScript = undefined;
				scope.scriptName = '';
				dataService.loadNewScript();
			};
			scope.downloadScript = function() {
				if (!scope.scriptName) {
					scope.scriptName = 'new_script.json';
				}
				var saveFileContent = JSON.stringify(dataService.assembleScript());
				var pom = document.createElement('a');
				pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveFileContent));
				pom.setAttribute('download', scope.scriptName);
				pom.click();
			};

			scope.localReadFile = function(element) {
		        var file = element.files[0];
			    var reader = new FileReader();
			    $scope.scriptName = file.name;

			    // If we use onloadend, we need to check the readyState.
			    reader.onloadend = function(evt) {
			      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			        var result = evt.target.result;
			        var jsonObject = JSON.parse(result);
			        if (jsonObject) {
				        $scope.$apply(function() {
			        		dataService.loadNewScript(jsonObject);
			        	});
			        }
			      }
				};

			    reader.readAsText(file);
			};
		}
	};
});