var autotestApp = angular.module("autotestApp");

autotestApp.controller("reportManageController", function($rootScope, $scope, $upload, $location, $window, dataService) {
	$scope.appContext.tabSelect = 5;
	$scope.reportByDays = [];
	var refresh = function() {
		dataService.getServerReport(function(reports) {
			$scope.reportByDays.length = 0;
			var lastDateTitle;
			var workingArray;
			reports.forEach(function(report) {
				var date = new Date(report.date);
				var dateTitle = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
				if (!lastDateTitle || lastDateTitle != dateTitle) {
					workingArray = [];
					$scope.reportByDays.push({
						title: dateTitle,
						reports: workingArray
					});
				}
				
				workingArray.push(report);
			});
		});
	};

	$scope.viewProfermenceReport = function(type, dayIndex, index) {
		var title = $scope.reportByDays[dayIndex].reports[index].title;
		$window.open($location.$$protocol + '://' + $location.$$host
			+ '/reporter#?title=' + encodeURIComponent(title) + '&type=' + type, '_blank');
	};

	$scope.viewTaskReport = function(dayIndex, index) {
		var title = $scope.reportByDays[dayIndex].reports[index].title;
		$window.open($location.$$protocol + '://' + $location.$$host + '/reporter/reports/' + encodeURIComponent(title) + '/index.html', '_blank');
	};

	$scope.deleteReport = function(dayIndex, index) {
		var deleteItem = $scope.reportByDays[dayIndex].reports[index];
		dataService.deleteReport(deleteItem, function() {
			refresh();
		});
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