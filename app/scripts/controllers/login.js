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
        //Direkte Weiterlung zu den Datensätzen
		window.location="#/data";
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