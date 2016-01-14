var association = {}; //Hier wird die Legende gespeichert

//Setter fuer association
//@params: newAssociation: die Zuordnung
function setAssociation(newAssociation) {
    association = newAssociation;
}

var gap = 30; //Abstand zwischen den Gebaeuden
var gardenID = 0; //counter fuer die GartenIDs
var hashGarden = {}; //hashed GartenID mit Garten

var arrayOfBuildings, maxWidth, maxDepth, startToBuildInZDirection, extension, buildingInZDirection, lastMaxWidth, width, startToBuildInXDirection; //fuer setOneDistrict

//gibt die Hashtable fuer die Gaerten zurueck
//@return: die Hashtable fuer die Gaerten
function getHashGarden() {
    return hashGarden;
}


//Konstruktor für einen Vorgarten
//@params: aWidth: Breite von dem Garten (x-Richtung)
//			aDepth: Tiefe von dem Garten (z-Richtung)
//			aID: die ID vom Garten
function garden(aWidth, aDepth, aID) {
    var aGarden = {
        _width: aWidth,
        _height: 0.01,
        depth: aDepth,
        _centerPosition: [0, 0.05, 0],
        nextLinePos: [0, 0],
        on: false,
        id: aID,
        linesTo: abhaengigkeiten()
    };
    if (aID < 10) {
        aGarden.linesTo[aID] = 0;
    }
    return aGarden;
}


//Mathode zum Setzen der nächsten Position, von der aus man eine Linea zeichnen kann im Garten
//@params: aGarden: ein Garten
function setNextLinePos(aGarden) {
    if (aGarden.nextLinePos[0] + 0.01 > aGarden._centerPosition[0] + aGarden._width) {
        aGarden.nextLinePos[0] = aGarden._centerPosition[0] - aGarden._width / 2;
        if (aGarden.nextLinePos[1] + 0.01 > aGarden._centerPosition[2] + aGarden.depth) {
            aGarden.nextLinePos[1] = aGarden._centerPosition[1] - aGarden.depth / 2;
        } else {
            aGarden.nextLinePos[1] = aGarden.nextLinePos[1] + 0.01;
        }
    } else {
        aGarden.nextLinePos[0] = aGarden.nextLinePos[0] + 0.01;
    }
}



//Methode zum setzen der GartenPosition in Abhängigkeit vom Gebaeude
//@params: aBuilding: ein Gebaeude oder District
function setGardenPos(aBuilding) {
    aBuilding._rightGarden._centerPosition[0] = aBuilding._centerPosition[0] + 1 + aBuilding._rightGarden._width / 2;
    aBuilding._rightGarden._centerPosition[1] = aBuilding._centerPosition[1] - aBuilding._height / 2 + 0.05;
    aBuilding._rightGarden._centerPosition[2] = aBuilding._centerPosition[2] + 1 + aBuilding._rightGarden.depth / 2 + aBuilding._width / 2;
    aBuilding._leftGarden._centerPosition[0] = aBuilding._centerPosition[0] - 1 - aBuilding._leftGarden._width / 2;
    aBuilding._leftGarden._centerPosition[1] = aBuilding._centerPosition[1] - aBuilding._height / 2 + 0.05;
    aBuilding._leftGarden._centerPosition[2] = aBuilding._centerPosition[2] + 1 + aBuilding._leftGarden.depth / 2 + aBuilding._width / 2;

    aBuilding._leftGarden.nextLinePos[0] = aBuilding._leftGarden._centerPosition[0] - aBuilding._leftGarden._width / 2;
    aBuilding._leftGarden.nextLinePos[1] = aBuilding._leftGarden._centerPosition[2] - aBuilding._leftGarden.depth / 2;
    aBuilding._rightGarden.nextLinePos[0] = aBuilding._rightGarden._centerPosition[0] - aBuilding._rightGarden._width / 2;
    aBuilding._rightGarden.nextLinePos[1] = aBuilding._rightGarden._centerPosition[2] - aBuilding._rightGarden.depth / 2;
}



//Methode, um fuer jedes Stadtteil die einzelnen Gebaeude zu positionieren und die Stadtteile auch zu positionieren
//@params: mainDistrict: ein JSON-Objekt vom Typ district, das die Grundflaeche auch enthaelt
function setMainDistrict(mainDistrict) {
    if (mainDistrict["buildings"] != undefined) {
        for (var i = 0; i < mainDistrict["buildings"].length; i++) {
            setMainDistrict(mainDistrict["buildings"][i]);
            if (mainDistrict["buildings"][i]["buildings"] != undefined) {
                setOneDistrict(mainDistrict["buildings"][i]);
            }
        }
        setOneDistrict(mainDistrict);
    }
}

//verschiebt die Gebauede und Distrikte, sodass sie wieder aufeinander liegen
//@params: mainDistrict: ein JSON-Objekt vom Typ district
function shiftBack(mainDistrict) {
    if (mainDistrict.buildings != undefined) {
        for (var i = 0; i < mainDistrict.buildings.length; i++) {
            setCenterPosition(
                mainDistrict.buildings[i],
                mainDistrict.buildings[i]._centerPosition[0] - mainDistrict._width / 2,
                mainDistrict.buildings[i]._centerPosition[1] + 1.5,
                mainDistrict.buildings[i]._centerPosition[2] - mainDistrict._width / 2
            );
            shiftBack(mainDistrict.buildings[i]);
        }
    }
    setGardenPos(mainDistrict);
}


//Hilfsmethode zum Sortieren der Gebaeude nach Breite absteigend
//@params: aDistrict: das Stadtteil, dessen Gebaeude sortiert werden sollen
//@return: das district mit einem sortierten Gebaeudearray
function sortBuildings(aDistrict) {
    aDistrict["buildings"].sort(
        function(building1, building2) {
            if (building2._width == undefined) {
                return (building2[association["width"]]) - (building1[association["width"]]);
            } else {
                return (building2._width - building1._width);
            }

        }
    );
    return aDistrict;
}

//Methode zur Initialisierung des Districts bzw. des Gebaeudes
//@params: aBuilding: Das Gebaeude bzw. District, das initialisiert werden soll
function initBuilding(aBuilding) {
    if (aBuilding._height == undefined) {
        var stringarray = ["height", "width", "color"];
        for (var i = 0; i < stringarray.length; i++) {
            if (aBuilding[association[stringarray[i]]] != undefined && aBuilding[association[stringarray[i]]] != "") {
                aBuilding["_" + stringarray[i]] = parseFloat(aBuilding[association[stringarray[i]]]) + 1.5;
            } else {
                aBuilding["_" + stringarray[i]] = 1.5;
            }
        }
        aBuilding._centerPosition = [0, aBuilding._height / 2, 0];
        var theLeftGarden = garden(10, 5, gardenID);
        var theRightGarden = garden(10, 5, gardenID + 1);
        hashGarden[gardenID] = theLeftGarden;
        hashGarden[gardenID + 1] = theRightGarden;
        gardenID = gardenID + 2;
        aBuilding["_leftGarden"] = theLeftGarden;
        aBuilding["_rightGarden"] = theRightGarden;
        if (aBuilding[association["height"]] != undefined) {
            updateExtrema(aBuilding[association["width"]], aBuilding[association["height"]], aBuilding[association["color"]]);
        }
    }
}


//Methode wird vom setMainDistrict aufgerufen
// Sie berechnet fuer die Gebaeude von einem Stadtteil die Position und speichert sie in buildings._centerPosition
// anschließend wird noch das Stadtteil vergroessert, damit alle Gebaeude auf das Stadtteil draufpassen
//@params: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
function setOneDistrict(aDistrict) {
    initBuilding(aDistrict);
    aDistrict = sortBuildings(aDistrict); //zunaechst muessen wir das gebaudearray sortieren absteigend nach der Breite der Boxen
    setFirstBuilding(aDistrict); //Initialisiert globale Variablen
    for (var i = 1; i < arrayOfBuildings.length; i++) {
        initBuilding(arrayOfBuildings[i]);
        if (buildingInZDirection == true) { //wenn wir gerade in Z-Richtung bauen

            if (startToBuildInZDirection > maxDepth) { //wenn wir bereits ueber den Rand (Tiefe des letzten Blocks) sind

                if (maxWidth + extension > maxDepth) { //wenn die Breite in x-Richtung groesser als in z-Richtung ist
                    continueBuildingInXDirection(i);
                } else { //wenn die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
                    buildANewBuildingRowOnTheRightInZDirection(i);
                }
            } else { //wenn wir noch nicht am Rand angekommen sind
                continueBuildingNormallyInZDirection(i);

            }
        } else { //wenn wir gerade in X-Richtung bauen (nach links)
            if (startToBuildInXDirection - arrayOfBuildings[i]._width >= gap) { //wenn wir noch nicht am Rand angekommen sind
                continueBuildingNormallyInXDirection(i);
            } else { //wenn eine weitere Box links nebendran nicht mehr hinpassen würde

                if (maxDepth + extension >= maxWidth) { //wenn die Tiefe gerade groesser als die Breite ist, dann baue wieder in Z-Richtung und fange rechts unten an
                    buildAgainDownOnTheRightInZDirection(i);
                } else { //wenn nicht, dann bauen wir eine Reihe obendrueber weiter nach links
                    buildANewRowOnTheTopInXDirection(i);
                }
            }
        }
    }
    aDistrict._width = width;
}

//Hilfsmethode: wenn man centerPosition von einem District aendert, aendern sich auch die
//centerPosition von allen Districts bzw. Gebaeuden, die auf diesem District sich befinden mit
//@params: aDistrict: das District, das gesetzt wird
//			newX: neuer X-Wert
//			newY: neuer Y-Wert
//			newZ: neuer Z-Wert
function setCenterPosition(aDistrict, newX, newY, newZ) {
    if (aDistrict["buildings"] != undefined) {
        for (var i = 0; i < aDistrict["buildings"].length; i++) {
            setCenterPosition(
                aDistrict["buildings"][i],
                aDistrict["buildings"][i]._centerPosition[0] + newX - aDistrict._centerPosition[0],
                aDistrict["buildings"][i]._centerPosition[1] + newY - aDistrict._centerPosition[1],
                aDistrict["buildings"][i]._centerPosition[2] + newZ - aDistrict._centerPosition[2]
            );

        }
    }
    aDistrict._centerPosition = [newX, newY, newZ];
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des ersten Gebaeudes
//@params: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
function setFirstBuilding(aDistrict) {
    arrayOfBuildings = aDistrict["buildings"];
    initBuilding(arrayOfBuildings[0]);
    //Setzen des ersten Elements
    setCenterPosition(
        arrayOfBuildings[0],
        gap + (arrayOfBuildings[0]._width) / 2, (arrayOfBuildings[0]._height) / 2,
        gap + (arrayOfBuildings[0]._width) / 2
    );
    maxWidth = 2 * gap + arrayOfBuildings[0]._width; // hier startet man, in X-Richtung zu bauen
    maxDepth = 2 * gap + arrayOfBuildings[0]._width; // baut man in Z-Richtung höher als maxDepth, muss man woanders eine neue Reihe starten
    startToBuildInXDirection = arrayOfBuildings[0]._width + gap; // hier startet man, in X-Richtung zu bauen
    startToBuildInZDirection = gap; // hier startet man, in Z-Richtung zu bauen
    extension = 0; //Falls maxBreiteXRichtung<maxBreiteZRichtung und wir in Z-Richtung bauen,
    // muessen wir rechts nebendran eine neue Reihe nach oben bauen
    // und diese Variable speichert die x Koordinate, an der wir weiterbauen muessen
    //analog, wenn wir in die andere Richtung bauen
    buildingInZDirection = true; // true, wenn wir gerade in Z-Richtung bauen
    lastMaxWidth = arrayOfBuildings[0]._width - gap; // in einem bestimmten Fall startet man von hier aus, in X-Richtung zu bauen
    width = arrayOfBuildings[0]._width + 2 * gap; //vom aDistrict
    if (arrayOfBuildings.length > 1) {
        initBuilding(arrayOfBuildings[1]);
        extension = arrayOfBuildings[1]._width + gap;
    }
}




//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
//und die Breite in x-Richtung groesser als in z-Richtung ist
//@params: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
function continueBuildingInXDirection(i) {
    //bauen wir weiter in x-Richtung
    setCenterPosition(arrayOfBuildings[i],
        startToBuildInXDirection - (1 / 2) * arrayOfBuildings[i]._width, (arrayOfBuildings[i]._height) / 2,
        maxDepth + (1 / 2) * arrayOfBuildings[i]._width);
    width = Math.max(startToBuildInZDirection, maxDepth + arrayOfBuildings[i]._width, maxWidth + extension);
    buildingInZDirection = false;
    maxWidth = maxWidth + extension;
    extension = arrayOfBuildings[i]._width + gap;
    startToBuildInZDirection = gap;
    startToBuildInXDirection = startToBuildInXDirection - arrayOfBuildings[i]._width - gap;

}

//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
//und die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function buildANewBuildingRowOnTheRightInZDirection(i) {
    // Dann fangen wir rechts von der letzten Gebaeudereihe an, eine neue Gebaeudereihe aufzubauen
    setCenterPosition(arrayOfBuildings[i],
        maxWidth + extension + (1 / 2) * arrayOfBuildings[i]._width, (arrayOfBuildings[i]._height) / 2, (1 / 2) * arrayOfBuildings[i]._width + gap);
    width = Math.max(startToBuildInZDirection, maxWidth + extension);
    maxWidth = maxWidth + extension;
    extension = arrayOfBuildings[i]._width + gap;
    startToBuildInZDirection = arrayOfBuildings[i]._width + gap * 2;
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in Z-Richtung bauen und noch nicht am Rand angekommen sind
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function continueBuildingNormallyInZDirection(i, nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord) {
    setCenterPosition(arrayOfBuildings[i],
        maxWidth + (1 / 2) * arrayOfBuildings[i]._width, (arrayOfBuildings[i]._height) / 2,
        startToBuildInZDirection + (1 / 2) * arrayOfBuildings[i]._width);
    startToBuildInZDirection = startToBuildInZDirection + arrayOfBuildings[i]._width + gap;
    width = Math.max(startToBuildInZDirection, maxWidth + extension, maxDepth);
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in X-Richtung bauen (nach links) und noch nicht am Rand angekommen sind
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function continueBuildingNormallyInXDirection(i) {
    setCenterPosition(arrayOfBuildings[i],
        startToBuildInXDirection - (1 / 2) * arrayOfBuildings[i]._width, (arrayOfBuildings[i]._height) / 2,
        maxDepth + (1 / 2) * arrayOfBuildings[i]._width);
    width = Math.max(maxDepth + extension, maxWidth);
    startToBuildInXDirection = startToBuildInXDirection - arrayOfBuildings[i]._width - gap;

}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in X-Richtung bauen (nach links) und die Tiefe gerade groesser als die Breite ist
// dann bauen wir wieder in Z-Richtung und fangen rechts unten an
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function buildAgainDownOnTheRightInZDirection(i) {
    setCenterPosition(arrayOfBuildings[i],
        maxWidth + (1 / 2) * arrayOfBuildings[i]._width, (arrayOfBuildings[i]._height) / 2, (1 / 2) * arrayOfBuildings[i]._width + gap);
    maxDepth = maxDepth + extension;
    startToBuildInZDirection = arrayOfBuildings[i]._width + gap + 2 * gap;
    startToBuildInXDirection = maxWidth - gap;
    extension = arrayOfBuildings[i]._width + gap;
    buildingInZDirection = true;
    lastMaxWidth = maxWidth - 2 * gap;
    width = Math.max(maxWidth + extension, maxDepth);
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in X-Richtung bauen (nach links) und die Breite gerade groesser als die Tiefe ist
//dann bauen wir eine Reihe obendrueber weiter nach links
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function buildANewRowOnTheTopInXDirection(i) {
    startToBuildInXDirection = lastMaxWidth + 2 * gap;
    maxDepth = maxDepth + extension;
    extension = arrayOfBuildings[i]._width + gap;
    setCenterPosition(arrayOfBuildings[i],
        startToBuildInXDirection - (1 / 2) * arrayOfBuildings[i]._width, (arrayOfBuildings[i]._height) / 2,
        maxDepth + (1 / 2) * arrayOfBuildings[i]._width);
    startToBuildInXDirection = startToBuildInXDirection - arrayOfBuildings[i]._width - gap;
    width = Math.max(maxWidth, maxDepth + extension);

}
