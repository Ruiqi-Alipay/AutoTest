var protocolPanel = angular.module("property-panel", ['data-center']);

protocolPanel.directive("protocolPanel", function($compile) {
    return {
        restrict: "A",
        replace: true,
        scope: true,
        template: "<div></div>",
        link: function(scope, element, attr) {
            var resetPropertyies = function() {
                element.html('');
                element.append($compile("<div protocol-panel-item tag='root'></div>")(scope));
            };

            resetPropertyies();
        }
    };
});