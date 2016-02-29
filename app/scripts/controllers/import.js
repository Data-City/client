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
        /**    var db = SETTINGS.databaseForCollections;
            REST.setUsername(sharedLogin.getUsername());
            REST.setPassword(sharedLogin.getPassword());
            $scope.collID = null;
            
            if ($routeParams.collID) {
                $scope.collID = $routeParams.collID;
            }*/
        // var etag = REST.getCurrentETag(db, $scope.collID, function(result){});
        // var result = REST.putOnCollection(db, $scope.collID, etag, $routeParams, function(result){});
        
        var uploadedObj = null;
        var filename = null;
        var db = SETTINGS.databaseForCollections;
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());
        
        $scope.loader = false;

        $scope.startImport = function () {
            var fileInput = document.getElementById('csv-file');
            filename = getFilename(fileInput);
            $log.info(filename);
            Papa.parse(fileInput.files[0], {
                header: true,
                dynamicTyping: true,
                complete: function (obj) {
                    uploadedObj = obj;
                    startUpload();
                }
            });
        };
        
        var startUpload = function() {
            REST.putOnCollection(db, filename, null, uploadedObj, function(result) {
                $log.info(result);
            });
        };

        var getFilename = function (fileInput) {
            var path = fileInput.value;
            var filenameWithExtension = path.split(/(\\|\/)/g).pop();
            return filenameWithExtension.substr(0, filenameWithExtension.lastIndexOf('.')) || filenameWithExtension;
        };
    });
