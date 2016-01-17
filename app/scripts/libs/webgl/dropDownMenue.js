var association = {}; //hier wird die Legende gespeichert

//Setter fuer association
//@params: newAssociation: die Zuordnung
function setAssociation(newAssociation) {
    association = newAssociation;
}

//Variablen, die benoetigt werden, um Gebaeude/ Distrikte zu loeschen
var storedMesh, storedLeftGarden, storedRightGarden;
var storedDistrict = [];
var newBuildingClicked = true;
var removedBuildings = [];

// Dimensionen, die wir abbilden
var myDimensions = ["Name", "Breite", "Höhe", "Farbe"];

//Namen, auf die wir beim JSON-Objekt zugreifen fuer die Legende
var dimensionsFromDatabase = ["name", "width", "height", "color"];

//fuer den Ordner 'Legende'
var legend = {
    "Name": association.name,
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
    "isRemoved": false
};

//fuer den Ordner "Skalierung"
var scaling = {
    "logarithmicHeight": false,
    "logarithmicWidth": false,
    "logarithmicColor": false
};

//Getter für scaling
function getScalingBooleans() {
    return scaling;
}

//Setter fuer scaling
//@params: scalingObject: Object, mit dem Scaling ueberschrieben werden soll
function setScalingBooleans(scalingObject) {
    scaling = scalingObject;
}

//fuer den Ordner "Steuerung"
var controlling = {
    "zoomSpeed": 1,
    "rotateSpeed": 1
};

//fuer den Ordner "aktuelle Ansicht"
var currentView = {
    "Link": ''
}

//aendert bei den Gebaeudeinformationen in der Legende die Werte, die angezeigt werden sollen
//@params: newHeight: die neue Hoehe, die angezeigt werden soll
//			newWidth: die neue Breite, die angezeigt werden soll
//			newColor: die neue Farbe, die angezeigt werden soll
//			newDistrict: der neue Stadtteil-Name, der angezeigt werden soll
//			newName: der neue Name vom Gebaeude, der angezeigt werden soll
function changeBuildingInformation(newHeight, newWidth, newColor, newName, aMesh) {
    buildingInformation["height"] = newHeight;
    buildingInformation["width"] = newWidth;
    buildingInformation["color"] = newColor;
    buildingInformation["name"] = newName;
    buildingInformation["isRemoved"] = false;
    newBuildingClicked = true;
    buildingInformation.mesh = aMesh;
}

//aendert bei dem Link in der Legende den Link zum Verschicken
//@params: aJson: ein Objekt der Form {camPos: json_mit_Camera_Position,
//										garden: array_mit_ID_der_Gaerten,_die_an_sind,
//										scaling: json_von_legende}
function changeLinkForCurrentView(aJson) {
    currentView['Link'] = 'http://dummylink.com/viewDataCity?webGLSettings=' + JSON.stringify(aJson);
}


//Methode, um das Dropdown-Menue oben rechts zu zeichnen
//@params: legende: JSON-Objekt, das der Legende entspricht, sodass z.B. legende["breite"]="Anzahl Methoden" ist
//			scene: die scene, mit der man arbeiten moechte und auf die man reagieren moechte
//			aDistrict: das JSON vom Typ Stadtteil, mit dem ich agieren moechte, wenn der Nutzer das mit der Legende machen moechte
//			camera: die Kamera, die neu positioniert wird, falls das district bearbeitet wird
//			extrema: die Extremwerte, die sich aus den Daten ergeben, als JSON
//			control, controls: das Trackball bzw. OrbitControl fuer die Steuerung,die wir verwenden
//			nameOfDivElement: DivElement, dem wir die WebGLCanvas und Dropdownmenue hinzufuegen
function setMenue(legende, scene, aDistrict, camera, extrema, control, controls, nameOfDivElement) {
    var gui = new dat.GUI({
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
	"Name": association.name,
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
        h.add(buildingInformation, dimensionsFromDatabase[i]).name(legende[dimensionsFromDatabase[i]]).listen();
    }
    h.add(buildingInformation, "isRemoved").name("löschen").listen().onChange(function(value) {
        removeOrAddDistrict(newBuildingClicked, buildingInformation.mesh, true);
    });

    //*****************************************************************

    h = gui.addFolder("Skalierung");
    h.add(scaling, "logarithmicHeight").name("Höhe logarithmieren").onChange(function(value) {
        scaling["logarithmicHeight"] = value;
        scale(value, "height", scene, aDistrict, camera, extrema);
    });
    h.add(scaling, "logarithmicWidth").name("Breite logarithmieren").onChange(function(value) {
        scaling["logarithmicWidth"] = value;
        scale(value, "width", scene, aDistrict, camera, extrema);
    });
    h.add(scaling, "logarithmicColor").name("Farbe logarithmieren").onChange(function(value) {
        scaling["logarithmicColor"] = value;
        scale(value, "color", scene, aDistrict, camera, extrema);
    });

    //********************************************************************

    h = gui.addFolder("Steuerung");
    h.add(controlling, "zoomSpeed", 0.1, 2).name("Zoomgeschwindigkeit").onChange(function(value) {
        controls.zoomSpeed = value;
    });
    h.add(controlling, "rotateSpeed", 0.1, 2).name("Rotationsgeschwindigkeit").onChange(function(value) {
        control.rotateSpeed = value;
    });

    //********************************************************************

    h = gui.addFolder("aktuelle Ansicht");
    h.add(currentView, "Link").name("Link markieren Strg+A").listen();
    h.addFolder("Für neuen Link darf obiges Feld nicht angeklickt sein.");
	console.log(gui);
}

//Hilfsmethode, um den Ordner "Legende" in dat gui zu setzen
//@params: h: Ordner Legende
//			i: die Position fuer den naechsten Controller im Ordner Legende
//			gui: das Dropdownmenue
function setFolderLegende(h, i, gui){
	h.add(legend, myDimensions[i]).onChange(
		function(value){
			gui.__folders["Gebäudeinformationen"].__listening[i].name(value);
		}
	)
}

//Methode, um ein Distrikt oder ein Gebaeude zu loeschen
//@params: value: true oder false, ob das Distrikt oder Gebaeude bereits geloescht wurde
//			aMesh: Mesh vom Distrikt oder Gebaeude, das geloescht werden soll
//			isFirstCall: true, wenn es der Initialaufruf dieser Methode ist
function removeOrAddDistrict(value, aMesh, isFirstCall) {
    if (aMesh.building.buildings == undefined) {
        removeOrAddObject(value, aMesh);
    } else {
        if (value == true) {
            if (isFirstCall) {
                storedDistrict = [];
            }
            storedDistrict.push(aMesh);
            removeOrAddObject(true, aMesh);
            for (var i = 0; i < aMesh.building.buildings.length; i++) {
                removeOrAddDistrict(true, aMesh.building.buildings[i].mesh, false);
            }
        } else {
            for (var i = 0; i < storedDistrict.length; i++) {
                scene.add(storedDistrict[i]);
            }
        }

    }
}

//Methode, um Gebaeude zu loeschen
//@params: value: true oder false, ob ein Gebaeude bereits geloescht wurde oder nicht
//			aMesh: das Mesh zum Gebaeude
function removeOrAddObject(value, aMesh) {
    if (value == true) {
        storedMesh = aMesh;
        storedLeftGarden = aMesh.building._leftGarden.mesh;
        storedRightGarden = aMesh.building._rightGarden.mesh;
        var toRemove = [aMesh, storedLeftGarden, storedRightGarden];
        for (var i = 0; i < toRemove.length; i++) {
            if (toRemove[i] != undefined) {
                storedDistrict.push(toRemove[i]);
                scene.remove(toRemove[i]);
            }
        }
        newBuildingClicked = false;
    } else {
        scene.add(storedMesh);
        scene.add(storedLeftGarden);
        scene.add(storedRightGarden);
        newBuildingClicked = true;
    }
}


//Hilfsvariable als Methode zum Reagieren auf das DropDown-Menue
var update = function() {
    requestAnimationFrame(update);
};

//skaliert die Gebaeude und zeichnet sie neu
//@params: value: der Wert aus der Legende, also ein Boolean (true, falls logarithmisch skaliert werden soll; false, wenn nicht skaliert)
//			aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
//			scene: die scene, auf die neu gemalt werden soll
//			aDistrict: das JSON vom Typ district, dessen Gebaeude skaliert werden soll
//			camera: die Kamera, die nach dem Zeichnen neu positioniert werden soll
//			extrema: die Extremwerte, die sich aus den Daten ergeben, als JSON
function scale(value, aString, scene, aDistrict, camera, extrema) {
    if (value) {
        var scalingMethod = scaleLogarithmically;
        var scalingExtrema = takeLogarithmOfExtrema;
    } else {
        var scalingMethod = scaleLinearly;
        var scalingExtrema = linearizeExtrema;
    }
    removeAllObjects(scene, aString, scalingMethod);
    setClickedGardensEmpty();
    setLight(scene);
    setMainDistrict(aDistrict);
    shiftBack(aDistrict);
    scalingExtrema(extrema, aString);
    addCityToScene(aDistrict, scene, camera, extrema);
    updateControls(Math.max(aDistrict._width, extrema.maxHeight));
}


//Methode, um die Extremwerte ebenfalls zu skalieren
//@params: extrema: das JSON, das die alten Extremwerte enthaelt
//		aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function takeLogarithmOfExtrema(extrema, aString) {
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


//Methode, um die Extremwerte wieder normal zu skalieren
//@params: extrema: das JSON, das die alten Extremwerte enthaelt
//		aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function linearizeExtrema(extrema, aString) {
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


//Hilfsmethode zum logarithmieren (Logarithmus zur Basis 2)
//@params:aDistrict: das Stadtteil, dessen Gebaeude skaliert werden soll
//			aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function scaleLogarithmically(aDistrict, aString) {
    return (Math.log(aDistrict["_" + aString]) / Math.log(2));
}


//Hilfsmethode, um die urspruenglichen Werte wieder herzustellen, d.h. ohne Skalierung die Gebaeude zu zeichnen
//@params:aDistrict: das Stadtteil, dessen Gebaeude skaliert werden soll
//			aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function scaleLinearly(aDistrict, aString) {
    if(aDistrict[association[aString]]==""){
	return 1.5;
    }
    else{
	return aDistrict[association[aString]] + 1.5;
    }
}

//Hilfsmethode, um alle Objekte auf der Oberflaeche zu loeschen
//@params: scene: die Scene, auf der alle Objekte geloescht werden soll
function removeAllObjects(scene, aString, scalingMethod) {
    for (var i = scene.children.length - 1; i >= 0; i--) {
        if (scene.children[i].building != undefined) {
            scene.children[i].building._centerPosition = [0, scene.children[i].building._height / 2 - 1.5, 0];
            if (scene.children[i].building.buildings == undefined) {
                scene.children[i].building["_" + aString] = scalingMethod(scene.children[i].building, aString);
            }
        }
        scene.remove(scene.children[i]);
    }
}
