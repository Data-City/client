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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
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
 
 //Angular Test; Yeoman Tutorial
angular.module('datacityApp')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.todos = ['Item 1', 'Item 2', 'Item 3'];
    $scope.addTodo = function () {
      $scope.todos.push($scope.todo);
      $scope.todo = '';
    };
    $scope.removeTodo = function (index) {
      $scope.todos.splice(index, 1);
    };
  }]);
  
  //metadaten repeaten
	var App = angular.module('App', []);

	App.controller('TodoCtrl', ["$scope", "$http", function($scope, $http) {
	  $http.get('dataCity.json')
		   .then(function(res){
			  $scope.todos = res.data;                
			});
	}]);
  
function uploadWechseln(){
	var uploadAusgewaehlt;
	var ausgabe = "";
	var upload = document.getElementById("uploadAusgabe");
	
	if (document.getElementById("uploadRadio").checked === true) {
		ausgabe = document.getElementById("upload").innerHTML;
	} else {
		ausgabe = document.getElementById("datensatzAnzeigen").innerHTML;
	}
	
	upload.innerHTML = "<div class='container'>" + ausgabe + "</div>";
}

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
 * @ngdoc function
 * @name datacityApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('datacityApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/main.html',
    "<div class=\"container\"> <h3>1. Schritt: Eine Auswahlart auswählen</h3><br> <label class=\"radio-inline\"><input type=\"radio\" name=\"uploadRadio\" onchange=\"uploadWechseln()\" id=\"uploadRadio\">Datei hochladen</label> <label class=\"radio-inline\"><input type=\"radio\" name=\"uploadRadio\" onchange=\"uploadWechseln()\">Datensatz auswählen</label> </div> <div id=\"uploadAusgabe\"></div> <div id=\"upload\" class=\"container\" style=\"display: none\"> <h3>2. Schritt: (Absoluten) Pfad eingeben:</h3> <input class=\"form-control\" id=\"ex2\" type=\"text\" placeholder=\"C://...\"> <button type=\"button\" class=\"btn btn-default\"> <span class=\"glyphicon glyphicon-search\"></span> Durchsuchen... </button> <button type=\"button\" class=\"btn btn-default\" onclick=\"\">Datei hochladen</button> </div> <div id=\"datensatzAnzeigen\" style=\"display: none\" class=\"container\"> <h3>2. Schritt: Einen bereits hochgeladenen Datensatz auswählen</h3> <p>Hier sollte man dann später einen von vielen Datensätzen auswählen können. <br> <button type=\"button\" class=\"btn btn-default\" onclick=\"\">Datensatz verwenden</button> </p></div> <div id=\"metadatenAuswahl\"> <div class=\"container\"> <h3>3. Schritt: Parameter eingeben [For-Schleife mit JavaScript für alle Parameter, die eingelesen wurden?]</h3> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Fläche:</label> <select class=\"form-control\" id=\"flaecheselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Höhe:</label> <select class=\"form-control\" id=\"hoeheselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Farbe:</label> <select class=\"form-control\" id=\"farbeselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-4\"> <br><br> <label class=\"radio-inline\"><input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio1\" checked>Aufsteigend</label> <label class=\"radio-inline\"><input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio2\">Absteigend</label> </div> </div> <br><br> <div class=\"container\"> <p>Erstmal optional, weil noch nicht geklärt ist, wie diese ausgelesen werden</p> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Gruppierungen:</label> <select class=\"form-control\" id=\"gruppierung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Hier muss abgefragt werden, ob die Spalte Integer, Boolean oder String ist. Boolean und String können einfach abgefragt werden (JavaScript -> typeof; 2. Reihe einlesen) <br> Für Integer kann der Nutzer die Anzahl der Blöcke einstellen (oder Standardwert)? -> quadratisch?] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Verbindungen:</label> <select class=\"form-control\" id=\"verbindung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Es ist noch unklar, wie genau der Input bei den Verbindungen dargestellt wird] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Winkel einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" id=\"winkelInput\" value=\"0\" onchange=\"winkelOutput.value=value.concat('°')\"> <output id=\"winkelOutput\">0°</output> </div> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Granularität einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" id=\"granularInput\" value=\"0\" onchange=\"granularOutput.value=value.concat('%')\"> <output id=\"granularOutput\">0%</output> </div> </div> </div> <div class=\"container\"> <button type=\"button\" class=\"btn btn-default\" onclick=\"ausgabe()\">Ausgabe anzeigen</button> </div> <div class=\"container\"> <h3>Ausgabe:</h3> <p id=\"ausgabe\"></p> </div> </div>"
  );

}]);
