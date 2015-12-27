var camera, scene, renderer, controls, control, raycaster;
var mainDistrict;
var arrayOfWebGLBoxes = [];				//Array aus THREE.BoxGeometry's, die je gezeichnet wurden
var arrayOfBuildingsAsWebGLBoxes = []; 	//Array aus Gebaeuden in der gleichen Reihenfolge wie die zugehoerigen WebGLBoxen
var mouse = new THREE.Vector2(), INTERSECTED, SELECTED;
var extrema = { //enthaelt die Extremwerte aus den Daten nach Aufruf von addCityToScene --> createArrayOfBuildings
	maxWidth:0,
	maxHeight:0,
	maxColor:0,
	minWidth : Number.MAX_VALUE,
	minHeigth : Number.MAX_VALUE,
	minColor : Number.MAX_VALUE
};



// wird vom Client-Team aufgerufen und fuehrt alles aus, was getan werden muss, um die Stadtansicht zu erstellen
// @param data: JSON vom Datenbank-Team, das fuer jedes Gebaeude die Hoehe, Breite, Farbe, etc. gespeichert hat
//			association: JSON fuer die Legende, damit man weiss, dass z.B. die Breite der Anzahl Methoden entspricht
//			nameOfDivElement: Name vom Div-Element
function drawCity(data, association, nameOfDivElement){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage(); //Fehlermeldung, falls Browser kein WebGL unterstuetzt
	init(nameOfDivElement);
	window.addEventListener( 'resize', function () {
			camera.aspect = window.innerWidth / window.innerHeight;
			renderer.setSize( window.innerWidth, window.innerHeight );
			}, false );
	
	var districtarray = [district(createArrayOfBuildings(data, association["dimensions"]["name"], association["dimensions"]["flaeche"], association["dimensions"]["hoehe"], association["dimensions"]["farbe"]))];
	mainDistrict = district(districtarray);
				
	// diese Methode setze die Gebaueden und Stadtteile einigermaßen vernuenftig
	setMainDistrict(mainDistrict);
				
	//zeichnen nun auch die Stadt
	addCityToScene(mainDistrict, scene, camera, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema);
	addStreetsToScene(mainDistrict, scene);
	
	// Erstelle das Menue oben rechts
	if( Detector.webgl ){
		setMenue(association["dimensions"], scene, mainDistrict, camera, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema, control, controls);
	}
	
	updateControls(Math.max(mainDistrict.width, extrema.maxHeight));	
	animate();
}




// erstellt aus den Daten vom Client/ von der Datenbank ein Array aus Gebaeuden (buildings, Javascript-Objekte)
// damit man es spaeter auch sortieren kann
// @params: data: Daten als JSON vom Client-Team/Datenbank-Team mit allen Infos zu den Gebaeuden
//			nameOfBuilding: String, mit dem man auf den Namen des Gebaeudes zugreifen kann im JSON 'data'
//			widthOfBuilding: String, mit dem man auf die Breite des Gebaeudes zugreifen kann im JSON 'data'
//			heightOfBuilding: String, mit dem man auf die Hoehe des Gebaeudes zugreifen kann im JSON 'data'
//			colorOfBuilding: String, mit dem man auf die Farbe des Gebaeudes zugreifen kann im JSON 'data'
function createArrayOfBuildings(data, nameOfBuilding, widthOfBuilding, heightOfBuilding, colorOfBuilding){

	var anArrayOfBuildings = [];
	var myData = data["data"]["_embedded"]["rh:doc"];
	var width;
	var height;
	var color;

	for(var i=0; i<myData.length; i++){
		if(myData[i][widthOfBuilding]!=undefined && myData[i][heightOfBuilding]!=undefined ){
			width = myData[i][widthOfBuilding];
			height = myData[i][heightOfBuilding];
			color = myData[i][colorOfBuilding];
			
			if(width=="") width = 0;
			if(height=="") height=0;
			if(color=="") color=0;
			
			anArrayOfBuildings.push(building(myData[i][nameOfBuilding], width, height, color));
			
			updateExtrema(width, height, color);
		}
	}
	
	return anArrayOfBuildings;
}




// aktualisiert die alten Extremwerte, wenn man die neuen Werte breite, hoehe, farbe sieht
function updateExtrema(width, height, color){
	if(width>extrema.maxWidth) extrema.maxWidth = width+1.5;
	if(height>extrema.maxHeight) extrema.maxHeight = height+1.5;
	if(color>extrema.maxColor) extrema.maxColor = color+1.5;
	if(width<extrema.minWidth) extrema.minWidth = width+1.5;
	if(height<extrema.minHeigth) extrema.minHeigth = height+1.5;
	if(color<extrema.minColor) extrema.minColor = color+1.5;
}




//Initialisiert das Bild, d.h. malt die Zeichenflaeche, erstellt die Kamera, setzt das Licht, 
//aktiviert das Beobachten der Mausaktivitaeten und das Zoomen, Drehen, Verschieben
//@params nameOfDivElement: der Name vom Div-Element
function init(nameOfdivElement) {
	//$("body").html("<div id=" + nameOfdivElement + "></div>");

	// Erstelle einen neuen Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xbdbdbd);//0x222222);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
				
	//Hinzufügen von dem renderer-Element zu unserem HTML-Dokument
    /*
	var domElement = document.getElementById(nameOfdivElement);
	document.body.appendChild( renderer.domElement );
	renderer.domElement.id = "WebGLCanvas";
    */
    document.getElementById("WebGLCanvas").innerHTML = "";
    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

	scene = new THREE.Scene();

	//erstelle Kamera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 10, 30 );
				
	//Lichtquellen setzen
	setLight(scene);
	
	raycaster = new THREE.Raycaster();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	
	//Zum Zoomen, Drehen, Verschieben
	setControls();
}




//schaut regelmäßig, ob was passiert und updatet und zeichnet neu
function animate() {
	// schaut, ob was passiert ist
	requestAnimationFrame( animate );
	requestAnimationFrame(update);
	// update
	control.update();
	controls.update();
	//malt neu
	render();
}


//Methode zum Setzen der Controls fuer das Zoomen, Drehen, Verschieben
function setControls(){
	// für das Zoomen
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 10;
	controls.noRotate = true;
	controls.zoomSpeed = 1;
				
	//fuer das Verschieben und Drehen
	control = new THREE.OrbitControls( camera, renderer.domElement );
	control.enableDamping = true;
	control.dampingFactor = 0.5;
	control.enableZoom = false;
	control.rotateSpeed = 1;
}


//update vom maximalen Abstand fuer den Zoom, damit man noch die hoechsten Gebaeude sehen kann
//@param maxDistance: der Abstand zum Koordinatenursprung, zu dem man maximal wegzoomen kann
function updateControls(maxDistance){
	controls.maxDistance = maxDistance*3;
}