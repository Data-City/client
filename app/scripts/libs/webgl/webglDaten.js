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









