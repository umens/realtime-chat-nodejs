/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */

$(document).ready(function () {

    // Set minimal height of #wrapper to fit the window
    setTimeout(function () {
        fixWrapperHeight();
    }, 300);

    // Add special class to minimalize page elements when screen is less than 768px
    setBodySmall();
});

$(window).bind("load", function () {

    // Remove splash screen after load
    $('.splash').css('display', 'none');

})

$(window).bind("resize click", function () {

    // Add special class to minimalize page elements when screen is less than 768px
    setBodySmall();

    // Waint until metsiMenu, collapse and other effect finish and set wrapper height
    setTimeout(function () {
        fixWrapperHeight();
    }, 300);
})

function fixWrapperHeight() {

    // Get and set current height
    var headerH = 62;
    var navigationH = $("#navigation").height();
    var contentH = $(".content").height();

    // Set new height when contnet height is less then navigation
    if (contentH < navigationH) {
        $("#wrapper").css("min-height", navigationH + 'px');
    }

    // Set new height when contnet height is less then navigation and navigation is less then window
    if (contentH < navigationH && navigationH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH  + 'px');
    }

    // Set new height when contnet is higher then navigation but less then window
    if (contentH > navigationH && contentH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
    }

}

function setBodySmall() {
    if ($(this).width() < 769) {
        $('body').addClass('page-small');
    } else {
        $('body').removeClass('page-small');
        $('body').removeClass('show-sidebar');
    }
}
'use strict';

/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */
(function () {
    angular.module('homer', [
	    'ui.router',                // Angular flexible routing
	    'ui.bootstrap',             // AngularJS native directives for Bootstrap
	    'ngAnimate',                 // Angular animations
    	'ngCookies',
    	'btford.socket-io'    	
	])
})();


/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */

function configState($stateProvider, $urlRouterProvider, $compileProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise("/login");
    $stateProvider

        // register
        .state('register', {
            url: "/register",
            templateUrl: "views/register.html",
            controller: 'RegisterCtrl',
            data: {
                pageTitle: 'Register',
                specialClass: 'blank'
            }
        })

        // login
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl',
            data: {
                pageTitle: 'Login',
                specialClass: 'blank'
            }
        })

        // App views
        .state('app_views', {
            //url: "/app_views",
            templateUrl: "views/common/content.html",
            data: {
                pageTitle: 'App Views'
            }
        })
        // chat
        .state('app_views.chat', {
            url: "/chat",
            templateUrl: "views/chat_view.html",
            controller: 'ChatCtrl',
            data: {
                pageTitle: 'Chat',
                pageDesc: 'Create a chat room in your app'
            }
        })
}

angular
    .module('homer')
    .config(configState)
    .run(function($rootScope, $state, $cookieStore, AuthService, AUTH_EVENTS) {
        $rootScope.$state = $state;
        $rootScope.globals = $cookieStore.get('globals') || {};
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            if (!AuthService.isAuthenticated()) {
                if (next.name !== 'login' && next.name !== 'register') {
                    event.preventDefault();
                    $state.go('login');
                }
            }
        });
    });

// Toastr options
toastr.options = {
    "debug": false,
    "newestOnTop": false,
    "positionClass": "toast-top-center",
    "closeButton": true,
    "toastClass": "animated fadeInDown",
};
/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

angular
    .module('homer')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('minimalizaMenu', minimalizaMenu)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('panelTools', panelTools)
    .directive('panelToolsFullscreen', panelToolsFullscreen)
    .directive('smallHeader', smallHeader)
    .directive('animatePanel', animatePanel)
    .directive('landingScrollspy', landingScrollspy)

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title
                var title = 'HOMER | AngularJS Responsive WebApp';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'HOMER | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            element.metisMenu();

            // Colapse menu in mobile mode after click on element
            var menuElement = $('#side-menu a:not([href$="\\#"])');
            menuElement.click(function(){

                if ($(window).width() < 769) {
                    $("body").toggleClass("show-sidebar");
                }
            });


        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaMenu($rootScope) {
    return {
        restrict: 'EA',
        template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
        controller: function ($scope, $element) {

            $scope.minimalize = function () {
                if ($(window).width() < 769) {
                    $("body").toggleClass("show-sidebar");
                } else {
                    $("body").toggleClass("hide-sidebar");
                }
            }
        }
    };
};


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function() {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function() {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
}


/**
 * panelTools - Directive for panel tools elements in right corner of panel
 */
function panelTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/panel_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                var body = hpanel.find('div.panel-body');
                var footer = hpanel.find('div.panel-footer');
                body.slideToggle(300);
                footer.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                hpanel.toggleClass('').toggleClass('panel-collapse');
                $timeout(function () {
                    hpanel.resize();
                    hpanel.find('[id^=map-]').resize();
                }, 50);
            },

                // Function for close ibox
                $scope.closebox = function () {
                    var hpanel = $element.closest('div.hpanel');
                    hpanel.remove();
                }

        }
    };
};

/**
 * panelToolsFullscreen - Directive for panel tools elements in right corner of panel with fullscreen option
 */
function panelToolsFullscreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/panel_tools_fullscreen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                var body = hpanel.find('div.panel-body');
                var footer = hpanel.find('div.panel-footer');
                body.slideToggle(300);
                footer.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                hpanel.toggleClass('').toggleClass('panel-collapse');
                $timeout(function () {
                    hpanel.resize();
                    hpanel.find('[id^=map-]').resize();
                }, 50);
            };

            // Function for close ibox
            $scope.closebox = function () {
                var hpanel = $element.closest('div.hpanel');
                hpanel.remove();
            }

            // Function for fullscreen
            $scope.fullscreen = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                $('body').toggleClass('fullscreen-panel-mode');
                icon.toggleClass('fa-expand').toggleClass('fa-compress');
                hpanel.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }

        }
    };
};

/**
 * smallHeader - Directive for page title panel
 */
function smallHeader() {
    return {
        restrict: 'A',
        scope:true,
        controller: function ($scope, $element) {
            $scope.small = function() {
                var icon = $element.find('i:first');
                var breadcrumb  = $element.find('#hbreadcrumb');
                $element.toggleClass('small-header');
                breadcrumb.toggleClass('m-t-lg');
                icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
            }
        }
    }
}

function animatePanel($timeout,$state) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            //Set defaul values for start animation and delay
            var startAnimation = 0;
            var delay = 0.06;   // secunds
            var start = Math.abs(delay) + startAnimation;

            // Store current state where directive was start
            var currentState = $state.current.name;

            // Set default values for attrs
            if(!attrs.effect) { attrs.effect = 'zoomIn'};
            if(attrs.delay) { delay = attrs.delay / 10 } else { delay = 0.06 };
            if(!attrs.child) { attrs.child = '.row > div'} else {attrs.child = "." + attrs.child};

            // Get all visible element and set opactiy to 0
            var panel = element.find(attrs.child);
            panel.addClass('opacity-0');

            // Count render time
            var renderTime = panel.length * delay * 1000 + 700;

            // Wrap to $timeout to execute after ng-repeat
            $timeout(function(){

                // Get all elements and add effect class
                panel = element.find(attrs.child);
                panel.addClass('stagger').addClass('animated-panel').addClass(attrs.effect);

                var panelsCount = panel.length + 10;
                var animateTime = (panelsCount * delay * 10000) / 10;

                // Add delay for each child elements
                panel.each(function (i, elm) {
                    start += delay;
                    var rounded = Math.round(start * 10) / 10;
                    $(elm).css('animation-delay', rounded + 's');
                    // Remove opacity 0 after finish
                    $(elm).removeClass('opacity-0');
                });

                // Clear animation after finish
                $timeout(function(){
                    $('.stagger').css('animation', '');
                    $('.stagger').removeClass(attrs.effect).removeClass('animated-panel').removeClass('stagger');
                }, animateTime)

            });



        }
    }
}

function landingScrollspy(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}



angular.module('homer')
 
.service('AuthService', function($q, $http, API_ENDPOINT, $cookieStore, $rootScope) {
  var LOCAL_TOKEN_KEY = 'bigSecret_Chuuuuut_DontSayIt';
  var isAuthenticated = false;
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token, user) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
    $rootScope.globals = {
        currentUser: {
            username: user.username,
            _id: user._id,
            token: token
        }
    };
    $cookieStore.put('globals', $rootScope.globals);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    $rootScope.globals = {};
    $cookieStore.remove('globals');
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/auth/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/auth/login', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token, result.data.user);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
  };
})
 
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
angular.module('homer')
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
  url: 'http://'+window.location.host
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});
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
/**
 * @ngdoc function
 * @name homerApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the homerApp
 */
angular
    .module('homer')
    .controller('RegisterCtrl', RegisterCtrl);

function RegisterCtrl($http, $scope, $state, AuthService) {

	var user, signup;

	// Here we're creating a scope for our Signup page.
	// This will hold our data and methods for this page.
	$scope.signup = signup = {};

	// In our signup.html, we'll be using the ng-model
	// attribute to populate this object.
	signup.user = user = {};

	// This is our method that will post to our server.
	$scope.submit = function () {

		user = $scope.signup.user;

		// make sure all fields are filled out...
		// aren't you glad you're not typing out
		// $scope.signup.user.firstname everytime now??
		if (
			!user.firstname ||
			!user.lastname ||
			!user.username ||
			!user.email ||
			!user.password ||
			!user.password2
		) {
			toastr.error('Please fill out all form fields.');
			return false;
		}

		// make sure the passwords match match
		if (user.password !== user.password2) {
			toastr.error('Your passwords must match.');
			return false;
		}

		delete user.password2;

		// Just so we can confirm that the bindings are working
		console.log(user);

		// Make the request to the server ... which doesn't exist just yet
		AuthService.register(user).then(function(msg) {
			$state.go('login');
			toastr.success('Good Job!', 'You are now registered');
		}, function(errMsg) {
			toastr.error('Register failed!', errMsg);
		});

	};

}
/**
 * @ngdoc function
 * @name homerApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the homerApp
 */
angular
    .module('homer')
    .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($http, $scope, $state, AuthService, chatSocket, $rootScope) {

	var user, login;

	// Here we're creating a scope for our Signup page.
	// This will hold our data and methods for this page.
	$scope.login = login = {};

	// In our login.html, we'll be using the ng-model
	// attribute to populate this object.
	login.user = user = {};

	// This is our method that will post to our server.
	$scope.submit = function () {

		user = $scope.login.user;

		// make sure all fields are filled out...
		// aren't you glad you're not typing out
		// $scope.login.user.firstname everytime now??
		if (
			!user.username ||
			!user.password
		) {
			toastr.error('Please fill out all form fields.');
			return false;
		}

		// Just so we can confirm that the bindings are working
		//console.log(user);

		// Make the request to the server ... which doesn't exist just yet
		AuthService.login(user).then(function(msg) {
			$rootScope.$broadcast('authenticated');
			$state.go('app_views.chat');
		}, function(errMsg) {
			toastr.error('Login failed!', errMsg);
		});
		//var request = $http.post('/auth/login', user);

		// request.success(function (data) {
		//     // our json response is recognized as
		//     // the data parameter here. See? Our msg
		//     // value is right there!
		//     //toastr.success('Success - '+data.msg);
		//     $location.path('/dashboard');
		// });

		// request.error(function (data) {
		//     console.log();
		//     toastr.error(data.msg);
		// });

	};

}
/**
 * @ngdoc function
 * @name homerApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the homerApp
 */
angular
    .module('homer')
    .controller('ChatCtrl', ChatCtrl);

function ChatCtrl($http, $scope, $timeout, chatSocket, $rootScope) {

	$scope.messages = {};
    $scope.users_online = [];
    $scope.current_user = $rootScope.globals.currentUser;
    $scope.live = {typing: false, usernames: []};
    $scope.personCount = 0;
    var typing = false;  
    var timeout = undefined;

	// Make the request to the server ... which doesn't exist just yet
	var request = $http.get('/messages');

	request.success(function (data) {
	    // our json response is recognized as
	    // the data parameter here. See? Our msg
	    // value is right there!
	    //console.log(data);
	    $scope.messages = data.messages;
	});

	request.error(function (data) {
	    console.log(data);
	});

    chatSocket.then(function(socket) {
        socket.connect();

        socket.on('on_connect', function(online_user) {
            addAllUsersOnline(online_user);
        });

        socket.emit('nouveau_client');

        socket.on('message', function(data) {
            insereMessage(data);
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 0);
        });

        socket.on('client_connected', function(pseudo) {
            toastr.info(pseudo + ' a rejoint le Chat !');
            addUsersOnline(pseudo);
        });

        socket.on('client_disconnect', function(pseudo) {
            toastr.info(pseudo + ' a quitté le Chat !');
            removeUsersOnline(pseudo);
        });

        socket.on("isTyping", function(data) {
            if (data.isTyping) {
                if ($scope.live.usernames.length === 0) {
                    $scope.live.typing = true;
                }
                timeout = setTimeout(timeoutFunction, 5000);
                addUsersTyping(data.person);
            } else {
                removeUsersTyping(data.person);
                if($scope.live.usernames.length === 0){
                    $scope.live.typing = false;
                }
            }
            $scope.personCount = $scope.live.usernames.length;
        });
    });


    // Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
    $scope.submit = function () {
        var message = {message: $scope.iotext, date: Date.now(), author: $rootScope.globals.currentUser};
        $scope.iotext = '';
        chatSocket.then(function(socket) {
            socket.emit('message', message); // Transmet le message aux autres
        });
        $scope.messages.push(message); //insereMessage(message, true); // Affiche le message aussi sur notre page
        return false; // Permet de bloquer l'envoi "classique" du formulaire
    };
    

    function addUsersOnline(pseudo){
        $scope.users_online.push(pseudo);
    }
    function addAllUsersOnline(pseudoArray){
        $scope.users_online = pseudoArray;
    }
    function removeUsersOnline(pseudo){
        var index = $scope.users_online.indexOf(pseudo);
        if (index > -1) {
            $scope.users_online.splice(index, 1);
        }
    }
    function addUsersTyping(pseudo){
        $scope.live.usernames.push(pseudo);
    }
    function removeUsersTyping(pseudo){
        var index = $scope.live.usernames.indexOf(pseudo);
        if (index > -1) {
            $scope.live.usernames.splice(index, 1);
        }
    }
    // Ajoute un message dans la page
    function insereMessage(message) {
        $scope.messages.push(message);
    }
    function timeoutFunction() {  
        typing = false;
        chatSocket.then(function(socket) {
            socket.emit("typing", false);
        });
    }

    $(".chat-discussion").bind("DOMSubtreeModified",function() {  
        $(".chat-discussion").animate({
            scrollTop: $(".chat-discussion")[0].scrollHeight
        });
    });

    $("#iotext").keypress(function(e){
        if (e.which !== 13) {
            if (typing === false && $("#iotext").is(":focus")) {
                typing = true;
                chatSocket.then(function(socket) {
                    socket.emit("typing", true);
                });
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(timeoutFunction, 2000);
            }
        }
    });

}
/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

angular
    .module('homer')
    .factory('chatSocket', function (socketFactory, $rootScope, $window, $q, $timeout) {

	var chatSocket = $q.defer();
	// listen for the authenticated event emitted on the rootScope of 
	// the Angular app. Once the event is fired, create the socket and resolve
	// the promise.
	$rootScope.$on('authenticated', function() {
		var host = window.location.host;
	    
	    // resolve in another digest cycle
	    $timeout(function() {
	        // create the socket
	        var newSocket = (function() {

	            return socketFactory({
	        
	              	ioSocket: io.connect('', {
	                	//'force new connection': true,
	                	path: '',
	                	prefix: '',
	                	autoConnect: false,
	                	query: 'token=' + $rootScope.globals.currentUser.token.substring(4)
	                })
	            });
	        })();
	        
	        // resolve the promise
	        chatSocket.resolve(newSocket);
	    });
	});
	// return the promise
	return chatSocket.promise;
});
// .factory('chatSocket', function (socketFactory, $rootScope) {
//       var socket = socketFactory({
	        
// 	              	ioSocket: io.connect('', {
// 	                	//'force new connection': true,
// 	                	path: '',
// 	                	prefix: '',
// 	                	//query: 'token=' + $rootScope.globals.currentUser.token
// 	                })
// 	            });
//       socket.forward('broadcast');
//       return socket;
//   });