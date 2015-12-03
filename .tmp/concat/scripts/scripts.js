'use strict';

/**
 * @ngdoc overview
 * @name datacityApp
 * @description
 * # datacityApp
 *
 * Main module of the application.
 */
angular
  .module('datacityApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      /*
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/datasets', {
        templateUrl: 'views/datasets.html',
        controller: 'DatasetsCtrl',
        controllerAs: 'datasets'
      })
      .when('/views', {
        templateUrl: 'views/views.html',
        controller: 'ViewsCtrl',
        controllerAs: 'views'
      })
      */
      .when('/city', {
        templateUrl: 'views/city.html',
        controller: 'CityCtrl',
        controllerAs: 'city'
      })
      .when('/data', {
        templateUrl: 'views/data.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/views/', {
        templateUrl: 'views/views.html',
        controller: 'ViewsCtrl',
        controllerAs: 'views'
      })
      .when('/views/:collID', {
        templateUrl: 'views/views.html',
        controller: 'ViewsCtrl',
        controllerAs: 'views'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/data'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */

var App = angular.module('datacityApp');

/*
App.controller('MainCtrl', ['$scope', '$rootScope',function ($scope, $rootScope) {
	        console.log($rootScope.mySetting);
	    }
	]);
*/

//Die richtige Seite in der Navbar wird angezeigt
App.controller('MainCtrl', ["$scope", "$http", "$rootScope", "$log", function ($scope, $http, $rootScope, $log) {
	$(".nav a").on("click", function () {
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});

	// Zeilen auswählen Tabelle
	$scope.selectRow = function (id) {
		if (id == $rootScope.dataset) {
			return success;
		} else {
			return success;
		}
	}

	/*
	//Initialisierung
	if ($rootScope.username == null) {
		$rootScope.username = "Kalle Ölsand";
	}
	*/

	// Login
	$scope.login = function (usernameInput) {
		$rootScope.username = usernameInput;
	}

	$scope.logout = function () {
		$rootScope.username = null;
	}

	// Dataset Vars
	$scope.chosenCollection = null;

	$scope.setChosenCollection = function (id) {
		getCollection(database, id, username, password, $http, function (response) {
			if ($scope.chosenCollection === response) {
				$scope.chosenCollection = null;
			} else {
				$scope.chosenCollection = response;
			}
			$log.info($scope.chosenCollection.data._id);
		});
	}

	$scope.getIdOfCollection = function (collection) {
		return collection ? collection.data._id : null;
	}

	$scope.deleteDataset = function (id) {
		delete $scope.data[id];
		if ($rootScope.chosenDataset == id) {
			$rootScope.chosenDataset = null;
		}
	}

	// DataView Vars
	$scope.dataView = {
		showUploadForm: false
	};

	$scope.viewView = {
		setChosenView: function (id) {
			if ($scope.chosenView == id) {
				$scope.chosenView = null;
			} else {
				$scope.chosenView = id;
			}
		}
	}

	$scope.numberOfViews = function () {
		var count = Object.keys($scope.views).length;
		return count;
	};

	$scope.createNewView = function (chooseViewAfter) {
		var nextID = $scope.numberOfViews() + 1;
		var d = new Date();
		$scope.views[nextID] = {
			id: nextID,
			name: 'Neue Ansicht',
			collectionID: $rootScope.chosenDataset,
			creator: $rootScope.username,
			createdAt: d.toLocaleDateString()
		}
		if (typeof chooseViewAfter !== 'undefined') {
			$scope.viewView.setChosenView(nextID);
		}
	};

	$scope.deleteView = function (id) {
		delete $scope.views[id];
		$scope.chosenView = null;
	}

	$scope.chosenCollection = null;
	$scope.chosenView = null;

	var exampleViews = {
		1: {
			id: 1,
			name: "GebRate1",
			collectionID: 1, //Geburtenrate in Hessen
			creator: "Steffen Statistiker",
			createdAt: "26.11.2015 17:25 Uhr",
			dimensions: {
				name: "",
				area: "",
				height: "",
				color: ""
			}
		},
		2: {
			id: 2,
			name: "Logfile vom 24.12.2015",
			collectionID: 2, //Apache Log Files
			creator: "Benedikt Rumtreiber",
			createdAt: "30.11.2015 16:40 Uhr",
			dimensions: {
				name: {
					attr: null
				},
				area: {
					attr: null
				},
				height: {
					attr: null
				}
			}
		},
		3: {
			id: 3,
			name: "Export vom 1.1.1994",
			collectionID: 3, //User SQL Export
			creator: "Benedikt Rumtreiber",
			createdAt: "30.11.2015 16:41 Uhr",
			dimensions: {
				name: {
					attr: null
				},
				area: {
					attr: null
				},
				height: {
					attr: null
				}
			}
		}
	};

	$scope.views = exampleViews;
		
		
	/*
	var exampleData = {
		1 : {
			id: 1,
			name: "Geburtenrate in Hessen",
			creator: "Max Mustermann",
			createdAt: "25.11.2015 11:25 Uhr",
			attributes: {
				1: {
					name: "Stadt",
					type: "String"
				},
				2: {
					name: "Jahr",
					type: "int"
				},
				3: {
					name: "Geburten (absolut)",
					type: "int"
				},
				4: {
					name: "Veränderung zum Vorjahr in Prozent",
					type: "double"
				}
			},
			values: {
				1: {
					Stadt: "Wiesbaden",
					Jahr: 1990,
					Absolut: 345,
					Diff: 1.08
				}
			}
		},
		2 : {
			id: 2,
			name: "Apache Log Files",
			creator: "Viktor Verwalter",
			createdAt: "16.03.2013 15:48 Uhr",
			attributes: {
				1: {
					name: "Name",
					type: "String"
				},
				2: {
					name: "Datum",
					type: "int"
				},
				3: {
					name: "Anzahl Zeilen",
					type: "int"
				},
				4: {
					name: "Fehler?",
					type: "boolean"
				}
			}
		},
		3 : {
			id: 3,
			name: "User SQL Export",
			creator: "Renate Ritter",
			createdAt: "28.04.2014 19:57 Uhr",
			attributes: {
				1: {
					name: "Benutzer",
					type: "String"
				},
				2: {
					name: "Anzahl Datensätze",
					type: "int"
				},
				3: {
					name: "Datum",
					type: "String"
				},
			}
		},
	};
	*/
	$scope.data = null;


	var database = "prelife";
	var username = "a";
	var password = "a";


	getCollections(database, username, password, $http, function (response) {
		$scope.collections = response;
		$scope.numberOfCollections = Object.keys(response).length;
	});


	$scope.formatTimeString = function (timeString) {
		var d = new Date(timeString);
		return d.toLocaleDateString() + " " + d.toLocaleTimeString();
	}

}]);
'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:choosedatasource
 * @description
 * # choosedatasource
 */
angular.module('datacityApp')
  .directive('choosedatasource', function () {
    return {
      template: '' +
        '<div class="panel panel-default">' +
          '<div class="panel-heading">' + 
            '<h3 class="panel-title">Datenquelle wählen</h3>' +
          '</div>' +
          '<div class="panel-body">' +
            '<form name="dataSourceForm">' +
            '<label>' +
              '<input type="radio" ng-model="dataSource" value="existingCollection">' +
                'Bestehenden Datensatz verwenden' +
            '</label><br/>' +
            '<label>' +
                '<input type="radio" ng-model="dataSource" value="existingView">' +
                'Bestehende Ansicht verwenden' +
            '</label><br/>' +
            '<label>' +
                '<input type="radio" ng-model="dataSource" value="uploadCSVFile">' +
                'CSV-Datei hochladen' +
            '</label><br/>' +
          '<chooseexistingmongodbcollection ng-show="dataSource == \'existingCollection\'"></chooseexistingmongodbcollection>' +
	        '<uploadformdatasourcefile ng-show="dataSource == \'uploadCSVFile\'"></uploadformdatasourcefile>' +
          '<chooseexistingview ng-show="dataSource == \'existingView\'"></chooseexistingview>' +
          '</div>' +
         '</div>',
      restrict: 'E',
      
      link: function postLink(scope, element, attrs) {
        //element.html(scope.form);
        //element.text(scope.form);
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:uploadformdatasourcefile
 * @description
 * # uploadformdatasourcefile
 */
angular.module('datacityApp')
  .directive('uploadformdatasourcefile', function () {
    return {
      template: '' +
        '<div class="container">' +
	        '<h3>Eine .csv-Datei hochladen:</h3>' + 
		      '<input name="Datei" type="file" size="50" accept="csv/*">' +
		      '<button type="button" class="btn btn-default" onclick="">Datei hochladen</button>' +
        '</div>',
      restrict: 'E',
      /*
      link: function postLink(scope, element, attrs) {
        element.text('');
      }*/
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:chooseexistingmongodbcollection
 * @description
 * # chooseexistingmongodbcollection
 */
angular.module('datacityApp')
  .directive('chooseexistingmongodbcollection', function () {
    return {
      template: '' +
      '<div class ="container">' + 
        '<h3>Einen Datensatz auswählen:</h3>' + 
          '<div class="btn-group"> <!--  ng-repeat="sets in datasets" -->' +
            '<button type="button" class="btn btn-default btn-sm">Datensatz 1</button>' +
            '<button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>' +
          '</div>' +
          '<div class="btn-group">' +
              '<button type="button" class="btn btn-default btn-sm">Datensatz 2</button>' +
              '<button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>' +
          '</div>' +
          '<div class="btn-group">' +
            '<button type="button" class="btn btn-default btn-sm">...</button>' +
            '<button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>' +
          '</div>' +
    '<!--' +
    '[Nach Auswahl eines Datensatzes werden die Parameter und Ansichten aktualisiert; Sicherheitsabfrage beim Löschen]' +
    '-->' +
    '</div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the chooseexistingmongodbcollection directive');
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:displaydatasettings
 * @description
 * # displaydatasettings
 */
angular.module('datacityApp')
  .directive('displaydatasettings', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the displaydatasettings directive');
      }
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:ViewsCtrl
 * @description
 * # ViewsCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('ViewsCtrl', ["$scope", "$route", "$routeParams", "$log", "$http", function ($scope, $route, $routeParams, $log, $http) {
    View.prototype.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.collID = null;
    $scope.views = null;
    $scope.numberOfViews = null;
    $scope.chosenView = null;
    $scope.collection = null;
    $scope.attributesOfCollection = null;

    var username = "a";
    var password = "a";
    var database = "einstellungen";
    var collection = "ansichten";
    var baseurl = "https://pegenau.com:16392";

    $scope.getViews = function (func) {
      getViews(database, collection, username, password, $http, function (response) {
        $scope.views = response.data._embedded['rh:doc'];
        if ($scope.views && $scope.views.length) {
          $scope.numberOfViews = $scope.views.length;
          if (func) {
            func($scope.views);
          }
        }
      });
    }

    $scope.updateView = function () {
      updateView($scope.chosenView, username, password, $http, function (response) {
        var id = $scope.chosenView._id;
        $scope.chosenView = null;
        $scope.getViews(function (views) {
          for (var arrayIndex in views) {
            $log.info(views[arrayIndex]);
            if (views[arrayIndex]._id === id) {
              $scope.setChosenView(views[arrayIndex]);
            }
          }
        });
      });
    }

    $scope.setChosenView = function (view) {
      if ($scope.chosenView === view) {
        $scope.chosenView = null;
        $scope.collection = null;
        $scope.attributesOfCollection = null;
      } else {
        $scope.chosenView = view;
        getCollection("prelife", $scope.chosenView.collID, username, password, $http, function (resp) {
          $scope.collection = resp;
          $log.info($scope.collection);

          var firstDocument = $scope.collection.data._embedded['rh:doc'][0];
          var attrs = [];
          for (var key in firstDocument) {
            if (!key.startsWith('_', 0)) {
              attrs.push(key);
            }
          }
          $scope.attributesOfCollection = attrs;
          $log.info(attrs);
        });

      }
      $log.info($scope.chosenView);
    }

    // Initialization
    if ($routeParams.collID) {
      $scope.collID = $routeParams.collID;
      $scope.getViews();
    }

    $scope.deleteView = function (view) {
      deleteView(view, username, password, $http, function (response) {
        console.log(response);
        $scope.getViews();
      });
    };

    function View() {
      this.name = "Neue Ansicht";
      this.collID = $scope.collID;
      this.creator = username;
      this.timeOfCreation = Date.now();
      this.lastModifiedBy = username;
      this.timeOfLastModification = this.timeOfCreation;
      this.dimensions = {
        hoehe: null,
        flaeche: null,
        farbe: null,
        district: null
      }
    }

    $scope.newView = function (collID) {

      var newView = new View();
      $log.info(newView);
      var url = baseurl + '/einstellungen/ansichten/' + newView.timeOfCreation;
      $http.put(url, newView).then(function (response) {
        $scope.getViews();
      });
    };

    function ViewCopy(collID) {
      this.name = collID.name + " (Kopie)";
      this.collID = $scope.collID;
      this.creator = username;
      this.timeOfCreation = Date.now();
      this.lastModifiedBy = username;
      this.timeOfLastModification = this.timeOfCreation;
      this.dimensions = collID.dimensions;
    }

    $scope.copyView = function (collID) {

      var newView = new ViewCopy(collID);
      $log.info(newView);
      var url = baseurl + '/einstellungen/ansichten/' + newView.timeOfCreation;
      $http.put(url, newView).then(function (response) {
        $scope.getViews();
      });
    };


    $scope.jstimeToFormatedTime = function (jstime) {
      var d = new Date(jstime);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }
  }]);

'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:CityCtrl
 * @description
 * # CityCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('CityCtrl', ["$http", "$scope", "$log", function ($http, $scope, $log) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:hbar
 * @description
 * # hbar
 */
angular.module('datacityApp')
  .directive('hbar', function () {
    return {
      template: '<hr style="width: 100%; color: black; height: 1px; background-color:black;" />',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the hbar directive');
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:chooseexistingview
 * @description
 * # chooseexistingview
 */
angular.module('datacityApp')
  .directive('chooseexistingview', function () {
    return {
      template: '' +
        '<div class ="container">' + 
          '<h3>Eine Ansicht auswählen:</h3>' +
          '<div class="btn-group"> <!--  ng-repeat="view in views" -->' +
              '<button type="button" class="btn btn-default btn-sm">Ansicht 1</button>' +
              '<button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>' +
          '</div>' +
          '<div class="btn-group">' +
              '<button type="button" class="btn btn-default btn-sm">Ansicht 2</button>' +
              '<button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>' +
          '</div>' +
            '<div class="btn-group">' +
              '<button type="button" class="btn btn-default btn-sm">...</button>' +
              '<button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>' +
          '</div>' +
            '<!--' +
            '[Nach Auswahl eines Datensatzes werden die Parameter aktualisiert; Sicherheitsabfrage beim Löschen]' +
            '-->' +
        '</div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the chooseexistingview directive');
      }
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('AdminCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('LoginCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:tableofviews
 * @description
 * # tableofviews
 */
angular.module('datacityApp')
  .directive('tableofviews', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the tableofviews directive');
      }
    };
  });

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
angular.module('datacityApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/admin.html',
    "<p>This is the admin view.</p>"
  );


  $templateCache.put('views/city.html',
    "<div id=\"Stadt\"> <h1 ng-click=\"loadCollections();\">Hier könnte ihre Stadt stehen!</h1> {{json}} </div>"
  );


  $templateCache.put('views/data.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"MainCtrl\"> <div class=\"panel panel-default\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Datensätze</h3> </div> <div class=\"panel-body\"> <table class=\"table\"> <tr> <th>Name</th> <th>Erstellt</th> <th>Geändert</th> <th></th> </tr> <tr ng-repeat=\"collection in collections\" ng-click=\"setChosenCollection(collection._id)\"> <td>{{collection._id}}</td> <td>{{formatTimeString(collection._created_on)}}</td> <td>{{formatTimeString(collection._lastupdated_on)}}</td> <td><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\" ng-click=\"deleteDataset(collection.id)\"></span></td> </tr> </table> <div ng-show=\"chosenCollection\" class=\"well\"> <a href=\"#/views/{{getIdOfCollection(chosenCollection)}}\">{{getIdOfCollection(chosenCollection)}}</a> </div> <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"dataView.showUploadForm = !dataView.showUploadForm\"> <span class=\"glyphicon glyphicon-upload\" aria-hidden=\"true\"></span> CSV-Datei hochladen </button> <div class=\"pull-left\"> Legende: <br> <!--  Erst nochmal draußen, weil es blöd wäre, jetzt schon einen Datensatz zu löschen, ohne einen hinzufügen zu können\r" +
    "\n" +
    "        <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\" data-toggle=\"modal\" data-target=\"#deleteModal\"></span> Löschen <br /> --> <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Löschen <br> <span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span> Ansichten verwalten <br> </div> </div> </div> <div class=\"panel panel-default\" ng-show=\"dataView.showUploadForm\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Datensatz hochladen</h3> </div> <div class=\"panel-body\"> <uploadformdatasourcefile></uploadformdatasourcefile> </div> <!-- Modal --> <div id=\"deleteModal\" class=\"modal fade\" role=\"dialog\"> <div class=\"modal-dialog modal-sm\"> <!-- Modal content--> <div class=\"modal-content\"> <div class=\"modal-body\"> <p>Möchten Sie den Datensatz \"{{chosenCollection.name}}\" wirklich löschen?</p> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"deleteCollection(chosenCollection)\">Ja</button> <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Nein</button> </div> </div> </div> </div> </div></div>"
  );


  $templateCache.put('views/login.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"MainCtrl\"> <form role=\"form\"> <div class=\"form-group\"> <label for=\"email\">Username:</label> <input type=\"text\" class=\"form-control\" ng-model=\"usernameInput\"> </div> <div class=\"form-group\"> <label for=\"pwd\">Password: [noch keine Funktion]</label> <input type=\"password\" class=\"form-control\"> </div> <button type=\"submit\" class=\"btn btn-default\" ng-click=\"login(usernameInput)\">Einloggen</button> </form> </div>"
  );


  $templateCache.put('views/main.html',
    "<choosedatasource></choosedatasource> <hr style=\"width: 100%; color: black; height: 1px; background-color:black\"> <div class=\"container\"> <button type=\"button\" class=\"btn btn-default\" onclick=\"ausgabe()\">Ausgabe anzeigen</button> </div> <div class=\"container\"> <h3>Ausgabe:</h3> <p id=\"ausgabe\"></p> </div>"
  );


  $templateCache.put('views/views.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"ViewsCtrl\"> <a ng-href=\"#/data\"><i class=\"glyphicon glyphicon-chevron-left\"></i>Einen Datensatz auswählen</a> <div class=\"alert alert-danger\" role=\"alert\" ng-hide=\"collID\"> <h3>Kein Datensatz gewählt!</h3> </div> <div ng-show=\"collID\"> <h3>Ausgewählter Datensatz: {{collID}}</h3> </div> <div class=\"panel panel-default\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Ansichten</h3> </div> <div class=\"panel-body\"> <table class=\"table\"> <tr> <th>Name</th> <th>Datensatz</th> <th>Erstellt von</th> <th>Erstellt am</th> <th>Geändert von</th> <th>Geändert am</th> </tr> <!-- <tr ng-repeat=\"view in views | filterBy:'creator'\" ng-click=\"viewView.setChosenView(view.id);\"> Funktionert nicht--> <!-- <tr ng-repeat=\"view in views | filterBy: 'Benedikt Rumtreiber'\" ng-click=\"viewView.setChosenView(view.id);\"> Selbst das nicht--> <tr ng-repeat=\"view in views | filter:collID\" ng-click=\"setChosenView(view);\"> <td>{{view.name}}</td> <td>{{view.collID}}</td> <td>{{view.creator}}</td> <td>{{jstimeToFormatedTime(view.timeOfCreation)}}</td> <td>{{view.lastModifiedBy}}</td> <td>{{jstimeToFormatedTime(view.timeOfLastModification)}}</td> </tr> <tr ng-hide=\"numberOfViews > 0\"> <td colspan=\"6\" align=\"center\">Keine Ansichten vorhanden!</td> </tr> </table> </div> <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"newView();\"> <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Neue Ansicht erstellen </button> </div> <br> <div class=\"panel panel-default\" ng-show=\"chosenView\"> <div class=\"panel-heading\"> Ansicht bearbeiten: {{chosenView.name}} <div class=\"btn-group btn-group-xs pull-right\" role=\"group\" aria-label=\"...\"> <button type=\"button\" class=\"btn btn-default\" data-toggle=\"modal\" data-target=\"#deleteModal\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-download-alt\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"copyView(chosenView)\"><span class=\"glyphicon glyphicon-copy\" aria-hidden=\"true\"></span></button> </div> </div> <div class=\"panel-body\"> <div class=\"input-group\"> <span class=\"input-group-addon\">Name</span> <input type=\"text\" class=\"form-control\" placeholder=\"{{chosenView.name}}\" ng-model=\"chosenView.name\" ng-blur=\"updateView();\"> </div> <br> <div> <h4>Dimensionen festlegen</h4> <div class=\"input-group\"> <span class=\"input-group-addon\">Name des Gebäudes</span> <select class=\"form-control\" ng-model=\"chosenView.dimensions.name\" ng-options=\"attr as attr for attr in attributesOfCollection\"> </select> </div> <br> <div class=\"input-group\"> <span class=\"input-group-addon\">Fläche</span> <select class=\"form-control\" ng-model=\"chosenView.dimensions.flaeche\" ng-options=\"attr as attr for attr in attributesOfCollection\"> </select> </div> <br> <div class=\"input-group\"> <span class=\"input-group-addon\">Höhe</span> <select class=\"form-control\" ng-model=\"chosenView.dimensions.hoehe\" ng-options=\"attr as attr for attr in attributesOfCollection\"> </select> </div> <br> <div class=\"input-group\"> <span class=\"input-group-addon\">Farbe</span> <select class=\"form-control\" ng-model=\"chosenView.dimensions.farbe\" ng-options=\"attr as attr for attr in attributesOfCollection\"> </select> </div> <br> <div class=\"input-group\"> <span class=\"input-group-addon\">District</span> <select class=\"form-control\" ng-model=\"chosenView.dimensions.district\" ng-options=\"attr as attr for attr in attributesOfCollection\"> </select> </div> <button type=\"button\" class=\"btn btn-default\" ng-click=\"updateView();\">Änderungen speichern</button> </div> </div> </div> <!-- Modal --> <div id=\"deleteModal\" class=\"modal fade\" role=\"dialog\"> <div class=\"modal-dialog modal-sm\"> <!-- Modal content--> <div class=\"modal-content\"> <div class=\"modal-body\"> <p>Möchten Sie die Ansicht \"{{chosenView.name}}\" wirklich löschen?</p> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-danger pull-left\" data-dismiss=\"modal\" ng-click=\"deleteView(chosenView)\">Ja</button> <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Nein</button> </div> </div> </div> </div> </div> <!--\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<h3>Test {{views[chosenView].dimensions.name.attr}}</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\" ng-repeat=\"set in data\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label>{{set.name}}</label>\r" +
    "\n" +
    "\t        <select class=\"form-control\">\r" +
    "\n" +
    "\t         \t<option ng-repeat=\"collection in set.attributes\">{{collection.name}} - {{collection.type}}</option>\r" +
    "\n" +
    "\t        </select>\r" +
    "\n" +
    "    \t</div>\r" +
    "\n" +
    "    </div>\t\r" +
    "\n" +
    "\r" +
    "\n" +
    "<h1> Hier wird der Datensatz \"Geburtenrate in Hessen\" benutzt </h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label for=\"sel1\">Name:</label>\r" +
    "\n" +
    "\t\t\t<select class=\"form-control\" id=\"name\">\r" +
    "\n" +
    "\t\t\t\t<option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option>\r" +
    "\n" +
    "\t\t\t</select>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label for=\"sel1\">Flächeninhalt:</label>\r" +
    "\n" +
    "\t\t\t<select class=\"form-control\" id=\"area\">\r" +
    "\n" +
    "\t\t\t\t<option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option>\r" +
    "\n" +
    "\t\t\t</select>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label for=\"sel1\">Höhe:</label>\r" +
    "\n" +
    "\t\t\t<select class=\"form-control\" id=\"height\">\r" +
    "\n" +
    "\t\t\t\t<option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option>\r" +
    "\n" +
    "\t\t\t</select>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<h3>Ab hier muss alles in späteren Instanzen eingefügt werden!</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label for=\"sel1\">Farbe:</label>\r" +
    "\n" +
    "\t\t\t<select class=\"form-control\" id=\"farbeselektieren\">\r" +
    "\n" +
    "\t\t\t\t<option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option>\r" +
    "\n" +
    "\t\t\t</select>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<br>\r" +
    "\n" +
    "\t\t\t<br>\r" +
    "\n" +
    "\t\t\t<label class=\"radio-inline\">\r" +
    "\n" +
    "\t\t\t\t<input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio1\" checked>Aufsteigend</label>\r" +
    "\n" +
    "\t\t\t<label class=\"radio-inline\">\r" +
    "\n" +
    "\t\t\t\t<input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio2\">Absteigend</label>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<br>\r" +
    "\n" +
    "\t<br>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label for=\"sel1\">Gruppierungen:</label>\r" +
    "\n" +
    "\t\t\t<select class=\"form-control\" id=\"gruppierung\">\r" +
    "\n" +
    "\t\t\t\t<option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option>\r" +
    "\n" +
    "\t\t\t</select>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"col-sm-8\">\r" +
    "\n" +
    "\t\t\t<br>[Hier muss noch nach Abfrage des Typs bei Integer ein Eingabefeld hin]\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label for=\"sel1\">Verbindungen:</label>\r" +
    "\n" +
    "\t\t\t<select class=\"form-control\" id=\"verbindung\">\r" +
    "\n" +
    "\t\t\t\t<option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option>\r" +
    "\n" +
    "\t\t\t</select>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"col-sm-8\">\r" +
    "\n" +
    "\t\t\t<br>[Es ist noch unklar, wie genau der Input bei den Verbindungen dargestellt wird]\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label>Winkel einstellen:</label>\r" +
    "\n" +
    "\t\t\t<div id=\"slider\">\r" +
    "\n" +
    "\t\t\t\t<input class=\"bar\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" id=\"winkelInput\" value=\"0\" onchange=\"winkelOutput.value=value.concat('°')\"\r" +
    "\n" +
    "\t\t\t\t/>\r" +
    "\n" +
    "\t\t\t\t<output id=\"winkelOutput\">0°</output>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"container\">\r" +
    "\n" +
    "\t\t<div class=\"col-sm-4\">\r" +
    "\n" +
    "\t\t\t<label>Granularität einstellen:</label>\r" +
    "\n" +
    "\t\t\t<div id=\"slider\">\r" +
    "\n" +
    "\t\t\t\t<input class=\"bar\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" id=\"granularInput\" value=\"0\" onchange=\"granularOutput.value=value.concat('%')\"\r" +
    "\n" +
    "\t\t\t\t/>\r" +
    "\n" +
    "\t\t\t\t<output id=\"granularOutput\">0%</output>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div class = \"container\">\r" +
    "\n" +
    "\t\t<button type=\"button\" class=\"btn btn-default\" onclick=\"ausgabe()\">Ausgabe anzeigen</button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t\r" +
    "\n" +
    "\t\t<div class = \"container\">\r" +
    "\n" +
    "\t\t\t<h3>Ausgabe:</h3>\r" +
    "\n" +
    "\t\t\t<p id=\"ausgabe\"></p>\r" +
    "\n" +
    "\t\t</div>\t\t\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t\r" +
    "\n" +
    "-->"
  );

}]);
