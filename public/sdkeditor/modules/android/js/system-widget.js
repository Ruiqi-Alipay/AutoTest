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
            } else if (tAttrs.type === "img" || tAttrs.type === 'icon') {
				return "modules/android/templates/view_img.html";
			} else if (tAttrs.type === "component"){
				return "modules/android/templates/view_component.html";
			} else if (tAttrs.type === 'password' || tAttrs.type === 'input') {
                return "modules/android/templates/view_input.html";
            } else if (tAttrs.type === 'spassword') {
                return "modules/android/templates/view_spassword.html";
            } else if (tAttrs.type === 'checkbox') {
                return "modules/android/templates/view_checkbox.html";
            } else {
				return "modules/android/templates/view_block.html";
			}
    	},
    	link: function (scope, element, attr) {
    		scope.style = styleService.getWidgetStyle(attr.elementId);
            styleService.setupViewListener($compile, scope, element, attr.elementId, attr.type);
            styleService.branchCreateWidget($compile, scope, element, attr.elementId);
	    }
  	};
});