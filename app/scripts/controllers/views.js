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
    
    
    //Standardeinstellungen
    var username = sharedLogin.getUsername();
    var password = sharedLogin.getPassword();
    var database = "einstellungen";
    var collection = "ansichten";
    var baseurl = "https://pegenau.com:16392";
    
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
      this.attributesOfCollection = [];
      this.metaData = null;
    }
    
    // Initialisierung des Controllers
    $scope.collection = null;
    $scope.collID = null;
    $scope.views = null;
    $scope.numberOfViews = null;
    $scope.chosenView = null;
    $scope.loader = false;
    
    // Ein- & Ausklappen der Panels (Schritt 1-3)
    $scope.showStep1 = false;
    $scope.showStep2 = false;
    $scope.showStep3 = false;
   


    /**
     * Setzt die Daten, damit die WebGL-Stadt gezeichnet werden kann
     */
    $scope.setDataForCity = function (collection, view, divID) {
      $scope.collection = collection;
      $scope.view = view;
      $scope.divID = divID;
      $log.info(view);
      view.dimensions.hoehe = view.dimensions.hoehe.name;
      view.dimensions.flaeche = view.dimensions.flaeche.name;
      view.dimensions.farbe = view.dimensions.farbe.name;
      //view.dimensions.district = view.dimensions.district.name;
      drawCity(collection, view, divID);
    };
    
    /**
     * Holt die Ansichten und speichert sie im Controller-Scope
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
     * Speichert Änderungen an den Einstellungen der Ansicht
     */
    $scope.updateView = function () {
      $log.info("Update View:");
      $log.info($scope.chosenView);
      updateView($scope.chosenView, username, password, $http, $log, function (response) {
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
     * Wählt bei Klick auf eine Ansicht diese aus
     */
    $scope.setChosenView = function (view) {
      if ($scope.chosenView === view) {
        $scope.chosenView = new View();
      } else {
        $scope.chosenView = view;
        getCollection("prelife", $scope.chosenView.collID, username, password, $http, function (resp) {
          $scope.collection = resp;
          
          // Attribute der Collection holen, falls noch nicht vorhanden
          if (!$scope.chosenView.attributesOfCollection || $scope.chosenView.attributesOfCollection.length === 0) {
            var attrs = getAttributesWithType(resp.data._embedded['rh:doc']);
            $scope.chosenView.attributesOfCollection = attrs;
          }
          
          // Get Meta-Data
          if (!$scope.chosenView.metaData) {
            // Aggregation erstellen
            createAggregation(
              "prelife", // Die Datenbank, in der die aktuelle collection liegt
              $scope.chosenView.collID, // Name der Collection
              username, // DB User
              password, // DB Passwort
              $http,
              createMinMedMaxAggrParam($scope.chosenView.attributesOfCollection, view.collID), // Aggregationsparameter in der Form aggrs = { aggrs : [ ... ]}
              resp.data._etag.$oid // der aktuelle etag der Collection
              );

            
            // Aggregation ausführen
            /*
            var req = {
              method: 'GET',
              url: "https://pegenau.com:16392/prelife" + "/" + $scope.chosenView.collID + "/_aggrs/maxminavg",
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
              },
              data: { test: 'test' }
            };

            $http(req).then(function (response) {
              $log.info("Aggregation erfolgreich ausgeführt")
              $log.info(req);
            }, function (response) {
              $log.error("FEHLER BEI AGGREGATION");
              $log.error(response);
            });
            */

            var url = "/" + "prelife" + "/" + $scope.chosenView.collID + META_DATA_PART + "stats";
            $log.info("URL zu Metadaten: " + url);
            getURL(url, null, username, password, $http, function (response) {
              $scope.chosenView.metaData = response.data._embedded["rh:doc"][0];
              $log.info($scope.chosenView.metaData);
            });
            /*
          //$scope.loader = true;
          $log.info("Führe Aggregation aus: " + url);
          getURL(url, null, username, password, $http, function (response) {
            $log.info(response);
            $scope.loader = false;
            
            // Aggregation abrufen
            
          });*/

          }



          $log.info($scope.chosenView);
        });

      }
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
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);

      var a = document.createElement('a');
      a.download = "chosenView.json";
      a.href = url;
      a.textContent = "chosenView.json";

      document.getElementById('jsonDownload').appendChild(a);
    };

  });
