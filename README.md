# Data-City - Web-Client
Browser-Oberfläche zur Anzeige und Anpassung der *DataCity*

## Voraussetzungen
* Funktionierender RESTHeart-Server, siehe Anleitung (https://github.com/Data-City/MongoDB-Rest/blob/master/README.md)

## Betrieb
Der Betrieb kann grundsätzlich mit einem beliebigen Webserver erfolgen. Der in RESTHeart integrierte, minimale Webserver ist für diesen Zweck ausreichend. Die Nutzung wird ebenfalls in der Anleitung zu RESTHeart geschildert.

Alle auszuliefernden Inhalte liegen im Unterordner *dist*. Falls ein anderer Webserver genutzt wird, muss er diese Inhalte ausliefern.

## Konfiguration
Die Konfiguration des Clients erfolgt in der Datei *dist/scripts/controllers/settings ... .js* (Aus Caching-Gründen fügt Grunt zwischen *settings* und *.js* einen Hash ein).

Parameter | Bedeutung
----------|-----------
databaseForCollections | In welcher Datenbank der MongoDB liegen die Datensätze?
databaseForViews | In welcher Datenbank liegen die Einstellungen zu den Ansichten. **WICHTIG:** Ansichten und Datensätze müssen in zwei verschiedenen Datenbanken liegen!
collection | In welcher Collection liegen die Ansichten (in der Datenbank databaseForViews)
baseurl | Basis-URL zum RESTHEart Server. Beispiel: https://rest.server.net:1234
max_docs_per_aggregation | Wie viele Datensätze sollen in der Stadt maximal angezeigt werden? Hängt mit der maximalen Datengröße (16MB) zwischen den einzelnen MongoDB-Aggregationsstufen zusammen, die die binäre BSON-Darstellung der Daten nicht übersteigen darf.

## Anleitung für Entwickler
### Anlegen der Entwicklungsumgebung
Eine Entwicklungsumgebung erzeugt man sich mit den folgenden Shell/Cmd-Befehlen. Vorraussetzung ist die Installation von Node.js (https://nodejs.org/) im Systempfad.
```
mkdir datacity
cd datacity
git init
git pull https://github.com/Data-City/client.git
npm install
bower install
```
### Grunt Befehle
Befehl              | Bedeutung
--------------------|---------
grunt | Kompiliert (minifiziert, testet, ...) den aktuellen Entwicklungsstand und erzeugt eine auslieferbare dist-Version
grunt serve|Zeigt den aktuellen Entwicklungsstand mit live-reload nach Änderungen an
grunt serve:dist|Zeigt die kompilierte Version an

