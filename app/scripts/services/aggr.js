'use strict';

/**
 * @ngdoc service
 * @name datacityApp.AGGR
 * @description
 * # AGGR
 * Provider in the datacityApp.
 */
angular.module('datacityApp')
    .provider('AGGR', function AGGR() {

        var rest = null;
        var SETTINGS = null;
        var $log;

        // Wird in SETTINGS gesetzt
        this.META_DATA_AGGR_URI = null;
        var META_DATA_PART = null;
        this.MAX_DOCUMENTS_FOR_AGGREGATION = null;
        var DATA_SUFFIX = null;

        /**
         * Counts the elements in obj
         */
        var count = function(obj) {
            if (obj === null) {
                return 0;
            }
            return Object.keys(obj).length;
        };

        /**
         * Alle für MongoDB verfügbaren Gruppierungsoperationen
         * 
         * https://docs.mongodb.org/manual/reference/operator/aggregation/group/#pipe._S_group
         */
        this.availableAggregationOperations = [{
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
        }, {
            name: 'Push',
            cmd: '$push',
        }, {
            name: 'Zur Menge hinzufügen',
            cmd: '$addToSet',
        }, {
            name: 'Standardabweichung',
            cmd: '$stdDevPop',
        }, {
            name: 'Stichprobenabweichung',
            cmd: '$stdDevSamp',
        }];

        /**
         * Erzeugt MongoDB Project-Stage
         * 
         * @param Object params Alle Parametet mit boolean chooseable als Eigenschaft
         */
        this.projectStage = function(params) {
            /*
            $project : { title : 1 , author : 1 }
            */
            var project = {};
            params.forEach(function(element, index) {
                if (element.chooseable) {
                    project[element.name] = 1;
                }
            });
            project = {
                $project: project
            };
            return project;
        };

        /**
         * Erzeugt eine MongoDB Limit-Stage 
         * 
         * @param number limit Die Zahl der maximal zu verarbeitenden Einträge
         */
        this.createLimitStage = function(limit) {
            return {
                $limit: limit
            };
        };

        /**
         * Erzeugt eine MongoDB match-Stage:
         * "_$match": matchStage(params)
         * 
         * @param Object params Ein Objekt, das Collection-Attribute enthält, die gematcht werden sollen 
         */
        this.matchStage = function(params) {
            var matchers = [];
            params.forEach(function(element, index) {
                /*
                { score: { $gt: 70, $lt: 90 } },
                { views: { $gte: 1000 } } 
                */
                if (element.type === 'number' && element.chooseable && element.toBeFiltered) {
                    var obj = {};
                    obj[element.name] = {
                        '$gte': element.numberValueFilter[0],
                        '$lte': element.numberValueFilter[1]
                    };
                    matchers.push(obj);
                }
            });
            var ret;
            // Mehrere Bedingungen mit AND verknüpfen
            if (matchers.length < 1) {
                ret = {};
            } else if (matchers.length === 1) {
                ret = matchers[0];
            } else {
                // { $and: [ { score: { $gt: 70, $lt: 90 } }, { views: { $gte: 1000 } } ] }
                ret = {
                    "$and": []
                };
                for (var i = 0; i < matchers.length; i++) {
                    ret.$and.push(matchers[i]);
                }
            }
            ret = {
                $match: ret
            };
            return ret;
        };

        /**
         * Erzeugt MongoDB Group-Stage
         * 
         * @param Object grouping Ein Gruppierungsobjekt aus der Oberfläche
         */
        this.groupingStage = function(grouping) {
            var stages = [];

            // Zunächst Gruppieren            
            var group = {
                "$group": {
                    "_id": "$" + grouping.field.name,
                },
            };

            for (var key in grouping.attrs) {
                var cmd = grouping.attrs[key];
                group.$group[key] = {};
                group.$group[key][cmd] = "$" + key;
            }

            stages.push(group);

            // Umbenennen
            var project = {
                "$project": {}
            };

            project.$project[grouping.field.name] = "$_id";
            for (var attr in grouping.attrs) {
                project.$project[attr] = 1;
            }

            stages.push(project);
            return stages;
        };

        /**
         * Setzt einzelne Aggregationsschritte zu einem vollständigen RESTHeart-Aggregationsparameter zusammen
         * 
         * @param String collection Name der Collection
         * @param Array stages Array der zu verwendenden Stages
         * @param id viewID Id der Ansicht
         */
        this.buildAggregationPipe = function(collection, stages, viewID) {
            var aggr = {
                "aggrs": [{
                    "type": "pipeline",
                    "uri": "data_" + viewID,
                    "stages": stages
                }]
            };

            aggr.aggrs[0].stages.push({
                "$out": collection + META_DATA_PART + DATA_SUFFIX + "_" + viewID
            });

            return aggr;
        };

        /**
         * Erzeugt eine Aggregationsstufe zur Erzeugung der Stadtteile (districts)
         * 
         * @param Array districts Die in der Weboberfläche eingestellten Stadtteile
         * @param Object attributes Die Felder des Datensatzes
         */
        this.createDistrictAggregationStages = function(districts, attributes) {
            var stages = [];

            var fields = districts.map(function(d) {
                return d.field.name;
            });

            var groupTemplate = {
                _id: {},
                buildings: {
                    $addToSet: {}
                },
                count: {
                    $sum: 1
                }
            };


            // Wird in Schleife genutzt
            var idsAdder = function(field) {
                ids[field] = "$" + field;
            };

            var idsAdder2 = function(field) {
                group._id[field] = "$_id." + field;
            };

            // Wird in Schleife genutzt
            var dimensionAdder = function(attr) {
                if (attr.chooseable) {
                    group.buildings.$addToSet[attr.name] = "$" + attr.name;
                }
            };
            var group;
            for (var index = 0; index < districts.length; index++) {
                var element = districts[index];
                var elementName = element.field.name;
                group = JSON.parse(JSON.stringify(groupTemplate));

                // Spezialfall: erste Group Stage
                if (index === 0) {


                    // IDs hinzufügen
                    var ids = {};
                    fields.map(idsAdder);
                    group._id = ids;

                    // Buildings für Dimension hinzufügen
                    attributes.map(dimensionAdder);
                } else {
                    fields.map(idsAdder2);
                    group.buildings.$addToSet.name = "$_id." + districts[index - 1].field.name;
                    group.buildings.$addToSet.buildings = "$buildings";
                    group.buildings.$addToSet.count = "$count";

                }
                stages.push({
                    "$group": group
                });
                var i = fields.indexOf(elementName);
                fields.splice(i, 1);
            }

            //
            // City-Rahmen
            //
            // Spezialfall: Keine Blöcke
            if (!districts || districts.length === 0) {
                group = JSON.parse(JSON.stringify(groupTemplate));
                // IDs hinzufügen
                var Ids = {};
                fields.map(idsAdder);
                group._id = Ids;

                // Buildings für Dimension hinzufügen
                attributes.map(dimensionAdder);
            }
            // Es gibt Blöcke (districts)
            else {
                group = JSON.parse(JSON.stringify(groupTemplate));
                group._id = "city";
                group.buildings.$addToSet.name = "$_id." + districts[districts.length - 1].field.name;
                group.buildings.$addToSet.buildings = "$buildings";
                group.buildings.$addToSet.count = "$count";
            }
            stages.push({
                "$group": group
            });

            return stages;
        };
        
        /**
         * Hilfsfunktion zum Escapen eines Strings
         */
        var escapeRegExp = function(str) {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        };

        /**
         * Ersetzt alle Vorkommen von find in str mit replace
         * 
         * @param String str zu durchsuchender String
         * @param String find String, der ersetzt werden soll
         * @param String replace String, mit dem ersetzt wird
         */
        var replaceAll = function(str, find, replace) {
            return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        };

        /**
         * Baut MongoDB-Code zu Code um, mit dem RESTHeart umgehen kann
         */
        this.mongoDBCodeToRESTHeart = function(obj) {
            var str = JSON.stringify(obj);
            str = replaceAll(str, '$', '_$');
            return JSON.parse(str);
        };

        /**
         * Erzeugt Aggregationsstufen für RESTHEart um die Metadaten zu erzeugen
         * 
         * @param Object attrs Attribute der Collection
         * @param String colname Name der Collection
         */
        this.createMinMedMaxAggrParam = function(attrs, colname) {
            /*
                var aggrs =  {aggrs: [
                    {
                "type":"pipeline",
                "uri":"maxminavg",
                "stages": [
                { "_$group" : {
                    "_id": 0, //Ermittelung der Max,Min,Avg Werte eines Feldes aller Dokumente
                    "max_age" : { "_$max" : "$age" },
                    "min_age" : { "_$min" : "$age" },
                    "avg_age" : { "_$avg" : "$age" },
                    },               
                    }]
                },
                ]
            };
            */

            var aggrs = {
                aggrs: [{
                    "type": "pipeline",
                    "uri": this.META_DATA_AGGR_URI,
                    "stages": [{
                        "_$group": {}
                    }]
                }]
            };
            var ops = {
                "_id": 0,
            };
            attrs.forEach(function(element, index) {
                if (element.type === 'number') {
                    var name = element.name;

                    var max = "max_" + name;
                    var min = "min_" + name;
                    var avg = "avg_" + name;

                    ops[max] = {
                        "_$max": "$" + name
                    };
                    ops[min] = {
                        "_$min": "$" + name
                    };
                    ops[avg] = {
                        "_$avg": "$" + name
                    };


                }
            });
            aggrs.aggrs[0].stages[0]._$group = ops;
            aggrs.aggrs[0].stages.push({
                "_$out": colname + META_DATA_PART + this.META_DATA_AGGR_URI
            });
            return aggrs;
        };

        /**
         * Hilfsfunktion um nach der Initialisierung des Controllers auf $log zugreifen zu können
         * 
         * @param $log log
         */
        this.setLog = function(log) {
            $log = log;
        };

        /**
         * Hilfsfunktion um die Einstellungen bei der Initialisierung zu setzen
         * 
         * @param SETTINGS s
         */
        this.setSettings = function(s) {
            SETTINGS = s;

            this.META_DATA_AGGR_URI = SETTINGS.meta_data_suffix;
            META_DATA_PART = SETTINGS.meta_data_part;

            this.MAX_DOCUMENTS_FOR_AGGREGATION = SETTINGS.max_docs_per_aggregation;
            DATA_SUFFIX = SETTINGS.data_suffix;
        };

        /**
         * Kontruktor
         */
        this.$get = function($log, SETTINGS) {
            this.setLog($log);
            this.setSettings(SETTINGS);
            return this;
        };
    });
