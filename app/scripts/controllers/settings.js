'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
    .constant('SETTINGS', {
        databaseForCollections: "prelife",
        databaseForViews: "einstellungen",
        collection: "ansichten",
        baseurl: "https://pegenau.com:16392",
        WEBGL_DIV: 'Stadt'
    });

/*
var databaseForCollections = "prelife";
var databaseForViews = "einstellungen";
var collection = "ansichten";
var baseurl = "https://pegenau.com:16392";

var WEBGL_DIV = 'Stadt';

var dbWithCollections = "prelife";
*/
