protocolPanel.directive("protocolPanelItem", function($compile, $rootScope, dataService, dynamicProtocolService) {
  	return {
    	restrict: "A",
    	replace: true,
    	scope: true,
    	templateUrl: "modules/protocol-panel/templates/protocol-panel-item.html",
        compile: function (tElement, tAttrs, transclude) {
            tElement.find('#header').attr({
                'id': tAttrs.tagid + "-header",
                'data-parent': '#' + tAttrs.parentid,
                'data-toggle': 'collapse',
                'aria-expanded': true,
                'href': "#" + tAttrs.tagid + "-body",
                'aria-controls': tAttrs.tagid + "-body"
            });
            tElement.find('#body').attr({
                'id': tAttrs.tagid + "-body",
                'aria-labelledby': tAttrs.tagid + "-header"
            });
            tElement.find('#container').attr({
                id: tAttrs.tagid
            });

            return function (scope, element, attr) {
                scope.module = dynamicProtocolService.getProtocol(attr.tagid);
                scope.panel = {
                    title: attr.tag,
                    type: scope.module.type
                };

                scope.newProperty = function(name) {
                    dynamicProtocolService.newChildProperty($compile, element, scope, name, attr.propertyid, {});
                };
                scope.deleteProperty = function(name) {
                    dynamicProtocolService.deleteProperty(scope.module.childs, name);
                };
                scope.launchNewProtocolDialog = function() {
                    dynamicProtocolService.setNewProtocolParent(attr.tagid);
                };
                scope.deletePanel = function() {
                    element.remove();
                    var parent = dynamicProtocolService.getProtocol(attr.parentid);
                    dynamicProtocolService.deleteProperty(parent.childs, attr.tag);
                };

                scope.$on('protocol:change:' + attr.tagid, function(event, data) {
                    dynamicProtocolService.newProtocol(data, $compile, element, scope);
                });

                dynamicProtocolService.branchCreateChildPanel($compile, element, scope, attr.tagid, scope.module.childs);
            };
        }
  	};
});