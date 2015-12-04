"use strict";angular.module("datacityApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/data.html",controller:"MainCtrl",controllerAs:"main"}).when("/city",{templateUrl:"views/city.html",controller:"CityCtrl",controllerAs:"city"}).when("/data",{templateUrl:"views/data.html",controller:"MainCtrl",controllerAs:"main"}).when("/views/",{templateUrl:"views/views.html",controller:"ViewsCtrl",controllerAs:"views"}).when("/views/:collID",{templateUrl:"views/views.html",controller:"ViewsCtrl",controllerAs:"views"}).when("/admin",{templateUrl:"views/admin.html",controller:"AdminCtrl",controllerAs:"admin"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"login"}).otherwise({redirectTo:"/data"})}]);var App=angular.module("datacityApp");App.controller("MainCtrl",["$scope","$http","$rootScope","$log",function(a,b,c,d){$(".nav a").on("click",function(){$(".nav").find(".active").removeClass("active"),$(this).parent().addClass("active")}),a.login=function(a){c.username=a},a.logout=function(){c.username=null},a.chosenCollection=null,a.setChosenCollection=function(c){getCollection(e,c,f,g,b,function(b){a.chosenCollection===b?a.chosenCollection=null:a.chosenCollection=b,d.info(a.chosenCollection.data._id)})},a.getIdOfCollection=function(a){return a?a.data._id:null},a.deleteDataset=function(b){delete a.data[b],c.chosenDataset===b&&(c.chosenDataset=null)};var e="prelife",f="a",g="a";getCollections(e,f,g,b,function(b){a.collections=b,a.numberOfCollections=Object.keys(b).length}),a.formatTimeString=function(a){var b=new Date(a);return b.toLocaleDateString()+" "+b.toLocaleTimeString()}}]),angular.module("datacityApp").directive("choosedatasource",function(){return{template:'<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Datenquelle wählen</h3></div><div class="panel-body"><form name="dataSourceForm"><label><input type="radio" ng-model="dataSource" value="existingCollection">Bestehenden Datensatz verwenden</label><br/><label><input type="radio" ng-model="dataSource" value="existingView">Bestehende Ansicht verwenden</label><br/><label><input type="radio" ng-model="dataSource" value="uploadCSVFile">CSV-Datei hochladen</label><br/><chooseexistingmongodbcollection ng-show="dataSource == \'existingCollection\'"></chooseexistingmongodbcollection><uploadformdatasourcefile ng-show="dataSource == \'uploadCSVFile\'"></uploadformdatasourcefile><chooseexistingview ng-show="dataSource == \'existingView\'"></chooseexistingview></div></div>',restrict:"E",link:function(a,b,c){}}}),angular.module("datacityApp").directive("uploadformdatasourcefile",function(){return{template:'<div class="container"><h3>Eine .csv-Datei hochladen:</h3><input name="Datei" type="file" size="50" accept="csv/*"><button type="button" class="btn btn-default" onclick="">Datei hochladen</button></div>',restrict:"E"}}),angular.module("datacityApp").directive("chooseexistingmongodbcollection",function(){return{template:'<div class ="container"><h3>Einen Datensatz auswählen:</h3><div class="btn-group"> <!--  ng-repeat="sets in datasets" --><button type="button" class="btn btn-default btn-sm">Datensatz 1</button><button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button></div><div class="btn-group"><button type="button" class="btn btn-default btn-sm">Datensatz 2</button><button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button></div><div class="btn-group"><button type="button" class="btn btn-default btn-sm">...</button><button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button></div><!--[Nach Auswahl eines Datensatzes werden die Parameter und Ansichten aktualisiert; Sicherheitsabfrage beim Löschen]--></div>',restrict:"E",link:function(a,b,c){}}}),angular.module("datacityApp").directive("displaydatasettings",function(){return{template:"<div></div>",restrict:"E",link:function(a,b,c){b.text("this is the displaydatasettings directive")}}}),angular.module("datacityApp").controller("ViewsCtrl",["$scope","$route","$routeParams","$log","$http",function(a,b,c,d,e){function f(){this.name="Neue Ansicht",this.collID=a.collID,this.creator=h,this.timeOfCreation=Date.now(),this.lastModifiedBy=h,this.timeOfLastModification=this.timeOfCreation,this.dimensions={hoehe:null,flaeche:null,farbe:null,district:null}}function g(b){this.name=b.name+" (Kopie)",this.collID=a.collID,this.creator=h,this.timeOfCreation=Date.now(),this.lastModifiedBy=h,this.timeOfLastModification=this.timeOfCreation,this.dimensions=b.dimensions}a.collID=null,a.views=null,a.numberOfViews=null,a.chosenView=null,a.collection=null,a.attributesOfCollection=null;var h="a",i="a",j="einstellungen",k="ansichten",l="https://pegenau.com:16392";a.getViews=function(b){getViews(j,k,h,i,e,function(c){a.views=c.data._embedded["rh:doc"],a.views&&a.views.length&&(a.numberOfViews=a.views.length,b&&b(a.views))})},a.updateView=function(){updateView(a.chosenView,h,i,e,function(b){var c=a.chosenView._id;a.chosenView=null,a.getViews(function(b){for(var e in b)d.info(b[e]),b[e]._id===c&&a.setChosenView(b[e])})})},a.setChosenView=function(b){a.chosenView===b?(a.chosenView=null,a.collection=null,a.attributesOfCollection=null):(a.chosenView=b,getCollection("prelife",a.chosenView.collID,h,i,e,function(b){a.collection=b,d.info(a.collection);var c=a.collection.data._embedded["rh:doc"][0],e=[];for(var f in c)f.startsWith("_",0)||e.push(f);a.attributesOfCollection=e,d.info(e)})),d.info(a.chosenView)},c.collID&&(a.collID=c.collID,a.getViews()),a.deleteView=function(b){deleteView(b,h,i,e,function(b){console.log(b),a.getViews()})},a.newView=function(b){var c=new f;d.info(c);var g=l+"/einstellungen/ansichten/"+c.timeOfCreation;e.put(g,c).then(function(b){a.getViews()}),a.setChosenView(c)},a.copyView=function(b){var c=new g(b);d.info(c);var f=l+"/einstellungen/ansichten/"+c.timeOfCreation;e.put(f,c).then(function(b){a.getViews()})},a.jstimeToFormatedTime=function(a){var b=new Date(a);return b.toLocaleDateString()+" "+b.toLocaleTimeString()}}]),angular.module("datacityApp").controller("CityCtrl",["$http","$scope","$log",function(a,b,c){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("datacityApp").directive("hbar",function(){return{template:'<hr style="width: 100%; color: black; height: 1px; background-color:black;" />',restrict:"E",link:function(a,b,c){}}}),angular.module("datacityApp").directive("chooseexistingview",function(){return{template:'<div class ="container"><h3>Eine Ansicht auswählen:</h3><div class="btn-group"> <!--  ng-repeat="view in views" --><button type="button" class="btn btn-default btn-sm">Ansicht 1</button><button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button></div><div class="btn-group"><button type="button" class="btn btn-default btn-sm">Ansicht 2</button><button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button></div><div class="btn-group"><button type="button" class="btn btn-default btn-sm">...</button><button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button></div><!--[Nach Auswahl eines Datensatzes werden die Parameter aktualisiert; Sicherheitsabfrage beim Löschen]--></div>',restrict:"E",link:function(a,b,c){}}}),angular.module("datacityApp").controller("AdminCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("datacityApp").controller("LoginCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("datacityApp").directive("tableofviews",function(){return{template:"<div></div>",restrict:"E",link:function(a,b,c){b.text("this is the tableofviews directive")}}});var BASEURL="https://pegenau.com:16392",ANSICHTEN="/einstellungen/ansichten",setAuthHeader=function(a,b,c){c.defaults.headers.common.Authorization="Basic "+btoa(a+":"+b)},getCollections=function(a,b,c,d,e){setAuthHeader(b,c,d),d.get(BASEURL+"/"+a).then(function(a){e(a.data._embedded["rh:coll"])})},getViews=function(a,b,c,d,e,f){setAuthHeader(c,d,e),e.get(BASEURL+"/"+a+"/"+b).then(function(a){f(a)})},count=function(a){return Object.keys(a).length},getViewsByColID=function(a,b,c,d,e,f,g){setAuthHeader(d,e,f),f.get(BASEURL+"/"+a+"/"+b).then(function(a){g(a)})},getCollection=function(a,b,c,d,e,f){setAuthHeader(c,d,e),e.get(BASEURL+"/"+a+"/"+b).then(function(a){f(a)})},getNumberOfCollections=function(a,b,c,d,e){getCollections(a,b,c,d,function(a){var b=Object.keys(a).length;e(b)})},getNumberOfViews=function(a,b,c,d,e,f){getViews(a,b,c,d,e,function(a){var b=Object.keys(a).length;f(b)})},deleteView=function(a,b,c,d,e){var f={headers:{"If-Match":a._etag.$oid}},g=BASEURL+ANSICHTEN+"/"+a._id;d["delete"](g,f).then(function(a){e(a)})},updateView=function(a,b,c,d,e){var f={headers:{"If-Match":a._etag.$oid}},g=BASEURL+ANSICHTEN+"/"+a._id;d.patch(g,a,f).then(function(a){e(a)})};angular.module("datacityApp").run(["$templateCache",function(a){a.put("views/admin.html","<p>This is the admin view.</p>"),a.put("views/city.html",'<div id="Stadt"> <h1 ng-click="loadCollections();">Hier könnte ihre Stadt stehen!</h1> {{json}} </div>'),a.put("views/data.html",'<div ng-app="datacityApp" ng-controller="MainCtrl"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Datensätze</h3> </div> <div class="panel-body"> <table class="table"> <tr> <th>Name</th> <th>Erstellt</th> <th>Geändert</th> <th></th> </tr> <tr ng-repeat="collection in collections" ng-click="setChosenCollection(collection._id)"> <td>{{collection._id}}</td> <td>{{formatTimeString(collection._created_on)}}</td> <td>{{formatTimeString(collection._lastupdated_on)}}</td> <td><span class="glyphicon glyphicon-trash" aria-hidden="true" ng-click="deleteDataset(collection.id)" data-toggle="tooltip" title="Löschen"></span></td> <!--  Erst nochmal draußen, weil es blöd wäre, jetzt schon einen Datensatz zu löschen, ohne einen hinzufügen zu können\r\n          <td><span class="glyphicon glyphicon-trash" aria-hidden="true" ng-click="deleteDataset(collection.id)" data-toggle="modal" data-target="#deleteCollectionModal"></span></td> --> </tr> </table> <div ng-show="chosenCollection" class="well"> <a href="#/views/{{getIdOfCollection(chosenCollection)}}">{{getIdOfCollection(chosenCollection)}}</a> </div> <button type="button" class="btn btn-default pull-right" ng-click="dataView.showUploadForm = !dataView.showUploadForm"> <span class="glyphicon glyphicon-upload" aria-hidden="true"></span> CSV-Datei hochladen </button> </div> </div> <div class="panel panel-default" ng-show="dataView.showUploadForm"> <div class="panel-heading"> <h3 class="panel-title">Datensatz hochladen</h3> </div> <div class="panel-body"> <uploadformdatasourcefile></uploadformdatasourcefile> </div> <!-- Modal --> <div id="deleteCollectionModal" class="modal fade" role="dialog"> <div class="modal-dialog modal-sm"> <!-- Modal content--> <div class="modal-content"> <div class="modal-body"> <p>Möchten Sie den Datensatz "{{chosenCollection.name}}" wirklich löschen?</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-danger" data-dismiss="modal" ng-click="deleteCollection(chosenCollection)">Ja</button> <button type="button" class="btn btn-default" data-dismiss="modal">Nein</button> </div> </div> </div> </div> </div></div>'),a.put("views/login.html",'<div ng-app="datacityApp" ng-controller="MainCtrl"> <form role="form"> <div class="form-group"> <label for="email">Username:</label> <input type="text" class="form-control" ng-model="usernameInput"> </div> <div class="form-group"> <label for="pwd">Password: [noch keine Funktion]</label> <input type="password" class="form-control"> </div> <button type="submit" class="btn btn-default" ng-click="login(usernameInput)">Einloggen</button> </form> </div>'),a.put("views/main.html",'<choosedatasource></choosedatasource> <hr style="width: 100%; color: black; height: 1px; background-color:black"> <div class="container"> <button type="button" class="btn btn-default" onclick="ausgabe()">Ausgabe anzeigen</button> </div> <div class="container"> <h3>Ausgabe:</h3> <p id="ausgabe"></p> </div>'),a.put("views/views.html",'<div ng-app="datacityApp" ng-controller="ViewsCtrl"> <a ng-href="#/data"><i class="glyphicon glyphicon-chevron-left"></i>Einen Datensatz auswählen</a> <div class="alert alert-danger" role="alert" ng-hide="collID"> <h3>Kein Datensatz gewählt!</h3> </div> <div ng-show="collID"> <h3>Ausgewählter Datensatz: {{collID}}</h3> </div> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Ansichten</h3> </div> <div class="panel-body"> <table class="table"> <tr> <th>Name</th> <th>Datensatz</th> <th>Erstellt von</th> <th>Erstellt am</th> <th>Geändert von</th> <th>Geändert am</th> </tr> <tr ng-repeat="view in views | filter:collID" ng-click="setChosenView(view);"> <td>{{view.name}}</td> <td>{{view.collID}}</td> <td>{{view.creator}}</td> <td>{{jstimeToFormatedTime(view.timeOfCreation)}}</td> <td>{{view.lastModifiedBy}}</td> <td>{{jstimeToFormatedTime(view.timeOfLastModification)}}</td> </tr> <tr ng-hide="numberOfViews > 0"> <td colspan="6" align="center">Keine Ansichten vorhanden!</td> </tr> </table> </div> <button type="button" class="btn btn-default pull-right" ng-click="newView();"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Neue Ansicht erstellen </button> </div> <br> <!--- Was ist schöner ?\r\n	<div class="panel panel-default" ng-show ="chosenView != null"> --> <div class="panel panel-default"> <div class="panel-heading"> Ansicht bearbeiten: {{chosenView.name}} <div class="btn-group btn-group-xs pull-right" role="group" aria-label="..."> <!-- Reihenfolge der beiden "data-toggle"\'s nicht verändern! Funktioniert nur so! --> <button type="button" class="btn btn-default" data-toggle="modal" data-target="#deleteViewModal" data-toggle="tooltip" title="Löschen"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> </button> <button type="button" class="btn btn-default" data-toggle="tooltip" title="Was soll hier hin?"> <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> </button> <button type="button" class="btn btn-default" data-toggle="tooltip" title="Download"> <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> </button> <button type="button" class="btn btn-default" data-toggle="tooltip" title="Kopie erstellen" ng-click="copyView(chosenView)"> <span class="glyphicon glyphicon-copy" aria-hidden="true"></span> </button> </div> </div> <div class="panel-body"> <div class="input-group"> <span class="input-group-addon">Name</span> <input type="text" class="form-control" placeholder="{{chosenView.name}}" ng-model="chosenView.name" ng-blur="updateView();"> </div> <br> <div> <h4>Dimensionen festlegen</h4> <div class="input-group"> <span class="input-group-addon">Name des Gebäudes</span> <select class="form-control" ng-model="chosenView.dimensions.name" ng-options="attr as attr for attr in attributesOfCollection"> </select> </div> <br> <div class="input-group"> <span class="input-group-addon">Fläche</span> <select class="form-control" ng-model="chosenView.dimensions.flaeche" ng-options="attr as attr for attr in attributesOfCollection"> </select> </div> <br> <div class="input-group"> <span class="input-group-addon">Höhe</span> <select class="form-control" ng-model="chosenView.dimensions.hoehe" ng-options="attr as attr for attr in attributesOfCollection"> </select> </div> <br> <div class="input-group"> <span class="input-group-addon">Farbe</span> <select class="form-control" ng-model="chosenView.dimensions.farbe" ng-options="attr as attr for attr in attributesOfCollection"> </select> </div> <br> <div class="input-group"> <span class="input-group-addon">District</span> <select class="form-control" ng-model="chosenView.dimensions.district" ng-options="attr as attr for attr in attributesOfCollection"> </select> </div> <button type="button" class="btn btn-default" ng-click="updateView();">Änderungen speichern</button> </div> </div> </div> <!-- Modal --> <div id="deleteViewModal" class="modal fade" role="dialog"> <div class="modal-dialog modal-sm"> <!-- Modal content--> <div class="modal-content"> <div class="modal-body"> <p>Möchten Sie die Ansicht "{{chosenView.name}}" wirklich löschen?</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-danger pull-left" data-dismiss="modal" ng-click="deleteView(chosenView)">Ja</button> <button type="button" class="btn btn-default" data-dismiss="modal">Nein</button> </div> </div> </div> </div> </div>')}]);