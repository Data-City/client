'use strict';

/**
 * @ngdoc service
 * @name datacityApp.REST
 * @description
 * # REST
 * Provider in the datacityApp.
 */
angular.module('datacityApp')
    .provider('REST', function () {
        // Private
        var $http = null;
        var $log = null;
        // Basis-URL zu RESTHeart
        var BASEURL = "https://pegenau.com:16392";
        var ANSICHTEN = "/einstellungen/ansichten";

        this.META_DATA_PART = "_dc_";

        var username = null;
        var password = null;

        this.setUsername = function (user) {
            username = user;
        };

        this.setPassword = function (pw) {
            password = pw;
        };
        
        /**
         * Setzt Benutzername + Passwort passend in den Auth-Header
         */
        var setAuthHeader = function () {
            $http.defaults.headers.common.Authorization = "Basic " + btoa(username + ":" + password);
        };
        
        /**
         * Holt ein Dokument einer Collection
         */
        this.getDocument = function (database, collection, oid, fn) {
            setAuthHeader();
            this.getData(fn, database, collection, oid);
        };
        
        /**
         * Holt alle Einträge einer Collection
         */
        this.getDocuments = function (database, collection, fn) {
            setAuthHeader();
            this.getData(fn, database, collection, null);
        };
        
        /**
         * Holt alle Collections einer DB
         */
        this.getCollections = function (database, fn) {
            setAuthHeader();
            this.getData(fn, database, null, null);
        };
        
        /**
         * Holt alle Datenbanken
         */
        this.getDatabases = function (fn) {
            setAuthHeader();
            this.getData(fn, null, null, null);
        };

        /**
         * Holt alle Ansichten zu einer Collection
         */
        this.getViewsOfCollection = function (collection, fn) {
            setAuthHeader();
            var config = {
                params: {
                    filter: {
                        'collID': collection,
                    }
                }
            };
            $http.get(BASEURL + ANSICHTEN, config).then(
                function (response) { fn(response.data._embedded['rh:doc']);
            });
        };

        /**
         * Erzeugt eine ganze URL zu einer Collection
         */
        var createURL = function (database, collection) {
            return BASEURL + "/" + database + "/" + collection;
        };
        
        /**
         * Holt die Daten und ruft die Funktion mit dem Ergebnis auf
         * 
         * db, collection und id können null sein
         */
        this.getData = function (fn, db, collection, id) {
            var url = BASEURL;
            if (db) {
                url += "/" + db;
                if (collection) {
                    url += "/" + collection;
                    if (id) {
                        url += "/" + id;
                    }
                }
            }
            //$log.info("Getting " + url);
            $http.get(url).then(
                function (response) {
                    fn(response);
                },
                function error(response) {
                    $log.error("Error calling " + url);
                    $log.error(response);
                });
        };
        
        this.updateView = function(view, fn) {
            setAuthHeader();
            var config = {headers:  {
                "If-Match": view._etag.$oid}
            };
            
	       var url = BASEURL + ANSICHTEN + '/' + view._id;
           
           $http.patch(url, view, config).then(
               function success(response){
		          fn(response);
	           }, function errorCallback(response) {
                    $log.error("Error updating view:");
                    $log.error(view);
                    $log.error("Response:");
                    $log.error(response);
                });
        };
        
        /**
         * Löscht eine Ansicht
         * 
         * @param view Die Ansicht, die gelöscht werden soll
         * @param fn Funktion, die nach erfolgreichem Löschen aufgerufen wird
         */
        this.deleteView = function (view, fn) {
            setAuthHeader();
            var config = {
                headers:  {
                    "If-Match": view._etag.$oid,
                    }
                };
            var url = BASEURL + ANSICHTEN + '/' + view._id;
            
            $http.delete(url, config).then(function(response){
                if(fn) {
                    fn(response);
                }
            }); 
        };
        
        /**
         * Erzeugt eine neue Ansicht für eine gegebene Collection
         */
        this.createNewView = function(view, collection, fn) {
            var url = BASEURL + '/einstellungen/ansichten/' + view.timeOfCreation;
            $http.put(url, view).then(function (response) {
                if(fn) {
                    fn(response);
                }
            });
        };  
        
        this.createAggregation = function(database, collection, etag, aggrs, func) {
            setAuthHeader();
            var config = {
                headers: {
                    "If-Match": etag,
                }
            };
            $http.put(createURL(database,collection), aggrs, config);
        };
        
        //Holt beliebige URL ab Base URL, Beispiel /database/collection
        this.getURL = function (relUrl, parameters, funcSucc, funcError) {
            setAuthHeader();
            var req = {
                method: 'GET',
                url: BASEURL + relUrl,
                params: parameters,
            };
            
            $http(req).then(funcSucc, funcError);
        };

        
        
        this.getCurrentETag = function(database, collection, fn) {
            setAuthHeader();
            
            $http.get(createURL(database,collection)).then(function (response) {
                fn(response.data._etag.$oid);
            });
        };


        /**
         * Speichert $http in Provider
         */
        this.setHTTP = function (http) {
            $http = http;
        };
        
        /**
         * Speichert $log in Provider
         */
        this.setLOG = function (log) {
            $log = log;
        };

        /**
         * Instanziert Provider
         */
        this.$get = function ($http, $log) {
            this.setHTTP($http);
            this.setLOG($log);
            return this;
        };
    });
