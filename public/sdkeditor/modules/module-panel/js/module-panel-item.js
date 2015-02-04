blockPanel.directive("moduleItem", function ($compile, $rootScope, $location, $anchorScroll, moduleService, dataService, protocolService) {
  	return {
    	restrict: "A",
    	replace: true,
    	scope: true,
    	templateUrl: "modules/module-panel/templates/panel-item.html",
    	compile: function (tElement, tAttrs, transclude) {
    		var elementId = tAttrs.elementId;
            var parentId = dataService.findParentIdInHierarchy(elementId);

            tElement.find('#header').attr({
                'id': elementId + "-header",
                'data-parent': '#' + parentId,
                'data-toggle': 'collapse',
                'aria-expanded': false,
                'href': "#" + elementId + "-body",
                'aria-controls': elementId + "-body"
            });
    		tElement.find('#body').attr({
    			'id': elementId + "-body",
                'aria-labelledby': elementId + "-header"
    		});
    		tElement.find('#container').attr({
    			id: elementId
    		});

      		return function (scope, element, attr) {
                $anchorScroll.yOffset = 250;
                scope.block = dataService.getModule(attr.elementId);
                scope.hierarchyItem = dataService.findHierarchyItem(attr.elementId);
                scope.properties = [];
                scope.panel = {
                    title: '',
                    background: dataService.getHierarchyColor(attr.elementId),
                    childbackground: dataService.getChildHierarchyColor(attr.elementId),
                    typeArray: protocolService.getProtocol('blocks').type,
                    properties: [],
                    unuseProperties: []
                };
                moduleService.resetModuleProperties(scope.panel.properties, scope.panel.unuseProperties, scope.block);
                var panelProertyMap = moduleService.banchCreatePropertyPanel($compile, scope, element, attr.elementId, scope.block);

                scope.insertSlibingBefore = function(type) {
                    var insertPosition = dataService.findSlibingIndexInHierarchy(attr.elementId);
                    var elementId = moduleService.createModulePanel($compile, scope, element, insertPosition, type, parentId);
                    $rootScope.$broadcast('display:insert:' + attr.elementId, elementId);
                };
                scope.panelClicked = function() {
                    $rootScope.$broadcast('display:highlisht', attr.elementId);
                };
                scope.getPropertyProtocolValue = function(name) {
                    return protocolService.getProtocolValue(name);
                };
                scope.addNewProperty = function(name) {
                    scope.block[name] = protocolService.getProtocolDefaultValue(name);
                    moduleService.resetModuleProperties(scope.panel.properties, scope.panel.unuseProperties, scope.block);
                    if (protocolService.isModuleProperty(name)) {
                        moduleService.createPropertypanel($compile, scope, element, attr.elementId, name, {});
                    }
                    $rootScope.$broadcast("display:change:" + attr.elementId);
                };
                scope.deleteProperty = function(name) {
                    delete scope.block[name];
                    moduleService.resetModuleProperties(scope.panel.properties, scope.panel.unuseProperties, scope.block);
                    $rootScope.$broadcast("display:change:" + attr.elementId);
                };
		      	scope.appendNewChild = function(type) {
		      		var container = element.find("#" + attr.elementId);
                    moduleService.createModulePanel($compile, scope, container, -1, type, attr.elementId);
                };
                scope.deleteElement = function() {
                    moduleService.deletemodulePanel(attr.elementId);
                    element.remove();
                };
                scope.propertyChange = function() {
                    $rootScope.$broadcast("display:change:" + attr.elementId);
                };
                scope.getPropertyType = function(name) {
                    var valueType = protocolService.getProtocolValue(name);
                    if (valueType instanceof Array || valueType === 'array') {
                        return 'array';
                    } else {
                        return valueType;
                    }
                };

                scope.$on('property:change:' + attr.elementId, function(event, property) {
                    delete scope.block[property];
                    moduleService.resetModuleProperties(scope.panel.properties, scope.panel.unuseProperties, scope.block);
                });

                scope.$on('module:close-' + attr.elementId, function(event) {
                    element.find('#' + attr.elementId + '-body').collapse('hide');
                });
                scope.$on('module:open-' + attr.elementId, function(event) {
                    element.find('#' + attr.elementId + '-body').collapse('show');
                });
                scope.$on('module:open-' + attr.elementId + '-finished', function(event) {
                    // var newHash = attr.elementId + '-body';
                    // if ($location.hash() !== newHash) {
                    //     $location.hash(newHash);
                    // }
                    // $anchorScroll();
                });

                if (scope.block.value instanceof Array && scope.block.value) {
                    var container = element.find("#" + attr.elementId);
                    moduleService.branchCreateModulePanel($compile, scope, container, attr.elementId, scope.block.value);
                }

                if (moduleService.isManualCreated(attr.elementId)) {
                    element.find('#' + attr.elementId + '-body').collapse('show');
                }

                moduleService.panelCreated();
		    };
    	}
  	};
});