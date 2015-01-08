dataCenter.factory("dataService", function($rootScope, protocolService) {
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
	var loadNewScript = function(script) {
		actionFragmentList.length = 0;
		mainFragment = {};
		selectFragment = mainFragment;
		moduleHierarchy = [{id: 'root'}];
		propertyHierarchy = [{id: 'root'}];
		moduleDataMap = {};
		propertyDataMap = {};

		if (script && script.form) {
			extractActions(actionFragmentList, script);
			mainFragment = script
		}

		propertyDataMap['root'] = mainFragment;
	};
	var assembleScript = function() {
		saveCurrentForm();

		var script = {};
		jQuery.extend(script, scriptRoot);
		script.form = {};
		jQuery.extend(script.form, mainForm.parameter.form);
		script.form.blocks = [];
		for (var index in mainForm.blocks) {
			script.form.blocks[index] = {};
			jQuery.extend(script.form.blocks[index], mainForm.blocks[index]);
		}

		for (var index in actionList) {
			var actionCopy = {};
			jQuery.extend(actionCopy, actionList[index].parameter);
			if (actionList[index].blocks) {
				actionCopy.form.blocks = actionList[index].blocks;
			}
			assenbleAction(actionCopy, script.form.blocks);
		}

		return script;
	};
	var assenbleAction = function(action, script) {
		if (script instanceof Array) {
			for (var index in script) {
				var result = assenbleAction(action, script[index]);
				if (result) {
					return result;
				}
			}
		} else if (typeof script === 'object') {
			for (var key in script) {
				var content = script[key];

				if (key === 'action') {
					var ss = 'sss';
					if (ss != key) {
						var f = parseInt(1);
					}
				}

				if (typeof content === 'object' || content instanceof Array) {
					var result = assenbleAction(action, content);
					if (result) {
						return result;
					}
				} else if (key === 'action' && content === action.name) {
					script[key] = action;
					return true;
				}
			}
		}
	};

	var assembleBlocks = function(resultArray, sourceArray) {
		sourceArray.forEach(function(value, index) {
			resultArray[index] = moduleMap[value.name];
			if (value.array) {
				resultArray[index].value = [];
				assembleBlocks(resultArray[index].value, value.array);
			}
		});
	};
		
   	var moduleHierarchy = [{id: 'root'}];
   	var moduleDataMap = {};

   	var propertyDataMap = {};
   	var propertyHierarchy = [{id: 'root'}];

   	var mainFragment = {};
   	var actionFragmentList = [];
   	var selectFragment = mainFragment;

   	loadNewScript();

	return {
		loadNewScript: function(script) {
			loadNewScript(script);
			$rootScope.$broadcast('dataService:newScriptLoaded');
		},
		newModule: function(parentId, module, position) {
			var newItemId = newEelementId();
			moduleDataMap[newItemId] = module;

			var parent = findHierarchyItem(moduleHierarchy, parentId);
			if (!parent.childs) {
				parent.childs = [];
			}
			if (position >= 0) {
				var previousItemId = parent.childs[position].id;
				parent.childs.splice(position, 0, {id: newItemId});
				$rootScope.$broadcast('display:insert:' + previousItemId, newItemId);
			} else {
				parent.childs.push({id: newItemId});
				$rootScope.$broadcast('display:append:' + parentId, newItemId);
			}

			return newItemId;
		},
		newProperty: function(parentId, name, module) {
			var elementId;
			var moduleProperty = protocolService.isModuleProperty(name);
			propertyDataMap[parentId][name] = '';
			if (moduleProperty) {
				elementId = newEelementId();
				propertyDataMap[elementId] = module;

				var parent = findHierarchyItem(propertyHierarchy, parentId);
				if (!parent.childs) {
					parent.childs = [];
				}
				parent.childs.push({id: elementId});
			}
			
			$rootScope.$broadcast('property:change:' + parentId);
			return elementId;
		},
		deleteProperty: function(parentId, elementName, elementId) {
			delete propertyDataMap[parentId][elementName];
			if (elementId) {
				delete propertyDataMap[elementId];
				var parent = findHierarchyItem(propertyHierarchy, parentId);
				var deleteInedx = findSlibingIndexInHierarchy(parent.childs, elementId);
				var deleteItem = parent.childs.splice(deleteInedx, 1);
				if (deleteItem.childs) {
					deletePropertyModule(deleteItem.childs);
				}
			}
			$rootScope.$broadcast('property:change:' + parentId);
		},
		deleteModule: function(elementId) {
			delete moduleMap[elementId];
			if (elementId === 'root') {
				var deleteArray = findPositionArray(blockPositionTree, elementId);
				deleteArray.forEach(function(item) {
					delete moduleMap[item.name];
					if (item.array) {
						deleteBlockModule(item.childs);
					}
				});

				delete blockPositionTree[0]['array'];
			} else {
				var parentId = findParentId(blockPositionTree, elementId);
				var changeArray = findPositionArray(blockPositionTree, parentId);
				var deleteInedx = findBlockPosition(changeArray, elementId);
				var deleteItem = changeArray.splice(deleteInedx, 1);
				if (deleteItem.childs) {
					deleteBlockModule(deleteItem.childs);
				}
			}
		},
		assembleScript: function() {
			return assembleScript;
		},
		getSelectFragment: function() {
			return selectFragment;
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
		}
	}
});