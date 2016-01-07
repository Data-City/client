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
        var AGGR = null;
        // Basis-URL zu RESTHeart
        var BASEURL = "https://pegenau.com:16392";
        var ANSICHTEN = "/einstellungen/ansichten";
        
        // Wird zwischen den Namen der betreffenden Collection und das Suffix gesetzt
        // Beispiel: /db/coll_dc_stats
        this.META_DATA_PART = "_dc_";
        this.META_DATA_SUFFIX = "metaData";
        this.AGGREGATION_SUFFIX = "aggregation";

        var username = null;
        var password = null;
        
        var rest = null;

        this.setUsername = function (user) {
            username = user;
        };

        this.setPassword = function (pw) {
            password = pw;
        };
        
        var getAuthorizationHeader = function() {
            return "Basic " + btoa(username + ":" + password);
        };
        
        /**
         * Setzt Benutzername + Passwort passend in den Auth-Header
         */
        var setAuthHeader = function () {
            $http.defaults.headers.common.Authorization = getAuthorizationHeader();
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
                function success(response) {
                    if(fn) {
                        if(response.data._returned > 0) {
                            fn(response.data._embedded['rh:doc']);
                        } else {
                            fn(null);
                        }
                    }
                }, function error(response) {
                    $log.error("Fehler beim Holen der Ansichten für Collection" + collection);
                    $log.error(response);
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
        
        /**
         * Löscht eine Collection
         * 
         * TODO Ansichten löschen
         * TODO Meta-Daten löschen
         */
        this.deleteCollection = function(db, collection, fn) {
            // Eigentliche Collection löschen
            this.getCurrentETag(db, collection, function(etag) {
                rest.deleteData(function(r) {
                    $log.info('Gelöscht:\t' + db + '/' + collection);
                    if(fn) {
                        fn(r);
                    }
                }, etag, db, collection, null);
            });
        };
        
        /**
         * Löscht die Daten und ruft die Funktion mit dem Ergebnis auf
         * 
         * db, collection und id können null sein
         */
        this.deleteData = function (fn, etag, db, collection, id) {
            setAuthHeader();
            var config = {headers:  {
                "If-Match": etag}
            };
            
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
            $http.delete(url, config).then(
                function (response) {
                    fn(response);
                },
                function error(response) {
                    $log.error("Fehler beim Löschen: " + url);
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
        this.createView = function(view, collection, fn) {
            var url = BASEURL + '/einstellungen/ansichten/' + view.timeOfCreation;
            $http.put(url, view).then(
                function success(response) {
                if(fn) {
                    fn(response);
                }
            }, function error(response) {
                $log.error("Fehler beim Erzeugen einer Ansicht");
                $log.error("PUT auf " + url);
                $log.error(response);
            });
        };
        
        this.createAggregation = function(database, collection, etag, params, fn) {
            if(!params) {
                return;
            }            
            
            setAuthHeader();
            var config = {
                headers: {
                    "If-Match": etag,
                }
            };
            $http.put(createURL(database,collection), params, config).then(
            function success(response) {
                if(fn) {
                    fn(response);
                }
            }, function error(response) {
                $log.error("Fehler beim Anlegen der Aggregation!");
                $log.error("Parameter:");
                $log.error(params);
                $log.error("Antwort:");
                $log.error(response);
            });
        };
        
        this.putOnCollection = function(database, collection, etag, params, fn) {
            if(!params) {
                return;
            }       
            setAuthHeader();
            var config = {
                headers: {
                    "If-Match": etag,
                }
            };
            $http.put(createURL(database,collection), params, config).then(
            function success(response) {
                if(fn) {
                    fn(response);
                }
            }, function error(response) {
                $log.error("Fehler beim PUT auf " + createURL(database,collection));
                $log.error("Parameter:");
                $log.error(params);
                $log.error("Antwort:");
                $log.error(response);
            });
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
        
        /**
         * Holt alle vorhandenen Aggregationen
         */
        this.getAggregations = function(database, collection, fn) {
            this.getDocuments(database, collection,
                function(response) {
                if(response.data) {
                    fn(response.data.aggrs);
                } else {
                   fn(null); 
                }}, function error(resp) {
                    $log.error('Fehler beim Holen der Aggregation von ' + database + '/' + collection + '!\n' + 'Antwort:');
                    $log.error(resp);
                });
        };

        /**
         * Besitzt die Collection Aggregationen?
         */
        this.hasCollectionAggregations = function(database, collection, fn) {
            this.getAggregations(database, collection, function(aggrs) {
               var hasAggregations = (aggrs) ? true : false;
               fn(hasAggregations);
            });
        };
        
        /**
         * Fügt eine Aggregation zu den bestehenden hinzu
         */
        this.addAggregation = function(database, collection, aggr, fn) {
            var existingAggregations = null;
            this.getAggregations(database, collection, function(resp) {
                existingAggregations = resp;
                //$log.info("Vorhandene Aggregation:");
                //$log.info(resp);
                if(existingAggregations) {
                    aggr.aggrs.push(existingAggregations);
                }
                //$log.info('Mit neuer Aggregation');
                //$log.info(aggr);
                
                rest.getCurrentETag(database, collection, function(etag) {
                    rest.createAggregation(database, collection, etag, aggr, function(r) {
                        fn(r);
                    });
                });
            });
        };
        
        /**
         * Ruft die Meta-Daten-Aggregations-URI auf
         * 
         * Beispiel:
         * /db/collection/_aggrs/AGGR.META_DATA_AGGR_URI
         */
        this.callCollectionsMetaDataAggrURI = function(database, collection, fn) {
            var relUrl = '/' + database + '/' + collection + '/_aggrs/' + AGGR.META_DATA_AGGR_URI;
            var config = null;
            $http.jsonp(BASEURL + relUrl, config).then(
                function success() {
                    fn();
                }, function error() {
                    fn();
                }
            );
        };
        
        /**
         * Fügt einer Collection die Meta-Daten-Aggregation hinzu
         */
        this.createMetaDataAggregation = function(database, collection, fn) {
            rest.getURL('/' + database + '/' + collection, null, function(resp) {
                var attributesOfCollection = getAttributesWithType(resp.data._embedded['rh:doc']);
                var aggr = AGGR.createMinMedMaxAggrParam(attributesOfCollection, collection);
                rest.addAggregation(database, collection, aggr, function (response) {
                    fn(response);
                });}, null);
        };
        
        /**
         * Garantiert, dass Meta-Daten einer Collection vorhanden sind und 
         * ruft die Funktion mit diesen auf
         */
        this.ensureCollectionsMetaData = function(database, collection, fn) {
            // Meta-Daten holen
            //$log.info('=======================================================================');
            //$log.info("Hole Meta-Data");
            rest.getCollectionsMetaData(database, collection, function(metaData) {
                // Einfacher Fall: Meta-Daten vorhanden
                if(metaData) {
                    //$log.info("Meta-Daten gefunden");
                    fn(metaData);
                } else {
                    // Keine Meta-Daten vorhanden
                    //$log.info("Keine Meta-Daten gefunden");
                    // Gibt es Tabelle mit Meta-Daten?
                    var relUrl = '/' + database + '/' + collection + 
                                    rest.META_DATA_PART +
                                    AGGR.META_DATA_AGGR_URI;
                                    
                    // Ja => Abrufen und Daten in collection speichern
                    var funcSucc = function(respWithMetaData) {
                        //$log.info('Tabelle gefunden!');
                        //$log.info(respWithMetaData);
                        
                        if(!respWithMetaData.data || !respWithMetaData.data._embedded) {
                            rest.deleteCollection(database, collection + rest.META_DATA_PART + AGGR.META_DATA_AGGR_URI, null);
                            //$log.info("Leere Meta-Daten Tabelle gefunden und gelöscht");
                            // REKURSION
                            rest.ensureCollectionsMetaData(database, collection, fn);
                        } else {
                            var params = {
                            };
                            params[rest.META_DATA_SUFFIX] = {
                                'timeOfCreation': Date.now(),
                                'data': respWithMetaData.data._embedded['rh:doc'][0], 
                            };
                            rest.getCurrentETag(database, collection, function(etag) {
                                rest.putOnCollection(database, collection, etag, params, function(response) {
                                    // REKURSION
                                    rest.ensureCollectionsMetaData(database, collection, fn);
                                }); 
                            });
                        }
                    };
                    // Nein => Gibt es die nötige Aggregation?
                    var funcError = function(resp) {
                        //$log.info('Keine Tabelle gefunden. Hinweis: dadurch der 404-Fehler (;');
                        //$log.info('Gibt es die nötige Aggregation?');
                        // Gibt es eine Aggregation?
                        rest.getAggregations(database, collection, function(aggrs) {
                            if(aggrs) {
                                //$log.info('Das sind die vorhandenen Aggregationen:');
                                //$log.info(aggrs);
                                var metaDataAggrExists = false;
                                aggrs.forEach(function(element) {
                                    if(element.uri === AGGR.META_DATA_AGGR_URI) {
                                        metaDataAggrExists = true;
                                    }
                                });
                                // Ja, die nötige Aggregation ist da => Abrufen
                                if(metaDataAggrExists) {
                                    //$log.info('MetaDaten-Aggregation gefunden');
                                    rest.callCollectionsMetaDataAggrURI(database, collection, function(response) {
                                        // REKURSION
                                        rest.ensureCollectionsMetaData(database, collection, fn);
                                    });
                                } else {
                                    // Nein => Aggregation anlegen
                                    rest.createMetaDataAggregation(database, collection, function(response) {
                                        // REKURSION
                                        rest.ensureCollectionsMetaData(database, collection, fn);
                                    });
                                }
                            // Nein
                            } else {
                                // Aggregation anlegen
                                rest.createMetaDataAggregation(database, collection, function(response) {
                                    // REKURSION
                                    rest.ensureCollectionsMetaData(database, collection, fn);
                                });
                            }
                        });
                    };   
                    //$log.info('Gibt es Tabelle mit MetaDaten ' + relUrl);             
                    rest.getURL(relUrl, null, funcSucc, funcError);
                }
            });
        };

        /**
         * Besitzt die Collection eine Meta-Daten Aggregation _dc_stats
         */
        this.hasCollectionMetaDataAggregation = function(database, collection, fn) {
            // TODO
            return null;
        };
        
        /**
         * Prüft, ob eine Collection Meta-Daten gespeichert hat
         */
        this.hasCollectionMetaData = function(database, collection, fn) {
            this.getCollectionsMetaData(database, collection, function(metaData) {
               var boolean = (metaData) ? true : false;
               fn(boolean);
            });
        };
        
        /**
         * Ruft Funktion mit MetaDaten als Parameter auf
         * 
         * null, falls nicht vorhanden
         */
        this.getCollectionsMetaData = function(database, collection, fn) {
            var success = function (response) {
                if(response.data[rest.META_DATA_SUFFIX]) {
                    fn(response.data[rest.META_DATA_SUFFIX]);
                } else {
                    fn(null);
                }
            };         
            this.getData(success, database, collection, null);
        };
        
        /**
         * Gibt den aktuellen ETag einer Collection zurück
         * 
         * Nötig für _ALLE_ Änderungen an der Collection.
         * Siehe RESTHeart Doku
         */
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
        
        this.setAGGR = function (aggr) {
            AGGR = aggr;
        };

        /**
         * Instanziert Provider
         */
        this.$get = function ($http, $log, AGGR) {
            rest = this;
            this.setHTTP($http);
            this.setLOG($log);
            this.setAGGR(AGGR);
            return this;
        };
    });
