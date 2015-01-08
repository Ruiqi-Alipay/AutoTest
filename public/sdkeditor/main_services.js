var app = angular.module("sdkApp");

app.factory("dataService", function($rootScope, $timeout) {
	var dpiRatio = 2 / 3;

		var saveCurrentForm = function() {
			if (selectedForm && blockPositionTree[0].array) {
				selectedForm.blocks = [];
				assembleBlocks(selectedForm.blocks, blockPositionTree[0].array);
			}
		};
	var hierarchyColor = ['#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f',
							'#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f'];

	return {
		createNewAction: function() {
			actionList.push({
				parameter: {
					name: 'js://'
				}
			});
			this.selectForm(actionList.length - 1);
		},
		deleteAction: function() {
			actionList.splice(selectedFormIndex, 1);
			selectedFormIndex = -2;
			if (actionList.length == 0) {
				this.selectForm(-1);
			} else {
				this.selectForm(0);
			}
		},
		selectForm: function(index) {
			if (selectedFormIndex == index) {
				return;
			}

			saveCurrentForm();

			selectedFormIndex = index;
			selectedForm = index < 0 ? mainForm : actionList[index];
			moduleMap = {};
			moduleStyleMap = {};
			if (selectedForm.blocks) {
				blockPositionTree[0].array = [];
			} else {
				delete blockPositionTree[0]['array'];
			}
			$rootScope.$broadcast('sdk:panelSelectionChange');
		},
		createSelectFormBlocks: function() {
			selectedForm.blocks = [];
			blockPositionTree[0].array = [];
		},
		getSelectedFormIndex: function() {
			return selectedFormIndex;
		},
		getSelectForm: function() {
			return selectedForm;
		},
		getSelectedFormParameters: function() {
			return selectedForm.parameter;
		},
		getSelectedFormBlocks: function() {
			return selectedForm.blocks;
		},
		getScriptRoot: function() {
			return scriptRoot;
		},
		getActionList: function() {
			return actionList;
		},
		getModuleProtocol: function() {
			return moduleProtocol;
		},
		setHighlightViewId: function(elementId) {
			highlightView.elementId = elementId;
		},
		getHighlightView: function() {
			return highlightView;
		},
		getModuleProperties: function() {
			return fullProperites;
		},
		getHierarchyColor: function(elementId) {
			var hierarchy = getBlockHierarchyLevel(blockPositionTree, elementId);
			return hierarchyColor[hierarchy];
		},
		getPosition: function(elementId) {
			return findPosition(blockPositionTree, elementId);
		},
		getBlockRoot: function() {
			return blockPositionTree[0];
		},
		selectPanel: function(elementId) {
			var selectBranch = getBlockHierarchy(blockPositionTree, elementId);
			var selectHash = {};
			selectBranch.forEach(function(value) {
				selectHash[value] = '';
			});

			for (var i = selectBranch.length - 1; i >= 0; i--) {
				$rootScope.$broadcast('module:open-' + selectBranch[i]);
			}
			for (var element in moduleMap) {
				if (!(element in selectHash)) {
					$rootScope.$broadcast('module:close-' + element);
				}
			}
		    $timeout(function() {
				$rootScope.$broadcast('module:open-' + elementId + '-finished');
		    }, 500);
		},
		getVariable: function(key) {
			return variable.value[key];
		},
		createModule: function(compile, scope, target, position, type, parentId, block) {
			manualCreateId = createModule(compile, scope, target, position, type, parentId, block);
			return manualCreateId;
		},
		getManualCreateId: function() {
			return manualCreateId;
		},
		getModuleBlock: function(elementId) {
			return moduleMap[elementId];
		},
		getBlockParentId: function(elementId) {
			return findParentId(blockPositionTree, elementId);
		},
		getBlockPosition: function(elementId) {
			return findBlockPosition(blockPositionTree, elementId);
		},
		getBlockChilds: function(elementId) {
			return findPositionArray(blockPositionTree, elementId);
		}
	};
});