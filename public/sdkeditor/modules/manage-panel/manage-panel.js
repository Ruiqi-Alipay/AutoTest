var manaagerPanel = angular.module('manage-panel', []);

manaagerPanel.directive("managePanel", function ($location, restService) {
    return {
        restrict: "A",
        replace: true,
        scope: true,
        templateUrl: "modules/manage-panel/templates/manage-panel.html",
        link: function (scope, element, attr) {
            var refresh = function() {
                restService.listServerScripts(function(forderList, scriptByFolder) {
                    scope.scriptByFolder = scriptByFolder;
                    scope.folderList = forderList;
                });
            };

            var deleteFolderIndex;
            var deleteScriptIndex;

            scope.editScript = function(folderId, index) {
                var script = restService.getScript(folderId, index);
                $location.path('/').search({id: script._id});
            };

            scope.downloadScript = function(folderId, index) {
                dataService.downloadScript(folderId, index);
            };

            scope.editFolder = function(index) {
                scope.selectFolder = scope.folderList[index];
                scope.tempTitle = scope.selectFolder.title;
            };

            scope.newFolder = function() {
                scope.selectFolder = {};
                scope.tempTitle = '';
            };

            scope.saveFolder = function() {
                scope.selectFolder.title = scope.tempTitle;
                restService.saveFolder(scope.selectFolder, function() {
                    refresh();
                });
            };

            scope.deleteScript = function(folderIndex, scriptIndex) {
                deleteFolderIndex = folderIndex;
                deleteScriptIndex = scriptIndex;

                if (scriptIndex >= 0) {
                    var folder = scope.folderList[folderIndex];
                    var scripts = scope.scriptByFolder[folder._id];
                    var deleteScript = scripts[scriptIndex];

                    scope.configTitle = '删除脚本';
                    scope.configMessage = '确认删除脚本：' + deleteScript.title;
                } else {
                    var folder = scope.folderList[folderIndex];
                    scope.configTitle = '删除文件夹';
                    scope.configMessage = '确认删除文件夹：' + folder.title;
                }
            };

            scope.confirmDeleteScript = function() {
                if (deleteScriptIndex >= 0) {
                    restService.deleteScript(scope.scriptByFolder[scope.folderList[deleteFolderIndex]._id][deleteScriptIndex]._id, function() {
                        refresh();
                    });
                } else {
                    restService.deleteFolder(scope.folderList[deleteFolderIndex]._id, function() {
                        refresh();
                    });
                }
            };

            refresh();
        }
    };
});