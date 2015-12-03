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
