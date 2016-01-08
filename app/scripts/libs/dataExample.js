// Erzielte Aggregation:
var aggr = {
    "_id": "city",
    "districts": [
        {
            "name": "Anguilla",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 181,
                            "weight": 105,
                            "age": 27,
                            "country": "Anguilla"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Namibia",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 190,
                            "weight": 80,
                            "age": 80,
                            "country": "Namibia"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Peru",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 202,
                            "weight": 81,
                            "age": 94,
                            "country": "Peru"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Puerto Rico",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 190,
                            "weight": 117,
                            "age": 90,
                            "country": "Puerto Rico"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Montserrat",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 153,
                            "weight": 106,
                            "age": 24,
                            "country": "Montserrat"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Saint Lucia",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 178,
                            "weight": 80,
                            "age": 51,
                            "country": "Saint Lucia"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Iran",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 184,
                            "weight": 94,
                            "age": 58,
                            "country": "Iran"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Algeria",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 174,
                            "weight": 88,
                            "age": 81,
                            "country": "Algeria"
                        }
                    ]
                }
            ],
            "count": 1
        },
        {
            "name": "Vanuatu",
            "districts": [
                {
                    "name": "Female",
                    "buildings": [
                        {
                            "gender": "Female",
                            "size": 162,
                            "weight": 88,
                            "age": 44,
                            "country": "Vanuatu"
                        }
                    ]
                }
            ],
            "count": 1
        }
    ],
    "count": 9
};


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
                        '4': 8,
                    },
                    outgoingCalls: {

                    },
                },
            },
            districts: {},
        }
    }
};


