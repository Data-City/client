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
function drawCity(data, association, nameOfDivElement) {
    if (!Detector.webgl) Detector.addGetWebGLMessage(); //Fehlermeldung, falls Browser kein WebGL unterstuetzt
    init(nameOfDivElement);
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
    if(data[0].buildings == undefined){
		mainDistrict = createMainDistrict(data, association);
    }
    else{
		mainDistrict = data[0];
    }
    association.dimensions.width = association.dimensions.area;
    association.dimensions.name = association.dimensions.name.name;
    setAssociation(association["dimensions"]);

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
}


//Methode, um aus einem Array aus Gebaeuden Districts zu erstellen, die nach Packagenamen sortiert sind
//@params: data: das Array, das aus den Gebaeuden besteht
//			association: die Legende
//@return: das Objekt, das aus District besteht
function createMainDistrict(data, association){
	return {buildings: data};
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
function init(nameOfDivElement) {

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

    //Lichtquellen setzen
    setLight(scene);

    raycaster = new THREE.Raycaster();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

    //Zum Zoomen, Drehen, Verschieben
    setControls();
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
    setScalingBooleans(aJson.scaling);
    var scaleArray = ["height", "width", "color"];
    var i = 0;
    for (var x in aJson.scaling) {
        if (aJson.scaling[x]) {
            scale(true, scaleArray[i], scene, mainDistrict, camera, extrema);
        }
        i++;
    }

    setCameraPosForLink(camera, aJson);

    var theHashGarden = getHashGarden();
    for (var i = 0; i < aJson.garden.length; i++) {
        drawLines(theHashGarden[aJson.garden[i]]);
        theHashGarden[aJson.garden[i]].mesh.material.color.setHex(0xA5DF00);
        pushToClickedGardens(aJson.garden[i]);
    }
}
