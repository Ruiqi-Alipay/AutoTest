var autotestApp = angular.module("autotestApp");

autotestApp.factory("dataService", function($rootScope, $timeout, $http) {
	var serverScripts = [];
	var serverReports = [];
	var selectIndex;

	$http.get('/autotest/api/testscript').success(function(array) {
		if (array) {
			serverScripts.length = 0;
			array.forEach(function(value) {
				serverScripts.push(value);
			});
		}
	});
	$http.get('/autotest/api/testreport').success(function(array) {
		if (array) {
			serverReports.length = 0;
			array.forEach(function(value) {
				serverReports.push(value);
			});
		}
	});

	return {
		getServerScript: function() {
			return serverScripts;
		},
		getServerReport: function() {
			return serverReports;
		},
		getSelectIndex: function() {
			return selectIndex;
		},
		setSelectIndex: function(index) {
			selectIndex = index;
		},
		deleteAtindex: function(index) {
			return serverScripts.splice(index, 1);
		},
		downloadScript: function(index) {
			var selectScript = serverScripts[index];
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(selectScript.content));
			pom.setAttribute('download', selectScript.title + ".json");
			pom.click();
		},
		downloadReport: function(index) {
			var selectReport = serverReports[index];
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(selectReport.content));
			pom.setAttribute('download', selectReport.title + ".json");
			pom.click();
		}
	};
});