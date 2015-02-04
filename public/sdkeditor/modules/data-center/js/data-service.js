dataCenter.factory("dataService", function($rootScope, $timeout, protocolService) {
	var hierarchyColor = ['#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f',
							'#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f'];
							
	var newEelementId = function() {
		return protocolService.generateUuid() + '-' + protocolService.generateUuid() + '-' + protocolService.generateUuid();
	};
	var findHierarchyItem = function(childs, id) {
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];
			if (child.id === id) {
				return child;
			} else if (child.childs) {
				var result = findHierarchyItem(child.childs, id);
				if (result) {
					return result;
				}
			}
		}
	};
	var findParentIdInHierarchy = function(childs, id) {
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];
			if (child.id === id) {
				return "FIND";
			} else if (child.childs) {
				var result = findParentIdInHierarchy(child.childs, id);
				if (result) {
					if (result === "FIND") {
						result = child.id;
					}
					return result;
				}
			}
		}
	};
	var findSlibingIndexInHierarchy = function(childs, id) {
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];
			if (child.id === id) {
				return i;
			} else if (child.childs) {
				var result = findSlibingIndexInHierarchy(child.childs, id);
				if (result >= 0) {
					return result;
				}
			}
		}
	};
	var getHierarchyLevel = function(childs, id) {
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];
			if (child.id === id) {
				return 0;
			} else if (child.childs) {
				var result = getHierarchyLevel(child.childs, id);
				if (result >= 0) {
					return result + 1;
				}
			}
		}
	};
	var getHierarchyList = function(childs, id) {
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];
			if (child.id === id) {
				return [child.id];
			} else if (child.childs) {
				var result = getHierarchyList(child.childs, id);
				if (result) {
					result.push(child.id);
					return result;
				}
			}
		}
	};
	var deleteBlockModule = function(childs) {
		childs.forEach(function(child) {
			delete moduleDataMap[child.id];
			if (child.childs) {
				deleteBlockModule(child.childs);
			}
		});
	};
	var deletePropertyModule = function(childs) {
		childs.forEach(function(child) {
			delete propertyDataMap[child.id];
			if (child.childs) {
				deletePropertyModule(child.childs);
			}
		});
	};

	var extractActions = function(actionList, script) {
		if (script instanceof Array) {
			for (var index in script) {
				extractActions(actionList, script[index]);
			}
		} else if (typeof script === 'object') {
			for (var key in script) {
				var content = script[key];

				if (key === 'action' && typeof content === 'object') {
					actionList.push(content);
				}
				extractActions(actionList, content);
			}

			if ('action' in script && typeof script.action === 'object') {
				var actionName = script.action.name;
				delete script.action;
				script.action = actionName;
			}
		}
	};
	var extractActions = function(script) {
		for (var key in script) {
			if (script[key] instanceof Object) {
				if (key == 'action') {
					var action = script[key];
					if (action.name) {
						script['action.name'] = action.name;
					}
					if (action.params && action.params.result) {
						script['action.params.result'] = action.params.result;
					}
					if (action.params && action.params.code) {
						script['action.params.code'] = action.params.code;
					}
				} else {
					extractActions(script[key]);
				}
			}
		}
	};
	var assembleActions = function(script) {
		var action;
		for (var key in script) {
			var content = script[key];
			if (content instanceof Array) {
				content.forEach(function(value) {
					if (typeof value == 'object') {
						assembleActions(value);
					}
				});
			} else if (typeof content == 'object') {
				assembleActions(content);
			} else if (key == 'action.name') {
				if (!action) {
					action = {};
				}
				action.name = script[key];
			} else if (key == 'action.params.result') {
				if (!action) {
					action = {};
				}
				if (!action.params) {
					action.params = {};
				}
				action.params.result = script[key];
			} else if (key == 'action.params.code') {
				if (!action) {
					action = {};
				}
				if (!action.params) {
					action.params = {};
				}
				action.params.code = script[key];
			}
		}

		if (action) {
			delete script['action.name'];
			delete script['action.params.result'];
			delete script['action.params.code'];
			script.action = action;
		}
	};
	var loadNewScript = function(script) {
		moduleHierarchy = [{id: 'root'}];
		propertyHierarchy = [{id: 'root'}];
		moduleDataMap = {};
		propertyDataMap = {};
		variables.length = 0;

		if (script) {
			if (script.templates) {
				script.form = script.templates;
			}

			for (var key in script.variables) {
				variables.push({
					name: key,
					value: script.variables[key]
				})
			}
		} else {
			script = {};
		}

		extractActions(script);

		loadedScript = script;

		propertyDataMap['root'] = script;
	};
	var findItemParent = function(script, name) {
		if (script instanceof Array) {
			for (var index in script) {
				var result = findItemParent(script[index], name);
				if (result) {
					return result;
				}
			}
		} else if (typeof script === 'object') {
			for (var key in script) {
				var content = script[key];

				if (key === 'action' && typeof content === name) {
					return script;
				} else {
					var result = findItemParent(content, name);
					if (result) {
						return result;
					}
				}
			}
		}
	};
	var onSelectPanel = function(elementId) {
		var selectBranch = getHierarchyList(moduleHierarchy, elementId);
		var selectHash = {};
		selectBranch.forEach(function(value) {
			selectHash[value] = '';
		});

		for (var i = selectBranch.length - 1; i >= 0; i--) {
			$rootScope.$broadcast('module:open-' + selectBranch[i]);
		}
		for (var element in moduleDataMap) {
			if (!(element in selectHash)) {
				$rootScope.$broadcast('module:close-' + element);
			}
		}
	    $timeout(function() {
			$rootScope.$broadcast('module:open-' + elementId + '-finished');
	    }, 500);
	};
	var assembleBlocks = function(array) {
		for (var index in array) {
			var item = array[index];
			var module = jQuery.extend(true, {}, moduleDataMap[item.id]);
			jQuery.extend(module, moduleDataMap[item.id]);
			array[index] = module;
			if (item.childs) {
				assembleBlocks(item.childs);
				array[index].value = item.childs;
			}
		}
	};

   	var moduleHierarchy = [{id: 'root'}];
   	var moduleDataMap = {};

   	var propertyDataMap = {};
   	var propertyHierarchy = [{id: 'root'}];
   	var variables = [];
   	var loadedScript;

   	loadNewScript();

	return {
		getVariable: function(key) {
			for (var index in variables) {
				var item = variables[index];
				if (item.name == key) {
					return item.value;
				}
			}
		},
		getVariables: function() {
			return variables;
		},
		loadNewScript: function(script) {
			loadNewScript(script);
			$rootScope.$broadcast('dataService:newScriptLoaded');
			$rootScope.$broadcast('display:refresh');
		},
		newModule: function(parentId, module, position, broadcast) {
			var newItemId = newEelementId();
			moduleDataMap[newItemId] = module;

			var parent = findHierarchyItem(moduleHierarchy, parentId);
			if (!parent.childs) {
				parent.childs = [];
			}
			if (position >= 0) {
				var previousItemId = parent.childs[position].id;
				parent.childs.splice(position, 0, {id: newItemId});
				if (broadcast) {
					$rootScope.$broadcast('display:insert:' + previousItemId, newItemId);
				}
			} else {
				parent.childs.push({id: newItemId});
				if (broadcast) {
					$rootScope.$broadcast('display:append:' + parentId, newItemId);
				}
			}

			return newItemId;
		},
		newModuleProperty: function(module) {
			elementId = newEelementId();
			propertyDataMap[elementId] = module;
			return elementId;
		},
		newProperty: function(parentId, name, module) {
			var elementId;
			var moduleProperty = protocolService.isModuleProperty(name);
			
			if (moduleProperty) {
				elementId = newEelementId();
				propertyDataMap[elementId] = module;

				var parent = findHierarchyItem(propertyHierarchy, parentId);
				if (!parent.childs) {
					parent.childs = [];
				}
				parent.childs.push({id: elementId});
			} else {
				propertyDataMap[parentId][name] = '';
			}
			
			$rootScope.$broadcast('property:change:' + parentId);
			return elementId;
		},
		deleteProperty: function(parentId, elementName, elementId) {
			if (parentId in propertyDataMap) {
				delete propertyDataMap[parentId][elementName];
			}
			
			if (elementId) {
				delete propertyDataMap[elementId];
				var parent = findHierarchyItem(propertyHierarchy, parentId);
				if (parent) {
					var deleteInedx = findSlibingIndexInHierarchy(parent.childs, elementId);
					var deleteItem = parent.childs.splice(deleteInedx, 1);
					if (deleteItem.childs) {
						deletePropertyModule(deleteItem.childs);
					}
				}
			}
			$rootScope.$broadcast('property:change:' + parentId, elementName);
		},
		deleteModule: function(elementId) {
			delete moduleDataMap[elementId];
			var parentId = findParentIdInHierarchy(moduleHierarchy, elementId);
			var parent = findHierarchyItem(moduleHierarchy, parentId);
			var deleteInedx = findSlibingIndexInHierarchy(parent.childs, elementId);
			var deleteItem = parent.childs.splice(deleteInedx, 1);
			if (deleteItem[0].childs) {
				deleteBlockModule(deleteItem[0].childs);
			}
		},
		getOverallScript: function() {
			var script = jQuery.extend(true, {}, loadedScript);
			var blocks = jQuery.extend(true, [], moduleHierarchy[0].childs);

			assembleBlocks(blocks);
			if (blocks) {
				if (!script.form) {
					script.form = {};
				}
				script.form.blocks = blocks;
			} else if (script.form) {
				delete script.form.blocks;
			}

			if (script.templates) {
				script.templates = script.form;
				delete script.form;
			}

			assembleActions(script);

			if (variables) {
				script.variables = {};
				variables.forEach(function(item) {
					script.variables[item.name] = item.value;
				});
			} else {
				delete script.variables;
			}

			return script;
		},
		getScriptRoot: function() {
			return loadedScript;
		},
		getModule: function(elementId) {
			return moduleDataMap[elementId];
		},
		findHierarchyItem: function(id) {
			return findHierarchyItem(moduleHierarchy, id);
		},
		findParentIdInHierarchy: function(id) {
			return findParentIdInHierarchy(moduleHierarchy, id);
		},
		findSlibingIndexInHierarchy: function(id) {
			return findSlibingIndexInHierarchy(moduleHierarchy, id);
		},
		getHierarchyLevel: function(id) {
			return getHierarchyLevel(moduleHierarchy, id);
		},
		getHierarchyList: function(id) {
			return getHierarchyList(moduleHierarchy, id);
		},
		getActionFragments: function() {
			return actionFragmentList;
		},
		getProperty: function(propertyId) {
			return propertyDataMap[propertyId];
		},
		getHierarchyColor: function(elementId) {
			var hierarchy = getHierarchyLevel(moduleHierarchy, elementId);
			return hierarchyColor[hierarchy];
		},
		getChildHierarchyColor: function(elementId) {
			var hierarchy = getHierarchyLevel(moduleHierarchy, elementId);
			return hierarchyColor[hierarchy + 1];
		},
		getActionbar: function() {
			if (loadedScript && loadedScript.form && loadedScript.form.actionBar) {
				return loadedScript.form.actionBar;
			}
		},
		onSelectPanel: function(elementId) {
			onSelectPanel(elementId);
		}
	}
});