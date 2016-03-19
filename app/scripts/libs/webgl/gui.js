/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */

var buildingColor = 0x0000FF;
var colorOfTargetBuildings = 0x40FF00;
var colorOfBuildingsWithConns = 0xFFBF00;
var colorYellowBright = 0xFFA500;
var colorYellowDark = 0xFF0000;
var colorOfHighlightingByMouseOver = 0xFF0000;
var alphaForDistrictColor = 0.3;
var maximalHeight; //speichert max. hoehe der Gebaeude, um Linien in dieser Hoehe zu zeichnen, ohne extrema zu uebergeben
var clickedLeftGardens = []; //Array aus ID der Gebaeude, dessen Gaerten an sind
var clickedRightGardens = [];

var association = {}; //hier wird die Legende gespeichert

var highlightedBuildingID;
var colorOfHighlightedBuilding;
var camera;

var GARDEN_WIDTH = (6 + 6 * Math.sin(Math.PI / 6)) / Math.cos(Math.PI / 6);
var GARDEN_DEPTH = 6 + 6 * Math.sin(Math.PI / 6);

var lastIntersectedBuilding;

var targetList = [];
var projector;

var oldColor;
var totalGeom;
var totalMaterial;
var qwert = 0;

var drawnObject = null;

var drawGardens;

/**
 * Setter fuer die Farbe der Gebaeude aus settings.js
 *@param: hexaColor: der Farbstring fuer die Gebaeude der Form 0x...... in Hexadezimal
 */
function setBuildingColor(hexColor) {
    if (!isNaN(parseInt(hexColor))) buildingColor = parseInt(hexColor);
}


/**
 *Setter fuer camera
 *@param: aCam: die Kamera, die genutzt wird
 */
function setCamera(aCam) {
    camera = aCam;
}

/**
 * Getter fuer totalMaterial
 *@return: totalMaterial: das Material von unserem Hauptobjekt
 */
function getTotalMaterial() {
    return totalMaterial;
}

/**
 *highlighted ein Gebaeude (fuer die Gebaeudesuche)
 *@param: buildingID: ID vom Gebaeude, das gehighlighted werden soll
 */
function highlightBuilding(buildingID) {
    var hashMap = getBuildingsHashMap();
    var building = hashMap[buildingID];
    if (highlightedBuildingID != undefined) {
        colorObject(hashMap[highlightedBuildingID], colorOfHighlightedBuilding);
    }
    if (building != undefined) {
        highlightedBuildingID = buildingID;
        colorOfHighlightedBuilding = building._faces[0].color.clone();
        colorObject(building, 0xffff00);
    } else if (hashMap[buildingID + "."] != undefined) {
        highlightedBuildingID = buildingID + ".";
        building = hashMap[buildingID + "."]
        colorOfHighlightedBuilding = building._faces[0].color.clone();
        colorObject(hashMap[highlightedBuildingID], 0xffff00);
    } else {
        colorObject(hashMap[highlightedBuildingID], colorOfHighlightedBuilding);
        highlightedBuildingID = undefined;
    }
}


/**
 *deaktiviert das highlighten eines Gebaeudes durch die Gebaeudesuche
 */
function deactivateHighlighting() {
    var hashMap = getBuildingsHashMap();
    if (highlightedBuildingID != undefined) {
        colorObject(hashMap[highlightedBuildingID], colorOfHighlightedBuilding);
        highlightedBuildingID = undefined;
    }
}



/**
 * faerbt ein Objekt in einer Farbe ein
 * @param: object: Objekt (Gebaeude oder Garten), das eingefaerbt werden soll
 * @param: aColor: eine Instanz von THREE.Color oder eine Hexadezimalzahl
 */
function colorObject(object, aColor) {
    var faces = object._faces;
    for (var i = 0; i < faces.length; i++) {
        if (isNaN(aColor)) {
            faces[i].color.set(aColor);
        } else {
            faces[i].color.setHex(aColor);
        }
    }
    totalGeom.colorsNeedUpdate = true;
}


/**
 *positioniert die Kamera vor das Gebaeude, das in highlightedBuildingID gespeichert ist
 */
function showBuilding() {
    if (highlightedBuildingID != undefined) {
        var hashMap = getBuildingsHashMap();

        var b = hashMap[highlightedBuildingID];
        getControls().target.x = b._centerPosition[0];
        getControls().target.y = b._centerPosition[1];
        getControls().target.z = b._centerPosition[2];
        if (b.buildings == undefined) {
            var min = 10 * Math.min(b._height, b._width);
            camera.position.set(b._centerPosition[0],
                b._centerPosition[1] + min,
                b._centerPosition[2] + min);
        } else {
            camera.position.set(b._centerPosition[0],
                b._centerPosition[1] + 1.5 * b._width,
                b._centerPosition[2] + 1.5 * b._width);
        }
        camera.rotation.set(0, 0, 0);
    }
}

/**
 *Setter fuer association
 *@param: newAssociation: die zu speichernde Zuordnung
 */
function setAssociation(newAssociation) {
    association = newAssociation;
}

/**
 *Methode zum leeren der Arrays clickedLeft-/-RightGardens
 */
function setClickedGardensEmpty() {
    clickedLeftGardens = [];
    clickedRightGardens = [];
}

/**
 *Methode zum Hinzufuegen von Elementen zu clickedLeftGardens
 *@param: buildingID: eine GartenID
 */
function pushToClickedLeftGardens(buildingID) {
    clickedLeftGardens.push(buildingID);
}

/**
 *Methode zum hinzufuegen von Elementen zu clickedRightGardens
 *@param: buildingID: eine GartenID
 */
function pushToClickedRightGardens(buildingID) {
    clickedRightGardens.push(buildingID);
}

/**
 *Methode zum Setzen von clickedRightGardens und clickedLeftGardens
 *@param: das Json, das im Link gespeichert worden ist der Form
 {"position": {"x": xCamPos, "y": yCamPos, "z": zCamPos},
 "rotation": {"_x": xRotation, "_y": yRotation, "_z": zRotation, "_order": "XYZ" },
 "target": { "x": xPanPos,"y": yPanPos,"z": zPanPos},
 "leftGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 "rightGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 "scaling": { "logarithmicHeight": boolean,"logarithmicWidth": boolean,"logarithmicColor": boolean},
 "removedBuildings": ArrayAusIDsDerGeloeschtenGebaeuden,
 "changedLegend": {"Name": "Package","Breite": "Klassen","Höhe": "Methoden","Farbe": "Zeilen" },
 "collID": CollectionID,
 "_id": AnsichtsID};
 */
function setClickedGardens(aJson) {
    clickedLeftGardens = aJson.leftGarden;
    clickedRightGardens = aJson.rightGarden;
}


/**
 *Hilfsmethode, um ein schönes Material zu bekommen, wenn man die Farbe kriegt
 *@param: aColor: eine Farbe, i.A. als Hexa-Wert, aber als RGB auch moeglich, oder mit "new THREE.color(0,0,1)"
 *@return: das Material in der gewuenschten Farbe
 */
function getMaterial(aColor) {
    return new THREE.MeshPhongMaterial({
        color: aColor,
        vertexColors: THREE.VertexColors
    });
}

/**
 *Methode zum Setzen des Lichts
 *@param: scene: die scene, in die Licht eingesetzt werden soll
 */
function setLight(scene) {
    // Licht hinzufügen. AmbientLight ist generell das Licht auf die Scene auf alles
    scene.add(new THREE.AmbientLight(0x444444));

    //Weiteres Licht, legt Farbe und Intensität fest mit den Arugmenten
    var light1 = new THREE.DirectionalLight(0x999999, 0.9);
    //Einmal das Licht von rechts oben vorne
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    // Einmal Licht von links oben hinten
    var light2 = new THREE.DirectionalLight(0x999999, 1.5);
    light2.position.set(1, 1, -1);
    scene.add(light2);
}



/**
 *Stellt AnfangsKameraeinstellung wieder her
 *@param: position: die Position von der Kamera
 *@param: rotation: die Rotation von der Kamera
 */
function restoreCamera(position, rotation) {
    var trackballControls = getControls();
    trackballControls.reset();
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);
    trackballControls.update();

    render();
}

/**
 *setzt Camera auf die Vogelperspektive
 */
function goToArielView() {
    var camToSave = getCamToSave();
    restoreCamera({
        x: 0,
        y: getCamToSave().position.z,
        z: 0
    }, camToSave.rotation);
}

/**
 *setzt Camera auf die erste Ansicht
 */
function goToInitialView() {
    var camToSave = getCamToSave();
    restoreCamera(camToSave.position, camToSave.rotation, camToSave.controlCenter);
}

/**
 *Methode, um die Stadt auf die WebGL-scene zu zeichnen, wenn wir die Daten bekommen haben
 *@param: mainDistrict: das Stadtteil, das der unteren Grundflaeche entspricht mit allen zu zeichnenden Stadtteilen und Gebaeuden
 *@param: scene: die scene, der man die Zeichnungen hinzufuegen moechte
 *@param: camera: die Kamera, die wir nach dem Malen anders positionieren moechten
 */
function addCityToScene(mainDistrict, scene, camera) {
    var myGeometry = new THREE.Geometry();
    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion();
    var color = new THREE.Color();
    var extrema = getExtrema();
    // nun machen wir die Stadt gleich sichtbar, indem wir jedes Gebaeude und den Boden zeichnen
    var buildings = mainDistrict["buildings"];
    var length = buildings.length;
    var boxGeom = new THREE.BoxGeometry(1, 1, 1);
    var gardenGeom = [
        new THREE.CylinderGeometry(GARDEN_WIDTH / 2, GARDEN_WIDTH / 2, 0.01, 3, 1, false, 0),
        new THREE.CylinderGeometry(GARDEN_WIDTH / 2, GARDEN_WIDTH / 2, 0.01, 3, 1, false, Math.PI)
    ];
    for (var i = length; i--;) {
        addEachDistrict(buildings[i], scene, extrema, 0, boxGeom, gardenGeom, myGeometry, matrix, quaternion, color);
    }
    //Den Boden ganz unten verschieben wir noch ein kleines bisschen nach unten und danach zeichnen wir den auch noch
    mainDistrict._centerPosition[1] = -getDistrictHeight();
    addBoxes((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), alphaForDistrictColor), mainDistrict, boxGeom, myGeometry, matrix, quaternion);
    setCameraPos(camera, mainDistrict, extrema);

    maximalHeight = getExtrema().maxHeight;
    totalMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        vertexColors: THREE.FaceColors,
        transparent: true,
        opacity: 1
    })
    drawnObject = new THREE.Mesh(
        myGeometry,
        totalMaterial
    );
    scene.add(drawnObject);
    projector = new THREE.Projector();
    targetList.push(drawnObject);
    totalGeom = myGeometry;
}



/**
 *rekursive Hilfsmethode fuer addCityToScene
 *@param: aDistrict: das Stadtteil, das gezeichnet werden soll
 *@param: scene: die scene, der man die Zeichnungen hinzufuegen moechte
 *@param: extrema: ein JSON-Objekt, das die Extremwerte der Daten enhtaelt, dass man darauf zugreifen kann
 *@param: colorBoolean: 0, wenn Districtfarbe eben 0xB5BCDE war, 1 wenn sie eben 0x768dff (um Districtfarben abzuwechseln)
 *@param: boxGeom: die THREE.BoxGeometry(1,1,1)
 *@param: gardenGeom: die Dreiecke als Geometry fuer die Gaerten
 *@param: boxGeom: die THREE.BoxGeometry(1,1,1)
 *@param: myGeometry: die gesamte THREE.Geometry zum mergen
 *@param: matrix: eine Instanz von THREE.Matrix4()
 *@param: quaternion: eine Instanz von THREE.Quaternion()
 */
function addEachDistrict(aDistrict, scene, extrema, colorBoolean, boxGeom, gardenGeom, myGeometry, matrix, quaternion) {
    if (aDistrict["buildings"] == undefined) {
        var factor = getColorFactor(extrema, aDistrict._color, "Color");
        addBoxes((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), factor), aDistrict, boxGeom, myGeometry, matrix, quaternion);
        if (doWeUseConnections() && drawGardens) addGarden(aDistrict, scene, gardenGeom, myGeometry, matrix, quaternion);
    } else {
        if (colorBoolean == 0) {
            addBoxes(0xDBDBDC, aDistrict, boxGeom, myGeometry, matrix, quaternion);
        } else {
            addBoxes((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), alphaForDistrictColor), aDistrict, boxGeom, myGeometry, matrix, quaternion);
        }
        if (doWeUseConnections() && drawGardens) addGarden(aDistrict, scene, gardenGeom, myGeometry, matrix, quaternion);

        var buildings = aDistrict["buildings"];
        var length = buildings.length;
        for (var j = length; j--;) {
            addEachDistrict(buildings[j], scene, extrema, (colorBoolean + 1) % 2, boxGeom, gardenGeom, myGeometry, matrix, quaternion);
        }
    }
}




/**
 *Hilfsmethode fuer addCityToScene, zeichnet die Boxen
 *@param: aColor: die Farbe fuer die Box
 *@param: aBuilding: das Building oder District Objekt, das gezeichnet werden soll
 *@param: boxGeom: die THREE.BoxGeometry(1,1,1)
 *@param: myGeometry: die gesamte THREE.Geometry zum mergen
 *@param: matrix: eine Instanz von THREE.Matrix4()
 *@param: quaternion: eine Instanz von THREE.Quaternion()
 */
function addBoxes(aColor, aBuilding, boxGeom, myGeometry, matrix, quaternion) {
    setMatrix(aBuilding._centerPosition, aBuilding._width, aBuilding._height, quaternion, matrix);

    aBuilding._faces = [];
    var face;
    for (var i = 0; i < boxGeom.faces.length; i++) {
        face = boxGeom.faces[i];
        face.color.set(aColor);
    }

    myGeometry.merge(boxGeom, matrix);

    var length = myGeometry.faces.length;
    var nameOfDimension = aBuilding[association.name];
    for (var i = length - 1; i >= length - 12; i--) {
        face = myGeometry.faces[i];
        face.building = nameOfDimension;
        aBuilding._faces.push(face);
    }
}




/**
 setzt die Matrix, die die Position, Rotation und Skalierung von der naechsten BoxGeometry(1,1,1) beschreibt
 *@param: cP: centerPosition von der BoxGeometry
 *@param: width: Breite der BoxGeometry
 *@param: height: Hoehe der BoxGeometry
 *@param: matrix: eine Instanz von THREE.Matrix4()
 *@param: quaternion: eine Instanz von THREE.Quaternion()
 */
function setMatrix(cP, width, height, quaternion, matrix) {
    var position = new THREE.Vector3();
    position.x = cP[0];
    position.y = cP[1];
    position.z = cP[2];

    var rotation = new THREE.Euler();
    rotation.x = 0;
    rotation.y = 0;
    rotation.z = 0;

    var scale = new THREE.Vector3();
    scale.x = width;
    scale.y = height;
    scale.z = width;

    quaternion.setFromEuler(rotation, false);
    matrix.compose(position, quaternion, scale);
}



/**
 *Hilfsmethode fuer addCityToScene, zeichnet die Gaerten zu den zugehoerigen gebaeuden bzw Districts
 *@param aBuilding: das Gebaeude bzw das District
 *@param: scene: scene, der der Garten hinzugefuegt werden soll
 *@param: gardenGeom: ein Array bestehend aus den beiden Garten-Geometries
 *@param: myGeometry: die gesamte THREE.Geometry zum mergen
 *@param: matrix: eine Instanz von THREE.Matrix4()
 *@param: quaternion: eine Instanz von THREE.Quaternion()
 */
function addGarden(aBuilding, scene, gardenGeom, myGeometry, matrix, quaternion) {
    var gardens = ["_leftGarden", "_rightGarden"];
    for (var i = 0; i < 2; i++) {
        if (aBuilding[gardens[i]] && aBuilding[gardens[i]].color > 0) {
            var garden = aBuilding[gardens[i]];
            var factor = getColorFactor(getExtrema(), garden.color, "SumOfConn");

            setMatrix(garden._centerPosition, 1, 1, quaternion, matrix);

            garden._faces = [];
            var face;
            for (var j = 0; j < gardenGeom[i].faces.length; j++) {
                face = gardenGeom[i].faces[j];
                face.color.set((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(0x01DF01), factor));
            }
            myGeometry.merge(gardenGeom[i], matrix);

            var length = myGeometry.faces.length;
            aBuilding[gardens[i]]._faces = [];
            for (var j = length - 1; j >= length - 12; j--) {
                face = myGeometry.faces[j];
                face.building = aBuilding[association.name];
                if (i == 0) face.isLeftGarden = true;
                else face.isLeftGarden = false;
                aBuilding[gardens[i]]._faces.push(face);
            }
        }
    }
}

/**
 *Zeichnet alle Abhaengigkeiten, die von einem Garten ausgehen
 *@param: aGarden: der Garten, fuer den die Abhaengigkeit gezeichnet werden soll
 *@param: updateBoolean: true, wenn die Methode in gui.js aufgerufen wurde, sonst false
 */
function drawLines(aGarden, updateBoolean) {
    if (updateBoolean) {
        aGarden.on = true;
    }
    var hashMap = getBuildingsHashMap();
    for (var x in aGarden.linesTo) {
        if (aGarden.isLeftGarden == true) {
            drawALine(aGarden, hashMap[x]._rightGarden);
        } else {
            drawALine(aGarden, hashMap[x]._leftGarden);
        }

    }
}


/**
 *Zeichnet fuer die Gaerten eine Abhaengigkeit
 *@param: aGarden: der Start-Garten
 *@param: destGarden: der Ziel-Garten
 */
function drawALine(aGarden, destGarden) {
    var geometry = new THREE.Geometry();
    if (doWeUseStreets()) {
        pushVerticesForStreet(aGarden, destGarden, geometry);
    } else {
        pushVerticesForBow(aGarden, destGarden, geometry);
    }
    colorObject(destGarden.building, colorOfTargetBuildings);
    var factor = getColorFactor(getExtrema(), aGarden.linesTo[destGarden.building[association.name]], "Connections");
    var material = new THREE.LineBasicMaterial({
        color: new THREE.Color(0xFF0000).lerp(new THREE.Color(0x000000), factor)
    });
    var curveObject = new THREE.Line(geometry, material);


    scene.add(curveObject);

    workUpGarden(aGarden, destGarden, curveObject);
    destGarden.building._numOfActivatedConnections++;
}

/**
 * fuegt einer Geometry die Knoten fuer die Strassen hinzu
 * @param: aGarden: der Start-Garten
 * @param: destGarden: der Ziel-Garten
 * @param: geometry: die THREE.Geometry()-Instanz fuer die Strasse
 */
function pushVerticesForStreet(aGarden, destGarden, geometry) {
    var center = aGarden.building._centerPosition;
    var destCenter = destGarden.building._centerPosition;
    var otherGeometry = new THREE.Geometry();
    otherGeometry.vertices.push(new THREE.Vector3(center[0], center[1] - (aGarden.building._height / 2), center[2]));
    setPath(otherGeometry.vertices, aGarden.building, destGarden.building);
    otherGeometry.vertices.push(new THREE.Vector3(destCenter[0], destCenter[1] - destGarden.building._height / 2, destCenter[2]));
    pushVerticesFiveTimes(geometry, otherGeometry, true);

}

/**
 * fuegt einer Geometry die Knoten fuer die Boegen hinzu
 * @param: aGarden: der Start-Garten
 * @param: destGarden: der Ziel-Garten
 * @param: geometry: die THREE.Geometry()-Instanz fuer die Boegen
 */
function pushVerticesForBow(aGarden, destGarden, geometry) {
    var curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(aGarden.nextLinePos[0], aGarden._centerPosition[1], aGarden.nextLinePos[1]),
        new THREE.Vector3(aGarden.nextLinePos[0], 3 * maximalHeight, aGarden.nextLinePos[1]),
        new THREE.Vector3(destGarden.nextLinePos[0], 3 * maximalHeight, destGarden.nextLinePos[1]),
        new THREE.Vector3(destGarden.nextLinePos[0], destGarden._centerPosition[1], destGarden.nextLinePos[1])
    );

    var otherGeometry = new THREE.Geometry();
    otherGeometry.vertices = curve.getPoints(50);
    pushVerticesFiveTimes(geometry, otherGeometry, false);
}



/**
 * fuegt den vertices einer THREE.Geometry() versetzt 5 Linien hinzu
 * @param: geometry: die THREE.Geometry, dessen vertices um 5 Linien ergaenzt werden soll
 * @param: otherGeometry: die Hilfs-THREE.Geometry, die die mittlere Linie in den vertices gespeichert hat
 * @param: alsoZCoord: true, wenn man auch in z-Richtung fuer die Strassen die Linien versetzen will
 */
function pushVerticesFiveTimes(geometry, otherGeometry, alsoZCoord) {
    otherGeometry.translate(-0.2, 0, 0);
    for (var i = 0; i < 5; i++) {
        if (i % 2 == 0) {
            pushToArray(geometry.vertices, otherGeometry.vertices, false);
        } else {
            pushToArray(geometry.vertices, otherGeometry.vertices, true);
        }
        otherGeometry.translate(0.1, 0, 0);
    }
    if (alsoZCoord) {
        otherGeometry.translate(-0.2, 0, -0, 2);
        for (var i = 0; i < 5; i++) {
            if (i % 2 == 1) {
                pushToArray(geometry.vertices, otherGeometry.vertices, false);
            } else {
                pushToArray(geometry.vertices, otherGeometry.vertices, true);
            }
            otherGeometry.translate(0, 0, 0.1);
        }
    }
}


/**
 * fuegt dem die Elemente des zweiten Arrays an das erste Array hinten dran und verschiebt das zweite Array um 0.1 nach rechts
 * die Arrays sollten aus Elementen der Form {x: float, y:float, z:float} bestehen
 * @param: firstArray: das Array, an das die Elemente drangehaengt werden sollen
 * @param: secondArray: das Array, dessen Elemente an das erste Array angehaengt werden sollen
 * @param: isReversed: true, wenn die Elemente des zweiten Arrays in umgekehrter Reihenfolge an das erste drangehaengt werden sollen, ansonsten false
 */
function pushToArray(firstArray, secondArray, isReversed) {
    var length = secondArray.length;
    if (isReversed) {
        for (var i = length - 1; i >= 0; i--) {
            firstArray.push(new THREE.Vector3(secondArray[i].x, secondArray[i].y, secondArray[i].z));
            //secondArray[i].x = secondArray[i].x + 0.1;
        }
    } else {
        for (var i = 0; i < length; i++) {
            firstArray.push(new THREE.Vector3(secondArray[i].x, secondArray[i].y, secondArray[i].z));
            //secondArray[i].x = secondArray[i].x + 0.1;
        }
    }
}



/**
 *Hilfsmethode fuer drawALine
 *@param: aGarden: der Garten, dem die Linie gehoert
 *@param: destGarden: der Garten, zu dem die Linie geht
 *@param: curveObject: die Linie, die gezeichnet wurde
 */
function workUpGarden(aGarden, destGarden, curveObject) {
    if (aGarden.meshLines[destGarden.building[association.name]] == undefined) {
        aGarden.meshLines[destGarden.building[association.name]] = [curveObject];
    } else {
        aGarden.meshLines[destGarden.building[association.name]].push(curveObject);
    }
    //setNextLinePos(aGarden);
}

/**
 *Methode zum Löschen der Kanten, die von einem Garten ausgehen
 *@param: aGarden: der Garten, von dem aus die Linien gelöscht werden sollen
 *@param: updateBoolean: true, wenn sie von einer Methode aus gui.js aufgerufen wurde, sonst false
 */
function removeLines(aGarden, updateBoolean) {
    var gardenString;
    if (aGarden.isLeftGarden == true) {
        gardenString = "_rightGarden";
    } else {
        gardenString = "_leftGarden";
    }
    var hashMap = getBuildingsHashMap();

    for (var x in aGarden.meshLines) {
        var length = aGarden.meshLines[x].length;
        for (var i = length; i--;) {
            scene.remove(aGarden.meshLines[x][i]);
        }
        hashMap[x]._numOfActivatedConnections = hashMap[x]._numOfActivatedConnections - 1;
        if (hashMap[x]._numOfActivatedConnections == 0) {
            if (highlightBuildingsConnections) {
                var factor = (getColorFactor(getExtrema(), hashMap[x]._leftGarden.color, "SumOfConn") + getColorFactor(getExtrema(), hashMap[x]._leftGarden.color, "SumOfConn")) / 2;
                colorObject(hashMap[x], (new THREE.Color(colorYellowBright)).lerp(new THREE.Color(colorYellowDark), factor));
            } else {
                var factor = getColorFactor(getExtrema(), hashMap[x]._color, "Color");
                colorObject(hashMap[x], (new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), factor));
            }
        } else {
            colorObject(hashMap[x], colorOfTargetBuildings);
        }
    }
    if (updateBoolean) {
        aGarden.meshLines = {};
        aGarden.on = false;
    }
}



/**
 *setzt die Kameraposition neu
 *@param: camera: die Kamera, die wir anders positionieren moechten
 *@param: mainDistrict: District, nachdem sich die Kamera richten soll
 *@param: extrema: Extremwerte vom District
 */
function setCameraPos(camera, mainDistrict, extrema) {
    var maxWidth = mainDistrict._width;
    var maxHeight = extrema.maxHeight;
    var position = camera.position;
    position.x = Math.max(maxWidth, maxHeight);
    position.y = Math.max(maxWidth, maxHeight) / 2;
    position.z = Math.max(maxWidth, maxHeight) * 1.5;
}

/**
 *setzt die Kameraposition neu, wenn die alte Ansicht wiederhergestellt werden soll aus einem Link
 *@param: camera: die Kamera, die wir anders positionieren moechten
 *@params: aJson: das Json, das im Link gespeichert worden ist der Form {"position": {"x": xCamPos, "y": yCamPos, "z": zCamPos},
 "rotation": {"_x": xRotation, "_y": yRotation, "_z": zRotation, "_order": "XYZ" },
 "target": { "x": xPanPos,"y": yPanPos,"z": zPanPos},};
 */
function setCameraPosForLink(camera, aJson) {
    getControls().target.x = aJson.target.x;
    getControls().target.y = aJson.target.y;
    getControls().target.z = aJson.target.z;
    camera.position.set(aJson.position.x, aJson.position.y, aJson.position.z);
    camera.rotation.set(aJson.rotation._x, aJson.rotation._y, aJson.rotation._z);
}



/**
 *Methode zum Bestimmen der Farbe aus dem Farbwert (bisher noch nicht genutzt)
 *@param: extrema: das JSON-Objekt, das die Extremwerte der Daten enthaelt
 *@param: colorValue: der Wert, fuer den man die Farbe berechnen moechte
 *@param: string: "Color" oder "Connections"
 *@return: die berechnet den HSV-Wert, den man fuer den Farbton braucht HSV-Farbe(faktor, faktor, 1)
 */
function getColorFactor(extrema, colorValue, string) {
    return (colorValue - extrema["min" + string]) / (extrema["max" + string] - extrema["min" + string]);
}


/**
 *zeichnet das Bild neu nach einer Aktion vom Nutzer
 */
function render() {

    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    vector.unproject(camera);
    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = ray.intersectObjects(targetList);

    /*if(INTERSECTED){
        var buildingID = INTERSECTED.object.geometry.faces[INTERSECTED.faceIndex].building;
        var faces = getFaces(INTERSECTED);
        for (var i=0; i<faces.length; i++) {
            faces[i].color.setRGB(oldColor.r, oldColor.g, oldColor.b);
        }
        INTERSECTED.object.geometry.colorsNeedUpdate = true;
    }*/

    if (intersects.length > 0 && intersects[0].material == undefined) {
        INTERSECTED = intersects[0];

        /*var faces = getFaces(INTERSECTED);
        oldColor = {r: INTERSECTED.face.color.r, g: INTERSECTED.face.color.g, b:INTERSECTED.face.color.b};
        console.log(INTERSECTED.face.building);
        for (var i=0; i<faces.length; i++) {
            faces[i].color.setHex( 0xF5A9E1 );
        }
        INTERSECTED.object.geometry.colorsNeedUpdate = true;*/
        if (INTERSECTED.face.isLeftGarden == undefined) {
            updateHighlightingLines(INTERSECTED.object.geometry.faces[INTERSECTED.faceIndex].building);
        }

    }
    /*else{
        INTERSECTED = null;
        oldColor = null;
    }*/

    renderer.render(scene, camera);

}


/**
 gibt die Seitenflaechen von dem Objekt zurueck, das durch raycasting geschnitten wurde
 @param: object: das intersected Object
 @return: faces: die Seitenflaechen von diesem Objekt
 */
function getFaces(object) {
    var buildingID = INTERSECTED.object.geometry.faces[INTERSECTED.faceIndex].building;
    if (object.face.isLeftGarden == undefined) {
        var faces = getBuildingsHashMap()[buildingID]._faces;
    } else {
        if (object.face.isLeftGarden) {
            var faces = getBuildingsHashMap()[buildingID]._leftGarden._faces;
        } else {
            var faces = getBuildingsHashMap()[buildingID]._rightGarden._faces;
        }
    }
    return faces;
}


/**
 * Methode zum Updaten des Highlighten der Straßen
 * @param BuildingID: eine GebaeudeID, auf das gezeigt wird
 */
function updateHighlightingLines(buildingID) {
    var aBuilding = getBuildingsHashMap()[buildingID];
    if (doWeUseConnections() && aBuilding != undefined) {
        if (lastIntersectedBuilding != aBuilding) {
            if (lastIntersectedBuilding != undefined) {
                removeHighlightingGardenLines(lastIntersectedBuilding._leftGarden);
                removeHighlightingGardenLines(lastIntersectedBuilding._rightGarden);
            }
            lastIntersectedBuilding = aBuilding;
            highlightGardenLines(lastIntersectedBuilding._leftGarden);
            highlightGardenLines(lastIntersectedBuilding._rightGarden);
        }
    }
}




/**
 * Methode zum highlighten der Gartenlinien
 * @param aGarden: ein Gartenobjekt
 */
function highlightGardenLines(aGarden) {
    if (aGarden.on) {
        var hashMap = getBuildingsHashMap();
        var meshLines = aGarden.meshLines;
        var length;
        for (var x in meshLines) {
            length = meshLines[x].length;
            for (var i = 0; i < length; i++) {
                meshLines[x][i].material.color.setHex(colorOfHighlightingByMouseOver);
            }
            colorObject(hashMap[x], colorOfHighlightingByMouseOver);
        }
    }
    highlightSourceBuildings(aGarden);
}



/**
 * Hilfsmethode zum Highlighten der "Quell"-Gebaeude, wenn dessen Garten an ist
 * @param: aGarden: der Zielgarten, dessen Quellgebaude gehighlighted werden sollen
 */
function highlightSourceBuildings(aGarden) {
    if (aGarden.building._numOfActivatedConnections > 0) {
        var hashMap = getBuildingsHashMap();
        var linesTo = aGarden.linesTo;
        if (aGarden.isLeftGarden) {
            for (var x in linesTo) {
                if (hashMap[x]._rightGarden.on) {
                    colorObject(hashMap[x], colorOfHighlightingByMouseOver);
                }
            }
        } else {
            for (var x in linesTo) {
                if (hashMap[x]._leftGarden.on) {
                    colorObject(hashMap[x], colorOfHighlightingByMouseOver);
                }
            }
        }
    }
}


/**
 * Methode, die das highlighten der Gartenlinien rueckgaengig macht
 * @param aGarden: ein Gartenobjekt
 */
function removeHighlightingGardenLines(aGarden) {
    if (aGarden.on) {
        var hashMap = getBuildingsHashMap();
        var meshLines = aGarden.meshLines;
        var length;
        var factor;
        for (var x in meshLines) {
            length = meshLines[x].length;
            for (var i = 0; i < length; i++) {
                factor = getColorFactor(getExtrema(), aGarden.linesTo[x], "Connections");
                meshLines[x][i].material.color.set(new THREE.Color(0xFF0000).lerp(new THREE.Color(0x000000), factor));
            }
            colorObject(hashMap[x], colorOfTargetBuildings);
        }
    }
    removeHighlightingOfSourceBuildings(aGarden);
}


/**
 * Hilfsmethode zum Entfernen des Highlighten der "Quell"-Gebaeude, wenn dessen Garten an ist
 * @param: aGarden: der Zielgarten, dessen Quellgebaude nicht mehr gehighlighted werden sollen
 */
function removeHighlightingOfSourceBuildings(aGarden) {
    if (aGarden.building._numOfActivatedConnections > 0) {
        var hashMap = getBuildingsHashMap();
        var linesTo = aGarden.linesTo;
        var factor;
        if (aGarden.isLeftGarden) {
            for (var x in linesTo) {
                if (hashMap[x]._rightGarden.on) {
                    setOldColor(hashMap[x]);
                }
            }
        } else {
            for (var x in linesTo) {
                if (hashMap[x]._leftGarden.on) {
                    setOldColor(hashMap[x]);
                }
            }
        }
    }
}

/**
 * Hilfsmethode fuer removeHighlightingOfSourceBuildings
 * gibt den entsprechenden Gebaeuden die richtige Farbe zurueck
 * @param: aBuilding: das Zielgebaeude, dessen Farbe wieder gerichtet werden soll nach dem Highlighten
 */
function setOldColor(aBuilding) {
    if (aBuilding._numOfActivatedConnections == 0) {
        if (highlightBuildingsConnections) {
            var factor = (getColorFactor(getExtrema(), aBuilding._leftGarden.color, "SumOfConn") + getColorFactor(getExtrema(), aBuilding._rightGarden.color, "SumOfConn")) / 2;
            colorObject(aBuilding, (new THREE.Color(colorYellowBright)).lerp(new THREE.Color(colorYellowDark), factor));
        } else {
            var factor = getColorFactor(getExtrema(), aBuilding._color, "Color");
            colorObject(aBuilding, (new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), factor));
        }
    } else {
        colorObject(aBuilding, colorOfTargetBuildings);
    }
}


/**
 * gibt das Gartenobjekt von einer Seitenflaeche zurueck
 *@param: aFace: Seitenflaeche vom Garten
 *@return: garden: der zugehoerige Garten
 */
function getGarden(aFace) {
    var theBuilding = getBuildingsHashMap()[aFace.face.building];
    var gardenstring;
    if (aFace.face.isLeftGarden) {
        gardenstring = "_leftGarden";
    } else {
        gardenstring = "_rightGarden";
    }
    return theBuilding[gardenstring];
}



/**
 * wird aufgerufen, wenn jemand auf einen Garten klickt, der noch nicht an ist.
 * Der Garten bekommt dann eine andere Farbe und es werden die Verbindungen gezeichnet.
 *@param: theGarden: ein Garten
 */
function setGardenOn(theGarden) {
    drawLines(theGarden, true);
    if (drawGardens) {
        colorObject(theGarden, 0x424242);
    }
    if (theGarden.isLeftGarden == true) {
        clickedLeftGardens.push(theGarden.building[association.name]);
    } else {
        clickedRightGardens.push(theGarden.building[association.name]);
    }
}



/**
 * wird aufgerufen, wenn jemand auf einen Garten klickt, der bereits an ist.
 * Der Garten bekommt dann die urspruengliche Farbe und es werden die Verbindungen geloescht.
 *@param: theGarden: ein Garten
 */
function setGardenOff(theGarden) {
    removeLines(theGarden, true);
    var factor = getColorFactor(getExtrema(), theGarden.color, "SumOfConn");
    if (drawGardens) {
        colorObject(theGarden, (new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(0x01DF01), factor));
    }
    if (theGarden.isLeftGarden == true) {
        clickedLeftGardens.splice(clickedLeftGardens.indexOf(theGarden.building[association.name]), 1);
    } else {
        clickedRightGardens.splice(clickedRightGardens.indexOf(theGarden.building[association.name]), 1);
    }
}



/**
 *Methode zum erstellen des JSON zum Speichern der aktuellen Ansicht mit Kameraposition etc.
 *@return: das gewuenschte Json der Form {"position": {"x": xCamPos, "y": yCamPos, "z": zCamPos},
 "rotation": {"_x": xRotation, "_y": yRotation, "_z": zRotation, "_order": "XYZ" },
 "target": { "x": xPanPos,"y": yPanPos,"z": zPanPos},
 "leftGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 "rightGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 "scaling": { "logarithmicHeight": boolean,"logarithmicWidth": boolean,"logarithmicColor": boolean},
 "removedBuildings": ArrayAusIDsDerGeloeschtenGebaeuden,
 "changedLegend": {"Name": "Package","Breite": "Klassen","Höhe": "Methoden","Farbe": "Zeilen" },
 "collID": CollectionID,
 "_id": AnsichtsID};
 */
function getJsonForCurrentLink() {
    var aJson = {};
    aJson.position = camera.position.clone();
    aJson.rotation = camera.rotation.clone();
    aJson.target = getControls().target; //.clone();
    aJson.matrix = getControls().matrix;
    aJson.leftGarden = clickedLeftGardens;
    aJson.rightGarden = clickedRightGardens;
    aJson.scaling = getScalingBooleans();
    aJson.connections = {};
    aJson.connections.eingehendeVerbindungen = eingehendeVerbindungen;
    aJson.connections.ausgehendeVerbindungen = ausgehendeVerbindungen;
    aJson.connections.highlightBuildingsConnections = highlightBuildingsConnections;
    //aJson.removedBuildings = getRemovedBuildings();
    aJson.changedLegend = getChangedLegend();
    aJson.collID = getOriginalAssociations().collID;
    aJson._id = getOriginalAssociations()._id;
    return aJson;
}
