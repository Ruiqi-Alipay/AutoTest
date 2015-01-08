device.directive("systemWidget", function($compile, styleService) {
  	return {
    	restrict: "A",
    	replace: true,
    	scope: true,
    	templateUrl: function(tElem, tAttrs) {
			if (tAttrs.type === "button") {
				return "modules/android/templates/view_button.html";
			} else if (tAttrs.type === "label") {
				return "modules/android/templates/view_label.html";
			} else if (tAttrs.type === "link") {
                return "modules/android/templates/view_link.html";
            } else if (tAttrs.type === "img" || data.type === 'icon') {
				return "modules/android/templates/view_img.html";
			} else if (tAttrs.type === "component"){
				return "modules/android/templates/view_component.html";
			} else if (tAttrs.type === 'password' || data.type === 'input') {
                return "modules/android/templates/view_input.html"
            } else if (tAttrs.type === 'spassword') {
                return "modules/android/templates/view_spassword.html"
            } else if (tAttrs.type === 'checkbox') {
                return "modules/android/templates/view_checkbox.html"
            } else {
				return "modules/android/templates/view_block.html";
			}
    	},
    	link: function (scope, element, attr) {
    		scope.style = dataService.getModuleCssStyle(attr.elementId);

            scope.$on('display:delete:' + attr.elementId, function(event) {
                element.remove();
            });

            scope.$on('display:insert:' + attr.elementId, function(event, item) {
                dataService.createView($compile, scope, element, false, item.name, item.type);
            });

            if (attr.type === "component" || attr.type === "block") {
                scope.$on('display:append:' + attr.elementId, function(event, item) {
                    dataService.createView($compile, scope, element, true, item.name, item.type);
                });
            }

            element.bind('click', function (event) {
                e.stopPropagation();
                styleService.highlightWidget(attr.elementId);
            })

            if (scope.module.value) {
                dataService.recursiveProcessView($compile, scope, element, attr.elementId);
            }
	    }
  	};
});