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

  // var loggedUSer = {};
  // loggedUSer = accountService.getuser();
  // if (angular.isDefined(loggedUSer))
  //     $scope.username = loggedUSer.username;
  // $scope.isLoggedIn = sessionService.isLoggedIn;
  // $scope.logout = sessionService.logout;
  $scope.logout = function() {
    chatSocket.then(function(socket) {  
      socket.disconnect();
    });
    AuthService.logout();
    $state.go('login');
  };

};