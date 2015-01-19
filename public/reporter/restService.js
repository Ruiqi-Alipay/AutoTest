reporterApp.factory("restService", function($http) {
	return {
		getReport: function(title, callback) {
			$http.get('/reporter/api/testreport?title=' + encodeURIComponent(title)).success(callback);
		},
		getReportData: function(file, index, callback) {
			$http.get('/reporter/api/reportdata?file=' + encodeURIComponent(file) + '&index=' + index).success(callback);
		}
	};
});