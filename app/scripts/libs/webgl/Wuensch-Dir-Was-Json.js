//Unter der Annahme, dass diese Zuordnungen gelten
var zuordnungen = { 
	"dimensions" : { 
		"height" : "size" , 
		"width" : "weight" , 
		"color" : "age" , 
		"district" : "gender" , 
		"name" : "name",
		"numOfIncomingCalls": "irgendwas1",
		"numOfOutgoingCalls": "irgendwas2"
	}
};

var aggr = {
    "_id": "city",
    "buildings": [
        {
            "name": "Burkina Faso",
			"size": 194, //Summe aller size in .buildings; optional. Wenn es nicht da ist, dann steht in der Legende eben undefined
            "weight": 112,//analog zu size
            "age": 21, //analog zu size
            "country": "Burkina Faso",
			height:1.5,
			width:1.5,
			color:1.5,
			centerPosition:[0,0,0],
			"leftGarden": {
				numOfCalls: 220
				width: 220+1.5,
				height: 0.01,
				depth: (220+1.5)/2,
				centerPosition: [0,0.05,0],
				nextLinePos: [0,0],
				on: false,
				id: aID,
				linesTo: { 
					ersteGartenID: 124,
					zweiteGartenID: 42,
					dritteGartenID: 54
				}
			},
			"rightGarden": {
				numOfCalls: 1000,
				width: 1000+1.5,
				height: 0.01,
				depth: (1000+1.5)/2,
				centerPosition: [0,0.05,0],
				nextLinePos: [0,0],
				on: false,
				id: aID,
				linesTo: { 
					ersteGartenID: 524,
					zweiteGartenID: 412,
					dritteGartenID: 64
				}
			},
            "buildings": [
                {
                    "name": "Female",
					"gender": "Female",
                    "size": 194, //Summe aller size in .buildings; optional. Wenn es nicht da ist, dann steht in der Legende eben undefined
                    "weight": 112,//analog zu size
                    "age": 21, //analog zu size
                    "country": "Burkina Faso",
					height:1.5,
					width:1.5,
					color:1.5,
					centerPosition:[0,0,0],
					"leftGarden": {
						numOfCalls: 220
						width: 220+1.5,
						height: 0.01,
						depth: (220+1.5)/2,
						centerPosition: [0,0.05,0],
						nextLinePos: [0,0],
						on: false,
						id: aID,
						linesTo: { 
							ersteGartenID: 124,
							zweiteGartenID: 42,
							dritteGartenID: 54
						}
					},
					"rightGarden": {
						numOfCalls: 1000,
						width: 1000+1.5,
						height: 0.01,
						depth: (1000+1.5)/2,
						centerPosition: [0,0.05,0],
						nextLinePos: [0,0],
						on: false,
						id: aID,
						linesTo: { 
							ersteGartenID: 524,
							zweiteGartenID: 412,
							dritteGartenID: 64
						}
					},
                    "buildings": [
                        {	//hier fehlt "name". In der Legende wird hier dann undefined angezeigt, aber das ist ja ok, denke ich
                            "gender": "Female",
                            "size": 194,
                            "weight": 112,
                            "age": 21,
                            "country": "Burkina Faso", //country hat bisher nicht mehr in die Legende gepasst...^^
														//da muessen wir uns noch ueberlegen, wie viele Sachen wir
														//in die Legende packen moechten und wie wir das uebergeben
							height:194+1.5, //Damit es beim Logarithmieren nicht 0 oder <0 wird
							width:112+1.5,
							color:21+1.5,
							centerPosition:[(112+1.5)/2,(194+1.5)/2,(112+1.5)/2],
							"leftGarden": {
								numOfCalls: 220
								width: 220+1.5,
								height: 0.01,
								depth: (220+1.5)/2,
								centerPosition: [0,0.05,0],
								nextLinePos: [0,0],
								on: false,
								id: aID,
								linesTo: { 
									ersteGartenID: 124,
									zweiteGartenID: 42,
									dritteGartenID: 54
								}
							},
							"rightGarden": {
								numOfCalls: 1000,
								width: 1000+1.5,
								height: 0.01,
								depth: (1000+1.5)/2,
								centerPosition: [0,0.05,0],
								nextLinePos: [0,0],
								on: false,
								id: aID,
								linesTo: { 
									ersteGartenID: 524,
									zweiteGartenID: 412,
									dritteGartenID: 64
								}
							},
                        }
                    ]
                }
            ],
            "count": 1 //brauche ich aber bisher nicht, aber kann sicher nicht schaden, das zu wissen
        }
	};