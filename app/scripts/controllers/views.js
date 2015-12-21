/* Die globalen Funktionen kommen von lib_view /*
/* global getCollection */
/* global getViews */
/* global updateView */
/* global drawCity */
'use strict';
/*jshint -W117 */
/**
 * @ngdoc function
 * @name datacityApp.controller:ViewsCtrl
 * @description
 * # ViewsCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('ViewsCtrl', function ($scope, $route, $routeParams, $log, $http, $rootScope, sharedLogin) {

    //Konstruktor für eine Ansicht
    function View() {
      this.name = "Neue Ansicht";
      this.collID = $scope.collID;
      this.creator = username;
      this.timeOfCreation = Date.now();
      this.lastModifiedBy = username;
      this.timeOfLastModification = this.timeOfCreation;
      this.dimensions = {
        height: null,
        area: null,
        color: null,
        district: null
      };
    }

    $scope.collection = null;
    $scope.collID = null;
    $scope.views = null;
    $scope.numberOfViews = null;
    $scope.chosenView = null;
    $scope.collection = null;
    $scope.attributesOfCollection = null;

    $scope.setDataForCity = function (collection, view, divID) {
      $scope.collection = collection;
      $scope.view = view;
      $scope.divID = divID;

      drawCity(collection, view, divID);
    };

    /* Funktioniert nicht, weil die rootScope nur im MainCtrl existiert
    var username = $rootScope.username;
    var password = $rootScope.password;
    */
    
    //Standardeinstellungen
    var username = sharedLogin.getUsername();
    var password = sharedLogin.getPassword();
    var database = "einstellungen";
    var collection = "ansichten";
    var baseurl = "https://pegenau.com:16392";

    //Die Ansichten ausgeben
    $scope.getViews = function (func) {
      getViews(database, collection, username, password, $http, function (response) {
        $scope.views = response.data._embedded['rh:doc'];
        if ($scope.views && $scope.views.length) {
          $scope.numberOfViews = $scope.views.length;
          if (func) {
            func($scope.views);
          }
        }
      });
    };

    //Eine Ansicht aktualisieren
    $scope.updateView = function () {
      updateView($scope.chosenView, username, password, $http, function (response) {
        var id = $scope.chosenView._id;
        $scope.chosenView = null;
        $scope.getViews(function (views) {
          for (var arrayIndex in views) {
            if (views[arrayIndex]._id === id) {
              $scope.setChosenView(views[arrayIndex]);
              views[arrayIndex].lastModifiedBy = username;
              views[arrayIndex].timeOfLastModification = Date.now();
            }
          }
        });
      });
    };

    var getProperties = function (row) {
      var attrs = [];
      for (var key in row) {
        if (key[0] !== '_') {
          $log.info("Key: " + key + "\tValue: " + row[key] +  "\tType: " + getType(row[key]));
          attrs[key] = getType(row[key]);
        }
      }
      $log.info("Properties:");
      $log.info(attrs[key]);
    };

    var getType = function (thing) {
      return typeof(thing);
    };
    
    $scope.validate = function (attribute, typeToValidate) {          
      getCollection("prelife", $scope.chosenView.collID, username, password, $http, function (resp) {
        if(typeof $scope.collection.data._embedded['rh:doc'][0][attribute] === typeToValidate){
          //console.log("Eingabewert OK");
        }else{
          //console.log("Eingabewert ist nicht OK");
          window.alert("In dieses Feld dürfen nur Eingaben vom Typ " + typeToValidate);
        }
      });
    };


    //Eine Ansicht auswählen
    $scope.setChosenView = function (view) {
      if ($scope.chosenView === view) {
        $scope.chosenView = null;
        $scope.collection = null;
        $scope.attributesOfCollection = null;
      } else {
        $scope.chosenView = view;
        getCollection("prelife", $scope.chosenView.collID, username, password, $http, function (resp) {
          $scope.collection = resp;
          $log.info($scope.collection);

          var firstDocument = $scope.collection.data._embedded['rh:doc'][0];
          var attrs = [];
          for (var key in firstDocument) {
            if (key[0] !== '_') {
              attrs.push(key);
            }
          }

          getProperties(firstDocument);

          $scope.attributesOfCollection = attrs;
          $log.info("Attributes of Collection: " + attrs);
        });

      }
      $log.info($scope.chosenView);
    };

    // Initialisierung
    if ($routeParams.collID) {
      $scope.collID = $routeParams.collID;
      $scope.getViews();
    }

    //Eine Ansicht löschen
    $scope.deleteView = function (view) {
      deleteView(view, username, password, $http, function (response) {
        console.log(response);
        $scope.getViews();
      });
      $scope.chosenView = null;
    };

    //Eine neue Sicht erstellen
    $scope.newView = function (collID) {
      var newView = new View();
      $log.info(newView);
      var url = baseurl + '/einstellungen/ansichten/' + newView.timeOfCreation;
      $http.put(url, newView).then(function (response) {
        $scope.getViews();
        console.log(response);
      });
      $scope.setChosenView(newView);
    };

    //Konsturktor für eine Kopie einer neuen Ansicht
    function ViewCopy(collID) {
      this.name = collID.name + " (Kopie)";
      this.collID = $scope.collID;
      this.creator = username;
      this.timeOfCreation = Date.now();
      this.lastModifiedBy = username;
      this.timeOfLastModification = this.timeOfCreation;
      this.dimensions = collID.dimensions;
    }

    //Eine Kopie erstellt
    $scope.copyView = function (collID) {
      var newView = new ViewCopy(collID);
      $log.info(newView);
      var url = baseurl + '/einstellungen/ansichten/' + newView.timeOfCreation;
      $http.put(url, newView).then(function (response) {
        $scope.getViews();
        console.log(response);
      });
    };

    //Schönere Darstellung der Zeit
    $scope.jstimeToFormatedTime = function (jstime) {
      var d = new Date(jstime);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    };
    
    $scope.downloadJSON = function () {
        var data = $scope.chosenView;
        var json = JSON.stringify(data);
        var blob = new Blob([json], {type: "application/json"});
        var url  = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.download    = "chosenView.json";
        a.href        = url;
        a.textContent = "chosenView.json";

        document.getElementById('content').appendChild(a);
    };
    
  });
