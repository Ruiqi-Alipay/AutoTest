var device = angular.module('mobile-simulater', ['colorpicker.module', 'data-center']);

device.directive("android", function($compile, $rootScope, styleService) {
  	return {
    	restrict: "A",
    	replace: true,
        scope: true,
    	templateUrl: "modules/android/templates/android.html",
    	link: function (scope, element, attr) {
            var updateActivityStyle = function(popupwin) {
                if (popupwin) {
                    scope.style['width'] = '80%';
                    scope.style['height'] = '';
                    scope.style['align-self'] = 'center';
                    scope.style['background'] = 'white';
                    scope.style['border-radius'] = '4px';
                    scope.style['-moz-box-shadow'] = '0 0 5px 5px #C0C0C0';
                    scope.style['-webkit-box-shadow'] = '0 0 5px 5px #C0C0C0';
                    scope.style['box-shadow'] = '0 0 5px 5px #C0C0C0';
                    scope.style['margin'] = 'auto auto';
                    scope.style['padding-top'] = '0px';
                } else {
                    scope.style['width'] = '100%';
                    scope.style['max-width'] = '100%';
                    scope.style['height'] = '100%';
                    scope.style['max-height'] = '100%';
                    scope.style['background'] = '#eee';
                    scope.style['border-radius'] = '';
                    scope.style['-moz-box-shadow'] = '';
                    scope.style['-webkit-box-shadow'] = '';
                    scope.style['box-shadow'] = '';
                    scope.style['margin'] = '';
                    scope.style['padding-bottom'] = '58px';
                }
            };
            scope.style = styleService.getWidgetStyle('root');
            styleService.setupViewListener($compile, scope, element.find(".activity"), 'root', 'block');
            scope.$on('display:refresh', function(event, actionBar, moduleHierarchy) {
                var activity = element.find(".activity");
                activity.html('');
                scope.style = dataService.getModuleCssStyle('root');
                styleService.refresh(moduleHierarchy);
                dataService.recursiveProcessView($compile, scope, activity, moduleTree.value);
            });
            scope.$on('display:highlisht', function(event, elementId) {

            });

            scope.$on('sdk:moduleLoaded', function(event) {
                var target = element.find(".activity");
                dataService.recursiveProcessView($compile, scope, target, 'root');
                scope.formParameters = dataService.getSelectedFormParameters();
            });

            updateActivityStyle(false);
	    }
  	};
});