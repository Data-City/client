var abzubilden = ["Stadtteil","Gebäude","Breite","Höhe","Farbe"];
var VariablenAusDaten = ["district", "name", "flaeche", "hoehe", "farbe"];
var legendemenu = {
	"Stadtteil": function(){},
	"Gebäude": function(){},
	"Breite": function(){},
	"Höhe": function(){},
	"Farbe": function(){}
};
var mehrDetails = {
		"hoehe" : "Klicken Sie bitte auf ein Gebäude" , 
		"flaeche" :  "Klicken Sie bitte auf ein Gebäude" , 
		"farbe" :  "Klicken Sie bitte auf ein Gebäude" , 
		"district" :  "Klicken Sie bitte auf ein Gebäude", 
		"name" :  "Klicken Sie bitte auf ein Gebäude"
};

function changeDetails(neueHoehe, neueFlaeche, neueFarbe, neuerDistrict, neuerName){
	mehrDetails["hoehe"]=neueHoehe;
	mehrDetails["flaeche"]=neueFlaeche;
	mehrDetails["farbe"]=neueFarbe;
	mehrDetails["district"]=neuerDistrict;
	mehrDetails["name"]=neuerName;
}	
	
/*
Methode, um die Legende/ das Menü oben rechts zu zeichnen
*/
function setMenue(legende, gui){
	gui = new dat.GUI({
		width : 350
	});

	var h = gui.addFolder( "Legende" );
	for(var i=0; i<abzubilden.length; i++){
		h.add( legendemenu, abzubilden[i]).name( abzubilden[i]+": " + legende[VariablenAusDaten[i]]);
	}
	//*****************************************************************

	h = gui.addFolder( "Gebäudeinformationen" );
	for(var i=0; i<abzubilden.length; i++){
		h.add( mehrDetails, VariablenAusDaten[i]).name( legende[VariablenAusDaten[i]]).listen();
	}
	
}

var update = function() {
	requestAnimationFrame(update);
};
					
/*
Hilfsmethode, um eine Box zu malen
*/
						
function drawBox(eineBox, material, scene, WebGlBoxArray){
	var geometry = new THREE.BoxGeometry(eineBox.breite, eineBox.hoehe, eineBox.breite);
	WebGlBoxArray.push(geometry);
	var cube = new THREE.Mesh(geometry, material);
	cube.position.x = eineBox.mittelpunktPosition[0];
	cube.position.y = eineBox.mittelpunktPosition[1];
	cube.position.z = eineBox.mittelpunktPosition[2];
	scene.add(cube);
}
			
/*
Hilfsmethode, um ein schönes Material zu bekommen, wenn man die Farbe kriegt
*/
function getMaterial(Hexafarbe){
	var material = new THREE.MeshPhongMaterial( {
		color: Hexafarbe,
		specular: 0x333333,
		shininess: 50,
		side: THREE.DoubleSide,
		vertexColors: THREE.VertexColors,
		shading: THREE.SmoothShading
	} );
	return material;
}
			
/*
Methode zum Setzen des Lichts
*/
function setLight(scene){
	// Licht hinzufügen. AmbientLight ist generell das Licht auf die Scene auf alles
	scene.add( new THREE.AmbientLight( 0x444444 ) );

	//Weiteres Licht, legt Farbe und Intensität fest mit den Arugmenten
	var light1 = new THREE.DirectionalLight( 0x999999, 0.9 );
	//Einmal das Licht von rechts oben vorne
	light1.position.set( 1, 1, 1 ).normalize();
	scene.add( light1 );
	
	// Einmal Licht von links oben hinten
	var light2 = new THREE.DirectionalLight( 0x999999, 1.5 );
	light2.position.set( 1, 1, -1 );
	scene.add( light2 );
}
			
/*
Methode, um die Stadt zu malen, wenn wir die Daten bekommen haben
*/
function drawStadt(district, scene, camera, WebGlBoxArray, GebaeudeArrayWieBoxen){
			
	// Material von unserer Box.
	var buffer_material = getMaterial(0xee1289);
				
	// Material vom Boden
	var boden_material = getMaterial(0xffc1c1);
				
	// nun machen wir die Stadt gleich sichtbar, indem wir jedes Gebaeude und den Boden zeichnen
	for(var i=0;i<district.gebaeude.length;i++){
		var boden_material = getMaterial(0x768dff);//Math.random() * 0xffffff);//0xffc1c1);
		drawBox(district.gebaeude[i], boden_material, scene, WebGlBoxArray);
		GebaeudeArrayWieBoxen.push(district.gebaeude[i]);
		for(var j=0;j<district.gebaeude[i].gebaeude.length;j++){
			var buffer_material = getMaterial(0x0e2ecc);//Math.random() * 0xffffff);//0xee1289);
			drawBox(district.gebaeude[i].gebaeude[j], buffer_material, scene, WebGlBoxArray);
			GebaeudeArrayWieBoxen.push(district.gebaeude[i].gebaeude[j]);
		}
	}
	//Den Boden ganz unten verschieben wir noch ein kleines bisschen nach unten und danach zeichnen wir den auch noch
	district.mittelpunktPosition[1]=-1.5;
	var ganzUntenMaterial = getMaterial(0xB5BCDE)//0xff91cc);
	drawBox(district, ganzUntenMaterial, scene, WebGlBoxArray);
	camera.position.x = district.breite;
	camera.position.y = district.breite/2;
	camera.position.z = district.breite*1.5;
}


/*
Methode zum Setzen der Controls
*/
function setControls(maximalerAbstand){
	// für das Zoomen
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 10;
	//controls.zoomSpeed = 1.2;
	controls.maxDistance = maximalerAbstand*3;
	controls.noRotate = true;
				
	//fuer das verschieben und drehen
	control = new THREE.OrbitControls( camera, renderer.domElement );
	control.enableDamping = true;
	control.dampingFactor = 0.5;
	control.enableZoom = false;
	control.rotateSpeed = 1.0;
}

/*
zeichnet das Bild neu
*/
function render() {
	raycaster.setFromCamera(mouse, camera); //erstellt einen Strahl mit der Maus in Verbindung mit der Kamera

	var intersects = raycaster.intersectObjects(scene.children); //sammelt Objekte, die der Strahl schneidet
	
	if (INTERSECTED){
			INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex); //von dem Objekt nehme vom Material die Farbe und setze sie
	}
	
	if (intersects.length > 0) { //wenn der Strahl mindestens 1 Objekt schneidet

		
		INTERSECTED = intersects[0].object; //INTERSECTED sei nun das erste Objekt, das geschnitten wurde
		INTERSECTED.material.emissive.setHex(0xff0000); //davon setze die Farbe auf rot

	}
	else{ //wenn der Strahl kein Objekt (mehr) schneidet
		INTERSECTED = null; // dann sorge dafuer, dass es nichts mehr rot gemalt wird
	}

	renderer.render( scene, camera ); //zeichne das Bild neu

}






