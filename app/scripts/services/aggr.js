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
        
        this.META_DATA_AGGR_URI = "maxminavg";
     
     /**
     * Alle für MongoDB verfügbaren Gruppierungsoperationen
     * 
     * https://docs.mongodb.org/manual/reference/operator/aggregation/group/#pipe._S_group
     */
    this.availableAggregationOperations = {
      'forgot': {
        name: 'Vergessen',
        cmd: null,
      },
      'sum': {
        name: 'Summe',
        cmd: '$sum',
      },
      'avg': {
        name: 'Durchschnitt',
        cmd: '$avg',
      },
      'first': {
        name: 'Erster Wert',
        cmd: '$first',
      },
      'last': {
        name: 'Letzter Wert',
        cmd: '$last',
      },
      'max': {
        name: 'Maximum',
        cmd: '$max',
      },
      'push': {
        name: 'Push',
        cmd: '$push',
      },
      'addToSet': {
        name: 'Zur Menge hinzufügen',
        cmd: '$addToSet',
      },
      'stdDevPop': {
        name: 'Standardabweichung',
        cmd: '$stdDevPop',
      },
      'stdDevSamp': {
        name: 'Stichprobenabweichung',
        cmd: '$stdDevSamp',
      }
    };
        
        /**
         * Erzeugt Project-Stage
         */
        this.projectStage = function(params) {
            /*
            $project : { title : 1 , author : 1 }
            */
            var project = {};
            params.forEach(function(element, index) {
                if(element.chooseable) {
                    project[element.name] = 1;
                }		
            });
            return project;
        };
    
        /**
         * Erzeugt eine match-Stage:
         * 
         * "_$match": matchStage(params) 
         */
        this.matchStage = function (params) {
            var matchers = [];
            params.forEach(function (element, index) {
                /*
                { score: { $gt: 70, $lt: 90 } },
                { views: { $gte: 1000 } } 
                */
                if (element.type === 'number' && element.chooseable && element.toBeFiltered) {
                    var obj = {};
                    obj[element.name] = { '_$gte': element.numberValueFilter[0], '_$lte': element.numberValueFilter[1] };
                    matchers.push(obj);
                }
            });
            // Mehrere Bedingungen mit AND verknüpfen
            if  (matchers.length < 1) {
                return {};
            } else if  (matchers.length === 1) {
                return matchers[0];
            } else {
                // { $and: [ { score: { $gt: 70, $lt: 90 } }, { views: { $gte: 1000 } } ] }
                var ret = { "_$and": [] };
                for (var i = 0; i < matchers.length; i++) {
                    ret._$and.push(matchers[i]);
                }
                return ret;
            }
        };
        
        /**
         * Setzt einzelne Aggregationsschritte zu einem vollständigen Aggregationsparameter zusammen
         */
        this.buildAggregationPipe = function(collection, project, match) {
            var aggr = {
                "aggrs": [
                {
                    "type": "pipeline",
                    "uri": "data",
                    "stages": [ ]
                }
            ]};
            
            if(project && count(project) > 0) {
                aggr.aggrs[0].stages.push({ "_$project" : project });
            }
            
            if(match && count(project) > 0) {
                aggr.aggrs[0].stages.push({ "_$match" : match });
            }
            aggr.aggrs[0].stages.push({ "_$out" : collection + rest.META_DATA_PART + 'data'});
            
	       return aggr;
        };

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
        
        var aggrs = {aggrs: [
            {
                "type": "pipeline",
                "uri": this.META_DATA_AGGR_URI,
                "stages": [
                    {
                        "_$group" : {
                        }
                    }
                ]
            }
        ]};
        var ops = {
            "_id": 0,
        };
        attrs.forEach(function (element, index) {
            if (element.type === 'number') {
                var name = element.name;
                
                var max = "max_" + name;
                var min = "min_" + name;
                var avg = "avg_" + name;
                
                ops[max] = { "_$max" : "$" + name };
                ops[min] = { "_$min" : "$" + name };
                ops[avg] = { "_$avg" : "$" + name };
                
                
            }
        });
        aggrs.aggrs[0].stages[0]._$group = ops;
        aggrs.aggrs[0].stages.push({ "_$out" : colname + "_dc_stats"});
        return aggrs;
    };

        // Method for instantiating
        this.$get = function () {
            return this;
        };
    });