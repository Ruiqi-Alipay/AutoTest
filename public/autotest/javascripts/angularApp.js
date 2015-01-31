var autotestApp = angular.module("autotestApp", ['ngRoute', 'ngAnimate', 'angularFileUpload']);

autotestApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'templates/editor-panel.html',
                controller  : 'editorController'
            })
            .when('/manage', {
                templateUrl : 'templates/script-manage-panel.html',
                controller  : 'manageController'
            })
            .when('/parameter', {
                templateUrl : 'templates/parameter-panel.html',
                controller  : 'parameterController'
            })
            .when('/app_manage', {
                templateUrl : 'templates/app-manage-panel.html',
                controller  : 'appManageController'
            })
            .when('/report_manage', {
                templateUrl : 'templates/report-manage-panel.html',
                controller  : 'reportManageController'
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