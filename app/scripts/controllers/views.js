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
    .controller('ViewsCtrl', function($scope, $route, $routeParams, $log, $http, $rootScope, sharedLogin, $filter, AGGR, REST, SETTINGS, $timeout) {
        //Standardeinstellungen
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        var database = SETTINGS.databaseForViews;
        var dbWithCollections = SETTINGS.databaseForCollections;
        var collection = SETTINGS.collection;
        var baseurl = SETTINGS.baseurl;

        var WEBGL_DIV = SETTINGS.WEBGL_DIV;

        $scope.predicate = 'timeOfLastModification';
        $scope.reverse = true;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.msg = "";
        $scope.percentage = 100;



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
            this.dimensionSettings = {
                area: null,
                color: null,
                height: null,
                name: null,
            };
            this.attributesOfCollection = [];
            this.attributes = getAttributesWithType($scope.collection.data._embedded['rh:doc']);
            this.metaData = {};
            this.aggregations = [];
            this.districts = [];
            this.districtType = 0; // "Keine Blöcke benutzen" ist voreingestellt
            this.useGrouping = 0; // Keine Grupperiung
            this.grouping = {
                field: null,
                attrs: {}
            };
            this.scalingOption = "min"; // Standard
        }

        $scope.resetAggregationOps = function() {
            var grouping = $scope.chosenView.grouping;

            var attrs = $filter('bychooseability')($scope.chosenView.attributes);

            attrs.forEach(function(a) {
                if (a.name !== grouping.field.name) {
                    grouping.attrs[a.name] = '$sum';
                }
            });
        };

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
            }, {
                name: 'Vergessen',
                cmd: null,
            },
        ];

        $scope.availableAggrOpsWithoutForget = [{
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
        }, {
            name: 'Standardabweichung',
            cmd: '$stdDevPop',
        }, {
            name: 'Minimum',
            cmd: '$min',
        }];

        $scope.setLoaderSettings = function(msg, percentage) {
            $scope.$evalAsync(function() {
                //$log.info(msg + percentage);
                $scope.percentage = percentage;
                $scope.msg = msg;
                /*
                setTimeout(function() {
                    resolve();
                }, 150);
                */
            });
        };

        /**
         * Prüft die Eingaben, stellt die Daten zusammen und veranlasst das Zeichnen der Stadt mit WebGL
         */
        $scope.drawCity = function() {
            $scope.cityLoaded = false;
            $scope.setLoaderSettings("Prüfe Einstellungen", 15);
            var view = $scope.chosenView;

            if (view.useConnections && view.experimentalMode && view.typeOfConnections === undefined) {
                window.alert("Schritt 2: \nEs wurden Verbindungen, aber keine Option ausgewählt!");
                return false;
            }

            if (view.useGrouping === "1" && (view.grouping === null || view.grouping === undefined)) {
                window.alert("Schritt 3: \nEs wurde die Aggregation ausgewählt, aber keine Option ausgewählt!");
                return false;
            }

            // Korrekte Blockeinstellungen
            for (var key in view.districts) {
                if (view.districts[key].field === null) {
                    window.alert("Schritt 4: \nEs wurden eine oder mehrere Blöcke hinzugefügt, aber keine Einstellungen vorgenommen!");
                    return false;
                };
                if (view.districts[key].field === "buildings") {
                    window.alert("Eine der ausgewählten Dimensionen heißt 'buildings'. Dies könnte zu Komplikationen bei der Stadtdarstellung führen. ");
                }
            }
            
            if (view.districts[0] === undefined && view.districtType === "2") {
                window.alert("Schritt 4: \nBei der Blockbildung wurde Option 3 festgelegt, aber keine Blöcke ausgewählt. \nFalls Sie keine Blockbildung möchten, bitte wählen Sie Option 1");
                return false;
            }

            //view.dimensionSettings.name = JSON.parse(view.dimensionSettings.name);

            // Korrekte Dimensionen
            if (!view.dimensionSettings || !view.dimensionSettings.area || !view.dimensionSettings.color || !view.dimensionSettings.height || !view.dimensionSettings.name) {
                $log.info(view);
                window.alert("Schritt 5: \nEs wurden eine oder mehr Dimensionen nicht ausgewählt!\n(Gegebenenfalls wurde in Schritt 1 zu viel heraus gefiltert)");
                return false;
            }

            if (!view.scalingOption) {
                window.alert("Schritt 5: \nEs wurde keine Skalierungsart ausgewählt!");
                return false;
            }

            // Spinner anzeigen
            $scope.loader = true;
            //$scope.setLoaderSettings("Setze Aggregationseinstellungen...", 20, $scope);
            $scope.createAggregationForDisplay(function(response) {
                $scope.setLoaderSettings("Führe Aggregation aus...", 30);
                REST.callCollectionAggr(dbWithCollections, $scope.chosenView.collID, "data_" + view._id, function(response) {
                    var relUrl = "/" + dbWithCollections + "/" + view.collID + REST.META_DATA_PART + "data_" + view._id;
                    $scope.setLoaderSettings("Rufe Aggregationsergebnis ab...", 40);
                    REST.getURL(relUrl, null, function(collection) {
                        $scope.setLoaderSettings("Daten erhalten...", 50);
      
                        view.numberOfEntries = collection.data._returned;
                        if (view.numberOfEntries === 0) {
                            window.alert("Die Filterung bzw. Aggregation wurde so eingestellt, dass keine Datensätze übrig bleiben!");
                            $scope.setLoaderSettings("Der Ladevorgang wurde abgebrochen", 100);
                            $scope.loader = false;
                            return false;
                        }
                        view.dimensions.name = {
                            name: view.dimensionSettings.name.name
                        };
                        view.metaData = $scope.chosenView.metaData;
                        view.dimensions.height = view.dimensionSettings.height.name;
                        view.dimensions.area = view.dimensionSettings.area.name;
                        view.dimensions.color = view.dimensionSettings.color.name;
                        view.buildingcolor = SETTINGS.farbefuerGebauede;

                        if (!$scope.chosenView.experimentalMode) {
                            view.typeOfConnections = 0; //Bögen
                        }

                        if (view.logScaling === undefined) {
                            view.logScaling = {};
                            view.logScaling.color = false;
                            view.logScaling.width = false;
                            view.logScaling.height = false;
                        }

                        $('#collapseAll').collapse();

                        if (view.metaData.connectionsAvailable) {
                            $scope.setLoaderSettings("Rufe Verbindungsdaten ab...", 60);
                            REST.getDocuments(dbWithCollections, view.collID + "_dc_connections_incoming", function(incoming) {
                                REST.getDocuments(dbWithCollections, view.collID + "_dc_connections_outgoing", function(outgoing) {
                                    var incomingConnections = incoming.data._embedded['rh:doc'][0];
                                    var outgoingConnections = outgoing.data._embedded['rh:doc'][0];
                                    $scope.setLoaderSettings("Beginne Aufbau der Stadt...", 65);
                                    drawCity(collection.data._embedded['rh:doc'], view, WEBGL_DIV, undefined, incomingConnections, outgoingConnections, $scope.setLoaderSettings);
                                    /*
                                        .then(function success() {
                                            $scope.setLoaderSettings("Fertig.", 100);
                                            $scope.cityLoaded = true;
                                        }, function error(e) {
                                            $scope.setLoaderSettings("Fehler aufgetreten", 100);
                                        });
                                        */
                                });
                            });
                        } else {
                            $scope.setLoaderSettings("Beginne Aufbau der Stadt...", 65, $scope);
                            drawCity(collection.data._embedded['rh:doc'], view, WEBGL_DIV, undefined, undefined, undefined, $scope.setLoaderSettings);
                        }
                        $scope.loader = false;
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
            if (!$scope.chosenView || $scope.chosenView._id !== view._id) {
                REST.getData(function(response) {
                    if (response.data) {
                        $scope.chosenView = response.data;
                        $log.info(response.data);
                        REST.getCollectionsMetaData(dbWithCollections, $scope.collID, function(metaData) {
                            $log.info(metaData);
                            $scope.chosenView.metaData = metaData;
                        });
                    }
                }, database, collection, view._id);
            } else {
                $scope.chosenView = null;
            }
            document.getElementById("Stadt").innerHTML = "";
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
         * Hilfsfunktionen für die kurze Vorschau des Datensatzes
         */
        REST.getDocuments(dbWithCollections, $scope.collID, function(collection) {
            var results = collection.data._embedded['rh:doc'];
            $scope.properties = getProperties(results[0]);

            var actualEntries = [];

            //Für jede Eigenschaft durchgehen
            for (var property in $scope.properties) {
                var propertyName = $scope.properties[property].name;
                for (var entry in results) {
                    if (results[entry][propertyName]) {
                        actualEntries.push(results[entry][propertyName]);
                        break;
                    }
                }
            }
            $scope.actualEntries = actualEntries;
        });

        $scope.changeViewMode = function() {
            if (!$scope.chosenView.experimentalMode) {
                window.alert("Die Funktionen in der experimentellen Version könnten Fehler enthalten! \nEs können jetzt benutzt werden:" + 
                                "\n - Straßen als Art der Verbindungsdarstellung \n - Die Skalierung im WebGL");
            }
            $scope.chosenView.typeOfConnections = 0; //Bögen
            $scope.chosenView.experimentalMode = !$scope.chosenView.experimentalMode;
            $scope.dimform.$setDirty();
        };

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
