// Dimensionen, die wir abbilden
var myDimensions = ["Stadtteil","Gebäude","Breite","Höhe","Farbe"]; 

//Namen, auf die wir beim JSON-Objekt zugreifen fuer die Legende
var dimensionsFromDatabase = ["district", "name", "flaeche", "hoehe", "farbe"]; 

//fuer den Ordner 'Legende'
var legend = {
	"Stadtteil": function(){},
	"Gebäude": function(){},
	"Breite": function(){},
	"Höhe": function(){},
	"Farbe": function(){}
};

//fuer den Ordner "Gebaeudeinformationen"
var buildingInformation = {
		"hoehe" : "Klicken Sie bitte auf ein Gebäude" , 
		"flaeche" :  "Klicken Sie bitte auf ein Gebäude" , 
		"farbe" :  "Klicken Sie bitte auf ein Gebäude" , 
		"district" :  "Klicken Sie bitte auf ein Gebäude", 
		"name" :  "Klicken Sie bitte auf ein Gebäude"
};

//fuer den Ordner "Skalierung"
var scaling = {
	"logarithmicHeight" : false,
	"logarithmicWidth" : false,
	"logarithmicColor" : false
};

//fuer den Ordner "Steuerung"
var controlling = {
	"zoomSpeed" : 1,
	"rotateSpeed": 1
};

//aendert bei den Gebaeudeinformationen in der Legende die Werte, die angezeigt werden sollen
//@params: newHeight: die neue Hoehe, die angezeigt werden soll
//			newWidth: die neue Breite, die angezeigt werden soll
//			newColor: die neue Farbe, die angezeigt werden soll
//			newDistrict: der neue Stadtteil-Name, der angezeigt werden soll
//			newName: der neue Name vom Gebaeude, der angezeigt werden soll
function changeBuildingInformation(newHeight, newWidth, newColor, newDistrict, newName){
	buildingInformation["hoehe"]=newHeight;
	buildingInformation["flaeche"]=newWidth;
	buildingInformation["farbe"]=newColor;
	buildingInformation["district"]=newDistrict;
	buildingInformation["name"]=newName;
}
	

//Methode, um das Dropdown-Menue oben rechts zu zeichnen
//@params: legende: JSON-Objekt, das der Legende entspricht, sodass z.B. legende["breite"]="Anzahl Methoden" ist
//			scene: die scene, mit der man arbeiten moechte und auf die man reagieren moechte
//			aDistrict: das JSON vom Typ Stadtteil, mit dem ich agieren moechte, wenn der Nutzer das mit der Legende machen moechte
//			camera: die Kamera, die neu positioniert wird, falls das district bearbeitet wird
//			arrayOfWebGLBoxes: Array, bestehend aus allen bisher gezeichneten THREE.BoxGeometry's
//			arrayOfBuildingsAsWebGLBoxes: Array, bestehend aus allen bisher gezeichneten Gebaeuden in der gleichen Reihenfolge wie arrayOfWebGLBoxes
//			extrema: die Extremwerte, die sich aus den Daten ergeben, als JSON

function setMenue(legende, scene, aDistrict, camera, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema, control, controls){
	var gui = new dat.GUI({
		width : 375
	});

	var h = gui.addFolder( "Legende" );
	for(var i=0; i<myDimensions.length; i++){
		h.add( legend, myDimensions[i]).name( myDimensions[i]+": " + legende[dimensionsFromDatabase[i]]);
	}
	//*****************************************************************

	h = gui.addFolder( "Gebäudeinformationen" );
	for(var i=0; i<myDimensions.length; i++){
		h.add( buildingInformation, dimensionsFromDatabase[i]).name( legende[dimensionsFromDatabase[i]]).listen();
	}
	
	//*****************************************************************
	
	h = gui.addFolder( "Skalierung");
	h.add (scaling, "logarithmicHeight").name( "Höhe logarithmieren").onChange(function(value){scale(value, "height", scene, aDistrict, camera, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema);});
	h.add (scaling, "logarithmicWidth").name ("Breite logarithmieren").onChange(function(value){scale(value, "width", scene, aDistrict, camera,arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema);});
	h.add (scaling, "logarithmicColor").name ("Farbe logarithmieren").onChange(function(value){scale(value, "color", scene, aDistrict, camera,arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema);});
	
	//********************************************************************
	
	h = gui.addFolder("Steuerung");
	h.add(controlling, "zoomSpeed", 0.1, 2).name("Zoomgeschwindigkeit").onChange(function(value){controls.zoomSpeed = value;});
	h.add(controlling, "rotateSpeed", 0.1, 2).name("Rotationsgeschwindigkeit").onChange(function(value){control.rotateSpeed = value;});
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
//			arrayOfWebGLBoxes: Array, bestehend aus allen bisher gezeichneten THREE.BoxGeometry's
//			arrayOfBuildingsAsWebGLBoxes: Array, bestehend aus allen bisher gezeichneten Gebaeuden in der gleichen Reihenfolge wie arrayOfWebGLBoxes
//			extrema: die Extremwerte, die sich aus den Daten ergeben, als JSON
function scale(value, aString, scene, aDistrict, camera, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema){
	removeAllObjects(scene, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes);
	setLight(scene);
	if(value){
		var scalingMethod = scaleLogarithmically;
		var scalingExtrema = takeLogarithmOfExtrema;
	}
	else{
		var scalingMethod = scaleLinearly;
		var scalingExtrema = linearizeExtrema;
	}
	var aBuilding;
	for(var i=0; i<aDistrict.buildings.length;i++){
		for(var j=0; j<aDistrict.buildings[i].buildings.length;j++){
			aBuilding = aDistrict.buildings[i].buildings[j];
			aDistrict.buildings[i].buildings[j][aString] = scalingMethod(aDistrict, i, j, aString);
		}
	}
	setMainDistrict(aDistrict);
	scalingExtrema(extrema, aString);
	addCityToScene(aDistrict, scene, camera, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes, extrema);
	addStreetsToScene(aDistrict, scene);
	updateControls(Math.max(aDistrict.width, extrema.maxHeight));
}


//Methode, um die Extremwerte ebenfalls zu skalieren
//@params: extrema: das JSON, das die alten Extremwerte enthaelt
//		aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function takeLogarithmOfExtrema(extrema, aString){
	if(aString=="width"){
		extrema.maxWidth=Math.log(extrema.maxWidth)/Math.log(2);
		extrema.minWidth = Math.log(extrema.minWidth)/Math.log(2);
	}
	else if(aString=="height"){
		extrema.maxHeight=Math.log(extrema.maxHeight)/Math.log(2);
		extrema.minHeigth = Math.log(extrema.minHeigth)/Math.log(2);
	}
	else{
		extrema.maxColor=Math.log(extrema.maxColor)/Math.log(2);
		extrema.minColor = Math.log(extrema.minColor)/Math.log(2);
	}
}


//Methode, um die Extremwerte wieder normal zu skalieren
//@params: extrema: das JSON, das die alten Extremwerte enthaelt
//		aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function linearizeExtrema(extrema, aString){
	if(aString=="width"){
		extrema.maxWidth=Math.pow(2, extrema.maxWidth);
		extrema.minWidth = Math.pow(2, extrema.minWidth);
	}
	else if(aString=="height"){
		extrema.maxHeight=Math.pow(2, extrema.maxHeight);
		extrema.minHeigth = Math.pow(2, extrema.minHeigth);
	}
	else{
		extrema.maxColor=Math.pow(2, extrema.maxColor);
		extrema.minColor = Math.pow(2, extrema.minColor);
	}
}


//Hilfsmethode zum logarithmieren (Logarithmus zur Basis 2)
//@params:aDistrict: das Stadtteil, dessen Gebaeude skaliert werden soll
//			i: entspricht dem i-ten Stadtteil, in dem sich das Gebaeude befindet
//			j: entspricht dem j-ten Gebaeude vom i-ten Stadtteil, das geaendert werden soll
//			aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function scaleLogarithmically(aDistrict, i, j, aString){
	return ((Math.log(aDistrict.buildings[i].buildings[j][aString])/Math.log(2)));
}


//Hilfsmethode, um die urspruenglichen Werte wieder herzustellen, d.h. ohne Skalierung die Gebaeude zu zeichnen
//@params:aDistrict: das Stadtteil, dessen Gebaeude skaliert werden soll
//			i: entspricht dem i-ten Stadtteil, in dem sich das Gebaeude befindet
//			j: entspricht dem j-ten Gebaeude vom i-ten Stadtteil, das geaendert werden soll
//			aString: "width" oder "height" oder "color", sagt, ob die Hoehe oder die Breite oder Farbe der Gebaeude skaliert werden soll
function scaleLinearly(aDistrict, i, j, aString){
	return aDistrict.buildings[i].buildings[j]["original"+aString]+1.5;
}

//Hilfsmethode, um alle Objekte auf der Oberflaeche zu loeschen
//@params: scene: die Scene, auf der alle Objekte geloescht werden soll
function removeAllObjects(scene, arrayOfWebGLBoxes, arrayOfBuildingsAsWebGLBoxes){
	for( var i = scene.children.length - 1; i >= 0; i--) {
		scene.remove(scene.children[i]);
	}
	 arrayOfWebGLBoxes = [];
	 arrayOfBuildingsAsWebGLBoxes =[];
}
					