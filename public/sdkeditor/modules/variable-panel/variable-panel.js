var variablePanel = angular.module("variable-panel", ['data-center']);

variablePanel.directive("variablePanel", function($compile, $rootScope, dataService) {
    return {
        restrict: "A",
        replace: true,
        scope: true,
        templateUrl: "modules/variable-panel/templates/variable-panel.html",
        link: function(scope, element, attr) {
            scope.variables = dataService.getVariables();

            scope.$watch('variables', function(newValue, oldValue) {
                $rootScope.$broadcast('display:variable:change');
            }, true);

            scope.deleteItem = function(index) {
                scope.variables.splice(index, 1);
            };

            scope.addItem = function() {
                scope.variables.splice(0, 0, {});
            };
        }
    };
});