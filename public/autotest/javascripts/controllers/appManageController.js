var autotestApp = angular.module("autotestApp");

autotestApp.controller("appManageController", function($scope, $rootScope, $upload, $http, dataService) {
	$scope.appContext.tabSelect = 4;
	$scope.app = {};

	var refresh = function() {
		dataService.getServerApps(function(array) {
			$scope.serverApps = array;
		});
	};

	$scope.select = function(files) {
		$scope.app.selectFile = files[0];
		$scope.app.title = $scope.app.selectFile.name;
	};

	$scope.deleteItem = function(index) {
		var item = $scope.serverApps[index];
		$http.delete('/autotest/api/testapp/' + item._id).success(function(data){
			$scope.serverApps.splice(index, 1);
  		});
	};

	$scope.uplaodApp = function() {
		var type;
		if ($scope.app.title.indexOf('.apk') > 0) {
			type = 'Android';
		} else if ($scope.app.title.indexOf('.zip') > 0) {
			type = 'iOS';
		} else {
			$rootScope.$broadcast('toastMessage', 'Incorrect formated app file!');
			return;
		}

		$rootScope.$broadcast('toastMessage', '报告上传中...');
		$upload.upload({
		  url: '/autotest/api/testapp',
		  method: 'POST',
		  data: {
		  	description: $scope.app.description,
		  	type: type
		  },
		  file: $scope.app.selectFile
		}).progress(function (evt) {
           $rootScope.$broadcast('toastMessage', 'APP上传中... ' + parseInt(100.0 * evt.loaded / evt.total) + ' %');
           if (evt.loaded === evt.total) {
           	 $rootScope.$broadcast('toastMessage', 'Uplaod success!');
           }
        }).success(function (data, status, headers, config) {
        	$scope.app = {};
        	refresh();
           $rootScope.$broadcast('closeDialog');
        }).error(function (data, status, headers, config) {
           $rootScope.$broadcast('toastMessage', 'upload failde: ' + data);
        });
	};

	refresh();
});