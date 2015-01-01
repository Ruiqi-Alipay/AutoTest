var autotestApp = angular.module("autotestApp", ['nvd3', 'ngRoute']);

autotestApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'templates/editor-panel.html',
                controller  : 'editorController'
            })
            .when('/manage', {
                templateUrl : 'templates/manage-panel.html',
                controller  : 'manageController'
            })
            .when('/report', {
                templateUrl : 'templates/report-panel.html',
                controller  : 'reportController'
            })
            .when('/guide', {
                templateUrl : 'templates/guide-panel.html',
                controller  : 'guideController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

autotestApp.directive('customOnChange', function() {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var onChangeFunc = element.scope()[attrs.customOnChange];
      element.bind('change', onChangeFunc);
    }
  };
});