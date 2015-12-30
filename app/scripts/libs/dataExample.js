var city = {
	name: 'Name des Datensatzes',
	minColor: '#000000',
	maxColor: '#ffffff',
	numberOfBuildings: 0,
	numberOfDistricts: 1,
	buildings: {},
	districts: {
		0: {
			id: 1,
			name: 'Klassen im Package x',
			numberOfBuildings: 1,
			numberOfDistricts: 0,
			buildings: {
				0: {
					id: 4,
					name: 'Beispielklasse',
					hoehe: 3,
					flaeche: 4,
					farbe: 90,
					noEingehendeVerbindungen: 1,
					noAusgehendeVerbindungen: 1,
					eingehendeVerbindungen: {
							// ID: Staerke
							'4' : 8,
					},
					ausgehendeVerbindungen: {
						
					},
				},
			},
			districts: {},
		}
	}
};