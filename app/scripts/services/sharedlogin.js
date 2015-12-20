'use strict';

/**
 * @ngdoc service
 * @name datacityApp.sharedLogin
 * @description
 * # sharedLogin
 * Der Service hilft, um die Logindaten über alle Controller hinweg zu realisieren
 */
angular.module('datacityApp')
  .service('sharedLogin', function () {
    
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
      getUsername: function () {
        return username;
      },
      getPassword: function () {
        return password;
      },
      login: function (usernameInput, passwordInput) {
        username = usernameInput;
        password = passwordInput;
        loggedIn = true;
      },
      logout: function () {
        username = "";
        password = "";
        loggedIn = false;
      },
      getLoggedIn: function () {
        return loggedIn;
      }
    };
  });