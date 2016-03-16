var association = {}; //hier wird die Legende gespeichert
var gui; //das Dropdownmenue
//Variablen, die benoetigt werden, um Gebaeude/ Distrikte zu loeschen
var storedMesh, storedLeftGarden, storedRightGarden;
var storedDistrict = [];
var storedBuilding = [];
var removedBuildings = [];
var arrayOfRemovedBuildings = [];

var eingehendeVerbindungen, ausgehendeVerbindungen;

// Dimensionen, die wir abbilden
var myDimensions = ["ID", "Breite", "Höhe", "Farbe"];

//Namen, auf die wir beim JSON-Objekt zugreifen fuer die Legende
var dimensionsFromDatabase = ["name", "width", "height", "color"];

//fuer den Ordner 'Legende'
var legend = {
    "ID": association.name,
    "Breite": association.width,
    "Höhe": association.height,
    "Farbe": association.color
};

//fuer den Ordner "Gebaeudeinformationen"
var buildingInformation = {
    "height": "Klicken Sie bitte auf ein Gebäude",
    "width": "Klicken Sie bitte auf ein Gebäude",
    "color": "Klicken Sie bitte auf ein Gebäude",
    "name": "Klicken Sie bitte auf ein Gebäude",
    /*"remove": function() {
        remove(buildingInformation.mesh);
    },
    "undo": function() {
        if (arrayOfRemovedBuildings.length > 0) undoRemoving(getScene());
    }*/
    "Verbindungen": false,
    "eingehendeVerbindungenaktivieren": false,
    "ausgehendeVerbindungenaktivieren": false
};

//entsteht, wenn Nutzer die Legende aendert
var changedLegend = undefined;

//fuer den Ordner "Skalierung"
var scaling = {
    "logarithmicHeight": false,
    "logarithmicWidth": false,
    "logarithmicColor": false
};


//fuer den Ordner "Steuerung"
var controlling = {
    "zoomSpeed": 1,
    "rotateSpeed": 1,
    "opacity": 1
};

//fuer den Ordner "aktuelle Ansicht"
var currentView = {
    "initialView": function() {
        goToInitialView();
    },
    "goToArielView": function() {
        goToArielView();
    },
    "Link": ''
}

//fuer den Ordner "Gebaeudesuche"
var searchBuilding = {
    "search": "Bitte Gebäudenamen eingeben",
    "deactivate": function() {
        deactivateHighlighting();
    }
}

/**
 * Hilfsvariable als Methode zum Reagieren auf das DropDown-Menue
 */
var update = function() {
    requestAnimationFrame(update);
};



/**
 * Getter fuer buildingInformation
 * @return: buildingInformation
 */
/*function getBuildingInformation() {
    return buildingInformation;
}*/

/**
 * loescht ein District von der Bildflaeche und speichert dies
 * @param: face: das Face-Objekt, auf das geklickt wurde und dessen Gebaeude geloescht werden soll
 */
function remove(Face) {
    var building = getBuildingsHashMap()[Face.face.building];
    //if (mesh.length != 0) {
    removeDistrict(getScene(), Face, true);
    arrayOfRemovedBuildings.push(storedDistrict);
    //}
}


/**
 * Setter fuer association
 * @param: newAssociation: die neue Zuordnung
 */
function setAssociation(newAssociation) {
    association = newAssociation;
}

/**
 * Getter für scaling
 * @return: scaling: Object { logarithmicHeight: boolean, logarithmicWidth: boolean, logarithmicColor: boolean }
 */
function getScalingBooleans() {
    return scaling;
}

/**
 * Setter fuer scaling
 * @param: scalingObject: Object, mit dem Scaling ueberschrieben werden soll der Form 
 * { logarithmicHeight: boolean, logarithmicWidth: boolean, logarithmicColor: boolean }
 */
function setScalingBooleans(scalingObject) {
    scaling = scalingObject;
}

/**
 * Getter fuer removedBuildings
 * @param: Variable removedBuildings: Array, das die IDs aller geloeschten Gebaeude enthaelt
 */
function getRemovedBuildings() {
    return removedBuildings;
}

/**
 * Setter fuer removedBuildings
 * @param: newRemovedBuildings: das neue Array, das die IDs aller geloeschten Gebaeude enthaelt
 */
function setRemovedBuildings(newRemovedBuildings) {
    removedBuildings = newRemovedBuildings;
}



/**
 * aendert bei den Gebaeudeinformationen in der Legende die Werte, die angezeigt werden sollen
 * @param: newHeight: die neue Hoehe, die angezeigt werden soll
 * @param: newWidth: die neue Breite, die angezeigt werden soll
 * @param: newColor: die neue Farbe, die angezeigt werden soll
 * @param: newName: der neue Name vom Gebaeude, der angezeigt werden soll
 * @param: aFace: Objekt von der Seitenflaeche, auf das geklickt worden ist
 */
function changeBuildingInformation(newHeight, newWidth, newColor, newName, aFace) {
    if (newHeight != undefined) {
        buildingInformation["height"] = newHeight;
        buildingInformation["width"] = newWidth;
        buildingInformation["color"] = newColor;
    } else {
        buildingInformation["height"] = "Keine Daten";
        buildingInformation["width"] = "Keine Daten";
        buildingInformation["color"] = "Keine Daten";
    }
    if (newName != "undefined.") {
        buildingInformation["name"] = newName;
    } else {
        buildingInformation["name"] = "Keine Daten";
    }
    /*buildingInformation.face = aFace;*/
}

/**
 * aendert bei dem Link in der Legende den Link zum Verschicken
 * @param: aJson: ein Objekt der Form 
 *    {camPos: json_mit_Camera_Position,
 *     garden: array_mit_ID_der_Gaerten,_die_an_sind,
 *     scaling: json_von_legende}
 */
function changeLinkForCurrentView(aJson) {
    currentView['Link'] = window.location.href.split("/#/")[0] + '/#/storedView?webGLSettings=' + JSON.stringify(aJson);
}

/**
 * getter fuer gui (dropdownmenu)
 * @return: gui: das dropdownmenu
 */
function getGui() {
    return gui;
}

/**
 * Initiiert die Legende auf den Anfangszustand
 */
function initDropDownMenue() {

    eingehendeVerbindungen = false;
    ausgehendeVerbindungen = false;

    //fuer den Ordner 'Legende'
    legend = {
        "ID": association.name,
        "Breite": association.width,
        "Höhe": association.height,
        "Farbe": association.color
    };

    //fuer den Ordner "Gebaeudeinformationen"
    buildingInformation = {
        "height": "Klicken Sie bitte auf ein Gebäude",
        "width": "Klicken Sie bitte auf ein Gebäude",
        "color": "Klicken Sie bitte auf ein Gebäude",
        "name": "Klicken Sie bitte auf ein Gebäude",
        /*,
                "remove": function() {
                    remove(buildingInformation.mesh);
                },
                "undo": function() {
                    if (arrayOfRemovedBuildings.length > 0) undoRemoving(getScene());
                }*/
        "Verbindungen": false,
        "eingehendeVerbindungenaktivieren": false,
        "ausgehendeVerbindungenaktivieren": false
    };

    //entsteht, wenn Nutzer die Legende aendert
    changedLegend = undefined;

    //fuer den Ordner "Skalierung"
    scaling["logarithmicHeight"] = logScaling.height;
    scaling["logarithmicWidth"] = logScaling.width;
    scaling["logarithmicColor"] = logScaling.color;

    //fuer den Ordner "Steuerung"
    controlling = {
        "zoomSpeed": 1,
        "rotateSpeed": 1,
        "opacity": 1
    };

    //fuer den Ordner "aktuelle Ansicht"
    currentView = {
        "initialView": function() {
            goToInitialView();
        },
        "goToArielView": function() {
            goToArielView();
        },
        "Link": ''
    }

    //fuer den Ordner "Gebaeudesuche"
    searchBuilding = {
        "search": "Bitte Gebäudenamen eingeben",
        "deactivate": function() {
            deactivateHighlighting();
        }
    }
}

/**
 * Methode, um das Dropdown-Menue oben rechts zu zeichnen
 * @param: scene: die scene, mit der man arbeiten moechte und auf die man reagieren moechte
 * @param: aDistrict: das JSON vom Typ Stadtteil, mit dem ich agieren moechte, wenn der Nutzer das mit der Legende machen moechte
 * @param: camera: die Kamera, die neu positioniert wird, falls das district bearbeitet wird
 * @param: orbitControls: OrbitControl fuer die Steuerung,die wir verwenden
 * @param: trackballControls: das Trackball fuer die Steuerung,die wir verwenden
 * @param: nameOfDivElement: DivElement, dem wir die WebGLCanvas und Dropdownmenue hinzufuegen
 */
function setMenue(scene, aDistrict, camera, orbitControls, trackballControls, nameOfDivElement) {

    initDropDownMenue();

    gui = new dat.GUI({
        width: 375,
        autoPlace: false
    });

    gui.domElement.style.position = 'absolute';
    var divelRect = document.getElementById("WebGLCanvas").getBoundingClientRect();
    gui.domElement.style.left = divelRect.left + "px";
    gui.domElement.style.top = "0px";
    gui.domElement.id = "dropdownmenu";
    document.getElementById(nameOfDivElement).appendChild(gui.domElement);

    var h = gui.addFolder("Legende");
    legend = {
        "ID": association.name,
        "Breite": association.width,
        "Höhe": association.height,
        "Farbe": association.color
    };

    for (var i = 0; i < myDimensions.length; i++) {
        setFolderLegende(h, i, gui);
    }
    //*****************************************************************

    h = gui.addFolder("Gebäudeinformationen");
    for (var i = 0; i < myDimensions.length; i++) {
        if (buildingInformation[dimensionsFromDatabase[i]] == undefined) {
            buildingInformation[dimensionsFromDatabase[i]] = "Klicken Sie bitte auf ein Gebäude";
        }
        h.add(buildingInformation, dimensionsFromDatabase[i]).name(association[dimensionsFromDatabase[i]]).listen();
    }
    h.add(buildingInformation, "Verbindungen").name("Geb. mit Verb. hervorheben").onChange(function(value) {
        buildingInformation["Verbindungen"] = value;
        highlightBuildingsWithConnections(value);
    })
    h.add(buildingInformation, "eingehendeVerbindungenaktivieren").name("eingehende Verb. per Klick").onChange(function(value) {
        eingehendeVerbindungen = value;
    })
    h.add(buildingInformation, "ausgehendeVerbindungenaktivieren").name("ausgehende Verb. per Klick").onChange(function(value) {
            ausgehendeVerbindungen = value;
        })
        /*h.add(buildingInformation, "remove").name("Ausblenden");
        h.add(buildingInformation, "undo").name("Ausblenden rückgängig");*/

    //*****************************************************************

    h = gui.addFolder("Skalierung");
    h.add(scaling, "logarithmicHeight").name("Höhe logarithmieren").onChange(function(value) {
        scaling["logarithmicHeight"] = value;
        scale(value, "height", scene, aDistrict, camera);
    });
    h.add(scaling, "logarithmicWidth").name("Breite logarithmieren").onChange(function(value) {
        scaling["logarithmicWidth"] = value;
        scale(value, "width", scene, aDistrict, camera);
    });
    h.add(scaling, "logarithmicColor").name("Farbe logarithmieren").onChange(function(value) {
        scaling["logarithmicColor"] = value;
        scale(value, "color", scene, aDistrict, camera);
    });

    //********************************************************************

    h = gui.addFolder("Steuerung");
    h.add(controlling, "zoomSpeed", 0.1, 2).name("Zoomgeschwindigkeit").onChange(function(value) {
        trackballControls.zoomSpeed = value;
    });
    h.add(controlling, "rotateSpeed", 0.1, 2).name("Rotationsgeschwindigkeit").onChange(function(value) {
        orbitControls.rotateSpeed = value;
    });
    h.add(controlling, "opacity", 0, 1).name("Transparenz").onChange(function(value) {
        getTotalMaterial().opacity = value;
    });

    //********************************************************************

    h = gui.addFolder("Gebäudesuche");
    h.add(searchBuilding, "search").name("Suche").onFinishChange(function(value) {
        highlightBuilding(value);
        showBuilding();
    });
    h.add(searchBuilding, "deactivate").name("Auswahl deaktivieren");

    //********************************************************************

    h = gui.addFolder("Ansicht");
    h.add(currentView, "initialView").name("Anfangsansicht");
    h.add(currentView, "goToArielView").name("Vogelperspektive");
    h.add(currentView, "Link").name("aktuelle Ansicht").listen();
    h.addFolder("Für neuen Link darf obiges Feld nicht angeklickt sein.");
}

/**
 * Hilfsmethode, um den Ordner "Legende" in dat gui zu setzen
 * @param: h: Ordner Legende
 * @param: i: die Position fuer den naechsten Controller im Ordner Legende
 * @param: gui: das Dropdownmenue
 */
function setFolderLegende(h, i, gui) {
    h.add(legend, myDimensions[i]).onChange(
        function(value) {
            gui.__folders["Gebäudeinformationen"].__listening[i].name(value);
            if (changedLegend == undefined) changedLegend = legend;
            changedLegend[myDimensions[i]] = value;
        }
    )
}

/**
 * Setter fuer changedLegend
 * @param: newchangedLegend: die neue Legende
 */
function setChangedLegend(newChangedLegend) {
    changedLegend = newChangedLegend;
}


/**
 * Getter fuer changedLegend
 * @return: changedLegend: die vom Nutzer veraenderte Legende
 */
function getChangedLegend() {
    if (changedLegend == undefined) {
        return legend;
    } else {
        return changedLegend;
    }
}


/**
 * Methode, um ein Distrikt oder ein Gebaeude zu loeschen
 * @param: scene: die Scene, auf der die Objekte gezeichnet wurden
 * @param: aMesh: Mesh vom Distrikt oder Gebaeude, das geloescht werden soll
 * @param: isFirstCall: true, wenn es der Initialaufruf dieser Methode ist
 */
/*function removeDistrict(scene, aMesh, isFirstCall) {
    if (isFirstCall) {
        storedDistrict = [];
        removedBuildings.push(aMesh.building[association.name]);
    }
    removeObject(scene, aMesh);
    storedDistrict = storedDistrict.concat(storedBuilding);
    if (aMesh.building.buildings != undefined) {
        for (var i = 0; i < aMesh.building.buildings.length; i++) {
            if (scene.children.indexOf(aMesh.building.buildings[i].mesh) != -1) {
                removeDistrict(scene, aMesh.building.buildings[i].mesh, false);
            }
        }
    }
}*/

/**
 * Methode, um das letzte geloeschte District wieder herzustellen
 * @param: scene: die Scene, auf der wir zeichnen
 */
/*function undoRemoving(scene) {
    storedDistrict = arrayOfRemovedBuildings.pop();
    removedBuildings.splice(removedBuildings.indexOf(storedDistrict[0].building[association.name]), 1);
    for (var i = 0; i < storedDistrict.length; i++) {
        scene.add(storedDistrict[i]);
        if (storedDistrict[i].building != undefined) {
            storedDistrict[i].building._isRemoved = false;
        }
    }
}*/

/**
 * Methode, um Gebaeude zu loeschen
 * @param: scene: die Scene, auf die die Objekte gezeichnet wurden
 * @param: aMesh: das Mesh zum Gebaeude
 */
/*function removeObject(scene, aMesh) {
    storedBuilding = [];
    storedBuilding.push(aMesh);
    aMesh.building._isRemoved = true;
    //removedBuildings.push(aMesh.building[association.name]);
    if (aMesh.building._leftGarden.mesh != undefined) {
        storedBuilding.push(aMesh.building._leftGarden.mesh);
        for (var x in aMesh.building._leftGarden.meshLines) {
            storedBuilding = storedBuilding.concat(aMesh.building._leftGarden.meshLines[x]);
        }
    }
    if (aMesh.building._rightGarden.mesh != undefined) {
        storedBuilding.push(aMesh.building._rightGarden.mesh);
        for (var x in aMesh.building._rightGarden.meshLines) {
            storedBuilding = storedBuilding.concat(aMesh.building._rightGarden.meshLines[x]);
        }
    }
    for (var i = 0; i < storedBuilding.length; i++) {
        scene.remove(storedBuilding[i]);
    }
}*/


/**Methode um die Gebaeude zu highlighten, die Verbindungen haben
 * @param: value: der Wert aus der Legende, also ein Boolean (true = Gebaeude sind markiert, false = Gebaeude sind nicht markiert)
 */
function highlightBuildingsWithConnections(value) {
    var arr = getCalls();
    var income = arr[0];
    var outgoing = arr[1];
    var hashmap = getBuildingsHashMap();
    for (var y in hashmap) {
        if (value) {
            if (income[y] || outgoing[y]) {
                colorObject(hashmap[y], 0xFFBF00);
            }
        } else {
            if (income[y] || outgoing[y]) {
                var hashMap = getBuildingsHashMap();
                var factor = getColorFactor(getExtrema(), hashMap[y]._color, "Color");
                colorObject(hashMap[y], (new THREE.Color(0xBDBDBD)).lerp(new THREE.Color(buildingColor), factor));
            }
        }
    }
}

/**
 * skaliert die Gebaeude und zeichnet sie neu
 * @param: value: der Wert aus der Legende, also ein Boolean (true, falls logarithmisch skaliert werden soll; false, wenn nicht skaliert)
 * @param: aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
 * @param: scene: die scene, auf die neu gemalt werden soll
 * @param: aDistrict: das JSON vom Typ district, dessen Gebaeude skaliert werden soll
 * @param: camera: die Kamera, die nach dem Zeichnen neu positioniert werden soll
 */
function scale(value, aString, scene, aDistrict, camera) {
    if (value) {
        var scalingMethod = scaleLogarithmically;
        var scalingExtrema = takeLogarithmOfExtrema;
    } else {
        var scalingMethod = scaleLinearly;
        var scalingExtrema = linearizeExtrema;
    }
    removeAllObjects(scene, aString, scalingMethod);
    scaleAll(aString, scalingMethod);
    storedDistrict = [];
    storedBuilding = [];
    setLight(scene);
    setAndDrawCity(aDistrict, true, aString, scalingExtrema);
    drawStoredLines(getJsonForCurrentLink());
    /*updateRemovedBuildings();
    if (buildingInformation.mesh != undefined) {
        buildingInformation.mesh = buildingInformation.mesh.building.mesh;
    }*/
    updateControls(Math.max(aDistrict._width, getExtrema().maxHeight));
    saveCamera();
}



/**
 * Methode, um die Extremwerte ebenfalls zu skalieren
 * @param: aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
 */
function takeLogarithmOfExtrema(aString) {
    var extrema = getExtrema();
    if (aString == "width") {
        extrema.maxWidth = Math.log(extrema.maxWidth) / Math.log(2);
        extrema.minWidth = Math.log(extrema.minWidth) / Math.log(2);
    } else if (aString == "height") {
        extrema.maxHeight = Math.log(extrema.maxHeight) / Math.log(2);
        extrema.minHeigth = Math.log(extrema.minHeigth) / Math.log(2);
    } else {
        extrema.maxColor = Math.log(extrema.maxColor) / Math.log(2);
        extrema.minColor = Math.log(extrema.minColor) / Math.log(2);
    }
}


/**
 * Methode, um die Extremwerte wieder normal zu skalieren
 * @param: aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
 */
function linearizeExtrema(aString) {
    var extrema = getExtrema();
    if (aString == "width") {
        extrema.maxWidth = Math.pow(2, extrema.maxWidth);
        extrema.minWidth = Math.pow(2, extrema.minWidth);
    } else if (aString == "height") {
        extrema.maxHeight = Math.pow(2, extrema.maxHeight);
        extrema.minHeigth = Math.pow(2, extrema.minHeigth);
    } else {
        extrema.maxColor = Math.pow(2, extrema.maxColor);
        extrema.minColor = Math.pow(2, extrema.minColor);
    }
}


/**
 * Hilfsmethode zum logarithmieren (Logarithmus zur Basis 2)
 * @param: aDistrict: das Stadtteil, dessen Gebaeude skaliert werden soll
 * @param: aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
 */
function scaleLogarithmically(aDistrict, aString) {
    return (Math.log(aDistrict["_" + aString] + 1) / Math.log(2));
}


/**
 * Hilfsmethode, um die urspruenglichen Werte wieder herzustellen, d.h. ohne Skalierung die Gebaeude zu zeichnen
 * @param: aDistrict: das Stadtteil, dessen Gebaeude skaliert werden soll
 * @param: aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
 */
function scaleLinearly(aDistrict, aString) {
    return getDrawnDimValue(aDistrict, aString);
}


/**
 * Hilfsmethode, um alle Objekte auf der Oberflaeche zu loeschen
 * @param: scene: die Scene, auf der alle Objekte geloescht werden soll
 * @param: aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
 * @param: scalingMethod: scaleLogarithmically oder scaleLinearly
 */
function removeAllObjects(scene, aString, scalingMethod) {
    var object;
    for (var i = scene.children.length - 1; i >= 0; i--) {
        object = scene.children[i];
        if (object.faces != undefined) {
            for (var j = 0; j < object.faces.length; j++) {
                delete object.geometry.faces[j];
            }
        }
        scene.remove(object);
        //delete object;
    }
}

/**
 * skaliert alle Gebaeuden
 * @param: aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
 * @param: scalingMethod: scaleLogarithmically oder scaleLinearly
 */
function scaleAll(aString, scalingMethod) {
    var hashMap = getBuildingsHashMap();
    for (var x in hashMap) {
        hashMap[x]._centerPosition = [0, hashMap[x]._height / 2 - 1.5, 0];
        if (hashMap[x].buildings == undefined) {
            hashMap[x]["_" + aString] = scalingMethod(hashMap[x], aString);
        }
    }
    if (aString == "height") setDistrictHeight(scalingMethod({
        _height: getDistrictHeight()
    }, "height"));
}

/**
 * nach dem Skalieren update der geloeschten Objekte, damit sie auch wiederhergestellt werden koennen
 */
/*function updateRemovedBuildings() {
    for (var i = 0; i < arrayOfRemovedBuildings.length; i++) {
        for (var j = 0; j < arrayOfRemovedBuildings[i].length; j++) {
            if (arrayOfRemovedBuildings[i][j].building != undefined) {
                arrayOfRemovedBuildings[i][j] = arrayOfRemovedBuildings[i][j].building.mesh;
                scene.remove(arrayOfRemovedBuildings[i][j].building.mesh);
            } else {
                arrayOfRemovedBuildings[i][j] = arrayOfRemovedBuildings[i][j].garden.mesh;
                scene.remove(arrayOfRemovedBuildings[i][j].garden.mesh);
            }
        }
    }
}*/
