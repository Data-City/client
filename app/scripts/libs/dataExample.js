var city = {
	name: 'Name des Datensatzes',
	minColor: '#000000',
	maxColor: '#ffffff',
	maxHeight: 1000,
	numberOfBuildings: 0,
	numberOfDistricts: 1,
	buildings: {
		0: {
			id: 1,
			name: 'Klassen im Package x',
			numberOfBuildings: 1,
			numberOfDistricts: 0,
			height: 3, //Summe aller Hoehen
			width: 4, //Summe aller Breiten
			color: 90, //Summe aller Farben
			numOfIncomingCalls: 1, //summe
			numOfOutgoingCalls: 1, //summe
			incomingCalls: {}, //von anderen Packages
			outgoingCalls: {}, // zu anderen Packages
			buildings: {
				0: {
					id: 4,
					name: 'Beispielklasse',
					height: 3,
					width: 4,
					color: 90,
					numOfIncomingCalls: 1,
					numOfOutgoingCalls: 1,
					incomingCalls: {
							// ID: Staerke
							'4' : 8,
					},
					outgoingCalls: {
						
					},
				},
			},
			districts: {},
		}
	}
};