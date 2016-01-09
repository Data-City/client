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
 * Counts the elements in obj
 */
var count = function (obj) {
    if(obj === null) {
        return 0;
    }
    return Object.keys(obj).length;
};
     
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
            project = {
                $project: project
            }
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
                    obj[element.name] = { '$gte': element.numberValueFilter[0], '$lte': element.numberValueFilter[1] };
                    matchers.push(obj);
                }
            });
            var ret;
            // Mehrere Bedingungen mit AND verknüpfen
            if  (matchers.length < 1) {
                ret = {};
            } else if  (matchers.length === 1) {
                ret = matchers[0];
            } else {
                // { $and: [ { score: { $gt: 70, $lt: 90 } }, { views: { $gte: 1000 } } ] }
                ret = { "$and": [] };
                for (var i = 0; i < matchers.length; i++) {
                    ret._$and.push(matchers[i]);
                }
            }
            ret = {
                $match: ret
            };
            return ret;
        };
        
        /**
         * Setzt einzelne Aggregationsschritte zu einem vollständigen Aggregationsparameter zusammen
         */
        this.buildAggregationPipe = function(collection, stages) {
            var aggr = {
                "aggrs": [
                {
                    "type": "pipeline",
                    "uri": "data",
                    "stages": stages,
                }
            ]};
            
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
        aggrs.aggrs[0].stages.push({ "_$out" : colname + "_dc_" + this.META_DATA_AGGR_URI});
        return aggrs;
    };

        // Method for instantiating
        this.$get = function () {
            return this;
        };
    });
