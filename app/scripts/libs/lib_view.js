var test = function(a, b) {
	return a + b;
}

// Basis-URL zu RESTHeart
var BASEURL = "https://pegenau.com:16392";

var getCollections = function(database, username, password, $http, func) {
	setAuthHeader(username, password, $http);
	
	$http.get(BASEURL + "/" + database).then(
		function (response) {
			func(response.data._embedded['rh:coll']);
		}
	);
};

var setAuthHeader = function(username, password, $http) {
	$http.defaults.headers.common['Authorization'] = "Basic " + btoa(username + ":" + password);
}
