var autotestApp = angular.module("autotestApp");

autotestApp.factory("dataService", function($rootScope, $timeout, $http) {
	var scriptByFolderId = {};
	var folderIdToTitle;
	var folderList = [];
	var configScripts = [];

	var selectScript;
	var selectReport;

	var sortScritps = function(sortType) {
		for (var key in scriptByFolderId) {
			var itemList = scriptByFolderId[key];
			scriptByFolderId[key] = itemList.sort(function(obj1, obj2) {
				if (sortType === '首字母 A-Z') {
					if (obj1.title == obj2.title) {
						return 0;
					} else if (obj1.title > obj2.title) {
						return 1;
					} else {
						return -1;
					}
				} else if (sortType === '首字母 Z-A') {
					if (obj1.title == obj2.title) {
						return 0;
					} else if (obj1.title > obj2.title) {
						return -1;
					} else {
						return 1;
					}
				} else if (sortType === '最近跟新') {
					if (obj1.date == obj2.date) {
						return 0;
					} else if (obj1.date > obj2.date) {
						return -1;
					} else {
						return 1;
					}
				} else if (sortType === '最久更新') {
					if (obj1.date == obj2.date) {
						return 0;
					} else if (obj1.date > obj2.date) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}
	};

	var refreshScripts = function() {
		$http.get('/autotest/api/testscriptfolder').success(function(serverFolders) {
			folderIdToTitle = {};
			configScripts.length = 0;
			folderList.length = 0;
			serverFolders.forEach(function(value) {
				folderList.push(value);
			});
			folderList.push({title: '未分组', _id: 'UNFORDERED'});
			folderList.forEach(function(folder) {
				if (folder._id in scriptByFolderId) {
					scriptByFolderId[folder._id].length = 0;
				} else {
					scriptByFolderId[folder._id] = [];
				}
				folderIdToTitle[folder._id] = folder.title;
			});

			$http.get('/autotest/api/testscript').success(function(scriptList) {
				scriptList.forEach(function(script) {
					var date = new Date(script.date);
					script.readableDate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes();
					if (script.folder in scriptByFolderId) {
						scriptByFolderId[script.folder].push(script);
					} else {
						scriptByFolderId['UNFORDERED'].push(script);
					}
					if (script.type === 'Config') {
						configScripts.push(script);
					}
				});
				sortScritps('首字母 A-Z');
			});
		});
	};

	refreshScripts();

	return {
		getFolderIdToTitleMap: function() {
			return folderIdToTitle;
		},
		getScriptFolderMap: function() {
			return scriptByFolderId;
		},
		getConfigScripts: function() {
			return configScripts;
		},
		getFolderList: function() {
			return folderList;
		},
		selectReport: function(report) {
			selectReport = report;
		},
		getSelectReport: function() {
			return selectReport;
		},
		getServerReport: function(success, failed) {
			$http.get('/autotest/api/testreport').success(success);
		},
		getServerApps: function(success, failed) {
			$http.get('/autotest/api/testapp').success(success);
		},
		getServerScriptById: function(id, success) {
			$http.get('/autotest/api/testscript?id=' + id).success(success);
		},
		getSelectScript: function() {
			return selectScript;
		},
		setSelectScript: function(folderId, index) {
			if (folderId) {
				selectScript = scriptByFolderId[folderId][index];
			} else {
				selectScript = undefined;
			}
		},
		deleteScript: function(folderId, index) {
			var deleteItem = scriptByFolderId[folderId][index];
			$http.delete('/autotest/api/testscript/' + deleteItem._id).success(function(data){
				refreshScripts();
	  		});
		},
		deleteReport: function(report, success) {
			$http.delete('/autotest/api/testreport/' + report._id).success(success);
		},
		downloadScript: function(folderId, index) {
			var script = scriptByFolderId[folderId][index];
			var extention = script.type === 'Script' ? '.json' : '.config';
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(script.content));
			pom.setAttribute('download', script.title + ".json");
			pom.click();
		},
		downloadReport: function(index) {
			var selectReport = serverReports[index];
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(selectReport.content));
			pom.setAttribute('download', selectReport.title + ".json");
			pom.click();
		},
		getReportData: function(file, index, callback) {
			$http.get('/autotest/api/reportdata?file=' + encodeURIComponent(file) + '&index=' + index).success(callback);
		},
		serverDataChanges: function() {
			refreshScripts();
		},
		newEditFolder: function(folder) {
			$http.post('/autotest/api/testscriptfolder', folder).success(function(data){
		    	refreshScripts();
		    	$rootScope.$broadcast('toastMessage', '保存成功');
		  	}).error(function(data, status, headers, config) {
		  		$rootScope.$broadcast('toastMessage', '保存失败：' + data);
		  	});
		},
		deleteFolder: function(folder) {
			$http.delete('/autotest/api/testscriptfolder/' + folder._id).success(function(data){
				refreshScripts();
	  		});
		},
		saveScript: function(script, saveType) {
			var saveItem = {};
			if (selectScript && saveType != '另存为') {
				jQuery.extend(saveItem, selectScript);
			}

			saveItem.title = script.title;
			saveItem.type = script.type;
			saveItem.folder = script.folder;
			saveItem.content = JSON.stringify(script);

			$http.post('/autotest/api/testscript', saveItem).success(function(data){
		    	refreshScripts();
		    	$rootScope.$broadcast('toastMessage', '保存成功');
		  	}).error(function(data, status, headers, config) {
		  		$rootScope.$broadcast('toastMessage', '保存失败：' + data);
		  	});
		},
		sortScriptList: function(sortType) {
			sortScritps(sortType);
		}
	};
});