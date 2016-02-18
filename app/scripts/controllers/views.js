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
    .controller('ViewsCtrl', function($scope, $route, $routeParams, $log, $http, $rootScope, sharedLogin, AGGR, REST, SETTINGS) {
        //Standardeinstellungen
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        var database = SETTINGS.databaseForViews;
        var dbWithCollections = SETTINGS.databaseForCollections;
        var collection = SETTINGS.collection;
        var baseurl = SETTINGS.baseurl;

        var WEBGL_DIV = SETTINGS.WEBGL_DIV;

        $scope.mongoDbAggr = null;

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
                color: null
            };
            this.attributesOfCollection = [];
            this.attributes = getAttributesWithType($scope.collection.data._embedded['rh:doc']);
            this.metaData = {};
            this.aggregations = [];
            this.districts = [];
            this.districtType = 0; //"Keine Blöcke benutzen" ist voreingestellt
            this.useGrouping = 0;
        }

        /**
         *  Konstruktor für eine Aggregation
         */
        function Aggregation() {
            this.groupOverField = null;
            this.aggregationOperations = [];
        }

        /**
         * Konstruktor für einen Block
         */
        function District() {
            this.field = null;
        }

        /**
         * Fügt eine neue Ebene (Block) zur Auswahl hinzu
         */
        $scope.addDistrict = function() {
            if (!$scope.chosenView.districts) {
                $scope.chosenView.districts = [];
            }
            $scope.chosenView.districts.push(new District());
        };

        /**
         * Löscht die angegebene Ebene
         * 
         * @param: arrayIndex: Der Index vom Array, das gelöscht werden soll
         */
        $scope.deleteDistrict = function(arrayIndex) {
            $scope.chosenView.districts.splice(arrayIndex, 1);
        };

        $scope.numberOfAggregations = 0;

        /**
         * Fügt eine neue Aggregation hinzu
         */
        $scope.addNewAggregation = function() {
            $scope.chosenView.aggregations.push(new Aggregation());
            $scope.numberOfAggregations += 1;
        };

        /**
         * Löscht eine Aggregation
         * 
         * @param
         */
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
        $scope.showStep3 = false; // Blöcke
        $scope.showStep4 = false; // Dimensionen

        /**
         * Alle für MongoDB verfügbaren Gruppierungsoperationen
         * 
         * https://docs.mongodb.org/manual/reference/operator/aggregation/group/#pipe._S_group
         */
        $scope.availableAggrOps = [{
                name: 'Vergessen',
                cmd: null,
            }, {
                name: 'Summe',
                cmd: '$sum',
            }, {
                name: 'Durchschnitt',
                cmd: '$avg',
            }, {
                name: 'Erster Wert',
                cmd: '$first',
            }, {
                name: 'Letzter Wert',
                cmd: '$last',
            }, {
                name: 'Maximum',
                cmd: '$max',
            },
            /*
            * Macht in diesem Zusammenhang keinen Sinn!
            {
                name: 'Push',
                cmd: '$push',
            },
            {
                name: 'Zur Menge hinzufügen',
                cmd: '$addToSet',
            },
            */
            {
                name: 'Standardabweichung',
                cmd: '$stdDevPop',
            }, {
                name: 'Minimum',
                cmd: '$min',
            }
        ];

        /**
         * Prüft die Eingaben, stellt die Daten zusammen und veranlasst das Zeichnen der Stadt mit WebGL
         */
        $scope.drawCity = function() {
            var view = $scope.chosenView;

            // Korrekte Blockeinstellungen
            for (var key in view.districts) {
                if (view.districts[key].field === null) {
                    window.alert("Schritt 4: \nEs wurden eine oder mehrere Blöcke hinzugefügt, aber keine Einstellungen vorgenommen!");
                    return false;
                }
            }
            if (view.districts[0] === undefined && view.districtType === "2") {
                window.alert("Schritt 4: \nBei der Blockbildung wurde Option 3 festgelegt, aber keine Blöcke ausgewählt. \nFalls Sie keine Blockbildung möchten, bitte wählen Sie Option 1");
                return false;
            }

            // Korrekte Dimensionen
            if (!view.dimensionSettings || !view.dimensionSettings.area || !view.dimensionSettings.color || !view.dimensionSettings.height || !view.dimensionSettings.name) {
                window.alert("Schritt 5: \nEs wurden eine oder mehr Dimensionen nicht ausgewählt!");
                return false;
            }

            // Spinner anzeigen
            $scope.loader = true;

            $scope.createAggregationForDisplay(function(response) {
                REST.callCollectionAggr(dbWithCollections, $scope.chosenView.collID, "data_" + view._id, function(response) {

                    var relUrl = "/" + dbWithCollections + "/" + view.collID + REST.META_DATA_PART + "data_" + view._id;
                    REST.getURL(relUrl, null, function(collection) {
                        view.numberOfEntries = $scope.collection.data._returned;
                        view.dimensions.name = {
                            name: view.dimensionSettings.name.name
                        };
                        view.metaData = $scope.chosenView.metaData;
                        view.dimensions.height = view.dimensionSettings.height.name;
                        view.dimensions.area = view.dimensionSettings.area.name;
                        view.dimensions.color = view.dimensionSettings.color.name;
                        view.buildingcolor = SETTINGS.farbefuerGebauede;
                        // AUSKOMMENTIEREN! NUR DEBUG
                        //$scope.loader = false;

                        if (view.metaData.connectionsAvailable === "true") {
                            REST.getDocuments(dbWithCollections, view.collID + "_dc_connections_incoming", function(incoming) {
                                REST.getDocuments(dbWithCollections, view.collID + "_dc_connections_outgoing", function(outgoing) {
                                    var incomingConnections = incoming.data._embedded['rh:doc'][0];
                                    var outgoingConnections = outgoing.data._embedded['rh:doc'][0];
                                    drawCity(collection.data._embedded['rh:doc'], view, WEBGL_DIV, undefined, incomingConnections, outgoingConnections);
                                    $scope.loader = false;
                                });
                            });
                        } else {
                            drawCity(collection.data._embedded['rh:doc'], view, WEBGL_DIV, undefined, undefined, undefined);
                            $scope.loader = false;
                        }
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
            document.getElementById("Stadt").innerHTML = "";
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
                REST.getData(function(response) {
                    if (response.data) {
                        $scope.chosenView = response.data;
                        REST.getCollectionsMetaData(dbWithCollections, $scope.collID, function(metaData) {
                            $log.info(metaData);
                            $scope.chosenView.metaData = metaData;
                        });
                    }
                }, database, collection, view._id);
            }
        };


        /**
         * Initialisierung
         */
        if ($routeParams.collID) {
            $scope.loader = true;
            $scope.collID = $routeParams.collID;
            $scope.getViews();
            REST.getDocuments(dbWithCollections, $scope.collID, function(resp) {
                $scope.collection = resp;
                $scope.loader = false;
            });
        }

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
            REST.getCollectionsMetaData(dbWithCollections, $scope.collID, function(metaData) {
                //$scope.chosenView.attributes = getAttributesWithType($scope.collection.data._embedded['rh:doc']);
                view.attributes.forEach(function(element) {
                    var array = [];
                    if (element.type === 'number') {
                        array.push(parseFloat(metaData["min_" + element.name]));
                        array.push(parseFloat(metaData["max_" + element.name]));
                    } else {
                        array.push(0);
                        array.push(1);
                    }

                    element.numberValueFilter = array;
                });
                REST.createView(view, $scope.collID, function(response) {
                    $scope.getViews();
                    var url = response.config.url;
                    var array = url.split('/');
                    view._id = array[array.length - 1];
                    $scope.setChosenView(view);
                });
            });
        };

        /**
         * Erstellt eine Kopie der Ansicht, welche ausgewählt ist
         * 
         * @param collID Die ID des Datensatzes, der ausgewählt ist
         */
        $scope.copyView = function(view) {
            var newView = new View();

            newView = $scope.chosenView;
            newView._id = Date.now().toString();
            newView.name = view.name + " (Kopie)";
            newView.timeOfCreation = Date.now();
            newView.timeOfLastModification = newView.timeOfCreation;

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

        /**
         * Aus den ausgewählten Blöcken (Radio Button Option 3) wird die Stadt so zusammengebaut,
         * dass sie wie gewünscht mehrere Ebenen enthält. 
         */
        $scope.createAggregationForDisplay = function(fn) {
            var view = $scope.chosenView;
            var stages = [];
            stages.push(AGGR.createLimitStage(AGGR.MAX_DOCUMENTS_FOR_AGGREGATION));
            stages.push(AGGR.projectStage(view.attributes));
            stages.push(AGGR.matchStage(view.attributes));
            // == ist Absicht!
            /* jshint ignore:start */
            // Code here will be ignored by JSHint.
            if (view.useGrouping == 1) {
                stages = stages.concat(AGGR.groupingStage(view.grouping));
            }
            /* jshint ignore:end */

            stages = stages.concat(AGGR.createDistrictAggregationStages(view.districts, view.attributes));

            var aggr = AGGR.buildAggregationPipe(view.collID, stages, view._id);
            //$scope.mongoDbAggr = aggr;
            aggr = AGGR.mongoDBCodeToRESTHeart(aggr);
            REST.addAggregation(dbWithCollections, view.collID, aggr, function(response) {
                if (fn) {
                    fn(response);
                }
            });
        };

        /**
         * Aktiviert die Tooltips
         */
        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        /**
         * Hilfsfunktion fuer die Filterung der Verbindungen, erstmal auskommentiert 
         */
        /**  $scope.myTest = function(){
              var view = $scope.chosenView;
              if (view.metaData.connectionsAvailable === "true") {
                              REST.getDocuments(dbWithCollections, view.collID + "_dc_connections_incoming", function (incoming) {
                                  REST.getDocuments(dbWithCollections, view.collID + "_dc_connections_outgoing", function (outgoing) {
                                      var incomingConnections = incoming.data._embedded['rh:doc'][0];
                                      var outgoingConnections = outgoing.data._embedded['rh:doc'][0];
                                      var inc = incomingConnections.connections;
                                      
                                      var min = 0;
                                      for(var value = 0; value < inc.length; value++){
                                          if(inc[0].minimum <= inc[0 + value].minimum){
                                              min = inc[0].minimum;
                                          } else{
                                              min = inc[0+value].minimum;
                                              
                                              var x = inc[0+value].minimum;
                                              inc[0+value].minimum = inc[0].minimum;
                                              inc[0].minimum = x;
                                          }
                                      }
                                      var out = outgoingConnections.connections;
                                      var max = 0;
                                      for(var y = 0; y < out.length; y++){
                                          if(out[0].maximum >= out[0 + y].maximum){
                                              max = out[0].maximum;
                                          } else{
                                              max = out[0+y].maximum;
                                              
                                              var z = out[0+y].maximum;
                                              out[0+y].maximum = out[0].maximum;
                                              out[0].maximum = z;
                                          }
                                      }
                                  });
                              });
                          }
          };*/
    });
