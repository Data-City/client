var maximalHeight; //speichert max. hoehe der Gebaeude, um Linien in dieser Hoehe zu zeichnen, ohne extrema zu uebergeben
var mapOfLines = {}; //hier werden alle gezeichneteten Linien gespeichert von jedem Garten
var clickedLeftGardens = []; //Array aus ID der Gebaeude, dessen Gaerten an sind
var clickedRightGardens = [];

//moegliche Farben der Linien
var colorOfLines = [0xFF0000, 0xFF4000, 0xFF8000, 0xFFBF00, 0xFFFF00, 0xBFFF00, 0x80FF00, 0x40FF00, 0x04B404, 0x088A08];
var currentPosInColorOfLines = 0;

var association = {}; //hier wird die Legende gespeichert

var highlightedBuildingID;
var camera;

//Setter fuer camera
function setCamera(aCam){
    camera = aCam;
}

//highlighted ein Gebaeude
//@params: buildingID: ID vom Gebaeude, das gehighlighted werden soll
function highlightBuilding(buildingID){
    var hashMap = getBuildingsHashMap();
    if(highlightedBuildingID != undefined){
	    hashMap[highlightedBuildingID].mesh.material.emissive.setHex(null);
    }
	if(hashMap[buildingID]!=undefined){
        highlightedBuildingID = buildingID;
        hashMap[buildingID].mesh.material.emissive.setHex(0xffff00);
	}
	else{
	    highlightedBuildingID = undefined;
    }
}


//positioniert die Kamera vor das Gebaeude, das in highlightedBuildingID gespeichert ist
function showBuilding(){
    if(highlightedBuildingID != undefined){
        var hashMap = getBuildingsHashMap();
        camera.position.x = hashMap[highlightedBuildingID]._centerPosition[0];
        camera.position.y = hashMap[highlightedBuildingID]._centerPosition[1]+hashMap[highlightedBuildingID]._height;
        camera.position.z = hashMap[highlightedBuildingID]._centerPosition[2]+hashMap[highlightedBuildingID]._height*2;
	}
}

//Setter fuer association
//@params: newAssociation: die Zuordnung
function setAssociation(newAssociation) {
    association = newAssociation;
}


//Methode zum leeren der Arrays clickedLeft-/-RightGardens
function setClickedGardensEmpty() {
    clickedLeftGardens = [];
    clickedRightGardens = [];
}


//Methode zum hinzufuegen von Elementen zu clickedLeftGardens
//@params: buildingID: eine GartenID
function pushToClickedLeftGardens(buildingID) {
    clickedLeftGardens.push(buildingID);
}

//Methode zum hinzufuegen von Elementen zu clickedRightGardens
//@params: buildingID: eine GartenID
function pushToClickedRightGardens(buildingID) {
    clickedRightGardens.push(buildingID);
}

//Methode zum Setzen von clickedRightGardens und clickedLeftGardens
//@params: das Json, das im Link gespeichert worden ist der Form {camPos: json_mit_Camera_Position,
//										leftGarden: array_mit_ID_der_linken_Gaerten,_die_an_sind,
//										rightGarden: array_mit_ID_der_rechten_Gaerten,_die_an_sind
//										scaling: json_von_legende}
function setClickedGardens(aJson) {
    clickedLeftGardens = aJson.leftGarden;
    clickedRightGardens = aJson.rightGarden;
}

//Hilfsmethode, um eine WebGL-Box zu malen
//@params: aBuilding: ein JSON-Objekt vom Typ Gebaeude/building, das gezeichnet werden soll
//			material: ein Material von THREE.js, das auf das Gebaeude drauf soll
//			scene: die scene, der die Box hinzugefuegt werden soll
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


//Hilfsmethode, um ein schönes Material zu bekommen, wenn man die Farbe kriegt
//@params: aColor: eine Farbe, i.A. als Hexa-Wert, aber als RGB auch moeglich, oder mit "new THREE.color(0,0,1)"
//@return: das Material in der gewuenschten Farbe
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


//Methode zum Setzen des Lichts
//@params: scene: die scene, in die Licht eingesetzt werden soll
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



//Methode, um die Stadt auf die WebGL-scene zu zeichnen, wenn wir die Daten bekommen haben
//@params:	mainDistrict: das Stadtteil, das der unteren Grundflaeche entspricht mit allen zu zeichnenden Stadtteilen und Gebaeuden
//			scene: die scene, der man die Zeichnungen hinzufuegen moechte
//			camera: die Kamera, die wir nach dem Malen anders positionieren moechten
//			extrema: ein JSON-Objekt, das die Extremwerte der Daten enhtaelt, dass man darauf zugreifen kann
function addCityToScene(mainDistrict, scene, camera, extrema) {

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

//rekursive Hilfsmethode fuer addCityToScene
//@params:	aDistrict: das Stadtteil, das gezeichnet werden soll
//			scene: die scene, der man die Zeichnungen hinzufuegen moechte
//			extrema: ein JSON-Objekt, das die Extremwerte der Daten enhtaelt, dass man darauf zugreifen kann
//			colorBoolean: 0, wenn Districtfarbe eben 0xB5BCDE war, 1 wenn sie eben 0x768dff (um Districtfarben abzuwechseln)
function addEachDistrict(aDistrict, scene, extrema, colorBoolean) {
    if (aDistrict["buildings"] == undefined) {
        var faktor = getColor(extrema, aDistrict._color);
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



//Hilfsmethode fuer addCityToScene, zeichnet die Gaerten zu den zugehoerigen gebaeuden bzw Districts
//@params aBuilding: das Gebaeude bzw das District
//			scene: scene, der der Garten hinzugefuegt werden soll
function addGarden(aBuilding, scene) {
    var gardens = ["_leftGarden", "_rightGarden"];
    for (var i = 0; i < 2; i++) {
        var gardenMaterial = getMaterial(0x088A08);
        gardenMaterial.name = "garden";
        var geometry = new THREE.BoxGeometry(aBuilding[gardens[i]]._width, aBuilding[gardens[i]]._height, aBuilding[gardens[i]].depth);
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


//Zeichnet alle Abhaengigkeiten, die von einem Garten ausgehen
//@params: aGarden: der Garten, fuer den die Abhaengigkeit gezeichnet werden soll
//			updateBoolean: true, wenn die Methode in gui.js aufgerufen wurde, sonst false
function drawLines(aGarden, updateBoolean) {
    if (updateBoolean) {
        aGarden.on = true;
    }
    var hashMap = getBuildingsHashMap();
    for (var x in aGarden.linesTo) {
        for (var i = 0; i < aGarden.linesTo[x]; i++) {
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
    }
    currentPosInColorOfLines++;
}



//Zeichnet fuer die Gaerten eine Abhaengigkeit
//@params: aGarden: der Start-Garten
//			destGarden: der Ziel-Garten
function drawALine(aGarden, destGarden) {
    var curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(aGarden.nextLinePos[0], aGarden._centerPosition[1], aGarden.nextLinePos[1]),
        new THREE.Vector3(aGarden.nextLinePos[0] //+ 0.3 * (destGarden.nextLinePos[0] - aGarden.nextLinePos[0])
            , 2 * maximalHeight, aGarden.nextLinePos[1] //+ 0.3 * (destGarden.nextLinePos[0] - aGarden.nextLinePos[1])

        ),
        new THREE.Vector3(destGarden.nextLinePos[0] //+ 0.7 * (destGarden.nextLinePos[0] - aGarden.nextLinePos[0])
            , 3 * maximalHeight, destGarden.nextLinePos[1] //+ 0.7 * (destGarden.nextLinePos[0] - aGarden.nextLinePos[1])

        ),
        new THREE.Vector3(destGarden.nextLinePos[0], destGarden._centerPosition[1], destGarden.nextLinePos[1])
    );
    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(50);

    var material = new THREE.LineBasicMaterial({
        color: colorOfLines[currentPosInColorOfLines % 10]
    });
    var curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);

    workUpGarden(aGarden, destGarden, curveObject);
    workUpGarden(destGarden, aGarden, curveObject);
}


//Hilfsmethode fuer drawALine: fuegt die Linie den mapOfLines hinzu und setzt naechste Linenposition neu
//@params: aGarden: der Garten, dem die Linie gehoert
//			destGarden: der Garten, zu dem die Linie geht
//			curveObject: die Linie, die gezeichnet wurde
function workUpGarden(aGarden, destGarden, curveObject) {
    if (aGarden.meshLines[destGarden.building[association.name]] == undefined) {
        aGarden.meshLines[destGarden.building[association.name]] = [curveObject];
    } else {
        aGarden.meshLines[destGarden.building[association.name]].push(curveObject);
    }
    setNextLinePos(aGarden);
}


//Methode zum Löschen der Kanten, die von einem Garten ausgehen
//@params aGarden: der Garten, von dem aus die Linien gelöscht werden sollen
//		updateBoolean: true, wenn sie von einer Methode aus gui.js aufgerufen wurde, sonst false
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



//Hilfsmethode fuer addCityToScene, zeichnet die Boxen
//@params: aColor: die Farbe fuer die Box
//			aBuilding: das Building oder District Objekt, das gezeichnet werden soll
//			scene: die scene, der das Objekt hinzugefuegt werden soll
function addBoxes(aColor, aBuilding, scene) {
    var districtMaterial = getMaterial(aColor);
    drawBox(aBuilding, districtMaterial, scene);
}



//setzt die Kameraposition neu
//@params: camera: die Kamera, die wir anders positionieren moechten
//		mainDistrict: District, nachdem sich die Kamera richten soll
//		extrema: Extremwerte vom District
function setCameraPos(camera, mainDistrict, extrema) {
    camera.position.x = Math.max(mainDistrict._width, extrema.maxHeight);
    camera.position.y = Math.max(mainDistrict._width, extrema.maxHeight) / 2;
    camera.position.z = Math.max(mainDistrict._width, extrema.maxHeight) * 1.5;
}


//setzt die Kameraposition neu, wenn die alte Ansicht wiederhergestellt werden soll aus einem Link
//@params: camera: die Kamera, die wir anders positionieren moechten
//			aJson: das Json, das im Link gespeichert worden ist der Form {camPos: json_mit_Camera_Position,
//										garden: array_mit_ID_der_Gaerten,_die_an_sind,
//										scaling: json_von_legende}
function setCameraPosForLink(camera, aJson) {
    camera.position.x = aJson.camPos.x;
    camera.position.y = aJson.camPos.y;
    camera.position.z = aJson.camPos.z;
}




//Methode zum Bestimmen der Farbe aus dem Farbwert (bisher noch nicht genutzt)
//@params: extrema: das JSON-Objekt, das die Extremwerte der Daten enthaelt
//			colorValue: der Wert, fuer den man die Farbe berechnen moechte
//@return: die berechnet den HSV-Wert, den man fuer den Farbton braucht HSV-Farbe(faktor, faktor, 1)
function getColor(extrema, colorValue) {
    return (colorValue - extrema.minColor) / (extrema.maxColor - extrema.minColor);
}




//zeichnet das Bild neu nach einer Aktion vom Nutzer
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


//Wird ausgefuehrt, wenn man mit der Maus klickt
function onDocumentMouseDown(event) {

    event.preventDefault(); // schaltet controls aus

    raycaster.setFromCamera(mouse, camera); //schaut, was die Maus durch die Kamera so erwischt

    var intersects = raycaster.intersectObjects(scene.children); // schaut, was der Strahl, den die Maus macht, alles an Objekten schneidet
    if (intersects.length > 0) { //wenn der Strahl ein Objekt schneidet
        if (intersects[0].object.material.name == "garden") {
            if (intersects[0].object.garden.on == false) {
                drawLines(intersects[0].object.garden, true);
                intersects[0].object.material.color.setHex(0xA5DF00);
                if (intersects[0].object.garden.isLeftGarden == true) {
                    clickedLeftGardens.push(intersects[0].object.garden.building[association.name]);
                } else {
                    clickedRightGardens.push(intersects[0].object.garden.building[association.name]);
                }

            } else {
                removeLines(intersects[0].object.garden, true);
                intersects[0].object.material.color.setHex(0x088A08);
                if (intersects[0].object.garden.isLeftGarden == true) {
                    clickedLeftGardens.splice(clickedLeftGardens.indexOf(intersects[0].object.garden.id), 1);
                } else {
                    clickedRightGardens.splice(clickedRightGardens.indexOf(intersects[0].object.garden.id), 1);
                }
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

//Eine Methode, um den Abstand von einem DivElement zum linken bzw. oberen Rand des Fensters zu bekommen
//@params: ein DivElement
//@return: JSON, sodass man mit JSON.left den Abstand zum linken Rand in px bekommt
//			bzw. mit JSON.top den Abstand zum oberen Rand
function getScrollDistance(divElement) {
    var rect = divElement.getBoundingClientRect();

    return {
        left: rect.left,
        top: rect.top
    };
}

//Methode zum erstellen des JSON zum Speichern der aktuellen Ansicht mit Kameraposition etc.
//@return: das gewuenschte Json
function getJsonForCurrentLink() {
    var aJson = {};
    aJson.camPos = camera.position;
    aJson.leftGarden = clickedLeftGardens;
    aJson.rightGarden = clickedRightGardens;
    aJson.scaling = getScalingBooleans();
    aJson.removedBuildings = getRemovedBuildings();
    aJson.changedLegend = getChangedLegend();
    aJson.collID = getOriginalAssociations().collID;
    aJson._id = getOriginalAssociations()._id;
    return aJson;
}


//berechnet die Position von der Maus	
function onDocumentMouseMove(event) {
    changeLinkForCurrentView(getJsonForCurrentLink());

    event.preventDefault();
    var rect = getScrollDistance(document.getElementById("WebGLCanvas"));

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1 - (rect.left / window.innerWidth) * 2;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 + (rect.top / window.innerHeight) * 2;

}
