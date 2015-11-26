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
    "<div class=\"container\"> Die aktuelle Ansicht speichern unter: <input type=\"text\"> <button type=\"button\" class=\"btn btn-default\" onclick=\"\">Ansicht speichern</button> </div> <div class=\"container\"> <h3>Parameter eingeben:</h3> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Name:</label> <select class=\"form-control\" id=\"gruppierung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Flächeninhalt:</label> <select class=\"form-control\" id=\"flaecheselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Höhe:</label> <select class=\"form-control\" id=\"hoeheselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> </div> <h3>Ab hier muss alles in späteren Instanzen eingefügt werden!</h3> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Gruppierungen:</label> <select class=\"form-control\" id=\"gruppierung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Hier muss noch nach Abfrage des Typs bei Integer ein Eingabefeld hin] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Farbe:</label> <select class=\"form-control\" id=\"farbeselektieren\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-4\"> <br><br> <label class=\"radio-inline\"><input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio1\" checked>Aufsteigend</label> <label class=\"radio-inline\"><input type=\"radio\" name=\"farbenRadio\" id=\"farbenRadio2\">Absteigend</label> </div> </div> <br><br> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Gruppierungen:</label> <select class=\"form-control\" id=\"gruppierung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Hier muss noch nach Abfrage des Typs bei Integer ein Eingabefeld hin] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label for=\"sel1\">Verbindungen:</label> <select class=\"form-control\" id=\"verbindung\"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> </div> <div class=\"col-sm-8\"> <br>[Es ist noch unklar, wie genau der Input bei den Verbindungen dargestellt wird] </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Winkel einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" id=\"winkelInput\" value=\"0\" onchange=\"winkelOutput.value=value.concat('°')\"> <output id=\"winkelOutput\">0°</output> </div> </div> </div> <div class=\"container\"> <div class=\"col-sm-4\"> <label>Granularität einstellen:</label> <div id=\"slider\"> <input class=\"bar\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" id=\"granularInput\" value=\"0\" onchange=\"granularOutput.value=value.concat('%')\"> <output id=\"granularOutput\">0%</output> </div> </div> </div>"
  );

}]);
