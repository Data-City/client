var camera, scene, renderer, controls, control, raycaster, gui;
var WebGlBoxArray = [];
var GebaeudeArrayWieBoxen = [];
var mouse = new THREE.Vector2(), INTERSECTED, SELECTED;

function drawCity(daten, zuordnungen, nameOfDivElement){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		init(daten, zuordnungen, nameOfDivElement);
		window.addEventListener( 'resize', function () {
				camera.aspect = window.innerWidth / window.innerHeight;
				renderer.setSize( window.innerWidth, window.innerHeight );
			}, false );
		animate();
}

function erstelleArray(daten, Gebaeudename, gebaeudebreite, gebaeudehoehe){

	var gebaeudearray = [];
	console.log(daten);
	var unsereDaten = daten.data._embedded['rh:doc'];
	var breite;
	var hoehe;

	for(var i=0; i<unsereDaten.length; i++){
		
		breite = unsereDaten[i][gebaeudebreite];
		hoehe = unsereDaten[i][gebaeudehoehe];
		
		if(breite==""){
			breite = 0;
		}
		if(hoehe==""){
			hoehe=0;
		}
		
		//damit wir unterscheiden koennen, ob eine Box eigentlich 0 oder 1 Breite bzw Hoehe hat
		breite++;
		hoehe++;
		
		gebaeudearray.push(newGebaeude(unsereDaten[i][Gebaeudename], breite, hoehe));
	}
	return gebaeudearray;
}

/*
Initialisiert das Bild, d.h. es zeichnet, bestimmt Kameraposition, Lichtquellen, malt Boxen
*/
function init(daten, zuordnungen, nameOfdivElement) {
	// Erstelle das Menue oben rechts
	
	console.log(zuordnungen);
	if( Detector.webgl ){
		//setMenue(getLegende());
		setMenue(zuordnungen["dimensions"], gui);
	}

	// Erstelle einen neuen Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xbdbdbd);//0x222222);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
				
	//Hinzufügen von dem renderer-Element zu unserem HTML-Dokument
	var domElement = document.getElementById(nameOfdivElement);
	//document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	//erstelle Kamera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 10, 30 );
				
	//Lichtquellen setzen
	setLight(scene);

	//document.getElementById("blub").innerHTML = zuordnungen["flaeche"];			
	var districtarray = [stadtteil(erstelleArray(daten, zuordnungen["dimensions"]["name"], zuordnungen["dimensions"]["flaeche"], zuordnungen["dimensions"]["hoehe"]))];
				
	var district = stadtteil(districtarray);
				
	// diese Methode setze die Gebaueden und Stadtteile einigermaßen vernuenftig
	setzeBoxen(district);
				
	//zeichnen nun auch die Stadt
	drawStadt(district, scene, camera, WebGlBoxArray, GebaeudeArrayWieBoxen);
				
	raycaster = new THREE.Raycaster();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
				
	//Zum Zoomen, Drehen, Verschieben
	setControls(district.breite);
}
			
/*
schaut regelmäßig, ob was passiert und updatet und zeichnet neu
*/
function animate() {
	// schaut, ob was passiert ist
	requestAnimationFrame( animate );
	requestAnimationFrame(update);
	// update
	control.update();
	controls.update();
	//malt neu
	//renderer.render( scene, camera );
	render();
}

/*
Methode zum Setzen der Controls
*/
function setControls(maximalerAbstand){
	// für das Zoomen
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 10;
	controls.maxDistance = maximalerAbstand*3;
	controls.noRotate = true;
				
	//fuer das verschieben und drehen
	control = new THREE.OrbitControls( camera, renderer.domElement );
	control.enableDamping = true;
	control.dampingFactor = 0.5;
	control.enableZoom = false;
}