'use strict';
/*jshint -W117 */

/**
 * Counts the elements in obj
 */
var count = function (obj) {
	if(obj === null) {
		return 0;
	}
	return Object.keys(obj).length;
};

//Holt beliebige URL ab Base URL, Beispiel /database/collection
var getURL = function (url, parameters, username, password, $http, funcSucc, funcError) {
	setAuthHeader(username, password, $http);
	/*
	$http.get(BASEURL + url, config).then(
		function (response) {
			func(response);
		}
	);
	*/
	var req = {
		method: 'GET',
		url: BASEURL + url,
		params: parameters,
	};
	
	$http(req).then(funcSucc, funcError);
};

/**
 * Gibt es Datentyp des uebergebenen Datums zurueck
 * 
 * Beispiele:
 * "w"	=>	string
 * 3	=>	number
 * 3.14	=>	number
 * null	=>	null
 * ""	=>	null
 * true	=>	boolean
 */
var getType = function (thing) {
	if(thing === null) {
		return "null";
	} else if (thing === "") {
		return "null";
	}
	return typeof(thing);
};


/*
 * Erzeugt ein Array aller Attribute, die nicht mit "_" beginnen und ihrem Typ

var getProperties = function (row) {
	var attrs = [];
    for (var key in row) {
        if (key[0] !== '_') {
			var info = {
				'name': key,
				'type': getType(row[key]),
			};
			attrs.push(info);
        }
      }
return attrs;
};
*/

/**
 * Gibt alle Attribute mit Typ zurück
 * 
 * Erwartet als Parameter die Serverantwort, Beispiel:
 * getAttributesWithType($scope.collection.data._embedded['rh:doc']);
 * 
 * Beispielhafte Antwort:
 * 
 * var result = {
 *	'Klassen': {
 *		'name': "Klassen",
 *		'type': "number",
 *		},
 *	'Methoden': {
 *		'name': "Methoden",
 *		'type': "number",
 *	},
 *	'Package': {
 *		'name': "Package",
 *		'type': "string",
 *	},
 *	'Verzweigungen': {
 *		'name': "Verzweigungen",
 *		'type': "number",
 *	},
 *	'Zeilen': {
 *		'name': "Zeilen",
 *		'type': "number",
 *	}
 * };
 */
var getAttributesWithType = function (data) {
      var firstEntry = data[0];
      var attrs = [];
      // Alle Attribute ermitteln, die nicht mit '_' beginnen
      for (var attr in firstEntry) {
        if (attr[0] !== '_') {
          attrs.push(attr);
        }
      }
      
      // Datentypen der Attribute ermitten
      for (var entry in data) {
        var allAttrsValid = true;
        // Prüfen, ob alle Attribute mit Werten belegt sind
        for (var attribute in attrs) {
          if (data[entry][attrs[attribute]] === "") {
            allAttrsValid = false;
            break;
          }
        }
       
        // Zu nächstem Datensatz, weil aktueller leere Elemente hat
        if (!allAttrsValid) {
          continue;
        }
                
        var attributesWithType = [];
        // Eintrag gültig => Datentypen ermitteln
		var count = 0;
        for (var a in attrs) {
          var name = attrs[a];
          var type = getType(data[entry][attrs[a]]);
          attributesWithType[count] = {
			'index': count,
            'name': name,
            'type': type,
			'chooseable': true,
			'toBeFiltered': false,
			'numberValueFilter': [],
			'searchTermFilter': null,
          };
		  count++;
        }
		return attributesWithType;
      }
    };
	
var createURL = function(database, collection) {
	return BASEURL + "/" + database + "/" + collection;
};
	
var createAggregation = function(database, collection, username, password, $http, aggrs, etag, func) {
	setAuthHeader(username, password, $http);
	/*
	var req = {
		method: 'PUT',
		url: getURL(database, collection),
		headers: {
			'Content-Type': 'application/hal+json'
		},
		params: {
			//aggrs
		},
		data: {
			aggrs, 
		},
	};
	
	$http(req).then(func);
	*/
	var config = {
		headers: {
			"If-Match": etag,
		}
	};
	$http.put(createURL(database,collection), aggrs, config);
};

var createMinMedMaxAggrParam = function(attrs, colname) {
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
			"uri": "maxminavg",
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

var getCurrentETag = function(database, collection, username, password, $http, func) {
	setAuthHeader(username, password, $http);
	
	$http.get(createURL(database,collection)).then(function (response) {
		func(response.data._etag.$oid);
	});
};

var createCityAggregation = function(attrs, colname) {
	
	var aggrs = {aggrs: [
		{
			"type": "pipeline",
			"uri": "cityAggregation",
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
