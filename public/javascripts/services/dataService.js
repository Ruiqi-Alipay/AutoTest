var autotestApp = angular.module("autotestApp");

autotestApp.factory("dataService", function($rootScope, $timeout, $http) {
	var serverScripts = [];
	var selectIndex;

	$http.get('/api/testscript').success(function(array) {
		if (array) {
			serverScripts.length = 0;
			array.forEach(function(value) {
				serverScripts.push(value);
			});
		}
	});

	return {
		getServerScript: function() {
			return serverScripts;
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
		}
	};
});