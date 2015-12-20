'use strict';
/*jshint -W117 */
// Basis-URL zu RESTHeart
var BASEURL = "https://pegenau.com:16392";
var ANSICHTEN = "/einstellungen/ansichten";

//Authorisierung
var setAuthHeader = function (username, password, $http) {
	$http.defaults.headers.common.Authorization = "Basic " + btoa(username + ":" + password);
};

//Holt sich alle Datensätze
var getCollections = function (database, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database).then(
		function (response) {
			func(response.data._embedded['rh:coll']);
		}
	);
};

//Holt sich alle Ansichten
var getViews = function (database, collection, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database + "/" + collection).then(
		function (response) {
			func(response);
		}
	);
};

/**
 * Counts the elements in obj
 */

var count = function (obj) {
	if(obj === null) {
		return 0;
	}
	return Object.keys(obj).length;
};

var getViewsByColID = function (database, collection, colID, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database + "/" + collection).then(
		function (response) {
			func(response);
		}
	);
};

var getCollection = function (database, collection, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database + "/" + collection).then(
		function (response) {
			func(response);
		}
	);
};

var getNumberOfCollections = function (database, username, password, $http, func) {
	getCollections(database, username, password, $http, function (response) {
		var count = Object.keys(response).length;
		func(count);
	});
};

var getNumberOfViews = function (database, collection, username, password, $http, func) {
	getViews(database, collection, username, password, $http, function (response) {
		var count = Object.keys(response).length;
		func(count);
	});
};

var deleteView = function (doc, username, password, $http, func) {
	var config = {headers:  {
        "If-Match": doc._etag.$oid}
    };
	var url = BASEURL + ANSICHTEN + '/' + doc._id;
	
	$http.delete(url, config).then(function(response){
		func(response);
	});
};

var updateView = function (view, username, password, $http, func) {
	var config = {headers:  {
        "If-Match": view._etag.$oid}
    };
	var url = BASEURL + ANSICHTEN + '/' + view._id;
	
	$http.patch(url, view, config).then(function(response){
		func(response);
	});
};

//Holt beliebige URL ab Base URL, Beispiel /database/collection
var getURL = function (url, parameters, username, password, $http, func) {
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
	}
	
	$http(req).then(func);
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


/**
 * Erzeugt ein Array aller Attribute, die nicht mit "_" beginnen und ihrem Typ
 */
var getProperties = function (row) {
	var attrs = [];
    for (var key in row) {
        if (key[0] !== '_') {
			var info = {
				'name': key,
				'type': getType(row[key]),
			}
			attrs.push(info);
        }
      }
return attrs;
};