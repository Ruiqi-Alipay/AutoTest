var autotestApp = angular.module("autotestApp");

autotestApp.controller("reportManageController", function($rootScope, $scope, $upload, $location, dataService) {
	var refresh = function() {
		dataService.getServerReport(function(array) {
			$scope.reports = array;
		});
	};

	$scope.editReport = function(index) {
		dataService.selectReport($scope.reports[index]);
		$location.path('/report');
		$scope.tabSelect = 3;
	};

	$scope.deleteReport = function(index) {
		var deleteItem = $scope.reports.splice(index, 1);
		dataService.deleteReport(deleteItem);
	};

	$scope.$watch('files', function(files) {
		if (files) {
			$rootScope.$broadcast('toastMessage', '报告上传中...');
			$upload.upload({
			  url: '/autotest/api/report',
			  method: 'POST',
			  file: files
			}).progress(function (evt) {
                $rootScope.$broadcast('toastMessage', '报告上传中... ' + parseInt(100.0 * evt.loaded / evt.total) + ' %');
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
            }).error(function (data, status, headers, config) {
                // file failed to upload
                console.log(data);
            });
		}
	});

	refresh();
});