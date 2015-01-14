var propertyPanel = angular.module("property-panel", ['data-center']);

propertyPanel.directive("propertyPanel", function($compile, dataService) {
    return {
        restrict: "A",
        replace: true,
        scope: true,
        template: "<div></div>",
        link: function(scope, element, attr) {
            var resetPropertyies = function() {
                element.html('');
                element.append($compile("<div property-panel-item propertyid='root' propertyname='root'></div>")(scope));
            };

            scope.$on('dataService:newScriptLoaded', function(event) {
                resetPropertyies();
            });

            resetPropertyies();
        }
    };
});