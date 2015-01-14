device.directive("comboxSelector", function($compile, dataService, styleService) {
	return {
		testrict: "A",
		replace: true,
		scope: true,
		templateUrl: "modules/android/templates/view_combox.html",
		link: function(scope, element, attr) {
    		scope.style = styleService.getWidgetStyle(attr.elementId);
    		styleService.setupViewListener($compile, scope, element, attr.elementId, attr.type);
		}
	};
});