'use strict';
/*jshint -W117 */
/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */

var App = angular.module('datacityApp');

//Der Service hilft, um die Logindaten über alle Controller hinweg zu realisieren
App.service('sharedLogin', function() {
    
    // Aus Testzwecken ist man immer eingeloggt
	var username = "a";
    var password = "a";
	// */
    
    /* SPÄTER WIEDER REIN NEHMEN!!!
    //var username;
    //var password;
    !!!!!!!!!!!*/
    
    var loggedIn = false;

    return {
        getUsername: function() {
            return username;
        },
        getPassword: function() {
            return password;
        },
		login: function(usernameInput, passwordInput) {
            username = usernameInput;
            password = passwordInput;
            loggedIn = true;
        },
		logout: function() {
            username = "";
			password = "";
			loggedIn = false;
        },
		getLoggedIn: function() {
			return loggedIn;
		}
    };
});

App.controller('LoginCtrl', function ($scope, $rootScope, $log, sharedLogin) {
    
    /* SPÄTER WIEDER REIN NEHMEN!!!
    $rootScope.loggedIn = sharedLogin.getLoggedIn();
    $rootScope.username = sharedLogin.getUsername();
    !!!!!!!!!!!!!!!!!!*/
    
    //zu Testzwecken:
    $rootScope.loggedIn = true;
    $rootScope.username = "a";    
	
	$scope.login = function (usernameInput, passwordInput) {
		//Führt den Service zum Login aus
		sharedLogin.login(usernameInput, passwordInput);
        $scope.refreshRootScope();
	};

	$scope.logout = function () {
        sharedLogin.logout();
        $scope.refreshRootScope();
	};
    
    $scope.refreshRootScope = function () {
        $rootScope.loggedIn = sharedLogin.getLoggedIn();
        $rootScope.username = sharedLogin.getUsername(); 
    };
});