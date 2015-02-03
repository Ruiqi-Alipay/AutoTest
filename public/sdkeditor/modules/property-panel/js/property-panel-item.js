propertyPanel.directive("propertyPanelItem", function($compile, $rootScope, dataService, propertyService, protocolService) {
  	return {
    	restrict: "A",
    	replace: true,
    	scope: true,
    	templateUrl: "modules/property-panel/templates/property-panel-item.html",
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
                var protocol = protocolService.getProtocol(attr.propertyname);
                var background = attr.background;
                if (!background) {
                    background = '#ffffff';
                }
                scope.module = dataService.getProperty(attr.propertyid);
                scope.panel = {
                    title: attr.propertyname,
                    properties: [],
                    unuseProperties: [],
                    background: background
                };

                scope.newProperty = function(name) {
                    propertyService.newChildProperty($compile, element, scope, name, attr.propertyid, {});
                };
                scope.deleteProperty = function(key) {
                    propertyService.deleteChildProperty(attr.propertyid, key); 
                };
                scope.deletePanel = function() {
                    element.remove();
                    propertyService.deleteChildProperty(attr.parentid, attr.propertyname, attr.propertyid); 
                };
                scope.getPropertyType = function(name) {
                    var type = protocol[name];
                    if (type instanceof Array || type === 'array') {
                        return 'array';
                    } else {
                        return type;
                    }
                };
                scope.getPropertyProtocolValue = function(name) {
                    var values = protocol[name];
                    if (values instanceof Array) {
                        return values;
                    }
                }

                scope.$on('property:change:' + attr.propertyid, function(event) {
                    propertyService.resetPanelPropreties(scope.panel.properties, scope.panel.unuseProperties, scope.module, attr.propertyname);
                });

                if (attr.propertyname == 'form' || attr.propertyname == 'actionBar') {
                    scope.$watch('module', function(newValue, oldValue) {
                        if (attr.propertyname == 'form') {
                            if (newValue.type != oldValue.type) {
                                $rootScope.$broadcast('display:refresh');
                            }
                        } else {
                            if (newValue.title != oldValue.title ||
                                    newValue.left != oldValue.left) {
                                $rootScope.$broadcast('display:refresh');
                            }
                        }
                    }, true);
                }

                propertyService.branchCreateChildPanel($compile, element, scope, attr.propertyname, attr.propertyid, scope.module);
                propertyService.resetPanelPropreties(scope.panel.properties, scope.panel.unuseProperties, scope.module, attr.propertyname);
            };
        }
  	};
});