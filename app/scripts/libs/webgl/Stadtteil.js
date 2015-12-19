var abstand = 2; //Abstand zwischen den Gebaeuden

var gebaeudearray, maxBreite, maxTiefe, startBauInZRichtung, zusaetzlicherAnbau, inZRichtungBauen, letzteMaxBreite, breite, startBauInXRichtung;

/* Konstruktor für ein Stadtteil */
function stadtteil(gebaeudearray){
	var einStadtteil = {
		hoehe:1,
		breite:1,
		mittelpunktPosition:[1/2,-1/2,1/2],
		gebaeude:gebaeudearray};
	return einStadtteil;
};

/*
Methode, um die Stadt zu setzen
*/
function setzeBoxen(district){
	var districtarray = district.gebaeude;
	//setze die Gebaeuder erst mal fuer jedes Stadtteil separat, um die Breite der Districts zu kriegen
	for(var i=0;i<district.gebaeude.length;i++){
		setzeGebaeude(district.gebaeude[i]);
	}

	//verwende dieselbe Methode fuer die districts
	setzeGebaeude(district);
	
	//und anschließend verschiebe die Gebaeude entsprechend ihrer districts
	var verschiebeX = 0;
	var verschiebeZ = 0;
	
	//fuer jedes Stadtteil...
	for(var i=0;i<districtarray.length;i++){
		//verschiebe zuerst das grosse District zurueck in die Mitte
		districtarray[i].mittelpunktPosition[0] = districtarray[i].mittelpunktPosition[0]-(district.breite/2);
		districtarray[i].mittelpunktPosition[1] = -1/2;
		districtarray[i].mittelpunktPosition[2] = districtarray[i].mittelpunktPosition[2]-(district.breite/2);
		
		//Hilfsvariablen
		verschiebeX = districtarray[i].mittelpunktPosition[0]-(districtarray[i].breite)/2;
		verschiebeZ = districtarray[i].mittelpunktPosition[2]-(districtarray[i].breite)/2;
		
		//verschiebe jedes Gebaeude in diesem Stadtteil
		for(var j=0;j<districtarray[i].gebaeude.length;j++){
			districtarray[i].gebaeude[j].mittelpunktPosition[0]=districtarray[i].gebaeude[j].mittelpunktPosition[0]+verschiebeX;
			districtarray[i].gebaeude[j].mittelpunktPosition[2]=districtarray[i].gebaeude[j].mittelpunktPosition[2]+verschiebeZ;
		}
	}
				
}

function sortGebaeude(district){
	district.gebaeude.sort(
			function(gebaeude1, gebaeude2){
				return (gebaeude2.breite)-(gebaeude1.breite);
			}
		);
	return district;
}

/*
Methode, um ein Stadtteil zu setzen
*/
function setzeGebaeude(district){
	
	district = sortGebaeude(district);//zunaechst muessen wir das gebaudearray sortieren absteigend nach der Breite der Boxen
	erstesGebaeudeSetzen(district); //Initialisiert globale Variablen
	
	for(var i=1;i<gebaeudearray.length;i++){
	
		if(inZRichtungBauen==true){//wenn wir gerade in Z-Richtung bauen

			if(startBauInZRichtung>maxTiefe){//wenn wir bereits ueber den Rand (Tiefe des letzten Blocks) sind
				
				if(maxBreite+zusaetzlicherAnbau>maxTiefe){//wenn die Breite in x-Richtung groesser als in z-Richtung ist
					baueWiederInXRichtung(i);
				}
				else{//wenn die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
					baueRechtsNeueGebaeudeReiheInZRichtung(i);
				}
			}
			else{//wenn wir noch nicht am Rand angekommen sind
				baueNormalInZRichtungWeiter(i);
			}
		}
		//wenn wir gerade in X-Richtung bauen (nach links)
		else{
			//wenn wir noch nicht am Rand angekommen sind
			if(startBauInXRichtung-gebaeudearray[i].breite>=abstand){
				baueNormalInXRichtungWeiter(i);
			}
			else{//wenn eine weitere Box links nebendran nicht mehr hinpassen würde
				
				if(maxTiefe+zusaetzlicherAnbau>=maxBreite){//wenn die Tiefe gerade groesser als die Breite ist, dann baue wieder in Z-Richtung und fange rechts unten an
					baueRechtsUntenWiederInZRichtung(i);
				}
				else{//wenn nicht, dann bauen wir eine Reihe obendrueber weiter nach links
					baueObenDrueberNeueReiheInXRichtung(i);
				}
			}
		}
	}
	
	district.breite = breite;
	//district.mittelpunktPosition=[breite/2,-1/2,breite/2];
}

function erstesGebaeudeSetzen(district){
	gebaeudearray = district.gebaeude;
	//Setzen des ersten Elements
	gebaeudearray[0].mittelpunktPosition = [abstand+(gebaeudearray[0].breite)/2, (gebaeudearray[0].hoehe)/2, abstand+(gebaeudearray[0].breite)/2];
	
	maxBreite = 2*abstand+gebaeudearray[0].breite; 	// hier startet man, in X-Richtung zu bauen
	maxTiefe = 2*abstand+gebaeudearray[0].breite;		// baut man in Z-Richtung höher als maxTiefe, muss man woanders eine neue Reihe starten
	startBauInXRichtung = gebaeudearray[0].breite+abstand; // hier startet man, in X-Richtung zu bauen
	startBauInZRichtung = abstand;		// hier startet man, in Z-Richtung zu bauen
	zusaetzlicherAnbau = 0; 	//Falls maxBreiteXRichtung<maxBreiteZRichtung und wir in Z-Richtung bauen,
									// muessen wir rechts nebendran eine neue Reihe nach oben bauen
									// und diese Variable speichert die x Koordinate, an der wir weiterbauen muessen
									//analog, wenn wir in die andere Richtung bauen
	inZRichtungBauen = true;	// true, wenn wir gerade in Z-Richtung bauen
	letzteMaxBreite = gebaeudearray[0].breite-abstand; // in einem bestimmten Fall startet man von hier aus, in X-Richtung zu bauen
	breite=gebaeudearray[0].breite+2*abstand; //vom district
	
	if(gebaeudearray.length>1){
		zusaetzlicherAnbau = gebaeudearray[1].breite+abstand;
	}
}

function baueWiederInXRichtung(i){				
	//bauen wir weiter in x-Richtung
	gebaeudearray[i].mittelpunktPosition = [startBauInXRichtung-(1/2)*gebaeudearray[i].breite,
						(gebaeudearray[i].hoehe)/2,
						maxTiefe+(1/2)*gebaeudearray[i].breite];
	breite = Math.max(startBauInZRichtung, maxTiefe+gebaeudearray[i].breite, maxBreite+zusaetzlicherAnbau);
	inZRichtungBauen=false;
	maxBreite = maxBreite+zusaetzlicherAnbau;
	zusaetzlicherAnbau = gebaeudearray[i].breite+abstand;
	startBauInZRichtung = abstand;
	startBauInXRichtung = startBauInXRichtung-gebaeudearray[i].breite-abstand;
}

function aueRechtsNeueGebaeudeReiheInZRichtung(i){
	// Dann fangen wir rechts von der letzten Gebaeudereihe an, eine neue Gebaeudereihe aufzubauen
	gebaeudearray[i].mittelpunktPosition = [maxBreite+zusaetzlicherAnbau+(1/2)*gebaeudearray[i].breite,
		(gebaeudearray[i].hoehe)/2,
		(1/2)*gebaeudearray[i].breite+abstand];
	breite = Math.max(startBauInZRichtung, maxBreite+zusaetzlicherAnbau);
	maxBreite = maxBreite+zusaetzlicherAnbau;
	zusaetzlicherAnbau=gebaeudearray[i].breite+abstand;
	startBauInZRichtung = gebaeudearray[i].breite+abstand*2;
}

function baueNormalInZRichtungWeiter(i){
	gebaeudearray[i].mittelpunktPosition = [maxBreite+(1/2)*gebaeudearray[i].breite,
		(gebaeudearray[i].hoehe)/2,
		startBauInZRichtung+(1/2)*gebaeudearray[i].breite];			
	startBauInZRichtung = startBauInZRichtung+gebaeudearray[i].breite+abstand;
	breite = Math.max(startBauInZRichtung, maxBreite+zusaetzlicherAnbau, maxTiefe);
}

function baueNormalInXRichtungWeiter(i){
	gebaeudearray[i].mittelpunktPosition = [startBauInXRichtung-(1/2)*gebaeudearray[i].breite,
					(gebaeudearray[i].hoehe)/2, 
					maxTiefe+(1/2)*gebaeudearray[i].breite];
	breite = Math.max(maxTiefe+zusaetzlicherAnbau, maxBreite);
	startBauInXRichtung = startBauInXRichtung-gebaeudearray[i].breite-abstand;
}

function baueRechtsUntenWiederInZRichtung(i){
	gebaeudearray[i].mittelpunktPosition = [maxBreite+(1/2)*gebaeudearray[i].breite,
						(gebaeudearray[i].hoehe)/2,
						(1/2)*gebaeudearray[i].breite+abstand];
	maxTiefe = maxTiefe+zusaetzlicherAnbau;
	startBauInZRichtung = gebaeudearray[i].breite+abstand+2*abstand;
	startBauInXRichtung = maxBreite-2*abstand;
	zusaetzlicherAnbau = gebaeudearray[i].breite+abstand;
	inZRichtungBauen = true;
	letzteMaxBreite = maxBreite-2*abstand;
	breite = Math.max(maxBreite+zusaetzlicherAnbau, maxTiefe);
}

function baueObenDrueberNeueReiheInXRichtung(i){
	startBauInXRichtung = letzteMaxBreite;
	maxTiefe = maxTiefe + zusaetzlicherAnbau;
	zusaetzlicherAnbau = gebaeudearray[i].breite+abstand;
	gebaeudearray[i].mittelpunktPosition = [startBauInXRichtung-(1/2)*gebaeudearray[i].breite,
						(gebaeudearray[i].hoehe)/2,
						maxTiefe+(1/2)*gebaeudearray[i].breite];
	startBauInXRichtung = startBauInXRichtung-gebaeudearray[i].breite-abstand;
	breite = Math.max(maxBreite, maxTiefe+zusaetzlicherAnbau);
}
