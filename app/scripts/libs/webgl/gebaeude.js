/* Konstruktor für ein Gebäude*/
function gebaeude(dieBreite, dieHoehe){
	var einGebaeude = {
		hoehe:dieHoehe,
		breite:dieBreite,
		mittelpunktPosition:[dieBreite/2,dieHoehe/2,dieBreite/2],
		farbe:'zufällig ausgewählt',
		stadtteil: 'blub',
		name: 'supergebaeude'
	};
	return einGebaeude;
};
			
function newGebaeude(derName, dieBreite, dieHoehe){
  var einGebaeude = {
		hoehe:dieHoehe,
		breite:dieBreite,
		mittelpunktPosition:[dieBreite/2,dieHoehe/2,dieBreite/2],
		farbe:'blabla',
		stadtteil: 'es gibt zurzeit nur eins',
		name: derName
  };
  return einGebaeude;
};
