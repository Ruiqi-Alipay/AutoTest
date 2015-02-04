var consoleModule = angular.module('console', ['data-center', 'property-panel', 'module-panel', 'variable-panel']);

consoleModule.directive('console', function ($rootScope, $location, restService, dataService) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		templateUrl: 'modules/console/templates/console.html',
		link: function(scope, element, attr) {
			var serverScript;

			scope.$on('dataService:newScriptLoaded', function(event) {
				scope.displayPanel = 'property';
			});

			scope.selectFolder = function(folder) {
				scope.selectedFolder = folder;
			};

			restService.listServerScripts(function(folderList) {
				scope.folderList = folderList;
			});

			scope.onSaveButtonClicked = function() {
				scope.tempName = '';
				scope.selectedFolder = undefined;
				if (serverScript) {
					scope.tempName = serverScript.title;
					for (var index in scope.folderList) {
						var folder = scope.folderList[index];
						if (folder._id == serverScript.folder) {
							scope.selectedFolder = folder;
							break;
						}
					}
				}
			};

			scope.saveScript = function(folder, name) {
				var content = dataService.getOverallScript();
				var script = serverScript ? serverScript : {};
				script.title = name,
				script.content = JSON.stringify(content);
				script.folder = folder._id;

				restService.saveScript(script,
					function(data) {
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
			scope.loadFromLocal = function() {
				var pom = document.createElement('input');
				pom.setAttribute('type', 'file');
				pom.setAttribute('accept', '.json');
				pom.setAttribute('onchange', "angular.element(document.getElementById('consoleId')).scope().localReadFile(this)");
				pom.click();
			};
			scope.newScript = function() {
				$location.url('/').search({date: new Date});
			};
			scope.downloadScript = function() {
				var fileName = 'new-script';
				if (serverScript) {
					fileName = serverScript.title;
				}
				var script = dataService.getOverallScript();
				var saveFileContent = JSON.stringify(script, null, 2);
				var pom = document.createElement('a');
				console.log(script);
				pom.setAttribute('href', 'data:text/json;charset=utf8,' + encodeURIComponent(saveFileContent));
				pom.setAttribute('download', fileName + '.json');
				pom.click();
			};

			scope.localReadFile = function(element) {
		        var file = element.files[0];
			    var reader = new FileReader();
			    
			    // If we use onloadend, we need to check the readyState.
			    reader.onloadend = function(evt) {
			      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			        var result = evt.target.result;
			        var jsonObject = JSON.parse(result);
			        if (jsonObject) {
				        scope.$apply(function() {
				        	serverScript = undefined;
			        		dataService.loadNewScript(jsonObject);
			        	});
			        }
			      }
				};

			    reader.readAsText(file);
			};

			var param = $location.search();
			if (param && param.id) {
				restService.loadScript(param.id, function(script) {
					dataService.loadNewScript(JSON.parse(script.content));
					delete script.content;
					serverScript = script;
				});
			} else {
				serverScript = undefined;
				dataService.loadNewScript();
			}
		}
	};
});