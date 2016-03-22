'use strict';
/*jshint -W117 */
/**
 * @ngdoc function
 * @name datacityApp.controller:ImportCtrl
 * @description
 * # ImportCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
    .controller('ImportCtrl', function($scope, $routeParams, sharedLogin, $log, REST, SETTINGS) {

        var uploadedObj = null;
        var filename = null;
        var db = SETTINGS.databaseForCollections;
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        $scope.msg = "Eine mögliche Nachricht!";
        $scope.percentage = 0;
        $scope.importedDocs = 0;
        $scope.numberOfDocs = 0;
        $scope.loader = false;
        $scope.buttonMsg = 'Zum Datensatz';
        $scope.buttonUrl = null;
        $scope.finishMsg = "Import abgeschlossen.";

        $scope.leftCol = "col-sm-6";
        $scope.rightCol = "col-sm-6";
        $scope.useFilenameAsColName = true;
        $scope.colName = "";
        $scope.withConnections = false;

        var updateLoader = function() {
            $scope.importedDocs++;
            $scope.percentage = Math.round(($scope.importedDocs / $scope.numberOfDocs) * 100);
        };

        $scope.startImport = function() {
            if (!settingsValid()) {
                return false;
            }

            var fileInput = document.getElementById('csv-file');

            var collectionsName = $scope.useFilenameAsColName ? getFilename(fileInput) : $scope.colName;

            $scope.msg = "Lade Datensätze hoch...";
            $scope.buttonUrl = '#/views/' + collectionsName;
            console.log("buttonUrl: ");
            console.log($scope.buttonUrl);
            $scope.finishMsg = "Datensatz " + collectionsName + " importiert!";
            $scope.percentage = 0;
            $scope.loader = true;

            parse(fileInput, function(parseObj) {
                // Parsen erfolgreich?
                if (parseObj.meta.aborted) {
                    alert("Fehler beim Parsen!");
                    return false;
                }
                $scope.numberOfDocs = parseObj.data.length;

                REST.createCollection(collectionsName, parseObj.data,
                    function(result) {

                        if ($scope.withConnections) {
                            $scope.msg = "Lade Verbindungsdaten hoch...";
                            $scope.percentage = 0;
                            parse(document.getElementById('connections-csv-file'), function(connParseObj) {
                                // Parsen erfolgreich?
                                if (connParseObj.meta.aborted) {
                                    alert("Fehler beim Parsen der Verbindungsdatei!");
                                    return false;
                                }
                                $scope.numberOfDocs = connParseObj.data.length;
                                //_dc_connections_tmp
                                var connectionsCol = collectionsName + SETTINGS.meta_data_part + SETTINGS.TMP_CONNECTIONS;
                                REST.createCollection(connectionsCol, connParseObj.data, function success(result) {}, function err(error) {
                                    $log.error(error);
                                }, updateLoader);

                            });
                        }
                    },
                    function(error) {
                        $log.error(error);
                    }, updateLoader);
            });

            /*
            filename = getFilename(fileInput);
            $log.info(filename);
            
            $scope.msg = "Interpretiere Daten...";
            $scope.percentage = 20;
            */

        };

        var settingsValid = function() {
            var pathToCsvFile = document.getElementById('csv-file').value;
            var pathToConnectionsCsvFile = document.getElementById('connections-csv-file').value;
            // Wurde Datei Datensätzen ausgewählt?
            if (pathToCsvFile === "") {
                alert("Bitte wählen Sie eine Datei mit Datensätzen aus!");
                return false;
            }

            // Handelt es sich um eine CSV-Datei?
            else if (getFileExtension(pathToCsvFile) !== "csv") {
                alert("Bitte wählen Sie eine CSV-Datei aus!");
                return false;
            }

            // Wurde "eigener Name" gewählt aber keiner angegeben?
            else if (!$scope.useFilenameAsColName && $scope.colName === "") {
                alert("Bitte geben Sie einen Namen ein oder nutzen Sie den Namen der CSV-Datei!");
                return false;
            }
            // Wurde Verbindungen nutzen gewählt, aber keine Datei gewählt?
            else if ($scope.withConnections && pathToConnectionsCsvFile === "") {
                alert("Bitte wählen Sie eine Datei mit Verbindungen aus oder deaktivieren Sie die Verbindungen!");
                return false;
            }
            // Ist die Verbindungsdatei keine CSV-Datei?
            else if ($scope.withConnections && getFileExtension(pathToConnectionsCsvFile) !== "csv") {
                alert("Die Verbindungsdatei muss eine CSV-Datei sein!");
                return false;
            } else {
                // Jetzt müsste alles in Ordnung sein!
                return true;
            }

        };

        var getFileExtension = function(path) {
            return path.substr(path.lastIndexOf('.') + 1);
        };


        var getFilename = function(fileInput) {
            var path = fileInput.value;
            var filenameWithExtension = path.split(/(\\|\/)/g).pop();
            return filenameWithExtension.substr(0, filenameWithExtension.lastIndexOf('.')) || filenameWithExtension;
        };

        /**
         * Parst eine CSV-Datei und ruft anschließend die Callback-Funktion mit Obj auf
         * 
         * @param fileInput document.getElementById('id des Elements')
         */
        var parse = function(fileInput, callback) {
            Papa.parse(fileInput.files[0], {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: callback
            });
        };
    });
