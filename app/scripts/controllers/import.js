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
        $scope.loader = false;
        
        $scope.leftCol="col-sm-6";
        $scope.rightCol="col-sm-6";
        $scope.useFilenameAsColName=true;
        

        $scope.startImport = function() {
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
                complete: function(obj) {
                    uploadedObj = obj;
                    $scope.msg = "Lade Daten auf Server...";
                    $scope.percentage = 30;
                    startUpload(function() {
                        $scope.msg = "Fertig (Eigentlich müsste hier noch eine Menge passieren...)";
                        $scope.percentage = 70;
                        setTimeout(function() {
                            $scope.loader = false;
                        }, 2000);
                    });
                }
            });
        };


        var startUpload = function(fn) {
            REST.putOnCollection(db, filename, null, uploadedObj, function(result) {
                $log.info(result);
                if (fn) {
                    fn();
                }
            });
        };

        var getFilename = function(fileInput) {
            var path = fileInput.value;
            var filenameWithExtension = path.split(/(\\|\/)/g).pop();
            return filenameWithExtension.substr(0, filenameWithExtension.lastIndexOf('.')) || filenameWithExtension;
        };
    });
