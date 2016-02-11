var association = {}; //Hier wird die Legende gespeichert
var incomingCalls = {}; //speichert Infos ueber Eingehende Verbindungen
var outgoingCalls = {}; //speichert Infos ueber ausgehende Verbindungen

var gap = 5; //Abstand zwischen den Gebaeuden
var gardenRadius = 6; //Groesse der Gaerten

var arrayOfBuildings, maxWidth, maxDepth, startToBuildInZDirection, extension, buildingInZDirection, lastMaxWidth, width, startToBuildInXDirection; //fuer setOneDistrict

var buildingsHashMap = {}; //Hashmap fuer Gebaeude: mapt Gebaeude-ID mit dem Objekt

/*
 * Setter fuer association
 * @param: newAssociation: die neue Zuordnung
 */
function setAssociation(newAssociation) {
    association = newAssociation;
}

/*
 * Getter fuer die Hashmap der Gebaeuden
 * @return: Hashmap fuer die Gebaeuden
 */
function getBuildingsHashMap() {
    return buildingsHashMap;
}


/*
 * Setter fuer incomingCalls, outgoingCalls jeweils der Form
 * {GebaeudeID : {connections : {GebaeudeID_1: Gewichtung1, GebaeudeID_2: Gewichtung2}, sumOfConnections: SummeDerGewichtungen}}
 * @param: income: neues Objekt fuer incomingCalls
 * @param: outgoing: neues Objekt fuer outgoingCalls
 */
function setCalls(income, outgoing) {
    incomingCalls = income;
    outgoingCalls = outgoing;
}

/*
 * Konstruktor für einen Vorgarten
 * @param: isItLeftGarden: true, wenn es sich um einen linken Garten handelt, sonst false
 * @param: aBuilding: das Gebaeude, dessen Garten wir initialisieren moechten
 * @param: connections: ein Objekt der Form {GebaeudeID : {connections : {GebaeudeID_1: Gewichtung1, GebaeudeID_2: Gewichtung2}, sumOfConnections: SummeDerGewichtungen}}; eingehende bzw. ausgehende Verbindungen, je nachdem, ob es sich um einen rechten oder linken Garten handelt
 */
function garden(isItLeftGarden, aBuilding, connections) {
    if (connections == undefined) {
        connections = {
            sumOfConnections: 0,
            connections: {}
        };
    }
    var aGarden = {
        building: aBuilding,
        _width: (6 + 6 * Math.sin(Math.PI / 6)) / Math.cos(Math.PI / 6),
        radius: gardenRadius,
        _height: 0.01,
        depth: 6 + 6 * Math.sin(Math.PI / 6),
        color: connections.sumOfConnections,
        _centerPosition: [0, 0.05, 0],
        nextLinePos: [0, 0],
        on: false,
        isLeftGarden: isItLeftGarden,
        linesTo: connections.connections,
        meshLines: {}
    };
    if (aGarden.color == 0) {
        aGarden._width = 0;
        aGarden.depth = 0;
    }
    return aGarden;
}


/*
 * Mathode zum Setzen der nächsten Position, von der aus man eine Linea zeichnen kann im Garten
 * @param: aGarden: ein Garten
 */
function setNextLinePos(aGarden) {
    var nextLineObj = computeDistancesForNextLinePos(aGarden);
    if (aGarden.nextLinePos[0] + 1 > aGarden._centerPosition[0] + nextLineObj.currentTriangleWidth) {
        if (nextLineObj.aFactor * (aGarden.nextLinePos[1] + nextLineObj.aFactor) > nextLineObj.aFactor * (aGarden._centerPosition[2] + nextLineObj.aFactor * aGarden.radius)) {
            aGarden.nextLinePos[0] = aGarden._centerPosition[0] - aGarden._width / 2 + 1;
            aGarden.nextLinePos[1] = aGarden._centerPosition[2] - nextLineObj.aFactor * (aGarden.depth - aGarden.radius) + nextLineObj.aFactor;
        } else {
            aGarden.nextLinePos[0] = aGarden._centerPosition[0] - nextLineObj.currentTriangleWidth + 1;
            aGarden.nextLinePos[1] = aGarden.nextLinePos[1] + nextLineObj.aFactor * 0.1;
        }
    } else {
        aGarden.nextLinePos[0] = aGarden.nextLinePos[0] + 0.1;
    }
}

/**
 * Hilfsmethode zum initialisieren der Variablen fuer setNextLinePos-Methoden
 * @param: aGarden: ein Garten
 * @return: ein Objekt mit den keys distancePosToPeak, currentTriangleWidth, aFactor
 */
function computeDistancesForNextLinePos(aGarden) {
    var nextLineObj = {};
    if (aGarden.isLeftGarden) {
        nextLineObj.distancePosToPeak = aGarden.depth - (aGarden.nextLinePos[1] - (aGarden._centerPosition[2] + aGarden.radius - aGarden.depth));
        nextLineObj.currentTriangleWidth = nextLineObj.distancePosToPeak * Math.tan(Math.PI / 6);
        nextLineObj.aFactor = 1;
    } else {
        nextLineObj.distancePosToPeak = aGarden.nextLinePos[1] - (aGarden._centerPosition[2] - aGarden.radius);
        nextLineObj.currentTriangleWidth = nextLineObj.distancePosToPeak * Math.tan(Math.PI / 6);
        nextLineObj.aFactor = -1;
    }
    return nextLineObj;
}

/**
 * verschiebt die NextLinePos solange, bis 5 Linien nebeneinander passen
 * @param: aGarden: ein Garten
 */
function setNextLinePosForNextPackage(aGarden) {
    var nextLineObj = computeDistancesForNextLinePos(aGarden);
    while (aGarden.nextLinePos[0] + 1.5 > aGarden._centerPosition[0] + nextLineObj.currentTriangleWidth) {
        setNextLinePos(aGarden);
    }
}

/*
 * Methode zum Setzen der GartenPosition in Abhängigkeit vom Gebaeude
 * @param: aBuilding: ein Gebaeude oder District
 */
function setGardenPos(aBuilding) {
    var right = aBuilding._rightGarden;
    var left = aBuilding._leftGarden;
    var cP = aBuilding._centerPosition;

    right._centerPosition[0] = cP[0] + right._width / 2 - right.radius / 2;
    right._centerPosition[1] = cP[1] - aBuilding._height / 2 + 0.05;
    right._centerPosition[2] = cP[2] + 1 + right.radius + aBuilding._width / 2;
    left._centerPosition[0] = cP[0] - left._width / 2;
    left._centerPosition[1] = cP[1] - aBuilding._height / 2 + 0.05;
    left._centerPosition[2] = cP[2] + 1 + left.depth - left.radius + aBuilding._width / 2;

    left.nextLinePos[0] = left._centerPosition[0] - left._width / 2 + 1;
    left.nextLinePos[1] = left._centerPosition[2] - (left.depth - left.radius) + 1;
    right.nextLinePos[0] = right._centerPosition[0] - right._width / 2 + 1;
    right.nextLinePos[1] = right._centerPosition[2] + (right.depth - right.radius) - 1;
}



/*
 * Methode, um fuer jedes Stadtteil die einzelnen Gebaeude zu positionieren und die Stadtteile auch zu positionieren
 * @param: mainDistrict: ein JSON-Objekt vom Typ district, das die Grundflaeche auch enthaelt
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function setMainDistrict(mainDistrict, namePrefix) {
    if (mainDistrict["buildings"] != undefined) {
        var buildings = mainDistrict["buildings"];
        var length = buildings.length;
        for (var i = length; i--;) {
            var b = buildings[i];
            setMainDistrict(b, namePrefix + b.name + ".");
            if (b["buildings"] != undefined) {
                setOneDistrict(b);
            }
        }
        setOneDistrict(mainDistrict, namePrefix);
    }
}

/*
 * verschiebt die Gebauede und Distrikte, sodass sie wieder aufeinander liegen
 * @param: mainDistrict: ein JSON-Objekt vom Typ district
 */
function shiftBack(mainDistrict) {
    if (mainDistrict.buildings != undefined) {
        var buildings = mainDistrict.buildings;
        var width = mainDistrict._width;

        var length = mainDistrict.buildings.length;
        for (var i = length; i--;) {
            var b = buildings[i];
            setCenterPosition(
                b,
                b._centerPosition[0] - width / 2,
                b._centerPosition[1] + 1.5,
                b._centerPosition[2] - width / 2
                );
            shiftBack(b);
        }
    }
    setGardenPos(mainDistrict);
}

/*
 * Hilfsmethode zum Sortieren der Gebaeude nach Breite absteigend
 * @param: aDistrict: das Stadtteil, dessen Gebaeude sortiert werden sollen
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 * @return: das district mit einem sortierten Gebaeudearray
 */
function sortBuildings(aDistrict, namePrefix) {
    aDistrict["buildings"].sort(
        function (building1, building2) {
            initBuilding(building1, namePrefix);
            initBuilding(building2, namePrefix);
            return (getLandWidth(building2) - getLandWidth(building1));
        }
        );
    return aDistrict;
}

/*
 * Methode zur Initialisierung des Districts bzw. des Gebaeudes
 * @param: aBuilding: Das Gebaeude bzw. District, das initialisiert werden soll
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function initBuilding(aBuilding, namePrefix) {
    if (aBuilding._height == undefined) {
        var dimensions = ["height", "width", "color"];
        for (var i = 3; i--;) {
            var dim = dimensions[i];
            if (aBuilding[association[dim]] != undefined && aBuilding[association[dim]] != "") {
                aBuilding["_" + dim] = parseFloat(aBuilding[association[dim]]) + 1.5;
            } else {
                aBuilding["_" + dim] = 1.5;
            }
        }
        aBuilding._centerPosition = [0, aBuilding._height / 2, 0];
        var theLeftGarden = garden(true, aBuilding, outgoingCalls[aBuilding[association.name]]);
        var theRightGarden = garden(false, aBuilding, incomingCalls[aBuilding[association.name]]);
        aBuilding["_leftGarden"] = theLeftGarden;
        aBuilding["_rightGarden"] = theRightGarden;
        if (aBuilding[association["height"]] != undefined) {
            updateExtrema(aBuilding[association["width"]], aBuilding[association["height"]], aBuilding[association["color"]]);
        } else {
            aBuilding[association.name] = namePrefix;
        }
        buildingsHashMap[aBuilding[association.name]] = aBuilding;
        aBuilding._isRemoved = false;
    }
}


/*
 * Methode wird vom setMainDistrict aufgerufen
 *  Sie berechnet fuer die Gebaeude von einem Stadtteil die Position und speichert sie in buildings._centerPosition
 *  anschließend wird noch das Stadtteil vergroessert, damit alle Gebaeude auf das Stadtteil draufpassen
 * @param: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function setOneDistrict(aDistrict, namePrefix) {
    initBuilding(aDistrict, namePrefix);
    aDistrict = sortBuildings(aDistrict, namePrefix); //zunaechst muessen wir das gebaudearray sortieren absteigend nach der Breite der Boxen
    setFirstBuilding(aDistrict, namePrefix); //Initialisiert globale Variablen
    
    var length = arrayOfBuildings.length;
    for (var i = 1; i < length; i++) {
        initBuilding(arrayOfBuildings[i], namePrefix);
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
            if (startToBuildInXDirection - getLandWidth(arrayOfBuildings[i]) >= gap) { //wenn wir noch nicht am Rand angekommen sind
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

/*
 * Hilfsmethode: wenn man centerPosition von einem District aendert, aendern sich auch die
 * centerPosition von allen Districts bzw. Gebaeuden, die auf diesem District sich befinden mit
 * @param: aDistrict: das District, das gesetzt wird
 * @param: newX: neuer X-Wert
 * @param: newY: neuer Y-Wert
 * @param: newZ: neuer Z-Wert
 */
function setCenterPosition(aDistrict, newX, newY, newZ) {
    if (aDistrict["buildings"] != undefined) {
        var buildings = aDistrict["buildings"];
        var x = aDistrict._centerPosition[0];
        var y = aDistrict._centerPosition[1];
        var z = aDistrict._centerPosition[2];

        var length = buildings.length;
        for (var i = 0; i < length; i++) {
            var b = buildings[i];
            setCenterPosition(
                b,
                b._centerPosition[0] + newX - x,
                b._centerPosition[1] + newY - y,
                b._centerPosition[2] + newZ - z
                );

        }
    }
    aDistrict._centerPosition = [newX, newY, newZ];
}

/*
 * Hilfsmethode, um Code zu sparen, gibt Breite eines Grundstücks (d.h. Gebaeude und Gaerten zusammen) zurueck
 * @param: aBuilding: das Gebaeude, zu dem das Grundstueck gehoert
 * @return: Breite des Grundstuecks, das zum i-ten Gebaeude gehoert
 */
function getLandWidth(aBuilding) {
    var width = aBuilding._width;
    var left = aBuilding._leftGarden;
    var right = aBuilding._rightGarden;

    return Math.max(width + 1 + left.depth,
        width + 1 + right.depth,
        left._width + right._width + 2);
}


/*
 * Hilfsmethode, um xPosition von den Gebaeuden zu bestimmen
 * @param: i: i-te Eintrag in arrayOfBuildings
 */
function getXPosOfBuildingsFromLeft(i) {
    var b = arrayOfBuildings[i];
    return Math.max(b._width / 2, b._leftGarden._width + 1);
}

function getXPosOfBuildingsFromRight(i) {
    var b = arrayOfBuildings[i];
    return Math.max(b._width / 2, b._rightGarden._width + 1);
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des ersten Gebaeudes
 * @param: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function setFirstBuilding(aDistrict, namePrefix) {
    arrayOfBuildings = aDistrict["buildings"];
    
    var b = arrayOfBuildings[0];
    initBuilding(b, namePrefix);
    //Setzen des ersten Elements
    setCenterPosition(
        b,
        gap + getXPosOfBuildingsFromLeft(0), (b._height) / 2,
        gap + (b._width) / 2
        );
    maxWidth = 2 * gap + getLandWidth(b); // hier startet man, in X-Richtung zu bauen
    maxDepth = maxWidth; // baut man in Z-Richtung höher als maxDepth, muss man woanders eine neue Reihe starten
    startToBuildInXDirection = maxWidth - gap; // hier startet man, in X-Richtung zu bauen
    startToBuildInZDirection = gap; // hier startet man, in Z-Richtung zu bauen
    extension = 0; //Falls maxBreiteXRichtung<maxBreiteZRichtung und wir in Z-Richtung bauen,
    // muessen wir rechts nebendran eine neue Reihe nach oben bauen
    // und diese Variable speichert die x Koordinate, an der wir weiterbauen muessen
    //analog, wenn wir in die andere Richtung bauen
    buildingInZDirection = true; // true, wenn wir gerade in Z-Richtung bauen
    lastMaxWidth = maxWidth - 3 * gap; // in einem bestimmten Fall startet man von hier aus, in X-Richtung zu bauen
    width = maxWidth; //vom aDistrict
    if (arrayOfBuildings.length > 1) {
        initBuilding(arrayOfBuildings[1], namePrefix);
        extension = getLandWidth(arrayOfBuildings[1]) + gap;
    }
}




/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
 * und die Breite in x-Richtung groesser als in z-Richtung ist
 * @param: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
 */
function continueBuildingInXDirection(i) {
    var b = arrayOfBuildings[i];
    //bauen wir weiter in x-Richtung
    setCenterPosition(b,
        startToBuildInXDirection - getXPosOfBuildingsFromRight(i), (b._height) / 2,
        maxDepth + (1 / 2) * b._width);
    width = Math.max(startToBuildInZDirection, maxDepth + getLandWidth(b), maxWidth + extension);
    buildingInZDirection = false;
    maxWidth = maxWidth + extension;
    extension = getLandWidth(b) + gap;
    startToBuildInZDirection = gap;
    startToBuildInXDirection = startToBuildInXDirection - getLandWidth(b) - gap;

}

/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
 * und die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
 * @params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function buildANewBuildingRowOnTheRightInZDirection(i) {
    var b = arrayOfBuildings[i];
    // Dann fangen wir rechts von der letzten Gebaeudereihe an, eine neue Gebaeudereihe aufzubauen
    setCenterPosition(b,
        maxWidth + extension + getXPosOfBuildingsFromLeft(i), (b._height) / 2, (1 / 2) * b._width + gap);
    width = Math.max(startToBuildInZDirection, maxWidth + extension);
    maxWidth = maxWidth + extension;
    extension = getLandWidth(b) + gap;
    startToBuildInZDirection = getLandWidth(b) + gap * 2;
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in Z-Richtung bauen und noch nicht am Rand angekommen sind
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function continueBuildingNormallyInZDirection(i, nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord) {
    var b = arrayOfBuildings[i];
    setCenterPosition(b,
        maxWidth + getXPosOfBuildingsFromLeft(i), (b._height) / 2,
        startToBuildInZDirection + (1 / 2) * b._width);
    startToBuildInZDirection = startToBuildInZDirection + getLandWidth(b) + gap;
    width = Math.max(startToBuildInZDirection, maxWidth + extension, maxDepth);
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in X-Richtung bauen (nach links) und noch nicht am Rand angekommen sind
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function continueBuildingNormallyInXDirection(i) {
    var b = arrayOfBuildings[i];
    setCenterPosition(b,
        startToBuildInXDirection - getXPosOfBuildingsFromRight(i), (b._height) / 2,
        maxDepth + (1 / 2) * b._width);
    width = Math.max(maxDepth + extension, maxWidth);
    startToBuildInXDirection = startToBuildInXDirection - getLandWidth(b) - gap;

}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in X-Richtung bauen (nach links) und die Tiefe gerade groesser als die Breite ist
 *  dann bauen wir wieder in Z-Richtung und fangen rechts unten an
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function buildAgainDownOnTheRightInZDirection(i) {
    var b = arrayOfBuildings[i];
    setCenterPosition(b,
        maxWidth + getXPosOfBuildingsFromLeft(i), (b._height) / 2, (1 / 2) * b._width + gap);
    maxDepth = maxDepth + extension;
    startToBuildInZDirection = getLandWidth(b) + gap + 2 * gap;
    startToBuildInXDirection = maxWidth - gap;
    extension = getLandWidth(b) + gap;
    buildingInZDirection = true;
    lastMaxWidth = maxWidth - 2 * gap;
    width = Math.max(maxWidth + extension, maxDepth);
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in X-Richtung bauen (nach links) und die Breite gerade groesser als die Tiefe ist
 * dann bauen wir eine Reihe obendrueber weiter nach links
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function buildANewRowOnTheTopInXDirection(i) {
    var b = arrayOfBuildings[i];
    startToBuildInXDirection = lastMaxWidth + 2 * gap;
    maxDepth = maxDepth + extension;
    extension = getLandWidth(b) + gap;
    setCenterPosition(b,
        startToBuildInXDirection - getXPosOfBuildingsFromRight(i), (b._height) / 2,
        maxDepth + (1 / 2) * b._width);
    startToBuildInXDirection = startToBuildInXDirection - getLandWidth(b) - gap;
    width = Math.max(maxWidth, maxDepth + extension);

}
