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

    /**
     *  Konstruktor für eine Ansicht
     */
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

    /**
     * Setzt die Daten, damit die WebGL-Stadt gezeichnet werden kann
     */
    $scope.setDataForCity = function (collection, view, divID) {
      $scope.collection = collection;
      $scope.view = view;
      $scope.divID = divID;

      drawCity(collection, view, divID);
    };
    
    //Standardeinstellungen
    var username = sharedLogin.getUsername();
    var password = sharedLogin.getPassword();
    var database = "einstellungen";
    var collection = "ansichten";
    var baseurl = "https://pegenau.com:16392";

    /**
     * Gibt die Ansichten aus
     */
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

    /**
     * Aktualisiert die Ansicht
     * Wird für die live-Änderung der Namensänderung einer Ansicht benötigt
     */
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

    /** 
     * @row den Namen der Spalte
     */
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
    
    /**
     * @param thing Das übergebene Objekt
     * @return Den Typen vom Objekt/Parameter
     */
    var getType = function (thing) {
      return typeof(thing);
    };
    
    /**
     * Gibt eine Warnung aus, falls die Spalte einen anderen Datentyp hat als sie haben sollte
     * 
     * @param attribute Name der Spalte
     * @param typeToValidate String des Typs, der die Spalte haben soll (string, number, ...)
     */
    $scope.validate = function (attribute, typeToValidate) {     
        var type = $scope.getFirstValidEntry(attribute);
        
        if(type === typeToValidate){
            //console.log("Eingabewert OK");
        }else{
            //console.log("Eingabewert ist nicht OK");
            window.alert("In dieses Feld dürfen nur Eingaben vom Typ " + typeToValidate);
        }
    };
    
    /**
     * Sucht den ersten Eintrag in der Spalte und gibt dessen Typ zurück
     * 
     * @param attribute: Name der Spalte
     * @return: Rückgabewert des ersten Eintrags
     */
    $scope.getFirstValidEntry = function (attribute) {
        var data = $scope.collection.data;
              
        for (var key in data._embedded['rh:doc']) {
            if (data._embedded['rh:doc'][key][attribute] !== "") {
                return typeof data._embedded['rh:doc'][key][attribute];
            }
        }
        window.alert("Die ausgewählte Spalte ist leer!");
        return null;
    };
    
    /**
     * Wählt bei Klick auf eine Ansicht diese aus
     */
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

          var firstEntry = $scope.collection.data._embedded['rh:doc'][0];
          var attrs = [];
          for (var key in firstEntry) {
            if (key[0] !== '_') {
              attrs.push(key);
            }
          }

          getProperties(firstEntry);

          $scope.attributesOfCollection = attrs;
          $log.info("Attributes of Collection: " + attrs);
        });

      }
      $log.info($scope.chosenView);
    };

    /**
     * Initialisierung
     */
    if ($routeParams.collID) {
      $scope.collID = $routeParams.collID;
      $scope.getViews();
    }

    /**
     * löscht eine Ansicht
     * 
     * @param view Die Ansicht, die gelöscht werden soll
     */

    $scope.deleteView = function (view) {
      deleteView(view, username, password, $http, function (response) {
        console.log(response);
        $scope.getViews();
      });
      $scope.chosenView = null;
    };

    /**
     * Erstellt eine neue Ansicht zu einem Datensatz
     * 
     * @param collID Die ID des Datensatzes, zu dem die Ansicht hinzugefügt werden soll
     */
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

    /**
     * Konsturktor für eine Kopie einer neuen Ansicht
     * Übernimmt die ausgewählten Dimensionsn der alten Ansicht, jedoch mit anderen Namen, Ersteller, Datum etc
     */
    function ViewCopy(collID) {
      this.name = collID.name + " (Kopie)";
      this.collID = $scope.collID;
      this.creator = username;
      this.timeOfCreation = Date.now();
      this.lastModifiedBy = username;
      this.timeOfLastModification = this.timeOfCreation;
      this.dimensions = collID.dimensions;
    }

    /**
     * Erstellt eine Kopie der Ansicht, welche ausgewählt ist
     * 
     * @param collID Die ID des Datensatzes, der ausgewählt ist
     */
    $scope.copyView = function (collID) {
      var newView = new ViewCopy(collID);
      $log.info(newView);
      var url = baseurl + '/einstellungen/ansichten/' + newView.timeOfCreation;
      $http.put(url, newView).then(function (response) {
        $scope.getViews();
        console.log(response);
      });
    };

    /**
     * @param jstime JavaScriptTime
     * @return Schönere Darstellung der Zeit
     */
    $scope.jstimeToFormatedTime = function (jstime) {
      var d = new Date(jstime);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    };
    
    /**
     * Erzeugt einen Text zum Download der ausgewählten Ansicht als JSON-Datei
     */
    $scope.downloadJSON = function () {
        var data = $scope.chosenView;
        var json = JSON.stringify(data);
        var blob = new Blob([json], {type: "application/json"});
        var url  = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.download    = "chosenView.json";
        a.href        = url;
        a.textContent = "chosenView.json";

        document.getElementById('jsonDownload').appendChild(a);
    };
    
  });
