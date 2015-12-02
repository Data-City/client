angular.module('datacityApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/admin.html',
    "<p>This is the admin view.</p>"
  );


  $templateCache.put('views/city.html',
    "<p>This is the city view.</p>"
  );


  $templateCache.put('views/data.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"MainCtrl\"> <div class=\"panel panel-default\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Datensätze</h3> </div> <div class=\"panel-body\"> <table class=\"table\"> <tr> <th>Name</th> <th>Erstellt von</th> <th>Erstellt am</th> <th></th> </tr> <tr ng-repeat=\"collection in data\" ng-click=\"dataset.setChosenDataset(collection.id)\"> <td>{{collection.name}}</td> <td>{{collection.creator}}</td> <td>{{collection.createdAt}}</td> <td><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\" ng-click=\"deleteDataset(collection.id)\"></span></td> </tr> </table> <p>Ausgewählter Datensatz - id: {{chosenDataset}}</p> <p>Ausgewählter Datensatz - Name: {{data[chosenDataset].name}}</p> <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"dataView.showUploadForm = !dataView.showUploadForm\"> <span class=\"glyphicon glyphicon-upload\" aria-hidden=\"true\"></span> CSV-Datei hochladen </button> <div class=\"pull-left\"> Legende: <br> <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span> Löschen <br> <span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span> Ansichten verwalten <br> </div> </div> </div> <div class=\"panel panel-default\" ng-show=\"dataView.showUploadForm\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Datensatz hochladen</h3> </div> <div class=\"panel-body\"> <uploadformdatasourcefile></uploadformdatasourcefile> </div> </div></div>"
  );


  $templateCache.put('views/login.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"MainCtrl\"> <form role=\"form\"> <div class=\"form-group\"> <label for=\"email\">Username:</label> <input type=\"text\" class=\"form-control\" ng-model=\"usernameInput\"> </div> <div class=\"form-group\"> <label for=\"pwd\">Password: [noch keine Funktion]</label> <input type=\"password\" class=\"form-control\"> </div> <button type=\"submit\" class=\"btn btn-default\" ng-click=\"login(usernameInput)\">Einloggen</button> </form> </div>"
  );


  $templateCache.put('views/main.html',
    "<choosedatasource></choosedatasource> <hr style=\"width: 100%; color: black; height: 1px; background-color:black\"> <div class=\"container\"> <button type=\"button\" class=\"btn btn-default\" onclick=\"ausgabe()\">Ausgabe anzeigen</button> </div> <div class=\"container\"> <h3>Ausgabe:</h3> <p id=\"ausgabe\"></p> </div>"
  );


  $templateCache.put('views/views.html',
    "<div ng-app=\"datacityApp\" ng-controller=\"MainCtrl\"> <h3>Ausgewählter Datensatz: <u>{{data[chosenDataset].name}}</u></h3> <div class=\"panel panel-default\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Ansichten</h3> </div> <div class=\"panel-body\"> <table class=\"table\"> <tr> <th>Name</th> <th>Datensatz</th> <th>Erstellt von</th> <th>Erstellt am</th> </tr> <!-- <tr ng-repeat=\"view in views | filterBy:'creator'\" ng-click=\"viewView.setChosenView(view.id);\"> Funktionert nicht--> <!-- <tr ng-repeat=\"view in views | filterBy: 'Benedikt Rumtreiber'\" ng-click=\"viewView.setChosenView(view.id);\"> Selbst das nicht--> <tr ng-repeat=\"view in views\" ng-click=\"viewView.setChosenView(view.id);\"> <td>{{view.name}}</td> <td>{{data[view.collectionID].name}}</td> <td>{{view.creator}}</td> <td>{{view.createdAt}}</td> </tr> <tr ng-hide=\"numberOfViews() > 0\"> <td colspan=\"4\" align=\"center\">Keine Ansichten vorhanden!</td> </tr> </table> </div> <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"createNewView(true);\"> <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Neue Ansicht erstellen </button> </div> <br> <div class=\"panel panel-default\" ng-show=\"chosenView\"> <div class=\"panel-heading\"> Ansicht bearbeiten: {{views[chosenView].name}} <div class=\"btn-group btn-group-xs pull-right\" role=\"group\" aria-label=\"...\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"deleteView(chosenView);\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-download-alt\" aria-hidden=\"true\"></span></button> <button type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-copy\" aria-hidden=\"true\"></span></button> </div> </div> <div class=\"panel-body\"> <div class=\"input-group\"> <span class=\"input-group-addon\">Name</span> <input type=\"text\" class=\"form-control\" placeholder=\"{{views[chosenView].name}}\" ng-model=\"views[chosenView].name\"> </div> <br> <!-- Wird nicht mehr benötigt, wenn man nur einen Datensatz betrachtet\r" +
    "\n" +
    "\t\t\t<div class=\"input-group\">\r" +
    "\n" +
    "\t\t\t\t<span class=\"input-group-addon\">Datensatz</span>\r" +
    "\n" +
    "\t\t\t\t<select class=\"form-control\" ng-model=\"views[chosenView].collectionID\" ng-options=\"collection.id as collection.name for collection in data\">\r" +
    "\n" +
    "\t\t\t\t</select>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<br />\r" +
    "\n" +
    "\t\t\t--> <div ng-show=\"views[chosenView].collectionID\"> <h4>Dimensionen festlegen</h4> <div class=\"input-group\"> <span class=\"input-group-addon\">Name</span> <select class=\"form-control\" ng-model=\"views[chosenView].dimensions.name.attr\" ng-options=\"attr.id as attr.name for attr in data[views[chosenView].collectionID].attributes\"> </select> </div> <br> <div class=\"input-group\"> <span class=\"input-group-addon\">Fläche</span> <select class=\"form-control\" ng-model=\"views[chosenView].dimensions.area.attr\" ng-options=\"attr.id as attr.name for attr in data[views[chosenView].collectionID].attributes\"> </select> </div> <br> <div class=\"input-group\"> <span class=\"input-group-addon\">Höhe</span> <select class=\"form-control\" ng-model=\"views[chosenView].dimensions.height.attr\" ng-options=\"attr.id as attr.name for attr in data[views[chosenView].collectionID].attributes\" ng-change=\"views[chosenView].dimensions.height.attr = value\"> </select> </div> <br> <!-- Kann noch nicht visualisiert werden\r" +
    "\n" +
    "\t\t\t\t<div class=\"input-group\">\r" +
    "\n" +
    "\t\t\t\t\t<span class=\"input-group-addon\">Farbe</span>\r" +
    "\n" +
    "\t\t\t\t\t<select class=\"form-control\" ng-model=\"views[chosenView].dimensions.color.attr\" ng-options=\"attr.id as attr.name for attr in data[views[chosenView].collectionID].attributes\">\r" +
    "\n" +
    "\t\t\t\t\t</select>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<br />\r" +
    "\n" +
    "\t\t\t\t--> </div> </div> </div> <h3>Test {{views[chosenView].dimensions.name.attr}}</h3> <div class=\"container\" ng-repeat=\"set in data\"> <div class=\"col-sm-4\"> <label>{{set.name}}</label> <select class=\"form-control\"> <option ng-repeat=\"collection in set.attributes\">{{collection.name}} - {{collection.type}}</option> </select> </div> </div> ----------- Hier wird der Datensatz \"Geburtenrate in Hessen\" benutzt ----------------- <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Name:</label> <select class=\"form-control\" id=\"name\"> <option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Flächeninhalt:</label> <select class=\"form-control\" id=\"area\"> <option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Höhe:</label> <select class=\"form-control\" id=\"height\"> <option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option> </select> </div> </div> <h3>Ab hier muss alles in späteren Instanzen eingefügt werden!</h3> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Farbe:</label> <select class=\"form-control\" id=\"farbeselektieren\"> <option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option> </select> </div> <div class=\"col-sm-4\"> <br> <br> <label class=\"radio-inline\"> <input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio1\" checked>Aufsteigend</label> <label class=\"radio-inline\"> <input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio2\">Absteigend</label> </div> </div> <br> <br> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Gruppierungen:</label> <select class=\"form-control\" id=\"gruppierung\"> <option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option> </select> </div> <div class=\"col-sm-8\"> <br>[Hier muss noch nach Abfrage des Typs bei Integer ein Eingabefeld hin] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Verbindungen:</label> <select class=\"form-control\" id=\"verbindung\"> <option ng-repeat=\"collection in data[1].attributes\">{{collection.name}}</option> </select> </div> <div class=\"col-sm-8\"> <br>[Es ist noch unklar, wie genau der Input bei den Verbindungen dargestellt wird] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Winkel einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" id=\"winkelInput\" value=\"0\" onchange=\"winkelOutput.value=value.concat('°')\"> <output id=\"winkelOutput\">0°</output> </div> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Granularität einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" id=\"granularInput\" value=\"0\" onchange=\"granularOutput.value=value.concat('%')\"> <output id=\"granularOutput\">0%</output> </div> </div> </div> </div>"
  );

}]);
