/* Wird ausgefuehrt, wenn man mit der Maus klickt */
function onDocumentMouseDown( event ) {	

	event.preventDefault(); // schaltet controls aus
	
	raycaster.setFromCamera( mouse, camera ); //schaut, was die Maus durch die Kamera so erwischt

	var intersects = raycaster.intersectObjects( scene.children); // schaut, was der Strahl, den die Maus macht, alles an Objekten schneidet

	if ( intersects.length > 0 ) { //wenn der Strahl ein Objekt schneidet
		//document.getElementById("demo").innerHTML = "Breite: "+intersects[0].object.geometry.parameters.width
					//+", Höhe: "+intersects[0].object.geometry.parameters.height;
		var index = WebGlBoxArray.indexOf(intersects[0].object.geometry);
		changeDetails(GebaeudeArrayWieBoxen[index].hoehe-1, GebaeudeArrayWieBoxen[index].breite-1, "noch nicht implementiert", "noch nicht implementiert", GebaeudeArrayWieBoxen[index].name);
		//changeDetails(neueHoehe, neueFlaeche, neueFarbe, neuerDistrict, neuerName)
	}

}
		
/* berechnet die Position von der Maus*/		
function onDocumentMouseMove( event ) {
	
	event.preventDefault(); 

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
