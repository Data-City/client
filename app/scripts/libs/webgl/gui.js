//Hilfsmethode, um eine WebGL-Box zu malen
//@params: aBuilding: ein JSON-Objekt vom Typ Gebaeude/building, das gezeichnet werden soll
//			material: ein Material von THREE.js, das auf das Gebaeude drauf soll
//			scene: die scene, der die Box hinzugefuegt werden soll
//			arrayOfWebGLBoxes: das Array bestehend aus THREE.BoxGeometry's, um spaeter den Mouseclick hinzubekommen
function drawBox(aBuilding, material, scene, arrayOfWebGLBoxes){
	var geometry = new THREE.BoxGeometry(aBuilding.width, aBuilding.height, aBuilding.width);
	arrayOfWebGLBoxes.push(geometry);
	var cube = new THREE.Mesh(geometry, material);
	cube.position.x = aBuilding.centerPosition[0];
	cube.position.y = aBuilding.centerPosition[1];
	cube.position.z = aBuilding.centerPosition[2];
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
//			arrayOfWebGLBoxes: ein Array, bestehend aus allen THREE.BoxGeometry's, die bisher gezeichnet wurden
//			arrayOfBuildingsAsWebGLBoxes: ein Array, bestehend aus allen JSON-Objekten buildings, die bisher gezeichnet wurden,
//									in der gleichen Reihenfolge wie arrayOfWebGLBoxes
//			extrema: ein JSON-Objekt, das die Extremwerte der Daten enhtaelt, dass man darauf zugreifen kann
function addCityToScene(mainDistrict, scene, camera, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema){
	// Material von unserer Box.
	var buildingMaterial = getMaterial(0xee1289);
				
	// nun machen wir die Stadt gleich sichtbar, indem wir jedes Gebaeude und den Boden zeichnen
	for(var i=0;i<mainDistrict.buildings.length;i++){
		addBoxes(0x768dff, mainDistrict.buildings[i], scene, arrayOfWebGLBoxes);
		for(var j=0;j<mainDistrict.buildings[i].buildings.length;j++){
			var faktor = getColor(extrema, mainDistrict.buildings[i].buildings[j].color);
			addBoxes(new THREE.Color(faktor,faktor,1), mainDistrict.buildings[i].buildings[j], scene, arrayOfWebGLBoxes);
		}
	}
	//Den Boden ganz unten verschieben wir noch ein kleines bisschen nach unten und danach zeichnen wir den auch noch
	mainDistrict.centerPosition[1]=-1.5;
	addBoxes(0xB5BCDE, mainDistrict, scene, arrayOfWebGLBoxes);
	setCameraPos(camera, mainDistrict, extrema);
}


//Hilfsmethode fuer addCityToScene, zeichnet die Boxen und fuegt sie dem array arrayOfBuildingsAsWebGLBoxes hinzu
//@params
function addBoxes(aColor, aBuilding, scene, arrayOfWebGLBoxes){
	var districtMaterial = getMaterial(aColor);
	drawBox(aBuilding, districtMaterial, scene, arrayOfWebGLBoxes);
	arrayOfBuildingsAsWebGLBoxes.push(aBuilding);
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




//Methode, um die Stadt auf die WebGL-scene zu zeichnen, wenn wir die Daten bekommen haben
//@params:	mainDistrict: das Stadtteil, das der unteren Grundflaeche entspricht mit allen zu zeichnenden Stadtteilen und Gebaeuden
//			scene: die scene, der man die Zeichnungen hinzufuegen moechte
function addStreetsToScene(mainDistrict, scene){
	var aEdge;
	for(var i=0;i<mainDistrict.buildings.length;i++){
		//zeichne alle Kanten, die im array building.edges liegen
		for(var j=0; j<mainDistrict.buildings[i].edges.length;j++){
			aEdge = mainDistrict.buildings[i].edges[j];
			drawEdge(aEdge, scene);
		}
		//zeichne alle Kanten, die von den Gebaeuden ausgehen
		for(var j=0; j<mainDistrict.buildings[i].buildings.length;j++){
			aEdge = mainDistrict.buildings[i].buildings[j].nextEdge;
			drawEdge(aEdge, scene);
		}
	}
};




//zeichnet eine Kante auf die WebGLCanvas
//@param aEdge: die Kante, die gezeichnet werden soll
//		scene: die Scene, auf die die Strasse gepackt werden soll
function drawEdge(aEdge,scene){
	drawEachEdge(aEdge, true, scene);
	//drawEachEdge(aEdge, false, scene);
}



//Hilfsfunktion fuer drawEdge
//@params: aEdge: Kante, die gezeichnet werden soll
//			material: Material der Strasse
//			isIncoming: Boolean, true, wenn es eine eingehende Strasse ist, sonst false
//			scene: die scene, auf die die Strasse gepackt werden soll
function drawEachEdge(aEdge, isIncoming, scene){
	if(isIncoming){
		var material = getMaterial(0xA4A4A4);
	}
	else{
		var material = getMaterial(0x585858);
	}
	
	var geometry = new THREE.BoxGeometry(aEdge.xWidth, aEdge.incomingWeight, aEdge.zWidth);
	var street = new THREE.Mesh(geometry, material);
	street.position.y = 0;
	
	if(aEdge.isHorizontalEdge){
		street.position.x = aEdge.center[0];
		if(isIncoming){
			street.position.z = aEdge.center[1];//+0.5;
		}
		else{
			street.position.z = aEdge.center[1];//-0.5;
		}
	}
	else{
		street.position.z = aEdge.center[1];
		if(isIncoming){
			street.position.x = aEdge.center[0];//+0.5;
		}
		else{
			street.position.x = aEdge.center[0];//-0.5;
		}
	}
	
	scene.add(street);
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


//Wird ausgefuehrt, wenn man mit der Maus klickt
function onDocumentMouseDown( event ) {	

	event.preventDefault(); // schaltet controls aus
	
	raycaster.setFromCamera( mouse, camera ); //schaut, was die Maus durch die Kamera so erwischt

	var intersects = raycaster.intersectObjects( scene.children); // schaut, was der Strahl, den die Maus macht, alles an Objekten schneidet

	if ( intersects.length > 0 ) { //wenn der Strahl ein Objekt schneidet
		var index = arrayOfWebGLBoxes.indexOf(intersects[0].object.geometry);
		
		//changeBuildingInformation(neueHoehe, neueFlaeche, neueFarbe, neuerDistrict, neuerName)
		changeBuildingInformation(
			arrayOfBuildingsAsWebGLBoxes[index].originalheight, 
			arrayOfBuildingsAsWebGLBoxes[index].originalwidth, 
			arrayOfBuildingsAsWebGLBoxes[index].originalcolor, 
			"noch nicht implementiert", 
			arrayOfBuildingsAsWebGLBoxes[index].name);
		
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