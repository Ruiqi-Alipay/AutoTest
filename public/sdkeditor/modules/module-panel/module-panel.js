var blockPanel = angular.module('module-panel', ['data-center']);

blockPanel.directive("modulePanel", function ($compile, $rootScope, moduleService, protocolService) {
    return {
        restrict: "A",
        replace: true,
        scope: true,
        templateUrl: "modules/module-panel/templates/panel-root.html",
        link: function (scope, element, attr) {
            var childRoot = element.find("#root");
            scope.moduleTypes = protocolService.getProtocol('blocks').type;

            scope.$on('dataService:newScriptLoaded', function() {
                childRoot.html('');
                var blocks = moduleService.getSelectPanelModules();
                if (blocks) {
                    moduleService.branchCreateModulePanel($compile, scope, connatiner, 'root', blocks);
                }
            });
            
            scope.appendChildPanel = function(type) {
                var elementId = moduleService.createModulePanel($compile, scope, childRoot, -1, type, 'root');
                $rootScope.$broadcast('display:append:root', elementId);
            };

            scope.clearAllPanel = function() {
                childRoot.html('');
                dataService.deleteBlockModule('root');
                $rootScope.$broadcast('delete:' + 'root');
            };
        }
    };
});