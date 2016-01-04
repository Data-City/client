var maximalHeight;
var mapOfLines = {};

//Hilfsmethode, um eine WebGL-Box zu malen
//@params: aBuilding: ein JSON-Objekt vom Typ Gebaeude/building, das gezeichnet werden soll
//			material: ein Material von THREE.js, das auf das Gebaeude drauf soll
//			scene: die scene, der die Box hinzugefuegt werden soll
function drawBox(aBuilding, material, scene){
	var geometry = new THREE.BoxGeometry(aBuilding.width, aBuilding.height, aBuilding.width);
	var cube = new THREE.Mesh(geometry, material);
	cube.position.x = aBuilding.centerPosition[0];
	cube.position.y = aBuilding.centerPosition[1];
	cube.position.z = aBuilding.centerPosition[2];
	cube.building = aBuilding;
	scene.add(cube);
}


//Hilfsmethode, um ein schönes Material zu bekommen, wenn man die Farbe kriegt
//@params: aColor: eine Farbe, i.A. als Hexa-Wert, aber als RGB auch moeglich, oder mit "new THREE.Color(0,0,1)"
//@return: das Material in der gewuenschten Farbe
function getMaterial(aColor){
	var material = new THREE.MeshPhongMaterial( {
		color: aColor,
		specular: 0x333333,
		shininess: 50,
		side: THREE.DoubleSide,
		vertexColors: THREE.VertexColors,
		shading: THREE.SmoothShading
	} );
	return material;
}


//Methode zum Setzen des Lichts
//@params: scene: die scene, in die Licht eingesetzt werden soll
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


	
//Methode, um die Stadt auf die WebGL-scene zu zeichnen, wenn wir die Daten bekommen haben
//@params:	mainDistrict: das Stadtteil, das der unteren Grundflaeche entspricht mit allen zu zeichnenden Stadtteilen und Gebaeuden
//			scene: die scene, der man die Zeichnungen hinzufuegen moechte
//			camera: die Kamera, die wir nach dem Malen anders positionieren moechten
//			extrema: ein JSON-Objekt, das die Extremwerte der Daten enhtaelt, dass man darauf zugreifen kann
function addCityToScene(mainDistrict, scene, camera, extrema){
	// Material von unserer Box.
	var buildingMaterial = getMaterial(0xee1289);
				
	// nun machen wir die Stadt gleich sichtbar, indem wir jedes Gebaeude und den Boden zeichnen
	for(var i=0;i<mainDistrict.buildings.length;i++){
		addBoxes(0x768dff, mainDistrict.buildings[i], scene);
		addGarden(mainDistrict.buildings[i], scene);
		for(var j=0;j<mainDistrict.buildings[i].buildings.length;j++){
			var faktor = getColor(extrema, mainDistrict.buildings[i].buildings[j].color);
			addBoxes(new THREE.Color(faktor,faktor,1), mainDistrict.buildings[i].buildings[j], scene);
			addGarden(mainDistrict.buildings[i].buildings[j], scene);
		}
	}
	//Den Boden ganz unten verschieben wir noch ein kleines bisschen nach unten und danach zeichnen wir den auch noch
	mainDistrict.centerPosition[1]=-1.5;
	addBoxes(0xB5BCDE, mainDistrict, scene);
	setCameraPos(camera, mainDistrict, extrema);

	maximalHeight = getExtrema().maxHeight;
}



//Hilfsmethode fuer addCityToScene, zeichnet die Gaerten zu den zugehoerigen gebaeuden bzw Districts
//@params aBuilding: das Gebaeude bzw das District
function addGarden(aBuilding, scene){
	var gardens = ["leftGarden", "rightGarden"];
	for(var i=0;i<2;i++){
		var gardenMaterial = getMaterial(0x088A08);
		gardenMaterial.name="garden";
		var geometry = new THREE.BoxGeometry(aBuilding[gardens[i]].width, aBuilding[gardens[i]].height, aBuilding[gardens[i]].depth);
		var cube = new THREE.Mesh(geometry, gardenMaterial);
		cube.position.x = aBuilding[gardens[i]].centerPosition[0];
		cube.position.y = aBuilding[gardens[i]].centerPosition[1];
		cube.position.z = aBuilding[gardens[i]].centerPosition[2];
		cube.garden = aBuilding[gardens[i]];
		scene.add(cube);
	}
}


//Zeichnet alle Abhaengigkeiten, die von einem Garten ausgehen
//@params: aGarden: der Garten, fuer den die Abhaengigkeit gezeichnet werden soll
function drawLines(aGarden){
	aGarden.on=true;
	var hashTable = getHashGarden();
	for(var x in aGarden.linesTo){
		for(var i=0; i<aGarden.linesTo[x]; i++){
			if(hashTable[x].on==false){
				drawALine(aGarden, hashTable[x]);
			}
		}
	}
}



//Zeichnet fuer die Gaerten eine Abhaengigkeit
//@params: aGarden: der Start-Garten
//			destGarden: der Ziel-Garten
function drawALine(aGarden, destGarden){
	var curve = new THREE.CubicBezierCurve3(
		new THREE.Vector3(aGarden.nextLinePos[0], 0, aGarden.nextLinePos[1]),
		new THREE.Vector3(aGarden.nextLinePos[0]+0.3*(destGarden.nextLinePos[0]-aGarden.nextLinePos[0]), 2*maximalHeight, aGarden.nextLinePos[1]+0.3*(destGarden.nextLinePos[0]-aGarden.nextLinePos[1])),
		new THREE.Vector3(aGarden.nextLinePos[0]+0.7*(destGarden.nextLinePos[0]-aGarden.nextLinePos[0]), 2*maximalHeight, aGarden.nextLinePos[1]+0.7*(destGarden.nextLinePos[0]-aGarden.nextLinePos[1])),
		new THREE.Vector3(destGarden.nextLinePos[0], 0, destGarden.nextLinePos[1])
	);
	var geometry = new THREE.Geometry();
	geometry.vertices = curve.getPoints( 50 );

	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
	var curveObject = new THREE.Line( geometry, material );
	scene.add(curveObject);
	
	workUpGarden(aGarden, destGarden, curveObject);
	workUpGarden(destGarden, aGarden, curveObject);
}


//Hilfsmethode fuer drawALine: fuegt die Linie den mapOfLines hinzu und setzt naechste Linenposition neu
//@params: aGarden: der Garten, dem die Linie gehoert
//			destGarden: der Garten, zu dem die Linie geht
//			curveObject: die Linie, die gezeichnet wurde
function workUpGarden(aGarden, destGarden, curveObject){
	if(mapOfLines[aGarden.id]==undefined){
		mapOfLines[aGarden.id] = {};
		mapOfLines[aGarden.id][destGarden.id] = [curveObject];
	}
	else{
		if(mapOfLines[aGarden.id][destGarden.id]==undefined){
			mapOfLines[aGarden.id][destGarden.id] = [curveObject];
		}
		else{
			mapOfLines[aGarden.id][destGarden.id].push(curveObject);
		}
	}
	setNextLinePos(aGarden);
}


//Methode zum Löschen der Kanten, die von einem Garten ausgehen
//@params aGarden: der Garten, von dem aus die Linien gelöscht werden sollen
function removeLines(aGarden){
	var JsonOfLines = mapOfLines[aGarden.id];
	var hashTable = getHashGarden();
	var object;
	for(var x in JsonOfLines){
		if(hashTable[x].on==false){
			for(var i=0;i<JsonOfLines[x].length;i++){
				scene.remove(JsonOfLines[x][i]);
			}
		}
	}
	mapOfLines[aGarden.id]={};
	aGarden.on = false;
}



//Hilfsmethode fuer addCityToScene, zeichnet die Boxen
//@params
function addBoxes(aColor, aBuilding, scene){
	var districtMaterial = getMaterial(aColor);
	drawBox(aBuilding, districtMaterial, scene);
}



//setzt die Kameraposition neu
//@params: camera: die Kamera, die wir anders positionieren moechten
//		mainDistrict: District, nachdem sich die Kamera richten soll
//		extrema: Extremwerte vom District
function setCameraPos(camera, mainDistrict, extrema){
	camera.position.x = Math.max(mainDistrict.width, extrema.maxHeight);
	camera.position.y = Math.max(mainDistrict.width, extrema.maxHeight)/2;
	camera.position.z = Math.max(mainDistrict.width, extrema.maxHeight)*1.5;
}






//Methode zum Bestimmen der Farbe aus dem Farbwert (bisher noch nicht genutzt)
//@params: extrema: das JSON-Objekt, das die Extremwerte der Daten enthaelt
//			colorValue: der Wert, fuer den man die Farbe berechnen moechte
//@return: die berechnet den HSV-Wert, den man fuer den Farbton braucht HSV-Farbe(faktor, faktor, 1)
function getColor(extrema, colorValue){
	return (colorValue-extrema.minColor)/(extrema.maxColor - extrema.minColor);
}




//zeichnet das Bild neu nach einer Aktion vom Nutzer
function render() {
	raycaster.setFromCamera(mouse, camera); //erstellt einen Strahl mit der Maus in Verbindung mit der Kamera
	
	var intersects = raycaster.intersectObjects(scene.children); //sammelt Objekte, die der Strahl schneidet
	if (INTERSECTED && INTERSECTED.material.type != "LineBasicMaterial"){
			INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex); //von dem Objekt nehme vom Material die Farbe und setze sie
	}
	
	if (intersects.length > 0 && intersects[0].object.material.type!="LineBasicMaterial") { //wenn der Strahl mindestens 1 Objekt schneidet
		INTERSECTED = intersects[0].object; //INTERSECTED sei nun das erste Objekt, das geschnitten wurde
		INTERSECTED.material.emissive.setHex(0xff0000); //davon setze die Farbe auf rot

	}
	else{ //wenn der Strahl kein Objekt (mehr) schneidet
		INTERSECTED = null; // dann sorge dafuer, dass es nichts mehr rot gemalt wird
	}

	renderer.render( scene, camera ); //zeichne das Bild neu

}


//Wird ausgefuehrt, wenn man mit der Maus klickt
function onDocumentMouseDown( event ) {	

	event.preventDefault(); // schaltet controls aus
	
	raycaster.setFromCamera( mouse, camera ); //schaut, was die Maus durch die Kamera so erwischt

	var intersects = raycaster.intersectObjects( scene.children); // schaut, was der Strahl, den die Maus macht, alles an Objekten schneidet

	if ( intersects.length > 0) { //wenn der Strahl ein Objekt schneidet
		if(intersects[0].object.material.name=="garden"){
			if(intersects[0].object.garden.on==false){
				drawLines(intersects[0].object.garden);
				intersects[0].object.material.color.setHex(0xA5DF00);
			}
			else{
				removeLines(intersects[0].object.garden);
				intersects[0].object.material.color.setHex(0x088A08);
			}
		}
		else{
			changeBuildingInformation(
				intersects[0].object.building.originalheight, 
				intersects[0].object.building.originalwidth, 
				intersects[0].object.building.originalcolor, 
				"noch nicht implementiert", 
				intersects[0].object.building.name);
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
		
//berechnet die Position von der Maus	
function onDocumentMouseMove( event ) {
	
	event.preventDefault(); 
	var rect = getScrollDistance(document.getElementById("WebGLCanvas"));

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1 - (rect.left / window.innerWidth)*2;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1 + (rect.top / window.innerHeight)*2;
	
}