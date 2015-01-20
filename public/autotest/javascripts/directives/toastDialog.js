var autotestApp = angular.module("autotestApp");

autotestApp.directive("toastDialog", function($compile, dataService) {
  	return {
    	restrict: "A",
    	replace: true,
    	scope: true,
    	templateUrl: 'templates/toast-dialog.html',
    	link: function (scope, element, attr) {
    		scope.$on('toastMessage', function(event, message) {
    			scope.message = message;
    			element.modal('show');
    		});
            scope.$on('closeDialog', function(event, message) {
                element.modal('hide');
            });
    	}
    };
});