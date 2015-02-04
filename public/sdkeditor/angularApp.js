var editor = angular.module("editorPage", ['console', 'mobile-simulater']);
var manager = angular.module("managerPage", ['manage-panel']);

var app = angular.module("sdkApp", ['ngRoute', 'ngSanitize', 'editorPage', 'managerPage']);

app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'templates/editor-page.html',
                controller: 'EditorController'
            })
            .when('/manage', {
                templateUrl : 'templates/manage-page.html',
                controller: 'ManageController'
            })
            .when('/protocol', {
                templateUrl : 'templates/configure-page.html',
                controller: 'ConfigureController'
            })
            .when('/guide', {
                templateUrl : 'templates/guide-page.html',
                controller: 'GuideController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

app.controller('EditorController', function($scope) {
    $scope.appContext.tabSelect = 1;
});

app.controller('ManageController', function($scope) {
    $scope.appContext.tabSelect = 2;
});

app.controller('ConfigureController', function($scope, $rootScope, dynamicProtocolService) {
    $scope.appContext.tabSelect = 3;

    $scope.panelIsArray = function() {
        var parentId = dynamicProtocolService.getNewProtocolParent();
        var parent = dynamicProtocolService.getProtocol(parentId);
        if (parent) {
            return parent.type == 'Array';
        }
    };

    $scope.saveProtocol = function() {
        dynamicProtocolService.saveProtocol();
    };

    $scope.saveNewProcotolItem = function(newProtocol) {
        var parentId = dynamicProtocolService.getNewProtocolParent();
        $rootScope.$broadcast('protocol:change:' + parentId, newProtocol);
    };
});

app.controller('GuideController', function($scope) {
    $scope.appContext.tabSelect = 4;
});