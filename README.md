# Data-City - Web-Client
Browser-Oberfläche zur Anzeige und Anpassung der *DataCity*

## Voraussetzungen
* Funktionierender RESTHeart-Server, siehe Anleitung (https://github.com/Data-City/MongoDB-Rest/blob/master/README.md)

## Betrieb
Der Betrieb kann grundsätzlich mit einem beliebigen Webserver erfolgen. Der in RESTHeart integrierte, minimale Webserver ist für diesen Zweck ausreichend. Die Nutzung wird ebenfalls in der Anleitung zu RESTHeart geschildert.

Alle auszuliefernden Inhalte liegen im Unterordner *dist*. Falls ein anderer Webserver genutzt wird, muss er diese Inhalte ausliefern.

## Konfiguration

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

