var autotestApp = angular.module("autotestApp");

autotestApp.controller("reportManageController", function($rootScope, $scope, $upload, $location, $window, dataService) {
	$scope.appContext.tabSelect = 5;
	var refresh = function() {
		dataService.getServerReport(function(array) {
			$scope.reports = array;
		});
	};

	$scope.viewProfermenceReport = function(type, index) {
		$window.open($location.$$protocol + '://' + $location.$$host
			+ '/reporter#?title=' + encodeURIComponent($scope.reports[index].title) + '&type=' + type, '_blank');
	};

	$scope.viewTaskReport = function(index) {
		$window.open($location.$$protocol + '://' + $location.$$host + '/reporter/reports/' + encodeURIComponent($scope.reports[index].title) + '/index.html', '_blank');
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
               if (evt.loaded === evt.total) {
               	 $rootScope.$broadcast('toastMessage', 'Generating report, please wait a few second..');
               }
            }).success(function (data, status, headers, config) {
               refresh();
               $rootScope.$broadcast('closeDialog');
            }).error(function (data, status, headers, config) {
               $rootScope.$broadcast('toastMessage', 'upload failde: ' + data);
            });
		}
	});

	refresh();
});