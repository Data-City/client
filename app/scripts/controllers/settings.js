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
        farbefuerGebauede: "0x0000FF",

        //Standard-Passwort und Standard-Benutzername für die MongoDB
        benutzername: "a",
        passwort: "a",

        // Max. 16MB bei BSON in Aggregation 
        max_docs_per_aggregation: 100000,

        // Ab hier sollten eigentlich keine Änderungen nötig sein
        WEBGL_DIV: 'Stadt',
        meta_data_part: '_dc_',
        meta_data_suffix: 'maxminavg',
        aggregation_suffix: 'aggregation',
        data_suffix: 'data',
    });

/*
var databaseForCollections = "prelife";
var databaseForViews = "einstellungen";
var collection = "ansichten";
var baseurl = "https://pegenau.com:16392";

var WEBGL_DIV = 'Stadt';

var dbWithCollections = "prelife";
*/
