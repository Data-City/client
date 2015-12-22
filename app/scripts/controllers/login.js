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
	
    /**
     * Loggt den Nutzer ein, falls die Daten korrekt sind
     * 
     * @param usernameInput Der eingegebene Benutzername
     * @param passwordInput Das eingegebene Passwort
     */
	$scope.login = function (usernameInput, passwordInput) {
		//Führt den Service zum Login aus
		sharedLogin.login(usernameInput, passwordInput);
        $scope.refreshRootScope();
        //Direkte Weiterlung zu den Datensätzen
		window.location="#/data";
	};

    /**
     * Loggt den Nutzer aus
     */
	$scope.logout = function () {
        sharedLogin.logout();
        $scope.refreshRootScope();
	};
    
    /**
     * Aktualisiert die Anzeige
     */
    $scope.refreshRootScope = function () {
        $rootScope.loggedIn = sharedLogin.getLoggedIn();
        $rootScope.username = sharedLogin.getUsername(); 
    };
});