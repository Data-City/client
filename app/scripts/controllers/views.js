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
    .controller('ViewsCtrl', function ($scope, $route, $routeParams, $log, $http, $rootScope, sharedLogin, AGGR, REST) {

        $scope.test = 1;
        //Standardeinstellungen
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        var database = "einstellungen";
        var collection = "ansichten";
        var baseurl = "https://pegenau.com:16392";
    
        /**
        *  Konstruktor für eine Ansicht
        */
        function View() {
            this.name = "Neue Ansicht";
            this.collID = $scope.collID;
            this.creator = sharedLogin.getUsername();
            this.timeOfCreation = Date.now();
            this.lastModifiedBy = sharedLogin.getUsername();
            this.timeOfLastModification = this.timeOfCreation;
            this.dimensions = {
                height: null,
                area: null,
                color: null,
                district: null
            };
            this.attributesOfCollection = [];
            this.metaData = null;
            this.aggregations = [];
        }
    
        /**
        *  Konstruktor für eine Aggregation
        */
        function Aggregation() {
            this.groupOverField = null;
            this.aggregationOperations = [];
        }

        $scope.addNewAggregation = function () {
            $scope.chosenView.aggregations.push(new Aggregation());
        };

        $scope.removeAggregation = function (arrayIndex) {
            $scope.chosenView.aggregations.splice(arrayIndex, 1);
        };
    
        // Initialisierung des Controllers
        $scope.collection = null;
        $scope.collID = null;
        $scope.views = null;
        $scope.numberOfViews = null;
        $scope.chosenView = null;
        $scope.loader = false;
    
        // Ein- & Ausklappen der Panels (Schritt 1-4)
        $scope.showStep1 = true; // Daten reduzieren
        $scope.showStep2 = false; // Aggreagtion
        $scope.showStep3 = false; // Blöcke
        $scope.showStep4 = false; // Dimensionen
    
        $scope.availableAggregationOperations = AGGR.availableAggregationOperations;
    
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
            REST.getViewsOfCollection($scope.collID, function (views) {
                $scope.views = views;
                if ($scope.views) {
                    $scope.numberOfViews = count(views);
                }
                if (func) {
                    func(views);
                }
            });
        };

        /**
         * Speichert Änderungen an den Einstellungen der Ansicht
         */
        $scope.updateView = function () {
            $scope.chosenView.lastModifiedBy = sharedLogin.getUsername();
            $scope.chosenView.timeOfLastModification = Date.now();

            REST.updateView($scope.chosenView, function () {
                $scope.getViews();
            });
            //Macht die beiden Buttons wieder unsichtbar
            $scope.dimform.$setPristine();
        };
        
        $scope.discardChanges = function () {
            $scope.chosenView = angular.copy($scope.originalView);
            $scope.dimform.$setPristine();
        };

        /**
         * Wählt bei Klick auf eine Ansicht diese aus
         */
        $scope.setChosenView = function (view) {
            if ($scope.chosenView === view) {
                $scope.chosenView = new View();
            } else {
                $scope.chosenView = view;
                REST.getDocuments("prelife", $scope.chosenView.collID, function (resp) {
                    $scope.collection = resp;
          
                    // Attribute der Collection holen, falls noch nicht vorhanden
                    if (!$scope.chosenView.attributesOfCollection || $scope.chosenView.attributesOfCollection.length === 0) {
                        var attrs = getAttributesWithType(resp.data._embedded['rh:doc']);
                        $scope.chosenView.attributesOfCollection = attrs;
                    }
          
                    // Get Meta-Data
                    if (!$scope.chosenView.metaData) {
                        // Aggregation erstellen
                        REST.createAggregation(
                            "prelife", // Die Datenbank, in der die aktuelle collection liegt
                            createMinMedMaxAggrParam($scope.chosenView.attributesOfCollection, view.collID), // Aggregationsparameter in der Form aggrs = { aggrs : [ ... ]}
                            resp.data._etag.$oid // der aktuelle etag der Collection
                            );

                        var url = "/" + "prelife" + "/" + $scope.chosenView.collID + REST.META_DATA_PART + "stats";
                        $log.info("URL zu Metadaten: " + url);
                        REST.getURL(url, null, function (response) {
                            $scope.chosenView.metaData = response.data._embedded["rh:doc"][0];
                        }, function error(response) {
                            $log.error("Fehler beim Holen der Meta-Daten");
                            $log.error(response);
                        });
                    }
                    //Wird zum Zurücksetzen benötigt
                    $scope.originalView = angular.copy($scope.chosenView);
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
            REST.deleteView(view, function (response) {
                $scope.getViews();
                $scope.chosenView = null;
            });
        };
     
        /**
         * Erstellt eine neue Ansicht zu einem Datensatz
         * 
         * @param collID Die ID des Datensatzes, zu dem die Ansicht hinzugefügt werden soll
         */
        $scope.newView = function () {
            var view = new View();
            REST.createView(view, $scope.collID, function (response) {
                $scope.getViews();
                $scope.setChosenView(view);
            });
        };

        /**
         * Konstruktor für eine Kopie einer neuen Ansicht
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
            console.log($scope.chosenView);
            a.download =  "Collection_" + $scope.chosenView.collID + " - Ansicht_" + $scope.chosenView.name + ".json";
            a.href = url;
            a.textContent = "Collection:" + $scope.chosenView.collID + " - Ansicht:" + $scope.chosenView.name + ".json";

            var myWindow = window.open("", "", "width=400, height=200");
            myWindow.document.write("<div id='jsonDownload'></div>");
            myWindow.document.getElementById('jsonDownload').appendChild(a);
        };

        $scope.createAggregationForDisplay = function () {
            var view = $scope.chosenView;
            $log.info("Called");
            $log.info(view);
            var project = AGGR.projectStage(view.attributesOfCollection);
            var match = AGGR.matchStage(view.attributesOfCollection);
            $log.info(match);
            var aggr = AGGR.buildAggregationPipe(project, match);
            REST.getCurrentETag("prelife", view.collID, function (etag) {
                REST.createAggregation("prelife", view.collID, etag, aggr, function (resp) {
                    $log.info("Aggregation erstellt:");
                    $log.info(resp);
                });
            });


        };

    });
