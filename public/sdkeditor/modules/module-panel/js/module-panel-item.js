blockPanel.directive("modulePanelItem", function ($compile, $rootScope, $location, $anchorScroll, panelService, dataService, protocolService) {
  	return {
    	restrict: "A",
    	replace: true,
    	scope: true,
    	templateUrl: "modules/module-panel/templates/panel-item.html",
    	compile: function (tElement, tAttrs, transclude) {
    		var elementId = tAttrs['element-id'];
            var parentId = dataService.findParentIdInHierarchy(elemetId);

            tElem.find('#header').attr({
                'id': elementId + "-header",
                'data-parent': '#' + parentId,
                'data-toggle': 'collapse',
                'aria-expanded': false,
                'href': "#" + elementId + "-body",
                'aria-controls': elementId + "-body"
            });
    		tElem.find('#body').attr({
    			'id': elementId + "-body",
                'aria-labelledby': elementId + "-header"
    		});
    		tElem.find('#container').attr({
    			id: elementId
    		});

      		return function (scope, element, attr) {
                $anchorScroll.yOffset = 250;
                scope.block = dataService.getModule(attr.elementId);
                scope.properties = [];
                scope.panel = {
                    title: '',
                    background: dataService.getHierarchyColor(attr.elementId),
                    typeArray: dataService.getProtocol('blocks').type,
                    properties: [],
                    unuseProperties: []
                };
                resetModuleProperties(scope.panel.properties, scope.panel.unuseProperties, scope.block);

                scope.insertSlibingBefore = function(type) {
                    var insertPosition = dataService.findSlibingIndexInHierarchy(attr.elementId);
                    var elementId = panelService.createModulePanel($compile, scope, element, insertPosition, type, parentId);
                    $rootScope.$broadcast('display:insert:' + attr.elementId, elementId);
                };
                scope.panelClicked = function() {
                    dataService.setHighlightViewId(attr.elementId);
                };
                scope.getPropertyProtocolValue = function(name) {
                    return protocolService.getProtocolValue(name);
                };
                scope.addNewProperty = function(name) {
                    scope.block[name] = protocolService.getProtocolDefaultValue(name);
                    resetModuleProperties(scope.panel.properties, scope.panel.unuseProperties, scope.block);
                };
                scope.deleteProperty = function(name) {
                    delete scope.block[name];
                    resetModuleProperties(scope, scope.block.type);
                };
		      	scope.appendNewChild = function(type) {
		      		var container = element.find("#" + attr.elementId);
		      		var elementId = dataService.createModule($compile, scope, container, -1, type, attr.elementId);
                    $rootScope.$broadcast('display:append:' + attr.elementId, elementId);
                };
                scope.deleteElement = function() {
                    dataService.deleteBlockModule(scope.ctrl.elementId);
                    element.remove();
                    $rootScope.$broadcast('display:delete:' + scope.ctrl.elementId);
                }

                scope.$on('module:close-' + scope.ctrl.elementId, function(event) {
                    element.find('#' + scope.ctrl.elementId + '-body').collapse('hide');
                });
                scope.$on('module:open-' + scope.ctrl.elementId, function(event) {
                    element.find('#' + scope.ctrl.elementId + '-body').collapse('show');
                });
                scope.$on('module:open-' + scope.ctrl.elementId + '-finished', function(event) {
                    $location.hash(scope.ctrl.elementId + '-body');
                    $anchorScroll();
                });

                if (scope.block.value instanceof Array && scope.block.value) {
                    var container = element.find("#" + scope.ctrl.elementId);
                    var result = dataService.recursiveProcessModule($compile, scope, container, scope.ctrl.elementId, scope.block.value);
                    scope.addNewtask(result);
                }

                scope.moduleLoadFinished();

                if (attr.elementId === dataService.getManualCreateId()) {
                    element.find('#' + scope.ctrl.elementId + '-body').collapse('show');
                }
		    };
    	}
  	};
});