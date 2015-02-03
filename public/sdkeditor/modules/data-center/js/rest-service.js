dataCenter.factory('restService', function ($http) {
	var saveScript = function(script, success, error) {
		$http.post('/sdkeditor/api/scripts', script).success(function(data){
	    	success(data);
	  	}).error(function(data, status, headers, config) {
	  		error(data);
	  	});
	};
	var deleteScript = function(id, success, error) {
		$http.delete('/sdkeditor/api/scripts/' + id).success(function(data){
	    	success();
	  	}).error(function(data, status, headers, config) {
	  		error(data);
	  	});
	};
	var saveFolder = function(folder, success, error) {
		$http.post('/sdkeditor/api/scriptsfolder', folder).success(function(data){
	    	success(data);
	  	}).error(function(data, status, headers, config) {
	  		error(data);
	  	});
	};
	var deleteFolder = function(id, success, error) {
		$http.delete('/sdkeditor/api/scriptsfolder/' + id).success(function(data){
	    	success();
	  	}).error(function(data, status, headers, config) {
	  		error(data);
	  	});
	};
	var refreshScripts = function(callback) {
		$http.get('/sdkeditor/api/scriptsfolder').success(function(serverFolders) {
			scriptByFolderId = {};
			forderList = serverFolders.sort(function(obj1, obj2) {
				if (obj1.title == obj2.title) {
					return 0;
				} else if (obj1.title > obj2.title) {
					return 1;
				} else {
					return -1;
				}
			});

			$http.get('/sdkeditor/api/scripts').success(function(scriptList) {
				scriptList.forEach(function(script) {
					var date = new Date(script.date);
					script.readableDate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes();
					var folderScriptList = scriptByFolderId[script.folder];
					if (!folderScriptList) {
						folderScriptList = [];
						scriptByFolderId[script.folder] = folderScriptList;
					}
					folderScriptList.push(script);
				});

				if (callback) {
					callback(forderList, scriptByFolderId);
				}
			});
		});
	};
	var loadScript = function(scriptId, callback) {
		$http.get('/sdkeditor/api/scripts', {
    			params: { id: scriptId }
			}).success(function(script) {
				callback(script);
			});
	};

	var scriptByFolderId;
	var forderList;

	return {
		getScript: function(folderId, index) {
			return scriptByFolderId[folderId][index];
		},
		loadScript: function(scriptId, callback) {
			loadScript(scriptId, callback);
		},
		listServerScripts: function(success, error) {
			refreshScripts(success);
		},
		saveScript: function(script, success, error) {
			saveScript(script, success, error);
		},
		deleteScript: function(id, success, error) {
			deleteScript(id, success, error);
		},
		saveFolder: function(folder, success, error) {
			saveFolder(folder, success, error);
		},
		deleteFolder: function(id, success, error) {
			deleteFolder(id, success, error);
		}
	};
});