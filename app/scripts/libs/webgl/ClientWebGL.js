var associations;
var camera, scene, renderer, trackballControls, orbitControls, raycaster;
var mainDistrict;
var mouse = new THREE.Vector2(),
    INTERSECTED, SELECTED;
var extrema = { //enthaelt die Extremwerte aus den Daten
    maxWidth: 0,
    maxHeight: 0,
    maxColor: 0,
    maxConnections: 0,
    maxSumOfConn: 0,
    minWidth: Number.MAX_VALUE,
    minHeigth: Number.MAX_VALUE,
    minColor: Number.MAX_VALUE,
    minConnections: Number.MAX_VALUE,
    minSumOfConn: Number.MAX_VALUE
};
var camToSave = {};


//Getter fuer scene
function getScene() {
    return scene;
}

//gibt die Extremwerte zurueck
function getExtrema() {
    return extrema;
}

//Getter fuer mainDistrict
function getMainDistrict() {
    return mainDistrict;
}

//Getter fuer trackballControls
function getControls() {
    return trackballControls;
}


// wird vom Client-Team aufgerufen und fuehrt alles aus, was getan werden muss, um die Stadtansicht zu erstellen
// @param data: JSON vom Datenbank-Team, das fuer jedes Gebaeude die Hoehe, Breite, Farbe, etc. gespeichert hat
//			association: JSON fuer die Legende, damit man weiss, dass z.B. die Breite der Anzahl Methoden entspricht
//			nameOfDivElement: Name vom Div-Element
function drawCity(data, association, nameOfDivElement, settings, incomingCalls, outgoingCalls) {

    if (!Detector.webgl) Detector.addGetWebGLMessage(); //Fehlermeldung, falls Browser kein WebGL unterstuetzt
    init(nameOfDivElement, incomingCalls, outgoingCalls);
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    association.dimensions.width = association.dimensionSettings.area.name;
    association.dimensions.name = association.dimensionSettings.name.name;
    association.dimensions.color = association.dimensionSettings.color.name;
    association.dimensions.height = association.dimensionSettings.height.name;
    setAssociation(association["dimensions"]);
    associations = association;

    setNumOfEntries(association.numberOfEntries);
    setBuildingColor(association.buildingcolor);
    /*if(data[0].buildings == undefined){
		mainDistrict = createMainDistrict(data, association.dimensions);
    }
    else{
		mainDistrict = data[0];
    }*/


    if (association.districtType == "0") { //Falls keine Blockbildung
        mainDistrict = {
            buildings: data
        };
    } else if (association.districtType == "1") { //Falls Blockbildung mit Punkten
        mainDistrict = createMainDistrict(data, association.dimensions);
    } else {
        mainDistrict = data[0];
    }

    // diese Methode setze die Gebaueden und Stadtteile einigermaßen vernuenftig
    setMainDistrict(mainDistrict, "");
    shiftBack(mainDistrict);

    //zeichnen nun auch die Stadt
    addCityToScene(mainDistrict, scene, camera, extrema);

    // Erstelle das Menue oben rechts
    if (Detector.webgl) {
        var ourDivElement = document.getElementById(nameOfDivElement);
        if (ourDivElement.children["dropdownmenu"] != undefined) {
            ourDivElement.removeChild(ourDivElement.children["dropdownmenu"]);
        }
        setMenue(scene, mainDistrict, camera, orbitControls, trackballControls, nameOfDivElement);
    }
    updateControls(Math.max(mainDistrict._width, extrema.maxHeight));
    animate();
    saveCamera();
    goToInitialView();
    if (settings != undefined) {
        setSpecificView(settings);
    }

}


//speichert Kameraeinstellung
function saveCamera() {
    camToSave.position = camera.position.clone();
    camToSave.rotation = camera.rotation.clone();
    camToSave.target = orbitControls.target.clone();
}

//Getter fuer Kameraeinstellung
function getCamToSave() {
    return camToSave;
}


/*** ADDING SCREEN SHOT ABILITY ***/
window.addEventListener("keyup", function(e) {
    var imgData, imgNode;
    //Listen to 'P' key
    if (e.which !== 80) return;
    try {
        imgData = renderer.domElement.toDataURL();
        console.log(imgData);
    } catch (e) {
        console.log("Browser does not support taking screenshot of 3d context");
        return;
    }

    imgNode = document.createElement("img");
    imgNode.src = imgData;

    var myWindow = window.open("", "");
    myWindow.document.write("<div id='imageDownload'></div>");
    myWindow.document.getElementById('imageDownload').appendChild(imgNode);
});


//Methode, um aus einem Array aus Gebaeuden Districts zu erstellen, die nach Packagenamen sortiert sind
//@params: data: das Array, das aus den Gebaeuden besteht
//			association: die Legende
//@return: das Objekt, das aus District besteht
function createMainDistrict(data, association) {
    var district = {};
    var splitString, currentDistrict;
    for (var i = 0; i < data.length; i++) {
        currentDistrict = district;
        splitString = data[i][association.name].toString().split(".");
        for (var j = 0; j < splitString.length - 1; j++) {
            if (currentDistrict[splitString[j]] == undefined) {
                currentDistrict[splitString[j]] = {};
            }
            currentDistrict = currentDistrict[splitString[j]];
        }
        if (currentDistrict.buildings == undefined) {
            currentDistrict.buildings = [data[i]];
        } else {
            currentDistrict.buildings.push(data[i]);
        }
    }
    district = getMainDistrictFromJSON(district);
    return district;
}

//rekursive Hilfsmethode, um aus dem Objekt, was in createMainDistrict erstellt wurde, ein Stadtobjekt zu erstellen
//@params: aDistrict: ein Teil vom Objekt, was in createMainDistrict erstellt wurde
//@return: ein stadtobjekt
function getMainDistrictFromJSON(aDistrict) {
    var toReturn = {
        buildings: []
    };
    for (var x in aDistrict) {
        if (x == "buildings") {
            for (var i = 0; i < aDistrict.buildings.length; i++) {
                toReturn.buildings.push(aDistrict.buildings[i]);
            }
        } else {
            toReturn.buildings.push(getMainDistrictFromJSON(aDistrict[x]));
            toReturn.buildings[toReturn.buildings.length - 1].name = x;
        }
    }
    return toReturn
}

// aktualisiert die alten Extremwerte, wenn man die neuen Werte breite, hoehe, farbe sieht
//@params: width: Breite, die evtl. geupdatet werden soll
//			height: Hoehe, die ggf. geupdatet werden soll
//			color: Farbe, die ggf. geupdatet werden soll<<y
function updateExtrema(width, height, color) {
    if (width > extrema.maxWidth) extrema.maxWidth = width + 1.5;
    if (height > extrema.maxHeight) extrema.maxHeight = height + 1.5;
    if (color > extrema.maxColor) extrema.maxColor = color + 1.5;
    if (width < extrema.minWidth) extrema.minWidth = width + 1.5;
    if (height < extrema.minHeigth) extrema.minHeigth = height + 1.5;
    if (color < extrema.minColor) extrema.minColor = color + 1.5;
}




//Initialisiert das Bild, d.h. malt die Zeichenflaeche, erstellt die Kamera, setzt das Licht, 
//aktiviert das Beobachten der Mausaktivitaeten und das Zoomen, Drehen, Verschieben
//@params nameOfDivElement: der Name vom Div-Element
function init(nameOfDivElement, incomingCalls, outgoingCalls) {

    // Erstelle einen neuen Renderer
    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true // required to support .toDataURL()
    });

    //renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xbdbdbd); //0x222222);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Hinzufügen von dem renderer-Element zu unserem HTML-Dokument

    renderer.domElement.id = "WebGLCanvas";
    document.getElementById(nameOfDivElement).innerHTML = "";
    document.getElementById(nameOfDivElement).appendChild(renderer.domElement);

    scene = new THREE.Scene();

    //erstelle Kamera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.set(0, 10, 30);
    setCamera(camera);

    //Lichtquellen setzen
    setLight(scene);

    raycaster = new THREE.Raycaster();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

    //Zum Zoomen, Drehen, Verschieben
    setControls();

    if (incomingCalls != undefined && outgoingCalls != undefined) {
        setCalls(getIncomingConnections(incomingCalls), getOutgoingConnections(outgoingCalls));
    }
}




//schaut regelmäßig, ob was passiert und updatet und zeichnet neu
function animate() {
    // schaut, ob was passiert ist
    requestAnimationFrame(animate);
    requestAnimationFrame(update);
    // update
    orbitControls.update();
    trackballControls.update();
    //malt neu
    render();
}


//Methode zum Setzen der trackballControls fuer das Zoomen, Drehen, Verschieben
function setControls() {
    // für das Zoomen und Verschieben
    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.minDistance = 10;
    trackballControls.noRotate = true;
    trackballControls.zoomSpeed = 1;

    //fuer das Drehen
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.5;
    orbitControls.enableZoom = false;
    orbitControls.rotateSpeed = 1;
    orbitControls.noPan = true;
}

//Getter fuer orbitcontrols
function getOrbitControls() {
    return orbitControls;
}


//update vom maximalen Abstand fuer den Zoom, damit man noch die hoechsten Gebaeude sehen kann
//@param maxDistance: der Abstand zum Koordinatenursprung, zu dem man maximal wegzoomen kann
function updateControls(maxDistance) {
    trackballControls.maxDistance = maxDistance * 3;
}


//wenn ein Link fuer eine spezielle Ansicht aufgerufen wurde, wird diese Methode aufgerufen, 
// um die alte Ansicht (mit Kameraposition etc.) wiederherzustellen, nachdem drawCity(...) aufgerufen wurde
//@params: das Json, das im Link gespeichert worden ist der Form 
/*{"position": {"x": xCamPos, "y": yCamPos, "z": zCamPos},
 "rotation": {"_x": xRotation, "_y": yRotation, "_z": zRotation, "_order": "XYZ" },
 "target": { "x": xPanPos,"y": yPanPos,"z": zPanPos},
 "leftGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 "rightGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 "scaling": { "logarithmicHeight": boolean,"logarithmicWidth": boolean,"logarithmicColor": boolean},
 "removedBuildings": ArrayAusIDsDerGeloeschtenGebaeuden,
 "changedLegend": {"Name": "Package","Breite": "Klassen","Höhe": "Methoden","Farbe": "Zeilen" },
 "collID": CollectionID,
 "_id": AnsichtsID};*/
function setSpecificView(aJson) {
    var gui = getGui();

    var hashMap = getBuildingsHashMap();

    for (var j = 0; j < aJson.removedBuildings.length; j++) {
        remove(hashMap[aJson.removedBuildings[j]].mesh);
    }

    setScalingBooleans(aJson.scaling);
    var scaleArray = ["height", "width", "color"];
    var i = 0;
    for (var x in aJson.scaling) {
        if (aJson.scaling[x]) {
            gui.__folders["Skalierung"].__controllers[i].setValue(true);
            scale(true, scaleArray[i], scene, mainDistrict, camera, extrema);
        }
        i++;
    }

    drawStoredLines(aJson);

    setChangedLegend(aJson.changedLegend);
    var myDimensions = ["Name", "Breite", "Höhe", "Farbe"];

    for (var i = 0; i < 4; i++) {
        gui.__folders["Legende"].__controllers[i].setValue(aJson.changedLegend[myDimensions[i]]);
    }

    setCameraPosForLink(camera, aJson);
}


function drawStoredLines(aJson) {
    var hashMap = getBuildingsHashMap();
    var stringArray = ["leftGarden", "rightGarden"];
    for (var j = 0; j < stringArray.length; j++) {
        for (var i = 0; i < aJson[stringArray[j]].length; i++) {
            if (hashMap[aJson[stringArray[j]][i]]._isRemoved == false) {
                drawLines(hashMap[aJson[stringArray[j]][i]]["_" + stringArray[j]], true);
                hashMap[aJson[stringArray[j]][i]]["_" + stringArray[j]].mesh.material.color.setHex(0xA5DF00);
            }
        }
    }
    setClickedGardens(aJson);
}


//Getter fuer associations
//@return: associations: die Zuordnungen
function getOriginalAssociations() {
    return associations;
}


//Methode bekommt ein JSON-Objekt fuer die Verbindungen und schreibt es so um, dass man nachher besser mit arbeiten kann
//@return neues JSON fuer Verbindungen
function getIncomingConnections(connectionData) {
    var newJson = {};
    var ithConn;
    for (var i = 0; i < connectionData.connections.length; i++) {
        ithConn = connectionData.connections[i];
        newJson[ithConn.Ziel] = {};
        newJson[ithConn.Ziel].connections = {};
        for (var j = 0; j < ithConn.incomingConnections.length; j++) {
            newJson[ithConn.Ziel].connections[ithConn.incomingConnections[j].Start] = ithConn.incomingConnections[j].Gewichtung;
            updateConnectionExtrema(ithConn.incomingConnections[j].Gewichtung, "Connections");
        }
        newJson[ithConn.Ziel].sumOfConnections = ithConn.Gewichtung;
        updateConnectionExtrema(ithConn.Gewichtung, "SumOfConn");
    }
    return newJson;
}

function getOutgoingConnections(connectionData) {
    var newJSON = {};
    for (var i = 0; i < connectionData.connections.length; i++) {
        newJSON[connectionData.connections[i].Start] = {};
        newJSON[connectionData.connections[i].Start].connections = {};
        for (var j = 0; j < connectionData.connections[i].outgoingConnections.length; j++) {
            newJSON[connectionData.connections[i].Start].connections[connectionData.connections[i].outgoingConnections[j].Ziel] =
                connectionData.connections[i].outgoingConnections[j].Gewichtung;
        }
        newJSON[connectionData.connections[i].Start].sumOfConnections = connectionData.connections[i].Gewichtung;
        updateConnectionExtrema(connectionData.connections[i].Gewichtung, "SumOfConn");
    }
    return newJSON;
}


/**
 * aktualisiert in extrema die min- bzq. maxConnections bzw. -SumOfCon
 * @param: weight: die Gewichtung von der Verbindung, die bei extrema aktualisiert werden soll
 * @param: string: "Connections" oder "SumOfConn"
 */
function updateConnectionExtrema(weight, string) {
    if (extrema["max" + string] < weight) {
        extrema["max" + string] = weight;
    }
    if (extrema["min" + string] > weight && weight > 0) {
        extrema["min" + string] = weight;
    }
}
