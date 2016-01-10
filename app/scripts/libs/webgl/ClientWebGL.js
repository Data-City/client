//*****************************
var seperator = ".";
var numOfSeps = 4;
//*****************************

var camera, scene, renderer, controls, control, raycaster;
var mainDistrict;
var mouse = new THREE.Vector2(), INTERSECTED, SELECTED;
var extrema = { //enthaelt die Extremwerte aus den Daten nach Aufruf von addCityToScene --> createArrayOfBuildings
	maxWidth:0,
	maxHeight:0,
	maxColor:0,
	minWidth : Number.MAX_VALUE,
	minHeigth : Number.MAX_VALUE,
	minColor : Number.MAX_VALUE
};


//gibt die Extremwerte zurueck
function getExtrema(){
	return extrema;
}



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
	
	mainDistrict = data;
	setAssociation(association["dimensions"]);
	
	// diese Methode setze die Gebaueden und Stadtteile einigermaßen vernuenftig
	setMainDistrict(mainDistrict);
	shiftBack(mainDistrict);

	//zeichnen nun auch die Stadt
	addCityToScene(mainDistrict, scene, camera, extrema);

	// Erstelle das Menue oben rechts
	if( Detector.webgl ){
		var ourDivElement = document.getElementById(nameOfDivElement);
		if(ourDivElement.children["dropdownmenu"]!=undefined){
			ourDivElement.removeChild(ourDivElement.children["dropdownmenu"]);
		}
		setMenue(association["dimensions"], scene, mainDistrict, camera, extrema, control, controls, nameOfDivElement);
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

	var jsonOfDistrictArrays = {};
	
	for(var i=0; i<myData.length; i++){
		if(myData[i][widthOfBuilding]!=undefined && myData[i][heightOfBuilding]!=undefined ){
			//******************************

			var splittedName = myData[i][nameOfBuilding].toString().split(seperator);
			//---------
			width = myData[i][widthOfBuilding];
			height = myData[i][heightOfBuilding];
			color = myData[i][colorOfBuilding];
			if(width=="") width = 0;
			if(height=="") height=0;
			if(color=="") color=0;
			updateExtrema(width, height, color);
			//----------
			
			if(splittedName.length <= numOfSeps){
				if(jsonOfDistrictArrays[" "]==undefined){
					jsonOfDistrictArrays[" "] = [building(myData[i][nameOfBuilding], width, height, color)];
				}
				else{
					jsonOfDistrictArrays[" "].push(building(myData[i][nameOfBuilding], width, height, color));
				}
			}
			else{
				var packagename = "";
				for(var j=0;j<numOfSeps; j++){
					packagename = splittedName[j]+seperator;
				}
				if(jsonOfDistrictArrays[packagename]==undefined){
					jsonOfDistrictArrays[packagename] = [building(myData[i][nameOfBuilding], width, height, color)];
				}
				else{
					jsonOfDistrictArrays[packagename].push(building(myData[i][nameOfBuilding], width, height, color));
				}
			}
		}
	}
	for(var x in jsonOfDistrictArrays){
		anArrayOfBuildings.push(district(jsonOfDistrictArrays[x]));
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
function init(nameOfDivElement) {
	//$("body").html("<div id=" + nameOfdivElement + "></div>");

	// Erstelle einen neuen Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xbdbdbd);//0x222222);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
				
	//Hinzufügen von dem renderer-Element zu unserem HTML-Dokument
	
    renderer.domElement.id = "WebGLCanvas";
    document.getElementById(nameOfDivElement).innerHTML = "";
    document.getElementById(nameOfDivElement).appendChild(renderer.domElement);

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


//wenn ein Link fuer eine spezielle Ansicht aufgerufen wurde, wird diese Methode aufgerufen, 
// um die alte Ansicht (mit Kameraposition etc.) wiederherzustellen, nachdem drawCity(...) aufgerufen wurde
//@params: das Json, das im Link gespeichert worden ist der Form {camPos: json_mit_Camera_Position,
//										garden: array_mit_ID_der_Gaerten,_die_an_sind,
//										scaling: json_von_legende}
function setSpecificView(aJson){
	setScalingBooleans(aJson.scaling);
	var scaleArray = ["height", "width", "color"];
	var i=0;
	for(var x in aJson.scaling){
		if(aJson.scaling[x]){
			scale(true, scaleArray[i], scene, mainDistrict, camera, extrema);
		}
		i++;
	}

	setCameraPosForLink(camera, aJson);
	
	var theHashGarden = getHashGarden();
	for(var i=0;i<aJson.garden.length; i++){
		drawLines(theHashGarden[aJson.garden[i]]);
		theHashGarden[aJson.garden[i]].mesh.material.color.setHex(0xA5DF00);
		pushToClickedGardens(aJson.garden[i]);
	}
}