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

 //jshint: count is defined but never used
var count = function (obj) {
	return Object.keys(obj).length;
};

//jshint: is defined but never used
var getViewsByColID = function (database, collection, colID, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database + "/" + collection).then(
		function (response) {
			func(response);
		}
		);
};

//jshint: is defined but never used
var getCollection = function (database, collection, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database + "/" + collection).then(
		function (response) {
			func(response);
		}
		);
};

//jshint: is defined but never used
var getNumberOfCollections = function (database, username, password, $http, func) {
	getCollections(database, username, password, $http, function (response) {
		var count = Object.keys(response).length;
		func(count);
	});
};

//jshint: is defined but never used
var getNumberOfViews = function (database, collection, username, password, $http, func) {
	getViews(database, collection, username, password, $http, function (response) {
		var count = Object.keys(response).length;
		func(count);
	});
};

//jshint: is defined but never used
var deleteView = function (doc, username, password, $http, func) {
	var config = {headers:  {
        "If-Match": doc._etag.$oid}
    };
	var url = BASEURL + ANSICHTEN + '/' + doc._id;
	
	$http.delete(url, config).then(function(response){
		func(response);
	});
};

//jshint: is defined but never used
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
var getURL = function (url, config, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + url, config).then(
		function (response) {
			func(response);
		}
		);
};
