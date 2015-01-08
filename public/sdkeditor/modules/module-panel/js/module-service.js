blockPanel.factory('moduleService', function (dataService, protocolService) {
	var createModulePanel = function(compile, scope, target, position, type, parentId, module) {
        var elemetId = dataService.newModule(parentId, module, position);
		var	newElement = compile("<div module-panel-item element-id='" + elemetId + "' view-type='" + type + "'></div>")(scope);
		if (position < 0) {
            target.append(newElement);
        } else {
        	newElement.insertBefore(target);
        }

        return elemetId;
	};

	var creatingPanel = 0;

	return {
		branchCreateModulePanel: function(compile, scope, container, parentId, values) {
			values.forEach(function (value, index) {
				var type;
	            if ('type' in value) {
	                type = value.type;
	            } else if ('name' in value) {
	                type = value.name;
	            }

	            createModulePanel(compile, scope, container, -1, type, parentId, value);
	            creatingPanel++;
	        });
		},
		createModulePanel: function(compile, scope, target, position, type, parentId, module) {
			createModulePanel(compile, scope, target, position, type, parentId, module);
			creatingPanel++
		},
        panelCreated: function() {
            creatingPanel--;
            return creatingPanel;
        },
        getSelectPanelModules: function() {
        	var selectFragment = dataService.getSelectFragment();
            if (selectFragment.form && selectFragment.form.blocks) {
            	return selectFragment.form.blocks;
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

	            if (property in scope.block) {
	                properties.push(property);
	            } else {
	                unuseProperties.push(property);
	            }
	        }
	    }
	};
});