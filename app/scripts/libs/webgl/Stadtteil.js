var association = {}; //Hier wird die Legende gespeichert
var incomingCalls = {}; //speichert Infos ueber Eingehende Verbindungen
var outgoingCalls = {}; //speichert Infos ueber ausgehende Verbindungen

var gap = 10; //Abstand zwischen den Gebaeuden
var gardenRadius = 6; //Groesse der Gaerten

var arrayOfBuildings, maxWidth, maxDepth, startToBuildInZDirection, extension, buildingInZDirection, lastMaxWidth, width, startToBuildInXDirection; //fuer setOneDistrict

var buildingsHashMap = {}; //Hashmap fuer Gebaeude: mapt Gebaeude-ID mit dem Objekt

var GARDEN_WIDTH = (6 + 6 * Math.sin(Math.PI / 6)) / Math.cos(Math.PI / 6);
var GARDEN_DEPTH = 6 + 6 * Math.sin(Math.PI / 6);

var jsonOfNodes = {}; //man greift erst auf die x-Position zu, dann auf die z-Position, dann bekommt man den Knoten

var graph = {};
var nodeHashMap = {};
var nodeID = 0;

var metaData; //Objekt, das max, min-Werte enthaelt, die uebergeben worden sind

/**
* Setter fuer metaData
* @param: newMetaData: die neuen MetaDaten
*/
function setMetaData(newMetaData) {
	metaData = newMetaData;
}

/*
 * Setter fuer association
 * @param: newAssociation: die neue Zuordnung
 */
function setAssociation(newAssociation) {
    association = newAssociation;
}

/*
 * Getter fuer die Hashmap der Gebaeuden
 * @return: Hashmap fuer die Gebaeuden
 */
function getBuildingsHashMap() {
    return buildingsHashMap;
}


/*
 * Setter fuer incomingCalls, outgoingCalls jeweils der Form
 * {GebaeudeID : {connections : {GebaeudeID_1: Gewichtung1, GebaeudeID_2: Gewichtung2}, sumOfConnections: SummeDerGewichtungen}}
 * @param: income: neues Objekt fuer incomingCalls
 * @param: outgoing: neues Objekt fuer outgoingCalls
 */
function setCalls(income, outgoing) {
    incomingCalls = income;
    outgoingCalls = outgoing;
}


/**
* sortiert zu jedem key in nodesOfStreetsSortByXCoord und nodesOfStreetsSortByZCoord das zugehoerige Array absteigend 
*/
function sortNodesOfStreets(nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord){
    for(var x in nodesOfStreetsSortByXCoord){
        nodesOfStreetsSortByXCoord[x].sort(function(a, b){return a-b});
    }
    for(var x in nodesOfStreetsSortByZCoord){
        nodesOfStreetsSortByZCoord[x].sort(function(a, b){return a-b});
    }
}


/**
* iteriert durch nodesOFStreetsSortByXCoord bzw. -ZCoord und bestimmt die Nachbarn von den Knoten
*/
function createEdges(nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord){
	sortNodesOfStreets(nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord);
	var lastNode, currentNode;
	for(var x in nodesOfStreetsSortByXCoord){
		lastNode = jsonOfNodes[x][nodesOfStreetsSortByXCoord[x][0]];
        for(var i=0; i<nodesOfStreetsSortByXCoord[x].length-1; i++){
			currentNode = jsonOfNodes[x][nodesOfStreetsSortByXCoord[x][i+1]];
			// eigentlich duerfte currentNode nicht undefined sein, aber irgendwie ist es trotzdem ab und zu undefined - komisch
			if (currentNode != undefined && currentNode.belongsToBuilding != true) {
				graph[lastNode.id][currentNode.id] = 1;
				graph[currentNode.id][lastNode.id] = 1;
				lastNode.front = currentNode;
				currentNode.back = lastNode;
			}
			lastNode = currentNode;
        }
    }
    for(var x in nodesOfStreetsSortByZCoord){
		lastNode = jsonOfNodes[nodesOfStreetsSortByZCoord[x][0]][x];
        for(var i=0; i<nodesOfStreetsSortByZCoord[x].length-1; i++){
            currentNode = jsonOfNodes[nodesOfStreetsSortByZCoord[x][i+1]][x];
			if(currentNode != undefined) { //auch hier sollte currentNode eigentlich nicht undefined sein ...
				graph[lastNode.id][currentNode.id] = 1;
				graph[currentNode.id][lastNode.id] = 1;
				lastNode.right = currentNode;
				currentNode.left = lastNode;
				lastNode = currentNode;
			}
        }
    }
}

/**
setzt den Graphen fuer die Strassen, damit man Dijkstra benutzen kann
*/
function setGraph(){
	graph = new Graph(graph);
}



/**
* Diese Methode fuegt den JSON-Objekten nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord, 
* welche die Positionen der Strassenkreuzungen bzw. Knoten speichern, die mit dem Gebaeude erstellt werden muessen
* @param: district: ein Gebaeude oder Stadtteil, bei dem die Knoten gesetzt werden sollen
*/
function setTheFiveStreetNodes(district, nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord){
    var toAdd = Math.round((getLandWidth(district)/2 + gap/2)*10000)/10000;
    var centerPos = [
		Math.round(district._centerPosition[0]*10000)/10000,
		Math.round(district._centerPosition[1]*10000)/10000,
		Math.round(district._centerPosition[2]*10000)/10000
	];
    district.posOfNextStreetNode = [Math.round(centerPos[0]*10000)/10000, Math.round(((Math.round(centerPos[2]*10000)/10000)+toAdd)*10000)/10000];

    addANode(nodesOfStreetsSortByXCoord, Math.round(centerPos[0]*10000)/10000,  Math.round((centerPos[2]+toAdd)*10000)/10000, district, true);
    addANode(nodesOfStreetsSortByXCoord, Math.round((centerPos[0]+toAdd)*10000)/10000, Math.round((centerPos[2]+toAdd)*10000)/10000, district);
    addANode(nodesOfStreetsSortByXCoord, Math.round((centerPos[0]+toAdd)*10000)/10000, Math.round((centerPos[2]-toAdd)*10000)/10000, district);
    addANode(nodesOfStreetsSortByXCoord, Math.round((centerPos[0]-toAdd)*10000)/10000, Math.round((centerPos[2]+toAdd)*10000)/10000, district);
    addANode(nodesOfStreetsSortByXCoord, Math.round((centerPos[0]-toAdd)*10000)/10000, Math.round((centerPos[2]-toAdd)*10000)/10000, district);

    addANode(nodesOfStreetsSortByZCoord, Math.round((centerPos[2]+toAdd)*10000)/10000, Math.round(centerPos[0]*10000)/10000);
    addANode(nodesOfStreetsSortByZCoord, Math.round((centerPos[2]+toAdd)*10000)/10000, Math.round((centerPos[0]+toAdd)*10000)/10000);
    addANode(nodesOfStreetsSortByZCoord, Math.round((centerPos[2]+toAdd)*10000)/10000, Math.round((centerPos[0]-toAdd)*10000)/10000);
    addANode(nodesOfStreetsSortByZCoord, Math.round((centerPos[2]-toAdd)*10000)/10000, Math.round((centerPos[0]+toAdd)*10000)/10000);
    addANode(nodesOfStreetsSortByZCoord, Math.round((centerPos[2]-toAdd)*10000)/10000, Math.round((centerPos[0]-toAdd)*10000)/10000);
}


/**
* Diese Methode fuegt dem Array, welches dem Wert von aJSON an der Stelle theKey ist, den Wert theValue hinzu
* @param: aJSON: ein JSON-Objekt der Form {key: Array}
* @param: theKey: Key, mit dem man auf JSON zugreifen will
* @param: theValue: der Wert, den man einfuegen moechte
* @param: aDistrict: das Distrikt oder das Gebaeude, das zum Knoten gehört (nur zum Testen/ Ueberpruefen)
* @param: belongsToBuilding: true, wenn es ein Knoten ist, das zu einem Gebäude gehört, sonst undefined
*/
function addANode(aJSON, theKey, theValue, aDistrict, belongsToBuilding){
	//if(theValue === -105.1423) console.log("dshgahdsöghaödsghaöodsghaoödsg: " + theKey);
	//if(theKey = -105.1423) console.log("LALALLALALALALALLAL: "+theValue);
    if (aJSON[theKey] != undefined) {
        if (aJSON[theKey].indexOf(theValue)==-1) {
            (aJSON[theKey]).push(theValue);
			if (aDistrict != undefined) {
				jsonOfNodes[theKey][theValue] = {x: theKey, z: theValue, building: aDistrict, belongsToBuilding: belongsToBuilding, id : nodeID};
				nodeHashMap[nodeID] = jsonOfNodes[theKey][theValue];
				graph[nodeID] = {};
				if(belongsToBuilding==true) aDistrict.nodeID = nodeID;
				nodeID++;
			}
        }
    }
    else{
        aJSON[theKey] = [theValue];
		if (aDistrict != undefined) {
			jsonOfNodes[theKey] = {};
			jsonOfNodes[theKey][theValue] = {x: theKey, z: theValue, building: aDistrict, belongsToBuilding: belongsToBuilding, id : nodeID};
			nodeHashMap[nodeID] = jsonOfNodes[theKey][theValue];
			graph[nodeID] = {};
			if(belongsToBuilding==true) aDistrict.nodeID = nodeID;
			nodeID++;
		}
    }
}



/**
 * berechnet einen Weg von einem Gebaeude (start) zu einem anderen Gebaeude (target)
 * Der Weg wird in vertices gepusht
 * @param: vertices: die Knoten, die der Weg besucht
 * @param: start: Gebaeude oder District, bei dem der Weg starten soll
 * @param: target: Gebaeude oder District, bei dem der Weg enden soll
 */
function setPath(vertices, start, target) {
	if(start._district == target._district) {
		setPathOnOneDistrict(vertices, start.nodeID, target.nodeID, start._centerPosition[1]-(start._height/2)+0.1);
	}
	else {
		var startDistricts = (start._district).split(".");
		var targetDistricts = (target._district).split(".");
		var k = getLastPosOfSameEntry(startDistricts, targetDistricts);

		var height = addPathFromUpperToLowerDistrict(start, vertices, startDistricts, k);

		var nameOfTargetDistrict = addPathBetweenDistrictsOnTheSameDistrict(startDistricts, targetDistricts, k, start, target, height, vertices);
		var currentDistrict = buildingsHashMap[nameOfTargetDistrict];

		currentDistrict = addPathFromLowerToUpperDistrict(nameOfTargetDistrict, targetDistricts, k, vertices, currentDistrict, height);
		height = currentDistrict._centerPosition[1]+currentDistrict._height/2+0.1;
		
		lastStepInCreatingPath(targetDistricts, vertices, currentDistrict, target, height, k);
	}
}

/**
* fuegt zu vertices den Weg vom Start hin bis runter zum "Exit-Knoten" des k-ten Distrikts unter dem Start
* @param: start: Gebaeude oder District, bei dem der Pfad starten soll
* @param: vertices: Array der Knoten vom Pfad bestehend aus THREE.Vector3
* @param: startDistricts: ein Array, der Districtname von dem Start, aufgesplitted nach Punkten im Namen
* @param: k: die letzte Position im startDistricts, die noch mit targetDistricts uebereinstimmt
* @return: height: die Hoehe, auf die die letzte Linie gezeichnet worden ist 
*/ 
function addPathFromUpperToLowerDistrict(start, vertices, startDistricts, k){
	var currentDistrict = buildingsHashMap[start._district]; //ein Districtobjekt
	var startingNode = nodeHashMap[start.nodeID]; //ein Knotenobjekt
	var endingNode = nodeHashMap[currentDistrict.exitNodeID]; //ein Knotenobjekt
	var height = start._centerPosition[1]-(start._height/2)+0.1;
	vertices.push(new THREE.Vector3(start._centerPosition[0], height, start._centerPosition[2]));
	for (var i = 0; i<startDistricts.length-1-k; i++) {
		setPathOnOneDistrict(vertices, startingNode.id, endingNode.id, height);
		vertices.push(
			new THREE.Vector3(currentDistrict._centerPosition[0], height, currentDistrict._centerPosition[2]+currentDistrict._width/2+0.1)
		);
		height = currentDistrict._centerPosition[1]-(currentDistrict._height/2)+0.1;
		vertices.push(
			new THREE.Vector3(currentDistrict._centerPosition[0], height, currentDistrict._centerPosition[2]+currentDistrict._width/2+0.1)
		);
		
		startingNode = nodeHashMap[currentDistrict.nodeID];			
		currentDistrict = buildingsHashMap[currentDistrict._district];
		endingNode = nodeHashMap[currentDistrict.exitNodeID];
	}
	return height;
}


/**
* fuegt den Pfad zwischen den beiden Distrikten von Start und Ziel hinzu, die auf einem gemeinsamen District stehen
* @param: startDistricts: ein Array, der Districtname von dem Start, aufgesplitted nach Punkten im Namen
* @param: targetDistricts: ein Array, der Districtname von dem Ziel, aufgesplitted nach Punkten im Namen
* @param: k: die letzte Position im startDistricts, die noch mit targetDistricts uebereinstimmt
* @param: start: Gebaeude- bzw. Districtobjekt, der (allererste) Startpunkt
* @param: target: Gebaeude- bzw. Districtobjekt, der (allerletzte) Zielpunkt
* @param: height: Hoehe der Linie, die als letztes gezeichnet worden ist
* @param: vertices: bisheriger Pfad, bestehend aus THREE.Vector3
* @return: nameOfTargetDistrict: der Name von dem ZielDistrict, bei dem man aufgehoert hat, den Pfad zu setzen
*/
function addPathBetweenDistrictsOnTheSameDistrict(startDistricts, targetDistricts, k, start, target, height, vertices){
	var nameOfStartingDistrict = "";
	var nameOfTargetDistrict = "";
	for (var i = 0; i<=k; i++) {
		nameOfStartingDistrict = nameOfStartingDistrict + startDistricts[i] +".";
		nameOfTargetDistrict = nameOfTargetDistrict + targetDistricts[i]+".";
	}
	if (startDistricts.length-1 == k) {
		nameOfStartingDistrict = start[association.name];
	}
	if (targetDistricts.length-1 == k) {
		nameOfTargetDistrict = target[association.name];
	}
	setPathOnOneDistrict(vertices, buildingsHashMap[nameOfStartingDistrict].nodeID, buildingsHashMap[nameOfTargetDistrict].nodeID, height);
	return nameOfTargetDistrict;
}



/**
* fuegt den Weg von einem unteren District hoch zu einem oberen District hinzu
* @param: nameOfTargetDistrict: Name von dem District, bei dem man einen Schritt vorher aufgehoert hat
* @param: targetDistricts: ein Array, der Districtname von dem Ziel, aufgesplitted nach Punkten im Namen
* @param: k: die letzte Position im targetDistricts, die noch mit startDistricts uebereinstimmt
* @param: vertices: bisheriger Pfad, bestehend aus THREE.Vector3
* @param: currentDistrict: District, auf dem man den naechsten Pfad haben moechte
* @param: height: Hoehe der Linie, die als letztes gezeichnet worden ist
* @return: localDistrict: das aktualisierte District
*/
function addPathFromLowerToUpperDistrict(nameOfTargetDistrict, targetDistricts, k, vertices, currentDistrict, height){
	var localNameOfTargetDistrict = nameOfTargetDistrict + targetDistricts[k+1] + ".";
	vertices.push(new THREE.Vector3(currentDistrict._centerPosition[0], height, currentDistrict._centerPosition[2]+currentDistrict._width/2+0.1));
	height = currentDistrict._centerPosition[1]+currentDistrict._height/2+0.1;
	vertices.push(new THREE.Vector3(currentDistrict._centerPosition[0], height, currentDistrict._centerPosition[2]+currentDistrict._width/2+0.1));
	var localDistrict = currentDistrict
	
	for (var i=k+2; i<targetDistricts.length; i++) {
		setPathOnOneDistrict(vertices, localDistrict.exitNodeID, buildingsHashMap[localNameOfTargetDistrict].nodeID, height);
		
		localDistrict = buildingsHashMap[localNameOfTargetDistrict];
		localNameOfTargetDistrict = localNameOfTargetDistrict + targetDistricts[i] + ".";	
		
		vertices.push(new THREE.Vector3(localDistrict._centerPosition[0], height, localDistrict._centerPosition[2]+localDistrict._width/2+0.1));
		height = localDistrict._centerPosition[1]+localDistrict._height/2+0.1;
		vertices.push(new THREE.Vector3(localDistrict._centerPosition[0], height, localDistrict._centerPosition[2]+localDistrict._width/2+0.1));
	}
	return localDistrict;
}



/**
 * berechnet einen Weg von einem Gebaeude (start) zu einem anderen Gebaeude (target), die sich im gleichen District befinden.
 * Der Weg wird in vertices gepusht
 * @param: vertices: die Knoten, die der Weg besucht
 * @param: start: KnotenID, bei dem man starten moechte
 * @param: target: KnotenID, bei dem der Weg enden soll
 * @param: height: die Hoehe von der Linie, die gezeichnet werden soll
 */
function setPathOnOneDistrict(vertices, start, target, height) {
	var path = graph.findShortestPath(start, target);
	var currentNode;
	for (var i=0; i<path.length; i++) {
		currentNode = nodeHashMap[path[i]];
		vertices.push(new THREE.Vector3(currentNode.x, height, currentNode.z));
	}
}




/**
* berechnet die Position in den Arrays, ab dem sich die beiden unterscheiden
* @param: firstArray: das eine Array
* @param: secondArray: das andere Array
* @return: die Position k, bei dem firstArray[k] noch secondArray[k] entspricht
*/
function getLastPosOfSameEntry(firstArray, secondArray) {
	var k = 0;
	var isTheSameDistrict = true;
	while (isTheSameDistrict) {
		if (firstArray[k]==secondArray[k]) {
			k++;
		}
		else {
			isTheSameDistrict = false;
		}
	}
	return k;
}


/**
* Der letzte Schritt beim Erstellen eines Pfades zwischen zwei Gebaeuden, die auf unterschiedlichen Distrikten liegen.
* Die Methode loescht entweder einen ueberfluessigen Knoten oder fuegt noch den letzten Pfad hinzu.
* @param: targetDistricts: Der Name vom Distrikt vom Ziel als Array, aufgesplitted nach Punkten im Namen
* @param: vertices: die bisherigen gesammelten Knoten / der Pfad (ein Array, bestehend aus THREE.Vector3)
* @param: currentDistrict: Gebaeudeobjekt: Ziel-Distrikt bzw. Distrikt vom Ziel
* @param: target: das Ziel
* @param: height: die Hoehe, auf dem die Linien gezeichnet werden sollen
* @param: k: Anzahl der uebereinstimmenden Distrike von Start und Ziel
*/
function lastStepInCreatingPath(targetDistricts, vertices, currentDistrict, target, height, k) {
	if (targetDistricts.length-1 == k) {
		vertices.pop();
	}
	else {
		setPathOnOneDistrict(vertices, currentDistrict.exitNodeID, target.nodeID, height);
	}
}



/*
 * Konstruktor für einen Vorgarten
 * @param: isItLeftGarden: true, wenn es sich um einen linken Garten handelt, sonst false
 * @param: aBuilding: das Gebaeude, dessen Garten wir initialisieren moechten
 * @param: connections: ein Objekt der Form {GebaeudeID : {connections : {GebaeudeID_1: Gewichtung1, GebaeudeID_2: Gewichtung2}, sumOfConnections: SummeDerGewichtungen}}; eingehende bzw. ausgehende Verbindungen, je nachdem, ob es sich um einen rechten oder linken Garten handelt
 */
function garden(isItLeftGarden, aBuilding, connections) {
    if (!connections || connections == undefined || connections.sumOfConnections === 0) {
        connections = {
            sumOfConnections: 0,
            connections: {}
        };
    }

    return {
        building: aBuilding,
        _width: (connections.sumOfConnections > 0) ? GARDEN_WIDTH : 0,
        radius: gardenRadius,
        _height: 0.01,
        depth: (connections.sumOfConnections > 0) ? GARDEN_DEPTH : 0,
        color: connections.sumOfConnections,
        _centerPosition: [0, 0.05, 0],
        nextLinePos: [0, 0],
        on: false,
        isLeftGarden: isItLeftGarden,
        linesTo: connections.connections,
        meshLines: {}
    };
}


/*
 * Mathode zum Setzen der nächsten Position, von der aus man eine Linea zeichnen kann im Garten
 * @param: aGarden: ein Garten
 */
function setNextLinePos(aGarden) {
    var nextLineObj = computeDistancesForNextLinePos(aGarden);
    if (aGarden.nextLinePos[0] + 1 > aGarden._centerPosition[0] + nextLineObj.currentTriangleWidth) {
        if (nextLineObj.aFactor * (aGarden.nextLinePos[1] + nextLineObj.aFactor) > nextLineObj.aFactor * (aGarden._centerPosition[2] + nextLineObj.aFactor * aGarden.radius)) {
            aGarden.nextLinePos[0] = aGarden._centerPosition[0] - aGarden._width / 2 + 1;
            aGarden.nextLinePos[1] = aGarden._centerPosition[2] - nextLineObj.aFactor * (aGarden.depth - aGarden.radius) + nextLineObj.aFactor;
        } else {
            aGarden.nextLinePos[0] = aGarden._centerPosition[0] - nextLineObj.currentTriangleWidth + 1;
            aGarden.nextLinePos[1] = aGarden.nextLinePos[1] + nextLineObj.aFactor * 0.1;
        }
    } else {
        aGarden.nextLinePos[0] = aGarden.nextLinePos[0] + 0.1;
    }
}

/**
 * Hilfsmethode zum initialisieren der Variablen fuer setNextLinePos-Methoden
 * @param: aGarden: ein Garten
 * @return: ein Objekt mit den keys distancePosToPeak, currentTriangleWidth, aFactor
 */
function computeDistancesForNextLinePos(aGarden) {
    var nextLineObj = {};
    if (aGarden.isLeftGarden) {
        nextLineObj.distancePosToPeak = aGarden.depth - (aGarden.nextLinePos[1] - (aGarden._centerPosition[2] + aGarden.radius - aGarden.depth));
        nextLineObj.currentTriangleWidth = nextLineObj.distancePosToPeak * Math.tan(Math.PI / 6);
        nextLineObj.aFactor = 1;
    } else {
        nextLineObj.distancePosToPeak = aGarden.nextLinePos[1] - (aGarden._centerPosition[2] - aGarden.radius);
        nextLineObj.currentTriangleWidth = nextLineObj.distancePosToPeak * Math.tan(Math.PI / 6);
        nextLineObj.aFactor = -1;
    }
    return nextLineObj;
}

/**
 * verschiebt die NextLinePos solange, bis 5 Linien nebeneinander passen
 * @param: aGarden: ein Garten
 */
function setNextLinePosForNextPackage(aGarden) {
    var nextLineObj = computeDistancesForNextLinePos(aGarden);
    while (aGarden.nextLinePos[0] + 1.5 > aGarden._centerPosition[0] + nextLineObj.currentTriangleWidth) {
        setNextLinePos(aGarden);
    }
}

/*
 * Methode zum Setzen der GartenPosition in Abhängigkeit vom Gebaeude
 * @param: aBuilding: ein Gebaeude oder District
 */
function setGardenPos(aBuilding) {
    var right = aBuilding._rightGarden;
    var left = aBuilding._leftGarden;
    var cP = aBuilding._centerPosition;

    if (right) {
        right._centerPosition[0] = cP[0] + right._width / 2 - right.radius / 2;
        right._centerPosition[1] = cP[1] - aBuilding._height / 2 + 0.05;
        right._centerPosition[2] = cP[2] + 1 + right.radius + aBuilding._width / 2;

        right.nextLinePos[0] = right._centerPosition[0] - right._width / 2 + 1;
        right.nextLinePos[1] = right._centerPosition[2] + (right.depth - right.radius) - 1;
    }

    if (left) {
        left._centerPosition[0] = cP[0] - left._width / 2;
        left._centerPosition[1] = cP[1] - aBuilding._height / 2 + 0.05;
        left._centerPosition[2] = cP[2] + 1 + left.depth - left.radius + aBuilding._width / 2;

        left.nextLinePos[0] = left._centerPosition[0] - left._width / 2 + 1;
        left.nextLinePos[1] = left._centerPosition[2] - (left.depth - left.radius) + 1;
    }
}



/*
 * Methode, um fuer jedes Stadtteil die einzelnen Gebaeude zu positionieren und die Stadtteile auch zu positionieren
 * @param: mainDistrict: ein JSON-Objekt vom Typ district, das die Grundflaeche auch enthaelt
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function setMainDistrict(mainDistrict, namePrefix) {
    if (mainDistrict["buildings"] != undefined) {
        var buildings = mainDistrict["buildings"];
        var length = buildings.length;
        for (var i = 0; i < length; i++) {
            var b = buildings[i];
            setMainDistrict(b, namePrefix + b.name + ".");
            if (b["buildings"] != undefined) {
                setOneDistrict(b);
				b._district = namePrefix;
            }
        }
        setOneDistrict(mainDistrict, namePrefix);
    }
}



/*
 * verschiebt die Gebauede und Distrikte, sodass sie wieder aufeinander liegen
 * @param: mainDistrict: ein JSON-Objekt vom Typ district
 */
function shiftBack(mainDistrict, nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord) {
    if (mainDistrict.buildings != undefined) {
		var nodesSortByX = {};
		var nodesSortByZ = {};
        var buildings = mainDistrict.buildings;
        var width = mainDistrict._width;

        var length = mainDistrict.buildings.length;
		for (var i = 0; i < length; i++) {
			var b = buildings[i];
            setCenterPosition(
                b,
                b._centerPosition[0] - width / 2,
                b._centerPosition[1] + 1.5,
                b._centerPosition[2] - width / 2
            );
            shiftBack(b, nodesSortByX, nodesSortByZ);
        }
		if(doWeUseConnections() && doWeUseStreets()){
			var exitNodeZCoord = Math.max.apply(Math, Object.keys(nodesSortByZ));
			var exitNodeXCoord = Math.round((mainDistrict._centerPosition[0])*10000)/10000;
			if(jsonOfNodes[exitNodeXCoord]==undefined){
				jsonOfNodes[exitNodeXCoord] = {};
			}
			
			addANode(nodesSortByZ, exitNodeZCoord, exitNodeXCoord);
			
			if(jsonOfNodes[exitNodeXCoord][exitNodeZCoord]==undefined) {
				jsonOfNodes[exitNodeXCoord][exitNodeZCoord] = {x: exitNodeXCoord, z: exitNodeZCoord, id : nodeID, building: mainDistrict};
				nodeHashMap[nodeID] = jsonOfNodes[exitNodeXCoord][exitNodeZCoord];
				graph[nodeID] = {};
				nodeID++;
			}
			
			mainDistrict.exitNodeID = jsonOfNodes[exitNodeXCoord][exitNodeZCoord].id;
			createEdges(nodesSortByX, nodesSortByZ);
		}
    }
    if (doWeUseConnections()) setGardenPos(mainDistrict);
	if (doWeUseStreets()) setTheFiveStreetNodes(mainDistrict, nodesOfStreetsSortByXCoord, nodesOfStreetsSortByZCoord);
}



/*
 * Hilfsmethode zum Sortieren der Gebaeude nach Breite absteigend
 * @param: aDistrict: das Stadtteil, dessen Gebaeude sortiert werden sollen
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 * @return: das district mit einem sortierten Gebaeudearray
 */
function sortBuildings(aDistrict, namePrefix) {
    aDistrict["buildings"].sort(
        function (building1, building2) {
            initBuilding(building1, namePrefix);
            initBuilding(building2, namePrefix);
            return (getLandWidth(building2) - getLandWidth(building1));
        }
    );
    return aDistrict;
}

/*
 * Methode zur Initialisierung des Districts bzw. des Gebaeudes
 * @param: aBuilding: Das Gebaeude bzw. District, das initialisiert werden soll
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function initBuilding(aBuilding, namePrefix) {
    if (aBuilding._height == undefined) {
        var dimensions = ["height", "width", "color"];
        for (var i = 3; i--;) {
            var dim = dimensions[i];
            if (aBuilding[association[dim]] != undefined && aBuilding[association[dim]] != "") {
				if(isNaN(parseFloat(aBuilding[association[dim]]))) {
					console.log("Erwartet wurde eine Zahl. Bekommen habe ich: "+aBuilding[association[dim]]);
				}
				if(metaData["min_"+association[dim]]>2) {
					aBuilding["_" + dim] = parseFloat(aBuilding[association[dim]])/parseFloat(metaData["min_"+association[dim]]) + 1.5;
				}
				else {
					aBuilding["_" + dim] = parseFloat(aBuilding[association[dim]]) + 1.5;
				}
            } else {
                aBuilding["_" + dim] = 1.5;
            }
        }
        aBuilding._centerPosition = [0, aBuilding._height / 2, 0];
        var theLeftGarden = garden(true, aBuilding, outgoingCalls[aBuilding[association.name]]);
        var theRightGarden = garden(false, aBuilding, incomingCalls[aBuilding[association.name]]);
        aBuilding["_leftGarden"] = theLeftGarden;
        aBuilding["_rightGarden"] = theRightGarden;
        if (aBuilding[association["height"]] != undefined) {
            //updateExtrema(aBuilding[association["width"]], aBuilding[association["height"]], aBuilding[association["color"]]);
            updateExtrema(aBuilding._width, aBuilding._height, aBuilding._color);
        } else {
            aBuilding[association.name] = namePrefix;
        }
        buildingsHashMap[aBuilding[association.name]] = aBuilding;
        aBuilding._isRemoved = false;
		aBuilding._district = namePrefix;
    }
}


/*
 * Methode wird vom setMainDistrict aufgerufen
 *  Sie berechnet fuer die Gebaeude von einem Stadtteil die Position und speichert sie in buildings._centerPosition
 *  anschließend wird noch das Stadtteil vergroessert, damit alle Gebaeude auf das Stadtteil draufpassen
 * @param: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function setOneDistrict(aDistrict, namePrefix) {
    initBuilding(aDistrict, namePrefix);
    aDistrict = sortBuildings(aDistrict, namePrefix); //zunaechst muessen wir das gebaudearray sortieren absteigend nach der Breite der Boxen
    setFirstBuilding(aDistrict, namePrefix); //Initialisiert globale Variablen
    
    var length = arrayOfBuildings.length;
    for (var i = 1; i < length; i++) {
        initBuilding(arrayOfBuildings[i], namePrefix);
        if (buildingInZDirection == true) { //wenn wir gerade in Z-Richtung bauen

            if (startToBuildInZDirection > maxDepth) { //wenn wir bereits ueber den Rand (Tiefe des letzten Blocks) sind

                if (maxWidth + extension > maxDepth) { //wenn die Breite in x-Richtung groesser als in z-Richtung ist
                    continueBuildingInXDirection(i);
                } else { //wenn die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
                    buildANewBuildingRowOnTheRightInZDirection(i);
                }
            } else { //wenn wir noch nicht am Rand angekommen sind
                continueBuildingNormallyInZDirection(i);

            }
        } else { //wenn wir gerade in X-Richtung bauen (nach links)
            if (startToBuildInXDirection - getLandWidth(arrayOfBuildings[i]) >= gap) { //wenn wir noch nicht am Rand angekommen sind
                continueBuildingNormallyInXDirection(i);
            } else { //wenn eine weitere Box links nebendran nicht mehr hinpassen würde

                if (maxDepth + extension >= maxWidth) { //wenn die Tiefe gerade groesser als die Breite ist, dann baue wieder in Z-Richtung und fange rechts unten an
                    buildAgainDownOnTheRightInZDirection(i);
                } else { //wenn nicht, dann bauen wir eine Reihe obendrueber weiter nach links
                    buildANewRowOnTheTopInXDirection(i);
                }
            }
        }
    }
    aDistrict._width = width;
}

/*
 * Hilfsmethode: wenn man centerPosition von einem District aendert, aendern sich auch die
 * centerPosition von allen Districts bzw. Gebaeuden, die auf diesem District sich befinden mit
 * @param: aDistrict: das District, das gesetzt wird
 * @param: newX: neuer X-Wert
 * @param: newY: neuer Y-Wert
 * @param: newZ: neuer Z-Wert
 */
function setCenterPosition(aDistrict, newX, newY, newZ) {
    if (aDistrict["buildings"] != undefined) {
        var buildings = aDistrict["buildings"];
        var x = aDistrict._centerPosition[0];
        var y = aDistrict._centerPosition[1];
        var z = aDistrict._centerPosition[2];

        var length = buildings.length;
        for (var i = 0; i < length; i++) {
            var b = buildings[i];
            setCenterPosition(
                b,
                b._centerPosition[0] + newX - x,
                b._centerPosition[1] + newY - y,
                b._centerPosition[2] + newZ - z
                );

        }
    }
    aDistrict._centerPosition = [newX, newY, newZ];
}

/*
 * Hilfsmethode, um Code zu sparen, gibt Breite eines Grundstücks (d.h. Gebaeude und Gaerten zusammen) zurueck
 * @param: aBuilding: das Gebaeude, zu dem das Grundstueck gehoert
 * @return: Breite des Grundstuecks, das zum i-ten Gebaeude gehoert
 */
function getLandWidth(aBuilding) {
	var width = aBuilding._width;
    var left = aBuilding._leftGarden;
    var right = aBuilding._rightGarden;
	if(left._width == 0 && right._width == 0){
		return width;
	}
	else{
		return Math.max(width + 1 + left.depth,
			width + 1 + right.depth,
			left._width + right._width + 2);
	}
}


/*
 * Hilfsmethode, um xPosition von den Gebaeuden zu bestimmen
 * @param: i: i-te Eintrag in arrayOfBuildings
 */
function getXPosOfBuildingsFromLeft(i) {
    var b = arrayOfBuildings[i];
    var left = b._leftGarden;
    return (left) ? Math.max(b._width / 2, left._width + 1) : b._width / 2;
}

function getXPosOfBuildingsFromRight(i) {
    var b = arrayOfBuildings[i];
    var right = b._rightGarden;
    return (right) ? Math.max(b._width / 2, right._width + 1) : b._width / 2;
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des ersten Gebaeudes
 * @param: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
 * @param: namePrefix: Praefix vom Namen der Form "maindistrict.package1.package2."
 */
function setFirstBuilding(aDistrict, namePrefix) {
    arrayOfBuildings = aDistrict["buildings"];

    var b = arrayOfBuildings[0];
    initBuilding(b, namePrefix);
    //Setzen des ersten Elements
    setCenterPosition(
        b,
        gap + getXPosOfBuildingsFromLeft(0), (b._height) / 2,
        gap + getLandWidth(b) / 2
        );
    maxWidth = 2 * gap + getLandWidth(b); // hier startet man, in X-Richtung zu bauen
    maxDepth = maxWidth; // baut man in Z-Richtung höher als maxDepth, muss man woanders eine neue Reihe starten
    startToBuildInXDirection = maxWidth - gap; // hier startet man, in X-Richtung zu bauen
    startToBuildInZDirection = gap; // hier startet man, in Z-Richtung zu bauen
    extension = 0; //Falls maxBreiteXRichtung<maxBreiteZRichtung und wir in Z-Richtung bauen,
    // muessen wir rechts nebendran eine neue Reihe nach oben bauen
    // und diese Variable speichert die x Koordinate, an der wir weiterbauen muessen
    //analog, wenn wir in die andere Richtung bauen
    buildingInZDirection = true; // true, wenn wir gerade in Z-Richtung bauen
    lastMaxWidth = maxWidth - 3 * gap; // in einem bestimmten Fall startet man von hier aus, in X-Richtung zu bauen
    width = maxWidth; //vom aDistrict
    if (arrayOfBuildings.length > 1) {
        initBuilding(arrayOfBuildings[1], namePrefix);
        extension = getLandWidth(arrayOfBuildings[1]) + gap;
    }
}




/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
 * und die Breite in x-Richtung groesser als in z-Richtung ist
 * @param: aDistrict: Das Stadtteil, dessen Gebaeude gesetzt werden sollen
 */
function continueBuildingInXDirection(i) {
    var b = arrayOfBuildings[i];
    //bauen wir weiter in x-Richtung
    setCenterPosition(b,
        startToBuildInXDirection - getXPosOfBuildingsFromRight(i), (b._height) / 2,
        maxDepth + (1 / 2) * getLandWidth(b));
    width = Math.max(startToBuildInZDirection, maxDepth + getLandWidth(b), maxWidth + extension);
    buildingInZDirection = false;
    maxWidth = maxWidth + extension;
    extension = getLandWidth(b) + gap;
    startToBuildInZDirection = gap;
    startToBuildInXDirection = startToBuildInXDirection - getLandWidth(b) - gap;

}

/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in Z-Richtung bauen und bereits ueber den Rand (Tiefe des letzten Blocks) sind
 * und die Breite in z-Richtung groesser ist als in x-Richtung und bereits am Rand angekommen sind
 * @params: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function buildANewBuildingRowOnTheRightInZDirection(i) {
    var b = arrayOfBuildings[i];
    // Dann fangen wir rechts von der letzten Gebaeudereihe an, eine neue Gebaeudereihe aufzubauen
    setCenterPosition(b,
        maxWidth + extension + getXPosOfBuildingsFromLeft(i), (b._height) / 2, (1 / 2) * getLandWidth(b) + gap);
    width = Math.max(startToBuildInZDirection, maxWidth + extension);
    maxWidth = maxWidth + extension;
    extension = getLandWidth(b) + gap;
    startToBuildInZDirection = getLandWidth(b) + gap * 2;
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in Z-Richtung bauen und noch nicht am Rand angekommen sind
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function continueBuildingNormallyInZDirection(i) {
    var b = arrayOfBuildings[i];
    setCenterPosition(b,
        maxWidth + getXPosOfBuildingsFromLeft(i), (b._height) / 2,
        startToBuildInZDirection + (1 / 2) * getLandWidth(b));
    startToBuildInZDirection = startToBuildInZDirection + getLandWidth(b) + gap;
    width = Math.max(startToBuildInZDirection, maxWidth + extension, maxDepth);
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in X-Richtung bauen (nach links) und noch nicht am Rand angekommen sind
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function continueBuildingNormallyInXDirection(i) {
    var b = arrayOfBuildings[i];
    setCenterPosition(b,
        startToBuildInXDirection - getXPosOfBuildingsFromRight(i), (b._height) / 2,
        maxDepth + (1 / 2) * getLandWidth(b));
    width = Math.max(maxDepth + extension, maxWidth);
    startToBuildInXDirection = startToBuildInXDirection - getLandWidth(b) - gap;

}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in X-Richtung bauen (nach links) und die Tiefe gerade groesser als die Breite ist
 *  dann bauen wir wieder in Z-Richtung und fangen rechts unten an
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function buildAgainDownOnTheRightInZDirection(i) {
    var b = arrayOfBuildings[i];
    setCenterPosition(b,
        maxWidth + getXPosOfBuildingsFromLeft(i), (b._height) / 2, (1 / 2) * getLandWidth(b) + gap);
    maxDepth = maxDepth + extension;
    startToBuildInZDirection = getLandWidth(b) + gap + 2 * gap;
    startToBuildInXDirection = maxWidth - gap;
    extension = getLandWidth(b) + gap;
    buildingInZDirection = true;
    lastMaxWidth = maxWidth - 2 * gap;
    width = Math.max(maxWidth + extension, maxDepth);
}


/*
 * Hilfsmethode fuer setOneDistrict(aDistrict) fuer das setzen des i-ten Gebaeudes
 * wenn wir gerade in X-Richtung bauen (nach links) und die Breite gerade groesser als die Tiefe ist
 * dann bauen wir eine Reihe obendrueber weiter nach links
 * @param: i: der Index fuer das Gebaeude von dem arrayOfBuildings, das gesetzt werden soll
 */
function buildANewRowOnTheTopInXDirection(i) {
    var b = arrayOfBuildings[i];
    startToBuildInXDirection = lastMaxWidth + 2 * gap;
    maxDepth = maxDepth + extension;
    extension = getLandWidth(b) + gap;
    setCenterPosition(b,
        startToBuildInXDirection - getXPosOfBuildingsFromRight(i), (b._height) / 2,
        maxDepth + (1 / 2) * getLandWidth(b));
    startToBuildInXDirection = startToBuildInXDirection - getLandWidth(b) - gap;
    width = Math.max(maxWidth, maxDepth + extension);

}
