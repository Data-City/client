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
    .controller('ImportCtrl', function ($scope, $routeParams, sharedLogin, $log, REST, SETTINGS) {

        var uploadedObj = null;
        var filename = null;
        var db = SETTINGS.databaseForCollections;
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        $scope.msg = "Eine mögliche Nachricht!";
        $scope.percentage = 0;
        $scope.loader = false;

        $scope.leftCol = "col-sm-6";
        $scope.rightCol = "col-sm-6";
        $scope.useFilenameAsColName = true;
        $scope.colName = "";
        $scope.withConnections = false;


        $scope.startImport = function () {
            if (!settingsValid()) {
                return false;
            }

            $scope.msg = "Lade Daten in Browser-Cache...";
            $scope.percentage = 10;
            $scope.loader = true;
            var fileInput = document.getElementById('csv-file');
            filename = getFilename(fileInput);
            $log.info(filename);

            $scope.msg = "Interpretiere Daten...";
            $scope.percentage = 20;
            Papa.parse(fileInput.files[0], {
                header: true,
                dynamicTyping: true,
                complete: function (obj) {
                    uploadedObj = obj;
                    $scope.msg = "Lade Daten auf Server...";
                    $scope.percentage = 30;
                    startUpload(function () {
                        $scope.msg = "Fertig (Eigentlich müsste hier noch eine Menge passieren...)";
                        $scope.percentage = 70;
                        setTimeout(function () {
                            $scope.loader = false;
                        }, 2000);
                    });
                }
            });
        };

        var settingsValid = function () {
            var pathToCsvFile = document.getElementById('csv-file').value;
            // Wurde Datei Datensätzen ausgewählt?
            if (pathToCsvFile === "") {
                alert("Bitte wählen Sie eine Datei mit Datensätzen aus!");
                return false;
            }

            // Handelt es sich um eine CSV-Datei?
            if (getFileExtension(pathToCsvFile) !== "csv") {
                alert("Bitte wählen Sie eine CSV-Datei aus!");
                return false;
            }
            
            // Wurde "eigener Name" gewählt aber keiner angegeben?
            if (!$scope.useFilenameAsColName && $scope.colName === "") {
                alert("Bitte geben Sie einen Namen ein oder nutzen Sie den Namen der CSV-Datei!");
                return false;
            }
            
            var connectionsFilePath = document.getElementById('connections-csv-file').value;
            // Wurde Verbindungen nutzen gewählt, aber keine Datei gewählt?
            if ($scope.withConnections && connectionsFilePath === "") {
                alert("Bitte wählen Sie eine Datei mit Verbindungen aus oder deaktivieren Sie die Verbindungen!");
                return false;
            }
            
            // Ist die Verbindungsdatei keine CSV-Datei?
            if (getFileExtension(connectionsFilePath) !== "csv") {
                alert("Die Verbindungsdatei muss eine CSV-Datei sein!");
                return false;
            }
            
            // Jetzt müsste alles in Ordnung sein!
            return true;
        };

        var getFileExtension = function (path) {
            return path.substr(path.lastIndexOf('.') + 1);
        };

        var startUpload = function (fn) {
            REST.putOnCollection(db, filename, null, uploadedObj, function (result) {
                $log.info(result);
                if (fn) {
                    fn();
                }
            });
        };

        var getFilename = function (fileInput) {
            var path = fileInput.value;
            var filenameWithExtension = path.split(/(\\|\/)/g).pop();
            return filenameWithExtension.substr(0, filenameWithExtension.lastIndexOf('.')) || filenameWithExtension;
        };
    });
