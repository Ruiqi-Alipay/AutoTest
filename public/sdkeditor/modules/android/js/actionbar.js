device.directive("actionbar", function(dataService) {
  	return {
    	restrict: "A",
    	replace: true,
    	templateUrl: "modules/android/templates/action_bar.html",
    	link: function (scope, element, attr) {
    		scope.$on('sdk:actionBarChange', function(event) {
                var data = dataService.getSelectedFormParameters();
                if (data.form) {
                    scope.bar = data.form.actionBar;
                } else {
                    scope.bar = undefined;
                }
            }, true);
	    }
  	};
});