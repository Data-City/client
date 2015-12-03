var test = function (a, b) {
	return a + b;
}

// Basis-URL zu RESTHeart
var BASEURL = "https://pegenau.com:16392";

var getCollections = function (database, username, password, $http, func) {
	setAuthHeader(username, password, $http);

	$http.get(BASEURL + "/" + database).then(
		function (response) {
			func(response.data._embedded['rh:coll']);
		}
		);
};
var getViews = function(database, collection, username, password, $http, func) {
	setAuthHeader(username, password, $http);
	
	$http.get(BASEURL + "/" + database + "/" + collection).then(
		function (response) {
			func(response);
		}
	);
};

var getCollection = function(database, collection, username, password, $http, func) {
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

var setAuthHeader = function (username, password, $http) {
	$http.defaults.headers.common['Authorization'] = "Basic " + btoa(username + ":" + password);
}
