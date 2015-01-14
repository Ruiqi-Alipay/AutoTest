var device = angular.module('mobile-simulater', ['colorpicker.module', 'data-center']);

device.directive("android", function($compile, $rootScope, styleService) {
  	return {
    	restrict: "A",
    	replace: true,
        scope: true,
    	templateUrl: "modules/android/templates/android.html",
    	link: function (scope, element, attr) {
            var activity = element.find(".activity");

            styleService.setupViewListener($compile, scope, element.find(".activity"), 'root', 'block');
            scope.$on('display:refresh', function(event) {
                activity.html('');
                scope.style = styleService.refreshActivity($compile, scope, activity);
                scope.actionbar = styleService.refreshActionbar();
            });
            scope.$on('display:highlisht', function(event, elementId) {
                styleService.highlightWidget(elementId);
            });
            scope.$on('display:actionbar:change', function(event) {
                scope.style = styleService.refreshActivity($compile, scope, activity);
                scope.actionbar = styleService.refreshActionbar();
            });

            scope.style = styleService.refreshActivity($compile, scope, activity);
            scope.actionbar = styleService.refreshActionbar();
	    }
  	};
});