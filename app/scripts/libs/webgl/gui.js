/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */

var buildingColor = 0x0000FF;
var alphaForDistrictColor = 0.3;
var maximalHeight; //speichert max. hoehe der Gebaeude, um Linien in dieser Hoehe zu zeichnen, ohne extrema zu uebergeben
var clickedLeftGardens = []; //Array aus ID der Gebaeude, dessen Gaerten an sind
var clickedRightGardens = [];

var currentPosInColorOfLines = 0;

var association = {}; //hier wird die Legende gespeichert

var highlightedBuildingID;
var camera;

var GARDEN_WIDTH = (6 + 6 * Math.sin(Math.PI / 6)) / Math.cos(Math.PI / 6);
var GARDEN_DEPTH = 6 + 6 * Math.sin(Math.PI / 6);

var lastIntersectedBuilding;

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
 *highlighted ein Gebaeude
 *@param: buildingID: ID vom Gebaeude, das gehighlighted werden soll
 */
function highlightBuilding(buildingID) {
    var hashMap = getBuildingsHashMap();
    if (highlightedBuildingID != undefined) {
        hashMap[highlightedBuildingID].mesh.material.emissive.setHex(null);
    }
    if (hashMap[buildingID] != undefined) {
        highlightedBuildingID = buildingID;
        hashMap[buildingID].mesh.material.emissive.setHex(0xffff00);
    } else if (hashMap[buildingID + "."] != undefined) {
        highlightedBuildingID = buildingID + ".";
        hashMap[buildingID + "."].mesh.material.emissive.setHex(0xffff00);
    } else {
        highlightedBuildingID = undefined;
    }
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
 *Hilfsmethode, um eine WebGL-Box zu malen
 *@param: aBuilding: ein JSON-Objekt vom Typ Gebaeude/building, das gezeichnet werden soll
 *@param: material: ein Material von THREE.js, das auf das Gebaeude drauf soll
 *@param: scene: die scene, der die Box hinzugefuegt werden soll
 *@param: boxGeom: die THREE.BoxGeometry
 */
function drawBox(aBuilding, material, scene, boxGeom) {
    var cP = aBuilding._centerPosition;
    var width = aBuilding._width;

    var cube = new THREE.Mesh(boxGeom, material);
    var pos = cube.position;
    var scale = cube.scale;
    pos.x = cP[0];
    pos.y = cP[1];
    pos.z = cP[2];
    scale.x = width;
    scale.y = aBuilding._height;
    scale.z = width;
    cube.building = aBuilding;
    aBuilding.mesh = cube;
    scene.add(cube);
}

/**
 *Hilfsmethode, um ein schönes Material zu bekommen, wenn man die Farbe kriegt
 *@param: aColor: eine Farbe, i.A. als Hexa-Wert, aber als RGB auch moeglich, oder mit "new THREE.color(0,0,1)"
 *@return: das Material in der gewuenschten Farbe
 */
function getMaterial(aColor) {
    return new THREE.MeshPhongMaterial({
        color: aColor,
        //specular: 0x333333,
        //shininess: 50,
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors,
        shading: THREE.SmoothShading
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
        addEachDistrict(buildings[i], scene, extrema, 0, boxGeom, gardenGeom);
    }
    //Den Boden ganz unten verschieben wir noch ein kleines bisschen nach unten und danach zeichnen wir den auch noch
    mainDistrict._centerPosition[1] = -1.5;
    addBoxes((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), alphaForDistrictColor), mainDistrict, scene, boxGeom);
    setCameraPos(camera, mainDistrict, extrema);

    maximalHeight = getExtrema().maxHeight;
}



/**
 *rekursive Hilfsmethode fuer addCityToScene
 *@param: aDistrict: das Stadtteil, das gezeichnet werden soll
 *@param: scene: die scene, der man die Zeichnungen hinzufuegen moechte
 *@param: extrema: ein JSON-Objekt, das die Extremwerte der Daten enhtaelt, dass man darauf zugreifen kann
 *@param: colorBoolean: 0, wenn Districtfarbe eben 0xB5BCDE war, 1 wenn sie eben 0x768dff (um Districtfarben abzuwechseln)
 *@param: boxGeom: die THREE.BoxGeometry(1,1,1)
 *@param: gardenGeom: die Dreiecke als Geometry fuer die Gaerten
 */
function addEachDistrict(aDistrict, scene, extrema, colorBoolean, boxGeom, gardenGeom) {
    if (aDistrict["buildings"] == undefined) {
        var faktor = getColorFactor(extrema, aDistrict._color, "Color");
        addBoxes((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), faktor), aDistrict, scene, boxGeom);
        if (doWeUseConnections()) addGarden(aDistrict, scene, gardenGeom);
    } else {
        if (colorBoolean == 0) {
            addBoxes(0xDBDBDC, aDistrict, scene, boxGeom);
        } else {
            addBoxes((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), alphaForDistrictColor), aDistrict, scene, boxGeom);
        }
        if (doWeUseConnections()) addGarden(aDistrict, scene, gardenGeom);

        var buildings = aDistrict["buildings"];
        var length = buildings.length;
        for (var j = length; j--;) {
            addEachDistrict(buildings[j], scene, extrema, (colorBoolean + 1) % 2, boxGeom, gardenGeom);
        }
    }
}


/**
 *Hilfsmethode fuer addCityToScene, zeichnet die Gaerten zu den zugehoerigen gebaeuden bzw Districts
 *@param aBuilding: das Gebaeude bzw das District
 *@param: scene: scene, der der Garten hinzugefuegt werden soll
 *@param: gardenGeom: ein Array bestehend aus den beiden Garten-Geometries
 */
function addGarden(aBuilding, scene, gardenGeom) {
    var gardens = ["_leftGarden", "_rightGarden"];
    for (var i = 0; i < 2; i++) {
        if (aBuilding[gardens[i]] && aBuilding[gardens[i]].color > 0) {
            var garden = aBuilding[gardens[i]];
            var factor = getColorFactor(getExtrema(), garden.color, "SumOfConn");
            //var gardenMaterial = getMaterial(new THREE.Color(1 - factor, 1, 1 - factor));
            var gardenMaterial = getMaterial((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(0x01DF01), factor));
            gardenMaterial.name = "garden";
            var cube = new THREE.Mesh(gardenGeom[i], gardenMaterial);
            cube.position.x = garden._centerPosition[0];
            cube.position.y = garden._centerPosition[1];
            cube.position.z = garden._centerPosition[2];
            cube.garden = garden;
            garden.mesh = cube;
            scene.add(cube);
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
    var length = 5;
    if (doWeUseStreets()) length = 1;
    for (var x in aGarden.linesTo) {
        for (var i = 0; i < length; i++) {
            if (aGarden.isLeftGarden == true) {
                if (hashMap[x]._rightGarden.on == false && hashMap[x]._isRemoved == false) {
                    drawALine(aGarden, hashMap[x]._rightGarden);
                }
            } else {
                if (hashMap[x]._leftGarden.on == false && hashMap[x]._isRemoved == false) {
                    drawALine(aGarden, hashMap[x]._leftGarden);
                }
            }
        }
        setNextLinePosForNextPackage(aGarden);
    }
    currentPosInColorOfLines++;
}


/**
 *Zeichnet fuer die Gaerten eine Abhaengigkeit
 *@param: aGarden: der Start-Garten
 *@param: destGarden: der Ziel-Garten
 */
function drawALine(aGarden, destGarden) {
    var geometry = new THREE.Geometry();

    if (doWeUseStreets()) {
        var center = aGarden.building._centerPosition;
        var destCenter = destGarden.building._centerPosition;
        geometry.vertices.push(new THREE.Vector3(center[0], center[1] - (aGarden.building._height / 2), center[2]));
        setPath(geometry.vertices, aGarden.building, destGarden.building);
        geometry.vertices.push(new THREE.Vector3(destCenter[0], destCenter[1] - destGarden.building._height / 2, destCenter[2]));
    } else {
        var curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(aGarden.nextLinePos[0], aGarden._centerPosition[1], aGarden.nextLinePos[1]),
            new THREE.Vector3(aGarden.nextLinePos[0], 2 * maximalHeight, aGarden.nextLinePos[1]),
            new THREE.Vector3(destGarden.nextLinePos[0], 3 * maximalHeight, destGarden.nextLinePos[1]),
            new THREE.Vector3(destGarden.nextLinePos[0], destGarden._centerPosition[1], destGarden.nextLinePos[1])
        );
        geometry.vertices = curve.getPoints(50);
    }
    destGarden.building.mesh.material.color.setHex(0x40FF00);
    var factor = getColorFactor(getExtrema(), aGarden.linesTo[destGarden.building[association.name]], "Connections");
    var material = new THREE.LineBasicMaterial({
        color: new THREE.Color(0xFF0000).lerp(new THREE.Color(0x000000), factor)
    });
    var curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);

    workUpGarden(aGarden, destGarden, curveObject);
    workUpGarden(destGarden, aGarden, curveObject);
    destGarden.building._numOfActivatedConnections++;
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
    setNextLinePos(aGarden);
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
        if (hashMap[x]._numOfActivatedConnections==1) {
            var faktor = getColorFactor(getExtrema(), hashMap[x]._color, "Color");
            hashMap[x].mesh.material.color.set((new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), faktor));
        }
        hashMap[x]._numOfActivatedConnections--;
        if (hashMap[x][gardenString].on == false) {
            var length = aGarden.meshLines[x].length;
            for (var i = length; i--;) {
                scene.remove(aGarden.meshLines[x][i]);
            }
        }
    }
    if (updateBoolean) {
        aGarden.meshLines = {};
        aGarden.on = false;
    }
}


/**
 *Hilfsmethode fuer addCityToScene, zeichnet die Boxen
 *@param: aColor: die Farbe fuer die Box
 *@param: aBuilding: das Building oder District Objekt, das gezeichnet werden soll
 *@param: scene: die scene, der das Objekt hinzugefuegt werden soll
 *@param: boxGeom: die THREE.BoxGeometry(1,1,1)
 */
function addBoxes(aColor, aBuilding, scene, boxGeom) {
    var districtMaterial = getMaterial(aColor);
    drawBox(aBuilding, districtMaterial, scene, boxGeom);
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
    raycaster.setFromCamera(mouse, camera); //erstellt einen Strahl mit der Maus in Verbindung mit der Kamera

    var intersects = raycaster.intersectObjects(scene.children); //sammelt Objekte, die der Strahl schneidet
    if (INTERSECTED && INTERSECTED.material.type != "LineBasicMaterial") {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex); //von dem Objekt nehme vom Material die Farbe und setze sie
    }

    if (intersects.length > 0 && intersects[0].object.material.type != "LineBasicMaterial") { //wenn der Strahl mindestens 1 Objekt schneidet
        INTERSECTED = intersects[0].object; //INTERSECTED sei nun das erste Objekt, das geschnitten wurde
        INTERSECTED.material.emissive.setHex(0xff0000); //davon setze die Farbe auf rot
        updateHighlightingLines(INTERSECTED.building);
    } else { //wenn der Strahl kein Objekt (mehr) schneidet
        INTERSECTED = null; // dann sorge dafuer, dass es nichts mehr rot gemalt wird
    }

    renderer.render(scene, camera); //zeichne das Bild neu

}


/**
 * Methode zum Updaten des Highlighten der Straßen
 * @param aBuilding: ein Gebaeude, auf das gezeigt wird
 */
function updateHighlightingLines(aBuilding) {
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
    var hashMap = getBuildingsHashMap();
    if (aGarden != undefined && aGarden.on) {
        var meshLines = aGarden.meshLines;
        var length;
        for (var x in meshLines) {
            length = meshLines[x].length;
            for (var i = 0; i < length; i++) {
                meshLines[x][i].material.color.setHex(0xFF0000);
                hashMap[x].mesh.material.emissive.setHex(0xff0000);
            }
        }
    }
}

/**
 * Methode, die das highlighten der Gartenlinien rueckgaengig macht
 * @param aGarden: ein Gartenobjekt
 */
function removeHighlightingGardenLines(aGarden) {
    var hashMap = getBuildingsHashMap();
    if (aGarden != undefined && aGarden.on) {
        var meshLines = aGarden.meshLines;
        var length;
        var factor;
        for (var x in meshLines) {
            length = meshLines[x].length;
            for (var i = 0; i < length; i++) {
                factor = getColorFactor(getExtrema(), aGarden.linesTo[x], "Connections");
                meshLines[x][i].material.color.set(new THREE.Color(0xFF0000).lerp(new THREE.Color(0x000000), factor));
                hashMap[x].mesh.material.emissive.setHex(null);
            }
        }
    }
}


/**
 *Wird ausgefuehrt, wenn man mit der Maus klickt
 */
function onDocumentMouseDown(event) {

    event.preventDefault(); // schaltet trackballControls aus

    raycaster.setFromCamera(mouse, camera); //schaut, was die Maus durch die Kamera so erwischt

    var intersects = raycaster.intersectObjects(scene.children); // schaut, was der Strahl, den die Maus macht, alles an Objekten schneidet
    if (intersects.length > 0) { //wenn der Strahl ein Objekt schneidet
        if (intersects[0].object.material.name == "garden") {
            if (intersects[0].object.garden.on == false) {
                setGardenOn(intersects[0]);
            } else {
                setGardenOff(intersects[0]);
            }
        } else {
            if (intersects[0].object.building != undefined) {
                var b = intersects[0].object.building;
                changeBuildingInformation(
                    b[association["height"]],
                    b[association["width"]],
                    b[association["color"]],
                    b[association["name"]],
                    intersects[0].object
                );
            }
        }
    }
}



/**
 * wird aufgerufen, wenn jemand auf einen Garten klickt, der noch nicht an ist.
 * Der Garten bekommt dann eine andere Farbe und es werden die Verbindungen gezeichnet.
 *@param: aMesh: Das Mesh vom Garten
 */
function setGardenOn(aMesh) {
    drawLines(aMesh.object.garden, true);
    aMesh.object.material.color.setHex(0x424242); //0xA5DF00);
    if (aMesh.object.garden.isLeftGarden == true) {
        clickedLeftGardens.push(aMesh.object.garden.building[association.name]);
    } else {
        clickedRightGardens.push(aMesh.object.garden.building[association.name]);
    }
}



/**
 * wird aufgerufen, wenn jemand auf einen Garten klickt, der bereits an ist.
 * Der Garten bekommt dann die urspruengliche Farbe und es werden die Verbindungen geloescht.
 *@param: aMesh: Das Mesh vom Garten
 */
function setGardenOff(aMesh) {
    removeLines(aMesh.object.garden, true);
    var factor = getColorFactor(getExtrema(), aMesh.object.garden.color, "SumOfConn");
    aMesh.object.material.color.set(new THREE.Color(1 - factor, 1, 1 - factor));
    if (aMesh.object.garden.isLeftGarden == true) {
        clickedLeftGardens.splice(clickedLeftGardens.indexOf(aMesh.object.garden.id), 1);
    } else {
        clickedRightGardens.splice(clickedRightGardens.indexOf(aMesh.object.garden.id), 1);
    }
}


/**
 *Eine Methode, um den Abstand von einem DivElement zum linken bzw. oberen Rand des Fensters zu bekommen
 *@param: ein DivElement
 *@return: JSON, sodass man mit JSON.left den Abstand zum linken Rand in px bekommt
 *            bzw. mit JSON.top den Abstand zum oberen Rand
 */
function getScrollDistance(divElement) {
    if (divElement) {
       var rect = divElement.getBoundingClientRect();

        return {
            left: rect.left,
            top: rect.top
        }; 
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
    aJson.removedBuildings = getRemovedBuildings();
    aJson.changedLegend = getChangedLegend();
    aJson.collID = getOriginalAssociations().collID;
    aJson._id = getOriginalAssociations()._id;
    return aJson;
}

/**
 *berechnet die Position von der Maus
 *@param: event: das Event wie Maus faehrt ueber Bildschirm
 */
function onDocumentMouseMove(event) {
    changeLinkForCurrentView(getJsonForCurrentLink());

    event.preventDefault();
    var rect = getScrollDistance(document.getElementById("WebGLCanvas"));

    if (rect) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1 - (rect.left / window.innerWidth) * 2;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 + (rect.top / window.innerHeight) * 2;  
    }
}
