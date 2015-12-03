'use strict';

// Basis-URL zu RESTHeart
var BASEURL = "https://pegenau.com:16392";
var ANSICHTEN = "/einstellungen/ansichten"

var setAuthHeader = function (username, password, $http) {
	$http.defaults.headers.common['Authorization'] = "Basic " + btoa(username + ":" + password);
};

var getCollections = function (database, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database).then(
		function (response) {
			func(response.data._embedded['rh:coll']);
		}
		);
};
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
	return Object.keys(obj).length;
}

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
	var url = BASEURL + ANSICHTEN + '/' + doc._id
	
	$http.delete(url, config).then(function(response){
		func(response);
	});
}

var updateView = function (view, username, password, $http, func) {
	var config = {headers:  {
        "If-Match": view._etag.$oid}
    };
	var url = BASEURL + ANSICHTEN + '/' + view._id 
	
	$http.patch(url, view, config).then(function(response){
		func(response);
	});
}