/*
Bisher nur zum Testen
*/

function getDaten(){
	//die beiden folgenden Arrays sind nur dazu da, damit ich gleich noch direkt sehe, was ich fuer Sachen eingegeben hab
	// diese sind fuer das Clientteam nicht wichtig
	var array = [[50, 10], [10, 20], [30,50], [50,30], [10,10], [10, 10], [20, 20], [50, 10], [8,28]];
	var arrayZwei = [[55, 19], [51, 10], [35, 67], [23, 7], [12, 32], [12, 43], [7, 23], [5, 12], [2,65], [2, 10]];
	var gebaeudearray = [];
	var gebaeudearrayZwei = [];
	
	// was wir aber brauchen ist ein Array an Gebaeuden, die in einem Stadtteil stehen, also erstellen wir das hier beispielhaft
	// wir rufen dabei in jeder iteration den "Konstruktor" eines gebaeudes auf
	for(var i=0;i<array.length; i++){
		gebaeudearray.push(gebaeude(array[i][0], array[i][1]));
	}
	//dies machen wir auch für den anderen Stadtteil
	for(var i=0;i<arrayZwei.length;i++){
		gebaeudearrayZwei.push(gebaeude(arrayZwei[i][0], arrayZwei[i][1]));
	}
	
	//Was wir aber schlussendlich brauchen ist ein Array aus Stadtteilen. Dies wird hier erstellt beispielhaft
	var districtarray = [stadtteil(gebaeudearray), stadtteil(gebaeudearrayZwei)];
	// und nun wird auch das endgültige district erstellt, sozusagen der Boden ganz unten
	return stadtteil(districtarray);
}

//selbsterklaerend
function getLegende(){
	var legende = {
			"hoehe" : "Anzahl Methoden" , 
			"flaeche" : "Anzahl Attribute" , 
			"farbe" : "bisher noch nichts" , 
			"district" : "Package" , 
			"name" : "Klasse"
	};
	return legende;
}


function abhaengigkeiten(){
	var toReturn = {0:5,
		1:23,
		2:75,
		3:1,
		4:9,
		5:15,
		6:27,
		7:15,
		8:4,
		9:6};
	return toReturn;
}


function ersteDatei(){
	var toReturn =  {"data" : { "_embedded" : { "rh:doc" : [ 
		{"Package" : "geb1" , "Klassen" :50  , "Methoden" :50  , "Zeilen" :73  , "Verzweigungen" : "" },
		{"Package" : "geb2" , "Klassen" :10  , "Methoden" :20  , "Zeilen" :186  , "Verzweigungen" : "" },
		{"Package" : "geb3" , "Klassen" :30  , "Methoden" :50  , "Zeilen" :45  , "Verzweigungen" : "" },
		{"Package" : "geb4" , "Klassen" :50  , "Methoden" :30  , "Zeilen" : 156 , "Verzweigungen" : "" },
		{"Package" : "geb5" , "Klassen" :10  , "Methoden" :10  , "Zeilen" : 67 , "Verzweigungen" : "" },
		{"Package" : "geb6" , "Klassen" :10  , "Methoden" :10  , "Zeilen" : 54 , "Verzweigungen" : "" },
		{"Package" : "geb7" , "Klassen" :20  , "Methoden" :20  , "Zeilen" : 31 , "Verzweigungen" : "" },
		{"Package" : "geb8" , "Klassen" :20  , "Methoden" :10  , "Zeilen" : 7 , "Verzweigungen" : "" },
		{"Package" : "geb9" , "Klassen" :50  , "Methoden" :30  , "Zeilen" :76  , "Verzweigungen" : "" },
		{"Package" : "geb10" , "Klassen": 8  , "Methoden" :28 , "Zeilen" :12 , "Verzweigungen" : "" }]}}
	};
	return toReturn;
}

function zweiteDatei(){
	var toReturn = {"data" : { "_embedded" : { "rh:doc" : [
		{"Package" : "geb11" , "Klassen" :55  , "Methoden" :19  , "Zeilen" :45  , "Verzweigungen" : "" },
		{"Package" : "geb12" , "Klassen" :51  , "Methoden" :10  , "Zeilen" :48  , "Verzweigungen" : "" },
		{"Package" : "geb13" , "Klassen" :35  , "Methoden" :67  , "Zeilen" : 15 , "Verzweigungen" : "" },
		{"Package" : "geb14" , "Klassen" :23  , "Methoden" :7  , "Zeilen" :68  , "Verzweigungen" : "" },
		{"Package" : "geb15" , "Klassen" :12  , "Methoden" :32  , "Zeilen" : 32 , "Verzweigungen" : "" },
		{"Package" : "geb16" , "Klassen" :12  , "Methoden" :43  , "Zeilen" : 76 , "Verzweigungen" : "" },
		{"Package" : "geb17" , "Klassen" :7  , "Methoden" : 23 , "Zeilen" : 100 , "Verzweigungen" : "" },
		{"Package" : "geb18" , "Klassen" :5  , "Methoden" : 12 , "Zeilen" : 109 , "Verzweigungen" : "" },
		{"Package" : "geb19" , "Klassen" :2  , "Methoden" : 65 , "Zeilen" :2  , "Verzweigungen" : "" },
		{"Package" : "geb20" , "Klassen" :2  , "Methoden" : 10 , "Zeilen" :73  , "Verzweigungen" : "" }
		]}}
	};
	return toReturn;
}

function beispielZuordnungen(){
	var zuordnungen = { 
		"dimensions" : { 
			"hoehe" : "Methoden" , 
			"flaeche" : "Klassen" , 
			"farbe" : "Zeilen" , 
			"district" : "Verzweigungen" , 
			"name" : {"name": "Package"}
		}
	};
	return zuordnungen;
}


function getLinkJson(){
	return {"camPos":{"x":180.71211144233038,"y":90.35605572116523,"z":271.06816716349556},"garden":[0,1,2],"scaling":{"logarithmicHeight":false,"logarithmicWidth":false,"logarithmicColor":false}};
}



