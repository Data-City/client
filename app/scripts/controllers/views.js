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
    .controller('ViewsCtrl', function($scope, $route, $routeParams, $log, $http, $rootScope, sharedLogin, AGGR, REST) {
        //Standardeinstellungen
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        var database = "einstellungen";
        var collection = "ansichten";
        var baseurl = "https://pegenau.com:16392";

        var dbWithCollections = "prelife";

        $scope.json = null;

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
            this.aggregations = [];
            this.districts = [];
        }

        /**
         *  Konstruktor für eine Aggregation
         */
        function Aggregation() {
            this.groupOverField = null;
            this.aggregationOperations = [];
        }

        function District() {
            this.field = null;
        }

        $scope.addDistrict = function() {
            $scope.chosenView.districts.push(new District());
        };

        $scope.deleteDistrict = function(arrayIndex) {
            $scope.chosenView.districts.splice(arrayIndex, 1);
        };

        $scope.numberOfAggregations = 0;

        $scope.addNewAggregation = function() {
            $scope.chosenView.aggregations.push(new Aggregation());
            $scope.numberOfAggregations += 1;
        };

        $scope.removeAggregation = function(arrayIndex) {
            $scope.chosenView.aggregations.splice(arrayIndex, 1);

            //Zur Sicherheit
            if ($scope.numberOfAggregations <= 0) {
                alert("Es gibt <= 0 Aggregationen?");
            } else {
                $scope.numberOfAggregations -= 1;
            }
        };

        // Initialisierung des Controllers
        $scope.collection = null;
        $scope.collID = null;
        $scope.views = null;
        $scope.numberOfViews = null;
        $scope.chosenView = null;
        $scope.loader = false;
        $scope.metaData = null;

        // Ein- & Ausklappen der Panels (Schritt 1-4)
        $scope.showStep1 = false; // Daten reduzieren
        $scope.showStep2 = false; // Verbindungen
        $scope.showStep3 = true; // Blöcke
        $scope.showStep4 = false; // Dimensionen

        $scope.availableAggregationOperations = AGGR.availableAggregationOperations;

        /**
         * Setzt die Daten, damit die WebGL-Stadt gezeichnet werden kann
         */
        $scope.setDataForCity = function(collection, view, divID) {
            var relUrl = "/" + dbWithCollections + "/" + view.collID + REST.META_DATA_PART + "data";
            $scope.createAggregationForDisplay(function(response) {
                REST.callCollectionAggr(dbWithCollections, $scope.chosenView.collID, 'data', function(response) {
                    REST.getURL(relUrl, null, function(collection) {
                        $scope.collection = collection;
                        $scope.view = view;
                        $scope.divID = divID;
                        $log.info(view);
                        view.dimensions.hoehe = view.dimensions.hoehe.name;
                        view.dimensions.flaeche = view.dimensions.flaeche.name;
                        view.dimensions.farbe = view.dimensions.farbe.name;
                        // Noch raus genommen, weil die Distrikte anders ausgewählt werdens
                        //view.dimensions.district = view.dimensions.district.name;
                        drawCity(collection, view, divID);
                    });
                });
            });
        };

        /**
         * Holt die Ansichten und speichert sie im Controller-Scope
         */
        $scope.getViews = function() {
            REST.getViewsOfCollection($scope.collID, function(views) {
                $scope.views = views;
                $scope.numberOfViews = (views) ? count(views) : 0;
            });
        };

        /**
         * Speichert Änderungen an den Einstellungen der Ansicht
         */
        $scope.updateView = function() {
            //Wird für die Anzeige in Angular benötigt
            $scope.chosenView.lastModifiedBy = sharedLogin.getUsername();
            $scope.chosenView.timeOfLastModification = Date.now();

            REST.updateView($scope.chosenView, function() {
                $scope.getViews();
            });
            //Versteckt die beiden Buttons wieder
            $scope.dimform.$setPristine();
        };

        /**
         * Verwirft die Änderungen, die in dem Formular gemacht wurden
         */
        $scope.discardChanges = function() {
            $scope.chosenView = angular.copy($scope.originalView);
            $scope.dimform.$setPristine();
        };

        /**
         * Wählt bei Klick auf eine Ansicht diese aus
         */
        $scope.setChosenView = function(view) {
            if ($scope.chosenView === view) {
                $scope.chosenView = null;
            } else {
                $scope.chosenView = view;
            }
        };


        /**
         * Initialisierung
         */
        if ($routeParams.collID) {
            $scope.collID = $routeParams.collID;
            $scope.getViews();
            REST.getDocuments(dbWithCollections, $scope.collID, function(resp) {
                $scope.collection = resp;
                $scope.metaData = resp.data.metaData.data;
                $scope.attributes = getAttributesWithType($scope.collection.data._embedded['rh:doc']);
            });

        }

        /**
         * Holt sich die Metadaten der Collection (Maximum, Minimum, etc...)
         * 
         * @return: Die Metadaten
         */
        $scope.getMetaData = function(attrname, type) {
            if ($scope.metaData) {
                return $scope.metaData[type + '_' + attrname];
            } else {
                return null;
            }
        };

        /**
         * löscht eine Ansicht
         * 
         * @param view Die Ansicht, die gelöscht werden soll
         */
        $scope.deleteView = function(view) {
            REST.deleteView(view, function(response) {
                $scope.getViews();
                $scope.chosenView = null;
            });
        };

        /**
         * Erstellt eine neue Ansicht zu einem Datensatz
         * 
         * @param collID Die ID des Datensatzes, zu dem die Ansicht hinzugefügt werden soll
         */
        $scope.newView = function() {
            var view = new View();
            REST.createView(view, $scope.collID, function(response) {
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
            this.creator = sharedLogin.getUsername();
            this.timeOfCreation = Date.now();
            this.lastModifiedBy = sharedLogin.getUsername();
            this.timeOfLastModification = this.timeOfCreation;
            this.dimensions = collID.dimensions;
        }

        /**
         * Erstellt eine Kopie der Ansicht, welche ausgewählt ist
         * 
         * @param collID Die ID des Datensatzes, der ausgewählt ist
         */
        $scope.copyView = function(collID) {
            var newView = new ViewCopy(collID);
            $log.info(newView);
            var url = baseurl + '/einstellungen/ansichten/' + newView.timeOfCreation;
            $http.put(url, newView).then(function(response) {
                $scope.getViews();
                console.log(response);
            });
        };

        /**
         * @param jstime JavaScriptTime
         * @return Schönere Darstellung der Zeit
         */
        $scope.jstimeToFormatedTime = function(jstime) {
            var d = new Date(jstime);
            return d.toLocaleDateString() + " " + d.toLocaleTimeString();
        };

        /**
         * Erzeugt einen Text zum Download der ausgewählten Ansicht als JSON-Datei
         */
        $scope.downloadJSON = function() {
            var data = $scope.chosenView;
            var json = JSON.stringify(data);
            var blob = new Blob([json], {
                type: "application/json"
            });
            var url = URL.createObjectURL(blob);

            var a = document.createElement('a');
            console.log($scope.chosenView);
            a.download = "Collection_" + $scope.chosenView.collID + " - Ansicht_" + $scope.chosenView.name + ".json";
            a.href = url;
            a.textContent = "Collection:" + $scope.chosenView.collID + " - Ansicht:" + $scope.chosenView.name + ".json";

            var myWindow = window.open("", "", "width=400, height=200");
            myWindow.document.write("<div id='jsonDownload'></div>");
            myWindow.document.getElementById('jsonDownload').appendChild(a);
        };


        $scope.createAggregationForDisplay = function(fn) {
            var view = $scope.chosenView;
            var stages = [];
            stages.push(AGGR.createLimitStage(AGGR.MAX_DOCUMENTS_FOR_AGGREGATION));
            $log.info(stages);
            stages.push(AGGR.projectStage($scope.attributes));
            stages.push(AGGR.matchStage($scope.attributes));
            if (view.districts.length > 0) {
                stages = stages.concat(AGGR.createDistrictAggregationStages(view.districts, $scope.attributes));
            }
            var aggr = AGGR.buildAggregationPipe(view.collID, stages);
            aggr = AGGR.mongoDBCodeToRESTHeart(aggr);

            $scope.json = aggr;
            REST.addAggregation(dbWithCollections, view.collID, aggr, function(response) {
                $log.info('Aggregation erzeugt');
                if (fn) {
                    fn(response);
                }
            });
        };

    });
