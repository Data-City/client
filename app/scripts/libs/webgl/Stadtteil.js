var gap = 2; //Abstand zwischen den Gebaeuden

var arrayOfBuildings, maxWidth, maxDepth, startToBuildInZDirection, extension, buildingInZDirection, lastMaxWidth, width, startToBuildInXDirection;

// Eine Art Konstruktor fuer ein Gebaeude
//@params: aName: Name von dem Gebaeude
//		aWidth: Breite von dem Gebaeude
//		aHeight: Hoehe von dem Gebaeude
//		aColor: Farbe von dem Gebaeude
//@return: ein Javascript-Objekt vom Typ Gebaeude bzw. building
function building(aName, aWidth, aHeight, aColor){
	var aBuilding = {
		//es wird 1.5 addiert, damit Gebaeude mit urspruenglich 0 Hoehe auch gezeichnet werden
		// und beim logarithmieren auch nicht verschwinden
		height:aHeight+1.5, 
		width:aWidth+1.5,
		centerPosition:[aWidth/2,aHeight/2,aWidth/2],
		color:aColor+1.5,
		district: 'es gibt zurzeit nur eins',
		name: aName,
		originalheight: aHeight,
		originalwidth: aWidth,
		originalcolor:aColor
	};
	return aBuilding;
};


//Konstruktor für ein Stadtteil
//@params: arrayOfBuildings: ein Array bestehend aus nur Gebaeuden(d.h. JSON-Objekte buildings) 
//							oder nur Stadtteilen (d.h. JSON-Objekte district)
//@return: ein Javascript-Objekt vom Typ stadtteil bzw. district
function district(arrayOfBuildings){
	var aDistrict = {
		height:1,
		width:1,
		centerPosition:[1/2,-1/2,1/2],
		buildings:arrayOfBuildings};
	return aDistrict;
};


//Methode, um fuer jedes Stadtteil die einzelnen Gebaeude zu positionieren und die Stadtteile auch zu positionieren
//@params: mainDistrict: ein JSON-Objekt vom Typ district, das die Grundflaeche auch enthaelt
function setMainDistrict(mainDistrict){
	var districtarray = mainDistrict.buildings;
	//setze die Gebaeuder erst mal fuer jedes Stadtteil separat, um die Breite der Districts zu kriegen
	for(var i=0;i<mainDistrict.buildings.length;i++){
		setOneDistrict(mainDistrict.buildings[i]);
	}

	//verwende dieselbe Methode fuer die districts
	setOneDistrict(mainDistrict);
	
	//und anschließend verschiebe die Gebaeude entsprechend ihrer districts
	var shiftX = 0;
	var shiftZ = 0;
	
	//fuer jedes Stadtteil...
	for(var i=0;i<districtarray.length;i++){
		//verschiebe zuerst das grosse District zurueck in die Mitte
		districtarray[i].centerPosition[0] = districtarray[i].centerPosition[0]-(mainDistrict.width/2);
		districtarray[i].centerPosition[1] = -1/2;
		districtarray[i].centerPosition[2] = districtarray[i].centerPosition[2]-(mainDistrict.width/2);
		
		//Hilfsvariablen
		shiftX = districtarray[i].centerPosition[0]-(districtarray[i].width)/2;
		shiftZ = districtarray[i].centerPosition[2]-(districtarray[i].width)/2;
		
		//verschiebe jedes Gebaeude in diesem Stadtteil
		for(var j=0;j<districtarray[i].buildings.length;j++){
			districtarray[i].buildings[j].centerPosition[0]=districtarray[i].buildings[j].centerPosition[0]+shiftX;
			districtarray[i].buildings[j].centerPosition[2]=districtarray[i].buildings[j].centerPosition[2]+shiftZ;
		}
	}
}


//Hilfsmethode zum sortieren der Gebaeude nach Breite absteigend
//@params: aDistrict: das Stadtteil, dessen Gebaeude sortiert werden sollen
//@return: das district mit einem sortierten Gebaeudearray
function sortBuildings(aDistrict){
	aDistrict.buildings.sort(
			function(building1, building2){
				return (building2.width)-(building1.width);
			}
		);
	return aDistrict;
}


//Methode wird vom setMainDistrict aufgerufen
// Sie berechnet fuer die Gebaeude von einem Stadtteil die Position und speichert sie in buildings.centerPosition
// anschließend wird noch das Stadtteil vergroessert, damit alle Gebaeude auf das Stadtteil draufpassen
//@params: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen

function setOneDistrict(aDistrict){
	
	aDistrict = sortBuildings(aDistrict);//zunaechst muessen wir das gebaudearray sortieren absteigend nach der Breite der Boxen
	setFirstBuilding(aDistrict); //Initialisiert globale Variablen
	
	for(var i=1;i<arrayOfBuildings.length;i++){
		if(buildingInZDirection==true){//wenn wir gerade in Z-Richtung bauen

			if(startToBuildInZDirection>maxDepth){//wenn wir bereits ueber den Rand (Tiefe des letzten Blocks) sind
				
				if(maxWidth+extension>maxDepth){//wenn die Breite in x-Richtung groesser als in z-Richtung ist
					continueBuildingInXDirection(i);
				}
				else{//wenn die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
					buildANewBuildingRowOnTheRightInZDirection(i);
				}
			}
			else{//wenn wir noch nicht am Rand angekommen sind
				continueBuildingNormallyInZDirection(i);
				
			}
		}
		else{//wenn wir gerade in X-Richtung bauen (nach links)
			if(startToBuildInXDirection-arrayOfBuildings[i].width>=gap){//wenn wir noch nicht am Rand angekommen sind
				continueBuildingNormallyInXDirection(i);
			}
			else{//wenn eine weitere Box links nebendran nicht mehr hinpassen würde
				
				if(maxDepth+extension>=maxWidth){//wenn die Tiefe gerade groesser als die Breite ist, dann baue wieder in Z-Richtung und fange rechts unten an
					buildAgainDownOnTheRightInZDirection(i);
				}
				else{//wenn nicht, dann bauen wir eine Reihe obendrueber weiter nach links
					buildANewRowOnTheTopInXDirection(i);
				}
			}
		}
	}
	
	aDistrict.width = width;
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des ersten Gebaeudes
//@params: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
function setFirstBuilding(aDistrict){
	arrayOfBuildings = aDistrict.buildings;
	//Setzen des ersten Elements
	arrayOfBuildings[0].centerPosition = [gap+(arrayOfBuildings[0].width)/2, (arrayOfBuildings[0].height)/2, gap+(arrayOfBuildings[0].width)/2];
	
	maxWidth = 2*gap+arrayOfBuildings[0].width; 	// hier startet man, in X-Richtung zu bauen
	maxDepth = 2*gap+arrayOfBuildings[0].width;		// baut man in Z-Richtung höher als maxDepth, muss man woanders eine neue Reihe starten
	startToBuildInXDirection = arrayOfBuildings[0].width+gap; // hier startet man, in X-Richtung zu bauen
	startToBuildInZDirection = gap;		// hier startet man, in Z-Richtung zu bauen
	extension = 0; 	//Falls maxBreiteXRichtung<maxBreiteZRichtung und wir in Z-Richtung bauen,
									// muessen wir rechts nebendran eine neue Reihe nach oben bauen
									// und diese Variable speichert die x Koordinate, an der wir weiterbauen muessen
									//analog, wenn wir in die andere Richtung bauen
	buildingInZDirection = true;	// true, wenn wir gerade in Z-Richtung bauen
	lastMaxWidth = arrayOfBuildings[0].width-gap; // in einem bestimmten Fall startet man von hier aus, in X-Richtung zu bauen
	width=arrayOfBuildings[0].width+2*gap; //vom aDistrict
	
	if(arrayOfBuildings.length>1){
		extension = arrayOfBuildings[1].width+gap;
	}
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
//und die Breite in x-Richtung groesser als in z-Richtung ist
//@params: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
function continueBuildingInXDirection(i){				
	//bauen wir weiter in x-Richtung
	arrayOfBuildings[i].centerPosition = [startToBuildInXDirection-(1/2)*arrayOfBuildings[i].width,
						(arrayOfBuildings[i].height)/2,
						maxDepth+(1/2)*arrayOfBuildings[i].width];
	width = Math.max(startToBuildInZDirection, maxDepth+arrayOfBuildings[i].width, maxWidth+extension);
	buildingInZDirection=false;
	maxWidth = maxWidth+extension;
	extension = arrayOfBuildings[i].width+gap;
	startToBuildInZDirection = gap;
	startToBuildInXDirection = startToBuildInXDirection-arrayOfBuildings[i].width-gap;
}

//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
//und die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function buildANewBuildingRowOnTheRightInZDirection(i){
	// Dann fangen wir rechts von der letzten Gebaeudereihe an, eine neue Gebaeudereihe aufzubauen
	arrayOfBuildings[i].centerPosition = [maxWidth+extension+(1/2)*arrayOfBuildings[i].width,
		(arrayOfBuildings[i].height)/2,
		(1/2)*arrayOfBuildings[i].width+gap];
	width = Math.max(startToBuildInZDirection, maxWidth+extension);
	maxWidth = maxWidth+extension;
	extension=arrayOfBuildings[i].width+gap;
	startToBuildInZDirection = arrayOfBuildings[i].width+gap*2;
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in Z-Richtung bauen und noch nicht am Rand angekommen sind
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function continueBuildingNormallyInZDirection(i){
	arrayOfBuildings[i].centerPosition = [maxWidth+(1/2)*arrayOfBuildings[i].width,
		(arrayOfBuildings[i].height)/2,
		startToBuildInZDirection+(1/2)*arrayOfBuildings[i].width];			
	startToBuildInZDirection = startToBuildInZDirection+arrayOfBuildings[i].width+gap;
	width = Math.max(startToBuildInZDirection, maxWidth+extension, maxDepth);
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in X-Richtung bauen (nach links) und noch nicht am Rand angekommen sind
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function continueBuildingNormallyInXDirection(i){
	arrayOfBuildings[i].centerPosition = [startToBuildInXDirection-(1/2)*arrayOfBuildings[i].width,
					(arrayOfBuildings[i].height)/2, 
					maxDepth+(1/2)*arrayOfBuildings[i].width];
	width = Math.max(maxDepth+extension, maxWidth);
	startToBuildInXDirection = startToBuildInXDirection-arrayOfBuildings[i].width-gap;
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in X-Richtung bauen (nach links) und die Tiefe gerade groesser als die Breite ist
// dann bauen wir wieder in Z-Richtung und fangen rechts unten an
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function buildAgainDownOnTheRightInZDirection(i){
	arrayOfBuildings[i].centerPosition = [maxWidth+(1/2)*arrayOfBuildings[i].width,
						(arrayOfBuildings[i].height)/2,
						(1/2)*arrayOfBuildings[i].width+gap];
	maxDepth = maxDepth+extension;
	startToBuildInZDirection = arrayOfBuildings[i].width+gap+2*gap;
	startToBuildInXDirection = maxWidth-gap;
	extension = arrayOfBuildings[i].width+gap;
	buildingInZDirection = true;
	lastMaxWidth = maxWidth-2*gap;
	width = Math.max(maxWidth+extension, maxDepth);
}


//Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
//wenn wir gerade in X-Richtung bauen (nach links) und die Breite gerade groesser als die Tiefe ist
//dann bauen wir eine Reihe obendrueber weiter nach links
//@params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
function buildANewRowOnTheTopInXDirection(i){
	startToBuildInXDirection = lastMaxWidth+2*gap;
	maxDepth = maxDepth + extension;
	extension = arrayOfBuildings[i].width+gap;
	arrayOfBuildings[i].centerPosition = [startToBuildInXDirection-(1/2)*arrayOfBuildings[i].width,
						(arrayOfBuildings[i].height)/2,
						maxDepth+(1/2)*arrayOfBuildings[i].width];
	startToBuildInXDirection = startToBuildInXDirection-arrayOfBuildings[i].width-gap;
	width = Math.max(maxWidth, maxDepth+extension);
}
