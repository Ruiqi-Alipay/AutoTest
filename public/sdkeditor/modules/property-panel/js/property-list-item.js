propertyPanel.directive("propertyListItem", function($compile, $rootScope, dataService, propertyService) {
  	return {
    	restrict: "A",
    	replace: true,
    	scope: true,
    	templateUrl: "modules/property-panel/templates/property-list-item.html",
        compile: function (tElement, tAttrs, transclude) {
            tElement.find('#header').attr({
                'id': tAttrs.propertyid + "-header",
                'data-parent': '#' + tAttrs.parentid,
                'data-toggle': 'collapse',
                'aria-expanded': true,
                'href': "#" + tAttrs.propertyid + "-body",
                'aria-controls': tAttrs.propertyid + "-body"
            });
            tElement.find('#body').attr({
                'id': tAttrs.propertyid + "-body",
                'aria-labelledby': tAttrs.propertyid + "-header"
            });
            tElement.find('#container').attr({
                id: tAttrs.propertyid
            });

            return function (scope, element, attr) {
                var background = attr.background;
                if (!background) {
                    background = '#ffffff';
                }
                scope.array = dataService.getProperty(attr.propertyid);
                scope.panel = {
                    title: attr.propertyname,
                    background: background
                };

                scope.newProperty = function(name) {
                    propertyService.newChildProperty($compile, element, scope, name, attr.propertyid, {});
                };
                scope.deletePanel = function() {
                    element.remove();
                    propertyService.deleteChildProperty(attr.parentid, attr.propertyname, attr.propertyid); 
                };

                propertyService.branchCreateListChildPanel($compile, element, scope, scope.array, attr.propertyname, attr.propertyid);
            };
        }
  	};
});