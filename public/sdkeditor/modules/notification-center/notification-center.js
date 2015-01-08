var notificationCenter = angular.module('notification-center', ['']);

notificationCenter.directive('notifactionPanel', function() {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		templateUrl: 'modules/notification-center/templates/notificationCenter.html',
		link: function(scope, element, attr) {
			scope.$on('notification:toast', function(event, message) {
				scope.message = message;
				element.modal('show');
			});
		}
	};
});