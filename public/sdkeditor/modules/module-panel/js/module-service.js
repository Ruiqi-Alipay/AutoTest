blockPanel.factory('moduleService', function ($rootScope, dataService, protocolService) {
	var createModulePanel = function(compile, scope, target, position, type, parentId, module, broadcast) {
		if (!module) {
			module = protocolService.getDefaultModule(type);
		}
        var elemetId = dataService.newModule(parentId, module, position, broadcast);
		var	newElement = compile("<div module-item element-id='" + elemetId + "' view-type='" + type + "'></div>")(scope);
		if (position < 0) {
            target.append(newElement);
        } else {
        	newElement.insertBefore(target);
        }

        return elemetId;
	};
	var banchCreateModulePanel = function(compile, scope, container, parentId, values) {
		values.forEach(function (value, index) {
			if (value.type) {
            	createModulePanel(compile, scope, container, -1, value.type, parentId, value);
            	creatingPanel++;
        	}
        });
	};
	var createPropertyPanel = function(compile, scope, element, parentid, propertyName, property) {
		var elementId = dataService.newModuleProperty(property);
        var container = element.find('#proeprty-container');
        var background = dataService.getHierarchyColor(parentid);
        var propertyPanelType = 'property-panel-item';
        if (propertyName === 'value' && dataService.getModule(parentid).type === 'combox') {
        	propertyName = 'combox-value';
        	propertyPanelType = 'property-list-item';
        }
	    container.append(compile("<div " + propertyPanelType + " propertyname='" + propertyName + "' propertyid='" + elementId + "' parentid='" + parentid + "' background='" + background + "'></div>")(scope));
		return elementId;
	};

	var creatingPanel = 0;
	var manualCreateId;

	return {
		onNewScriptLoaded: function(compile, scope, container) {
        	var scriptRoot = dataService.getScriptRoot();
            if (scriptRoot.form && scriptRoot.form.blocks) {
            	banchCreateModulePanel(compile, scope, container, 'root', scriptRoot.form.blocks);
            }
		},
		branchCreateModulePanel: function(compile, scope, container, parentId, values) {
			banchCreateModulePanel(compile, scope, container, parentId, values);
		},
		banchCreatePropertyPanel: function(compile, scope, element, parentid, module) {
			var createdProperty = {};
			for (var key in module) {
				if (protocolService.isModuleProperty(key)) {
					var elementId = createPropertyPanel(compile, scope, element, parentid, key, module[key]);
					createdProperty[key] = elementId;
				}
			}
			return createdProperty;
		},
		createPropertypanel: function(compile, scope, element, parentid, propertyname, property) {
			return createPropertyPanel(compile, scope, element, parentid, propertyname, property);
		},
		createModulePanel: function(compile, scope, target, position, type, parentId, module) {
			manualCreateId = createModulePanel(compile, scope, target, position, type, parentId, module, true);
			if (position >= 0) {
				var parent = dataService.findHierarchyItem(parentId);
				var insertPositionEelement = parent.childs[position + 1];
			}
			creatingPanel++
		},
		deletemodulePanel: function(elementId) {
			dataService.deleteModule(elementId);
            $rootScope.$broadcast('display:delete:' + elementId);
		},
        panelCreated: function() {
            creatingPanel--;
            if (creatingPanel === 0) {
            	$rootScope.$broadcast('display:refresh');
            }
        },
	    resetModuleProperties: function(properties, unuseProperties, block) {
	        properties.length = 0;
	        unuseProperties.length = 0;
	        var fullProperties = protocolService.getProtocol('blocks')[block.type];
	        for (var index in fullProperties) {
	            var property = fullProperties[index];
	            if (property === 'type' || property === 'value') {
	                continue;
	            }

	            if (property in block) {
	            	if (!protocolService.isModuleProperty(property)) {
	                	properties.push(property);
	            	}
	            } else {
	                unuseProperties.push(property);
	            }
	        }
	    },
	    isManualCreated: function(elementId) {
	    	return elementId === manualCreateId;
	    }
	};
});