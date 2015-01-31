var autotestApp = angular.module("autotestApp");

autotestApp.controller("parameterController", function($scope, $rootScope, $http) {
	$scope.appContext.tabSelect = 3;
	$scope.parameters;

	var refresh = function() {
		$http.get('/autotest/api/scriptparameter').success(function(params) {
			$scope.parameters = params;
		});
	};

	$scope.deleteItem = function(index) {
		var item = $scope.parameters[index];
		if (item._id) {
			$http.delete('/autotest/api/scriptparameter/' + item._id).success(function(data){
				$scope.parameters.splice(index, 1);
	  		});
		} else {
			$scope.parameters.splice(index, 1);
		}
	};

	$scope.saveItem = function(index) {
		var item = $scope.parameters[index];
		$http.post('/autotest/api/scriptparameter', item).success(function(data){
			if (data.error) {
				$rootScope.$broadcast('toastMessage', data.error);
			} else {
				$rootScope.$broadcast('toastMessage', '保存成功');
				refresh();
			}
	  	}).error(function(data, status, headers, config) {
	  		$rootScope.$broadcast('toastMessage', '保存失败：' + data);
	  	});
	};

	$scope.addItem = function() {
		$scope.parameters.splice(0, 0, {
			name: '',
			value: ''
		})
	};

	refresh();
});