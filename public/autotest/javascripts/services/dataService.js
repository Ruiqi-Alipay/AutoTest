var autotestApp = angular.module("autotestApp");

autotestApp.factory("dataService", function($rootScope, $timeout, $http) {
	var serverScripts = [];
	var selectIndex;
	var selectReport;

	$http.get('/autotest/api/testscript').success(function(array) {
		if (array) {
			serverScripts.length = 0;
			array.forEach(function(value) {
				serverScripts.push(value);
			});
		}
	});

	return {
		selectReport: function(report) {
			selectReport = report;
		},
		getSelectReport: function() {
			return selectReport;
		},
		getServerScript: function() {
			return serverScripts;
		},
		getServerReport: function(success, failed) {
			$http.get('/autotest/api/testreport').success(success);
		},
		getSelectIndex: function() {
			return selectIndex;
		},
		setSelectIndex: function(index) {
			selectIndex = index;
		},
		deleteScript: function(index) {
			var deleteItem = serverScripts.splice(index, 1);
			$http.delete('/autotest/api/testscript/' + deleteItem[0]._id).success(function(data){
	    	
	  		});
		},
		deleteReport: function(report) {
			$http.delete('/autotest/api/testreport/' + report[0]._id).success(function(data){
	    	
	  		});
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
		},
		getReportData: function(file, index, callback) {
			$http.get('/autotest/api/reportdata?file=' + encodeURIComponent(file) + '&index=' + index).success(callback);
		}
	};
});