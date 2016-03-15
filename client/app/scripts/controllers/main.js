/**
 *
 * appCtrl
 *
 */

angular
    .module('homer')
    .controller('appCtrl', appCtrl);

function appCtrl($http, $scope, $state, AuthService, AUTH_EVENTS, chatSocket) {

	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
		AuthService.logout();
		$state.go('login');
		toastr.warning('Session Lost', 'Sorry, You have to login again.');
	});

    $scope.logout = function() {
        chatSocket.then(function(socket) {  
            socket.disconnect();
        });
        AuthService.logout();
        $state.go('login');
    };

};