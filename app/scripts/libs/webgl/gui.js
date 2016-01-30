var maximalHeight; //speichert max. hoehe der Gebaeude, um Linien in dieser Hoehe zu zeichnen, ohne extrema zu uebergeben
var mapOfLines = {}; //hier werden alle gezeichneteten Linien gespeichert von jedem Garten
var clickedLeftGardens = []; //Array aus ID der Gebaeude, dessen Gaerten an sind
var clickedRightGardens = [];

var currentPosInColorOfLines = 0;

var association = {}; //hier wird die Legende gespeichert

var highlightedBuildingID;
var camera;

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
		getControls().target.x = hashMap[highlightedBuildingID]._centerPosition[0];
		getControls().target.y = hashMap[highlightedBuildingID]._centerPosition[1];
		getControls().target.z = hashMap[highlightedBuildingID]._centerPosition[2];
		camera.position.set(hashMap[highlightedBuildingID]._centerPosition[0], 
			hashMap[highlightedBuildingID]._centerPosition[1] + 10*Math.min(hashMap[highlightedBuildingID]._height, hashMap[highlightedBuildingID]._width), 
			hashMap[highlightedBuildingID]._centerPosition[2] + 10*Math.min(hashMap[highlightedBuildingID]._height, hashMap[highlightedBuildingID]._width));
		camera.rotation.set(0,0,0);
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
 */
function drawBox(aBuilding, material, scene) {
    var geometry = new THREE.BoxGeometry(aBuilding._width, aBuilding._height, aBuilding._width);
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = aBuilding._centerPosition[0];
    cube.position.y = aBuilding._centerPosition[1];
    cube.position.z = aBuilding._centerPosition[2];
    cube.building = aBuilding;
    aBuilding.mesh = cube;
    if (aBuilding._isRemoved == false) {
        scene.add(cube);
    }
}

/**
 *Hilfsmethode, um ein schönes Material zu bekommen, wenn man die Farbe kriegt
 *@param: aColor: eine Farbe, i.A. als Hexa-Wert, aber als RGB auch moeglich, oder mit "new THREE.color(0,0,1)"
 *@return: das Material in der gewuenschten Farbe
 */
function getMaterial(aColor) {
    var material = new THREE.MeshPhongMaterial({
        color: aColor,
        //specular: 0x333333,
        //shininess: 50,
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors,
        shading: THREE.SmoothShading
    });
    return material;
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
    for (var i = 0; i < mainDistrict["buildings"].length; i++) {
        addEachDistrict(mainDistrict["buildings"][i], scene, extrema, 0);
    }
    //Den Boden ganz unten verschieben wir noch ein kleines bisschen nach unten und danach zeichnen wir den auch noch
    mainDistrict._centerPosition[1] = -1.5;
    addBoxes(0xB5BCDE, mainDistrict, scene);
    setCameraPos(camera, mainDistrict, extrema);

    maximalHeight = getExtrema().maxHeight;
}

/**
 *rekursive Hilfsmethode fuer addCityToScene
 *@param: aDistrict: das Stadtteil, das gezeichnet werden soll
 *@param: scene: die scene, der man die Zeichnungen hinzufuegen moechte
 *@param: extrema: ein JSON-Objekt, das die Extremwerte der Daten enhtaelt, dass man darauf zugreifen kann
 *@param: colorBoolean: 0, wenn Districtfarbe eben 0xB5BCDE war, 1 wenn sie eben 0x768dff (um Districtfarben abzuwechseln)
 */
function addEachDistrict(aDistrict, scene, extrema, colorBoolean) {
    if (aDistrict["buildings"] == undefined) {
        var faktor = getColor(extrema, aDistrict._color, "Color");
        addBoxes(new THREE.Color(faktor, faktor, 1), aDistrict, scene);
        addGarden(aDistrict, scene);
    } else {
        if (colorBoolean == 0) {
            addBoxes(0x768dff, aDistrict, scene);
            addGarden(aDistrict, scene);
            for (var j = 0; j < aDistrict["buildings"].length; j++) {
                addEachDistrict(aDistrict["buildings"][j], scene, extrema, 1);
            }
        } else {
            addBoxes(0xB5BCDE, aDistrict, scene, 0);
            addGarden(aDistrict, scene);
            for (var j = 0; j < aDistrict["buildings"].length; j++) {
                addEachDistrict(aDistrict["buildings"][j], scene, extrema, 0);
            }
        }
    }
}


/**
 *Hilfsmethode fuer addCityToScene, zeichnet die Gaerten zu den zugehoerigen gebaeuden bzw Districts
 *@param aBuilding: das Gebaeude bzw das District
 *@param: scene: scene, der der Garten hinzugefuegt werden soll
 */
function addGarden(aBuilding, scene) {
    var gardens = ["_leftGarden", "_rightGarden"];
    for (var i = 0; i < 2; i++) {
	    if(aBuilding[gardens[i]].color>0){
		    var factor = getColor(getExtrema(), aBuilding[gardens[i]].color, "SumOfConn");
            var gardenMaterial = getMaterial(new THREE.Color(1-factor, 1, 1-factor));
            gardenMaterial.name = "garden";
	    	var geometry = new THREE.CylinderGeometry(aBuilding[gardens[i]]._width/2, aBuilding[gardens[i]]._width/2, aBuilding[gardens[i]]._height, 3, 1, false, i*Math.PI);
            var cube = new THREE.Mesh(geometry, gardenMaterial);
            cube.position.x = aBuilding[gardens[i]]._centerPosition[0];
            cube.position.y = aBuilding[gardens[i]]._centerPosition[1];
            cube.position.z = aBuilding[gardens[i]]._centerPosition[2];
            cube.garden = aBuilding[gardens[i]];
            aBuilding[gardens[i]].mesh = cube;
            if (aBuilding._isRemoved == false) {
                scene.add(cube);
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
        for (var i = 0; i < 5; i++) {
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
    var curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(aGarden.nextLinePos[0], aGarden._centerPosition[1], aGarden.nextLinePos[1]),
        new THREE.Vector3(aGarden.nextLinePos[0], 2 * maximalHeight, aGarden.nextLinePos[1]),
        new THREE.Vector3(destGarden.nextLinePos[0], 3 * maximalHeight, destGarden.nextLinePos[1]),
        new THREE.Vector3(destGarden.nextLinePos[0], destGarden._centerPosition[1], destGarden.nextLinePos[1])
    );
    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(50);

	var factor = getColor(getExtrema(), aGarden.linesTo[destGarden.building[association.name]], "Connections");
    var material = new THREE.LineBasicMaterial({
		color: new THREE.Color(1, 1-factor, 1-factor)
    });
    var curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);

    workUpGarden(aGarden, destGarden, curveObject);
    workUpGarden(destGarden, aGarden, curveObject);
}

/**
 *Hilfsmethode fuer drawALine: fuegt die Linie den mapOfLines hinzu und setzt naechste Linenposition neu
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
    if (aGarden.isLeftGarden == true) {
        var gardenString = "_rightGarden";
    } else {
        var gardenString = "_leftGarden";
    }
    var hashMap = getBuildingsHashMap();
    for (var x in aGarden.meshLines) {
        if (hashMap[x][gardenString].on == false) {
            for (var i = 0; i < aGarden.meshLines[x].length; i++) {
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
 */
function addBoxes(aColor, aBuilding, scene) {
    var districtMaterial = getMaterial(aColor);
    drawBox(aBuilding, districtMaterial, scene);
}


/**
 *setzt die Kameraposition neu
 *@param: camera: die Kamera, die wir anders positionieren moechten
 *@param: mainDistrict: District, nachdem sich die Kamera richten soll
 *@param: extrema: Extremwerte vom District
 */
function setCameraPos(camera, mainDistrict, extrema) {
    camera.position.x = Math.max(mainDistrict._width, extrema.maxHeight);
    camera.position.y = Math.max(mainDistrict._width, extrema.maxHeight) / 2;
    camera.position.z = Math.max(mainDistrict._width, extrema.maxHeight) * 1.5;
}

/**
 *setzt die Kameraposition neu, wenn die alte Ansicht wiederhergestellt werden soll aus einem Link
 *@param: camera: die Kamera, die wir anders positionieren moechten
 *@params: aJson: das Json, das im Link gespeichert worden ist der Form {"position": {"x": xCamPos, "y": yCamPos, "z": zCamPos},
 "rotation": {"_x": xRotation, "_y": yRotation, "_z": zRotation, "_order": "XYZ" },
 "target": { "x": xPanPos,"y": yPanPos,"z": zPanPos},};
 */
function setCameraPosForLink(camera, aJson) {
    camera.position.set(aJson.position.x, aJson.position.y, aJson.position.z);
    camera.rotation.set(aJson.rotation.x, aJson.rotation.y, aJson.rotation.z);
    getControls().target = new THREE.Vector3(aJson.target.x, aJson.target.y, aJson.target.z);
    getControls().matrix = aJson.matrix;
    camera.lookAt(getControls().target);
}



/**
 *Methode zum Bestimmen der Farbe aus dem Farbwert (bisher noch nicht genutzt)
 *@param: extrema: das JSON-Objekt, das die Extremwerte der Daten enthaelt
 *@param: colorValue: der Wert, fuer den man die Farbe berechnen moechte
 *@param: string: "Color" oder "Connections"
 *@return: die berechnet den HSV-Wert, den man fuer den Farbton braucht HSV-Farbe(faktor, faktor, 1)
 */
function getColor(extrema, colorValue, string) {
    return (colorValue - extrema["min"+string]) / (extrema["max"+string] - extrema["min"+string]);
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

    } else { //wenn der Strahl kein Objekt (mehr) schneidet
        INTERSECTED = null; // dann sorge dafuer, dass es nichts mehr rot gemalt wird
    }

    renderer.render(scene, camera); //zeichne das Bild neu

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
            changeBuildingInformation(
                intersects[0].object.building[association["height"]],
                intersects[0].object.building[association["width"]],
                intersects[0].object.building[association["color"]],
                intersects[0].object.building[association["name"]],
                intersects[0].object
            );
        }
    }
}

/**
 * wird aufgerufen, wenn jemand auf einen Garten klickt, der noch nicht an ist.
 * Der Garten bekommt dann eine andere Farbe und es werden die Verbindungen gezeichnet.
 *@param: aMesh: Das Mesh vom Garten
 */
function setGardenOn(aMesh){
    drawLines(aMesh.object.garden, true);
    aMesh.object.material.color.setHex(0xA5DF00);
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
function setGardenOff(aMesh){
    removeLines(aMesh.object.garden, true);
	var factor = getColor(getExtrema(), aMesh.object.garden.color, "SumOfConn");
    aMesh.object.material.color.set(new THREE.Color(1-factor,1,1-factor));
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
 *			bzw. mit JSON.top den Abstand zum oberen Rand
 */
function getScrollDistance(divElement) {
    var rect = divElement.getBoundingClientRect();

    return {
        left: rect.left,
        top: rect.top
    };
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

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1 - (rect.left / window.innerWidth) * 2;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 + (rect.top / window.innerHeight) * 2;

}
