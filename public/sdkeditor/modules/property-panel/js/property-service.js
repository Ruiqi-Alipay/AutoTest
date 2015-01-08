propertyPanel.factory('propertyService', function (protocolService, dataService) {
	return {
		newChildProperty: function(compile, element, scope, propertyname, parentid, property) {
			var elementId = dataService.newProperty(parentid, propertyname, property);

            if (protocolService.isModuleProperty(propertyname)) {
                var container = element.find('#' + parentid);
		    	container.append(compile("<div property-panel-item propertyname='" + propertyname + "' propertyid='" + elementId + "' parentid='" + parentid + "'></div>")(scope));
            }
		},
		deleteChildProperty: function(parentId, propertyName, elementId) {
			dataService.deleteProperty(parentId, propertyName, elementId);
		},
		resetPanelPropreties: function(properties, unuseProperties, property, propertyName) {
	        properties.length = 0;
	        unuseProperties.length = 0;
	        var fullProperties = protocolService.getProtocol(propertyName);
	        for (var name in fullProperties) {
	            if (name === 'type' || name === 'value' || name === 'blocks') {
	                continue;
	            }

	            if (name in property) {
	            	if (fullProperties[name] != 'object') {
	            		properties.push(name);
	            	}
	            } else {
	                unuseProperties.push(name);
	            }
	        }
	    },
	    branchCreateChildPanel: function(compile, element, scope, moduleName, moduleid, module) {
	    	var protocol = protocolService.getProtocol(moduleName);
			for (var key in module) {
                var type = protocol[key];
                if (key != 'blocks' && type === 'object') {
                    this.newChildProperty(compile, element, scope, key, moduleid, module[key]);
                }
            }
	    }
	};
});