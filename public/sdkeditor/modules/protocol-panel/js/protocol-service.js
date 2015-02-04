protocolPanel.factory('dynamicProtocolService', function ($rootScope, $http) {
	var newChildPanel = function(compile, element, scope, parentid, child) {
		var elementId = generateUuid();
		protocolIdToData[elementId] = child;

        var container = element.find('#' + parentid);
	   	container.append(compile("<div protocol-panel-item tag='"
	   			+ child.name + "' tagid='" + elementId + "' parentid='" + parentid + "'></div>")(scope));
	};
	var generateUuid = function() {
    	return (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '-'
    			+ (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '-'
    			+ (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
	};
	var saveProtocol = function(protocol, success, error) {
		$http.post('/sdkeditor/api/sdkprotocol', protocol).success(function(data){
			if (success) {
				success(data);
			}
	  	}).error(function(data, status, headers, config) {
	  		if (error) {
	  			error(data);
	  		}
	  	});
	};
	var getProtocol = function() {
		$http.get('/sdkeditor/api/sdkprotocol').success(function(data){
	    	if (data._id) {
	    		serverProtocol = data;
	    		protocolIdToData['root'] = JSON.parse(data.content);
	    	}
	  	}).error(function(data, status, headers, config) {
	  		
	  	});
	};

	getProtocol();

	var serverProtocol;
	var protocolIdToData = {};
	var newProtocolParent;

	return {
		getProtocol: function(tag) {
			return protocolIdToData[tag];
		},
		setNewProtocolParent: function(id) {
			newProtocolParent = id;
		},
		getNewProtocolParent: function() {
			return newProtocolParent;
		},
		newProtocol: function(value, compile, element ,scope) {
			var parent = protocolIdToData[newProtocolParent];
			if (value.type == 'Text' || value.type == 'Color') {
				parent.childs.push({
					name: value.name,
					type: value.type
				});
			} else if (value.type == 'Array' || value.type == 'Object') {
				var newItem = {
					name: value.name,
					type: value.type,
					childs: []
				};
				parent.childs.push(newItem);
				newChildPanel(compile, element, scope, newProtocolParent, newItem);
			}
		},
		saveProtocol: function(success, failed) {
			var script = serverProtocol ? serverProtocol : {};
			script.content = JSON.stringify(protocolIdToData['root']);
			saveProtocol(script, success, failed);
		},
		newChildProperty: function(compile, element, scope, propertyname, parentid, property) {
			newChildProperty(compile, element, scope, propertyname, parentid, property);
		},
		deleteChildProperty: function(parentId, propertyName, elementId) {
			dataService.deleteProperty(parentId, propertyName, elementId);
		},
	    branchCreateChildPanel: function(compile, element, scope, parentId, childs) {
			for (var index in childs) {
                var child = childs[index];
                if (child.type == 'Object' || child.type == 'Array') {
                    newChildPanel(compile, element, scope, parentId, child);
                }
            }
	    },
	    deleteProperty: function(childs, name) {
	        var findIndex = -1;
	        for (var index in childs) {
	            if (childs[index].name == name) {
	                findIndex = index;
	            }
	        }
	        if (findIndex >= 0) {
	            childs.splice(findIndex, 1);
	        }
	    }
	};
});