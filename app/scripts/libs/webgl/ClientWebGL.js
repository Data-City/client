var associations;
var camera, scene, renderer, controls, control, raycaster;
var mainDistrict;
var mouse = new THREE.Vector2(),
    INTERSECTED, SELECTED;
var extrema = { //enthaelt die Extremwerte aus den Daten
    maxWidth: 0,
    maxHeight: 0,
    maxColor: 0,
    minWidth: Number.MAX_VALUE,
    minHeigth: Number.MAX_VALUE,
    minColor: Number.MAX_VALUE
};


//gibt die Extremwerte zurueck
function getExtrema() {
    return extrema;
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
    setMainDistrict(mainDistrict);
    shiftBack(mainDistrict);

    //zeichnen nun auch die Stadt
    addCityToScene(mainDistrict, scene, camera, extrema);

    // Erstelle das Menue oben rechts
    if (Detector.webgl) {
        var ourDivElement = document.getElementById(nameOfDivElement);
        if (ourDivElement.children["dropdownmenu"] != undefined) {
            ourDivElement.removeChild(ourDivElement.children["dropdownmenu"]);
        }
        setMenue(association["dimensions"], scene, mainDistrict, camera, extrema, control, controls, nameOfDivElement);
    }
    updateControls(Math.max(mainDistrict._width, extrema.maxHeight));
    animate();

    if (settings != undefined) {
        setSpecificView(settings);
    }
}


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
            toReturn.buildings[toReturn.buildings.length - 1][association.name] = x;
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
    renderer = new THREE.WebGLRenderer();
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
    control.update();
    controls.update();
    //malt neu
    render();
}


//Methode zum Setzen der Controls fuer das Zoomen, Drehen, Verschieben
function setControls() {
    // für das Zoomen
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.noRotate = true;
    controls.zoomSpeed = 1;

    //fuer das Verschieben und Drehen
    control = new THREE.OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    control.dampingFactor = 0.5;
    control.enableZoom = false;
    control.rotateSpeed = 1;
}


//update vom maximalen Abstand fuer den Zoom, damit man noch die hoechsten Gebaeude sehen kann
//@param maxDistance: der Abstand zum Koordinatenursprung, zu dem man maximal wegzoomen kann
function updateControls(maxDistance) {
    controls.maxDistance = maxDistance * 3;
}


//wenn ein Link fuer eine spezielle Ansicht aufgerufen wurde, wird diese Methode aufgerufen, 
// um die alte Ansicht (mit Kameraposition etc.) wiederherzustellen, nachdem drawCity(...) aufgerufen wurde
//@params: das Json, das im Link gespeichert worden ist der Form {camPos: json_mit_Camera_Position,
//										garden: array_mit_ID_der_Gaerten,_die_an_sind,
//										scaling: json_von_legende}
function setSpecificView(aJson) {
    var gui = getGui();

    var hashMap = getBuildingsHashMap();
    setRemovedBuildings(aJson.removedBuildings);
    for (var i = 0; i < aJson.removedBuildings.length; i++) {
        hashMap[aJson.removedBuildings[i]]._isRemoved = true;
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

    setChangedLegend(aJson.changedLegend);
    var myDimensions = ["Name", "Breite", "Höhe", "Farbe"];

    for (var i = 0; i < 4; i++) {
        gui.__folders["Legende"].__controllers[i].setValue(aJson.changedLegend[myDimensions[i]]);
    }

    setCameraPosForLink(camera, aJson);
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
    for (var i = 0; i < connectionData.connections.length; i++) {
        newJson[connectionData.connections[i].Ziel] = {};
        newJson[connectionData.connections[i].Ziel].connections = {};
        for (var j = 0; j < connectionData.connections[i].incomingConnections.length; j++) {
            newJson[connectionData.connections[i].Ziel].connections[connectionData.connections[i].incomingConnections[j].Start] = connectionData.connections[i].incomingConnections[j].Gewichtung;
        }
        newJson[connectionData.connections[i].Ziel].sumOfConnections = connectionData.connections[i].Gewichtung;
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
    }
    return newJSON;
}
