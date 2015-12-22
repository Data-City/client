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
        /**
         * @return der Nutzername des eingeloggten Nutzers
         */
      getUsername: function () {
        return username;
      },
      /**
       * @return gibt das Password des eingeloggten Nutzers zurück
       */
      getPassword: function () {
        return password;
      },
      
    /**
     * Loggt den Nutzer ein, falls die Daten korrekt sind
     * 
     * @param usernameInput Der eingegebene Benutzername
     * @param passwordInput Das eingegebene Passwort
     */
      login: function (usernameInput, passwordInput) {
        username = usernameInput;
        password = passwordInput;
        loggedIn = true;
      },
     /**
     * Loggt den Nutzer aus
     */
      logout: function () {
        username = "";
        password = "";
        loggedIn = false;
      },
      /**
       * @return Gibt zurück, ob jemand eingeloggt ist oder nicht
       */
      getLoggedIn: function () {
        return loggedIn;
      }
    };
  });