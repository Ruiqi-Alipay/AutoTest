var autotestApp = angular.module("autotestApp");

autotestApp.controller("guideController", function($scope) {
	$scope.appContext.tabSelect = 6;

	$scope.downloadEnv = function(envType) {
		var href;
		if (envType == 'win-env') {
			href = 'http://autotest.d10970aqcn.alipay.net/environment/environment.rar';
		} else if (envType == 'mac-env') {
			href = 'http://autotest.d10970aqcn.alipay.net/environment/environment.tar.gz';
		}
		var pom = document.createElement('a');
		pom.setAttribute('href', href);
		pom.click();
	};
});