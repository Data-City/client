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
    'ngTouch',
    'xeditable'
  ])
  .run(["editableOptions", function(editableOptions) {
  editableOptions.theme = 'bs3';
  }])
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
      .when('/views', {
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

App.controller('MainCtrl', ["$scope", "$http", function($scope, $http) {
	$(".nav a").on("click", function()	{
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});

	// DataView Vars
	$scope.dataView = {
		showUploadForm : false
	};
	
	$scope.viewView = {
		setChosenView : function(id) {
			if($scope.chosenView == id) {
				$scope.chosenView = null;
			} else {
				$scope.chosenView = id;
			}
		}
	}
	
	$scope.numberOfViews = function() {
			var count = Object.keys($scope.views).length;
			return count;
	};
	
	$scope.username = "Kalle Ölsand";
	
	$scope.createNewView = function(chooseViewAfter) {
		var nextID = $scope.numberOfViews() + 1;
		var d = new Date();
		$scope.views[nextID] = {
			id: nextID,
			name: 'Neue Ansicht',
			collectionID: null,
			creator: $scope.username,
			createdAt: d.toLocaleDateString() 
		}
		if(typeof chooseViewAfter !== 'undefined') {
			$scope.viewView.setChosenView(nextID);
		}
	};
	
	$scope.deleteView = function(id) {
		delete $scope.views[id];
		if($scope.chosenView == id) {
			$scope.chosenView = null;
		}
	}
	
	$scope.chosenCollection = null;
	$scope.chosenView = null;
	
	var exampleViews = {
		1: {
			id: 1,
			name: "GebRate1",
			collectionID: 1,
			creator: "Steffen Statistiker",
			createdAt: "26.11.2015 17:25 Uhr"
		}
	};
	
	$scope.views = exampleViews;
		
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
				},
			}
		},
		2 : {
			id: 2,
			name: "Apache Log Files",
			creator: "Viktor Verwalter",
			createdAt: "16.03.2013 15:48 Uhr"
		},
		3 : {
			id: 3,
			name: "User SQL Export",
			creator: "Renate Ritter",
			createdAt: "28.04.2014 19:57 Uhr"
		},
	};
	$scope.data = exampleData;
	
}]);

function ausgabe(){	
	var ausgabe = document.getElementById("ausgabe");
	ausgabe.innerHTML = 
	"Fläche: " + document.getElementById("flaecheselektieren").value +
	"<br>Höhe: " + document.getElementById("hoeheselektieren").value +
	"<br>Farbe: " + document.getElementById("farbeselektieren").value;
	
	if (document.getElementById("farbenRadio1").checked === true){
		ausgabe.innerHTML += "<br>Aufsteigend wurde selektiert";
	} else {
		ausgabe.innerHTML += "<br>Absteigend wurde selektiert";
	}
	
	ausgabe.innerHTML +=
	"<br>Grupperigung nach: " + document.getElementById("gruppierung").value +
	"<br>Verbindungen bilden mit: " + document.getElementById("verbindung").value + 
	"<br>Der Winkel: " + document.getElementById("winkelInput").value + "°" + 
	"<br>Die Granularität: " + document.getElementById("granularInput").value + "%";
}

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
  .controller('ViewsCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:CityCtrl
 * @description
 * # CityCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('CityCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

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

angular.module('datacityApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/admin.html',
    "<p>This is the admin view.</p>"
  );


  $templateCache.put('views/city.html',
    "<p>This is the city view.</p>"
  );


  $templateCache.put('views/data.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"MainCtrl\"> <div class=\"panel panel-default\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Datensätze</h3> </div> <div class=\"panel-body\"> <table class=\"table\"> <tr> <th>Name</th> <th>Erstellt von</th> <th>Erstellt am</th> <th></th> <th></th> </tr> <tr ng-repeat=\"collection in data\"> <td>{{collection.name}}</td> <td>{{collection.creator}}</td> <td>{{collection.createdAt}}</td> <td><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></td> <td><span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span></td> </tr> </table> <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"dataView.showUploadForm = !dataView.showUploadForm\"> <span class=\"glyphicon glyphicon-upload\" aria-hidden=\"true\"></span> CSV-Datei hochladen </button> <div class=\"pull-left\"> Legende: <br> <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Löschen <br> <span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span> Ansichten verwalten <br> </div> </div> </div> <div class=\"panel panel-default\" ng-show=\"dataView.showUploadForm\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Datensatz hochladen</h3> </div> <div class=\"panel-body\"> <uploadformdatasourcefile></uploadformdatasourcefile> </div> </div></div>"
  );


  $templateCache.put('views/login.html',
    "<p>This is the login view.</p>"
  );


  $templateCache.put('views/main.html',
    "<choosedatasource></choosedatasource> <hr style=\"width: 100%; color: black; height: 1px; background-color:black\"> <div class=\"container\"> <button type=\"button\" class=\"btn btn-default\" onclick=\"ausgabe()\">Ausgabe anzeigen</button> </div> <div class=\"container\"> <h3>Ausgabe:</h3> <p id=\"ausgabe\"></p> </div>"
  );


  $templateCache.put('views/views.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"MainCtrl\"> <div class=\"panel panel-default\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Ansichten</h3> </div> <div class=\"panel-body\"> <table class=\"table\"> <tr> <th>Name</th> <th>Datensatz</th> <th>Erstellt von</th> <th>Erstellt am</th> </tr> <tr ng-repeat=\"view in views\" ng-click=\"viewView.setChosenView(view.id);\"> <td>{{view.name}}</td> <td>{{data[view.collectionID].name}}</td> <td>{{view.creator}}</td> <td>{{view.createdAt}}</td> </tr> <tr ng-hide=\"numberOfViews() > 0\"> <td colspan=\"4\" align=\"center\">Keine Ansichten vorhanden!</td> </tr> </table> <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"createNewView(true);\"> <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Neue Ansicht erstellen </button> </div> </div> <div class=\"panel panel-default\" ng-show=\"chosenView\"> <div class=\"panel-heading\"> Ansicht bearbeiten: {{views[chosenView].name}} <div class=\"btn-group btn-group-xs pull-right\" role=\"group\" aria-label=\"...\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"deleteView(chosenView);\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-download-alt\" aria-hidden=\"true\"></span></button> </div> </div> <div class=\"panel-body\"> <div class=\"col-md-4\"> <div class=\"row\">Name</div> </div> <div class=\"col-md-8\"> <div class=\"row\" editable-text=\"views[chosenView].name\">{{views[chosenView].name}}</div> </div> </div> </div> </div> <div class=\"container\"> Die aktuelle Ansicht speichern unter: <input type=\"text\"> <button type=\"button\" class=\"btn btn-default\" onclick=\"\">Ansicht speichern</button> </div> <div class=\"container\"> <h3>Parameter eingeben:</h3> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Name:</label> <select class=\"form-control\" id=\"gruppierung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Flächeninhalt:</label> <select class=\"form-control\" id=\"flaecheselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Höhe:</label> <select class=\"form-control\" id=\"hoeheselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <h3>Ab hier muss alles in späteren Instanzen eingefügt werden!</h3> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Gruppierungen:</label> <select class=\"form-control\" id=\"gruppierung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Hier muss noch nach Abfrage des Typs bei Integer ein Eingabefeld hin] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Farbe:</label> <select class=\"form-control\" id=\"farbeselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-4\"> <br> <br> <label class=\"radio-inline\"> <input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio1\" checked>Aufsteigend</label> <label class=\"radio-inline\"> <input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio2\">Absteigend</label> </div> </div> <br> <br> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Gruppierungen:</label> <select class=\"form-control\" id=\"gruppierung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Hier muss noch nach Abfrage des Typs bei Integer ein Eingabefeld hin] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Verbindungen:</label> <select class=\"form-control\" id=\"verbindung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Es ist noch unklar, wie genau der Input bei den Verbindungen dargestellt wird] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Winkel einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" id=\"winkelInput\" value=\"0\" onchange=\"winkelOutput.value=value.concat('°')\"> <output id=\"winkelOutput\">0°</output> </div> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Granularität einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" id=\"granularInput\" value=\"0\" onchange=\"granularOutput.value=value.concat('%')\"> <output id=\"granularOutput\">0%</output> </div> </div> </div>"
  );

}]);
