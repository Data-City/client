var associations; //Einstellungen, die der Nutzer eingestellt hat
var camera, scene, renderer, trackballControls, orbitControls, raycaster; //WebGL-Variablen
var mainDistrict; //Json, das das District darstellt
var mouse = new THREE.Vector2(), INTERSECTED, SELECTED; //Maus-Hilfsvariablen
var extrema;//enthaelt die Extremwerte aus den Daten
var camToSave = {}; //speichert Anfangseinstellung
var useStreets; //true, wenn Straßen benutzt werden
var usingConnections; //true, wenn Verbindungen genutzt werden
var SpeedForShiftByKeys = 5; //Geschwindigkeit der Kamera bei Naviagtion ueber Pfeiltasten
var nameOfAllBuildings = []; //Array bestehend aus allen Namen der Gebaeude

var animationId = null;

var numOfCanvas = 0; //Nummer der WebGLCanvas, d.h. wie oft wurde schon auf "Stadt aktualisieren" geklickt
var ctrlIsPressed; //Hilfsvariable fuer Screenshot

/**
 * Getter fuer scene
 * @return: scene: die Scene fuer die WebGL-Canvas, auf die gezeichnet wird
 */
function getScene() {
  return scene;
}

/**
 *gibt die Extremwerte zurueck
 * @return: extreme: die Extremwerte von den Gebaeuden fuer Hoehe, Breite, Farbe, Verbindungen
 */
function getExtrema() {
  return extrema;
}

/**
*Getter fuer mainDistrict
 @return: mainDistrict: das Json fuer das District
*/
function getMainDistrict() {
  return mainDistrict;
}

/**
 *Getter fuer trackballControls
 * @return: trackballControls: die TrackballControls von THREE.js
 */
function getControls() {
  return trackballControls;
}

/**
 * wird vom Client-Team aufgerufen und fuehrt alles aus, was getan werden muss, um die Stadtansicht zu erstellen
 * @param: data: JSON vom Datenbank-Team, das fuer jedes Gebaeude die Hoehe, Breite, Farbe, etc. gespeichert hat der Form
 * { name: "", buildings: [district_1, ..., district_n]}
 * wobei ein district die Form {name: NameVomDistrict, buildings: [district_0, ..., district_m]}
 * oder die Form {name: eineID, HoehenDimension: h, BreitenDimension: b, FarbenDimension: f}
 * @param: association: JSON fuer die Legende, damit man weiss, dass z.B. die Breite der Anzahl Methoden entspricht der Form
 * {name: {name : DimensionName}, area: {name: DimensionFlaeche}, height: {name: DimensionHoehe}, color: {name: DimensionFarbe}}
 * @param: nameOfDivElement: Name vom Div-Element
 * @param: settings: undefined oder ein JSON zum Wiederaufrufen einer bestimmten Ansicht, siehe setSpecificView()
 * @param: incomingCalls: JSON fuer die eingehenden Verbindungen, siehe getIncomingConnections(...) oder undefined
 * @param: outgoingCalls: JSON fuer die ausgehenden Verbindungen, siehe getOutgoingConnections(...) oder undefined
 * @param  function setLoaderSettings Funktion, mit der sich Nachricht und Prozent der Ladeanzeige setzen lassen
 */
function drawCity(data, association, nameOfDivElement, settings, incomingCalls,
  outgoingCalls, setLoaderSettings) {
  if (!Detector.webgl) Detector.addGetWebGLMessage(); //Fehlermeldung, falls Browser kein WebGL unterstuetzt

  init(nameOfDivElement, incomingCalls, outgoingCalls); //bereitet WebGLCanvas vor

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);
  initData(data, association, incomingCalls, outgoingCalls);
  setLoaderSettings("Zeichne Stadt...", 70);
  setAndDrawCity(mainDistrict, false);
  setLoaderSettings("Setze Kamera und starte Animation...", 90);

  // Erstelle die Legende
  if (Detector.webgl) {
    var ourDivElement = document.getElementById(nameOfDivElement);
    if (ourDivElement.children["dropdownmenu"]) {
      ourDivElement.removeChild(ourDivElement.children["dropdownmenu"]);
    }
    setMenue(scene, mainDistrict, camera, orbitControls, trackballControls,
      nameOfDivElement);
  }
  updateControls(Math.max(mainDistrict._width, extrema.maxHeight));
  animate();
  saveCamera();
  goToInitialView();
  setLoaderSettings("Fertig!", 100);
  if (settings != undefined) {
    setSpecificView(settings);
  }
}


/**
 * setzt und zeichnet die Stadt
 * @param: mainDistrict: District, das dargestellt werden soll
 * @param: scaling: boolean, true, wenn wir skalieren wollen
 * @param: scalingString: width, height oder color, jenachdem, was man skalieren will (angeben, wenn scaling true)
 * @param: scalingExtrema: die Skalierungsmethode (angeben, wenn scaling true);
 */
function setAndDrawCity(mainDistrict, scaling, scalingString, scalingExtrema) {
  // diese Methode setze die Gebaueden und Stadtteile einigermaßen vernuenftig
  setMainDistrict(mainDistrict, "");
  shiftBack(mainDistrict, {}, {}, (-1) * getDistrictHeight() / 2);
  if (usingConnections) setGraph();

  if (scaling) {
    scalingExtrema(scalingString);
  }

  //zeichnen nun auch die Stadt
  addCityToScene(mainDistrict, scene, camera, extrema);
}


/**
 * Getter fuer usingConnections
 * @return: true, wenn Verbindungen dargestellt werden sollen, sonst false
 */
function doWeUseConnections() {
  return usingConnections;
}


/**
 * Hilfsmethode bereitet Daten wie Legende, MainDistrict und Verbindungen vor
 * @param: data: die Daten, die an drawCity gehen
 * @param: association: die Legende und sonstige Einstellungen, die an drawCity gehen
 * @param: incomingCalls: eingehende Verbindungen
 * @param: outgoingCalls: ausgehende Verbindungen
 */
function initData(data, association, incomingCalls, outgoingCalls) {
  setMetaData(association.metaData);

  usingConnections = association.useConnections;

  initAssociation(association);
  initMainDistrict(data, association);

  if (usingConnections) {
    setCalls(getIncomingConnections(incomingCalls), getOutgoingConnections(
      outgoingCalls));
    if (association.typeOfConnections === "1") {
      useStreets = true;
    } else {
      useStreets = false;
    }
  }
}

/**
 * Hilfsmethode, um die Legende richtig vorzubereiten
 * @param: association: die vom Client uebergebene Legende
 */
function initAssociation(association) {
  association.dimensions.width = association.dimensionSettings.area.name;
  association.dimensions.name = association.dimensionSettings.name.name;
  association.dimensions.color = association.dimensionSettings.color.name;
  association.dimensions.height = association.dimensionSettings.height.name;
  setAssociation(association["dimensions"]);
  associations = association;

  if (association.experimentalMode) {
    experimentalMode = true;
  }

  useConnections = association.useConnections;
  drawGardens = association.drawGardens;
  logScaling = association.logScaling;

  gap = 20 * Math.sqrt(association.dimensionSettings.area.numberValueFilter[1]) /
    metaData["avg_" + association.dimensions.area];

  districtHeight = 1.5 * Math.sqrt(association.dimensionSettings.area.numberValueFilter[
    1]) / Math.sqrt(metaData["avg_" + association.dimensions.area]);

  setBuildingColor(association.buildingcolor);
}

/**
 * initialisiert mainDistrict je nachdem, welche Blockbildung gefordert ist
 * @param: association: hierin wird der Districttyp gespeichert
 */
function initMainDistrict(data, association) {
  if (association.districtType == "0") { //Falls keine Blockbildung
    mainDistrict = {
      buildings: data,
    };
  } else if (association.districtType == "1") { //Falls Blockbildung mit Punkten
    mainDistrict = createMainDistrict(data[0].buildings, association.dimensions);
  } else {
    mainDistrict = data[0];
  }
  nameOfAllBuildings = [];
  setNameOfAllBuildings(mainDistrict);
}


/**
 * initialisiert nameOfAllBuildings, setzt es gleich mit einem Array, das aus den Namen der Gebaeude besteht
 *@param: aDistrict: Das Distrikt, dessen Gebäudenamen alle in nameOfAllBuildings gespeichert werden soll
 */
function setNameOfAllBuildings(aDistrict) {
  if (aDistrict.buildings == undefined) {
    nameOfAllBuildings.push(aDistrict[associations.dimensions.name]);
  } else {
    for (var i = 0; i < aDistrict.buildings.length; i++) {
      setNameOfAllBuildings(aDistrict.buildings[i]);
    }
  }
}


/**
 * Getter fuer useStreets
 * @return: true, wenn die Strassen benutzt, false, wenn nicht
 */
function doWeUseStreets() {
  return useStreets;
}


/**
 *speichert Kameraeinstellung
 */
function saveCamera() {
  camToSave.position = camera.position.clone();
  camToSave.rotation = camera.rotation.clone();
  camToSave.target = orbitControls.target.clone();
}

/**
 * Getter fuer Kameraeinstellung
 * @return: camToSave: die gespeicherte (Anfangs-)Kameraeinstellung
 */
function getCamToSave() {
  return camToSave;
}




/**
 * Fügt Listener für einen Screenshot hinzu
 */
window.addEventListener("keydown", function(e) {
  var imgData, imgNode;

  if (e.which == 16) {
    ctrlIsPressed = true;
  }

  //Druck auf 'Pos1'
  if (e.which == 13 && ctrlIsPressed) {
    e.preventDefault();
    try {
      imgData = renderer.domElement.toDataURL();
    } catch (e) {
      console.log(
        "Browser does not support taking screenshot of 3d context");
      return;
    }

    imgNode = document.createElement("img");
    imgNode.src = imgData;

    var myWindow = window.open("", "");
    myWindow.document.write("<div id='imageDownload'></div>");
    myWindow.document.getElementById('imageDownload').appendChild(imgNode);
  }
});

/**
 * HilfsEventListener fuer Screenshot
 */
window.addEventListener("keyup", function(e) {
  if (e.which == 16) {
    ctrlIsPressed = false;
  }
});

/**
 * Navigation über die Pfeiltasten
 */
window.addEventListener("keydown", function(e) {
  //Pfeiltaste links
  if (e.which === 37) {
    e.preventDefault();
    try {
      shiftCam(37);
    } catch (e) {
      console.log("Die Navigation über die Pfeiltasten lief schief!");
      return;
    }
  }

  //Pfeiltaste hoch
  if (e.which === 38) {
    e.preventDefault();
    try {
      shiftCam(38);
    } catch (e) {
      console.log("Die Navigation über die Pfeiltasten lief schief!");
      return;
    }
  }

  //Pfeiltaste rechts
  if (e.which === 39) {
    e.preventDefault();
    try {
      shiftCam(39);
    } catch (e) {
      console.log("Die Navigation über die Pfeiltasten lief schief!");
      return;
    }
  }

  //Pfeiltaste runter
  if (e.which === 40) {
    e.preventDefault();
    try {
      shiftCam(40);
    } catch (e) {
      console.log("Die Navigation über die Pfeiltasten lief schief!");
      return;
    }
  }
});


/**
 * verschiebt die Kamera und das Target durch Druecken auf eine Taste
 * @param: theKey: 37 fuer links, 38 fuer hoch, 39 fuer rechts, 40 fuer runter
 */
function shiftCam(theKey) {
  var shiftingVector = getShiftingVector(theKey);
  var lengthOfshiftingVector = Math.sqrt(Math.pow(shiftingVector.x, 2) + Math.pow(
    shiftingVector.z, 2));
  shiftingVector.x = shiftingVector.x * SpeedForShiftByKeys /
    lengthOfshiftingVector;
  shiftingVector.z = shiftingVector.z * SpeedForShiftByKeys /
    lengthOfshiftingVector;
  camera.position.x = camera.position.x - shiftingVector.x;
  camera.position.z = camera.position.z - shiftingVector.z;
  trackballControls.target.x -= shiftingVector.x;
  trackballControls.target.z -= shiftingVector.z;
}

/**
 * Hilfsmethode fuer ShiftCam, gibt den Normalenvektor von dem Verbindungsvektor der Kamera zum Target
 * @param: theKey: 37 fuer links, 38 fuer hoch, 39 fuer rechts, 40 fuer runter
 * @return: shiftingVector: der Vektor, um den die Kamera und der Target verschoben werden sollen
 */
function getShiftingVector(theKey) {
  var x = trackballControls.target.x - camera.position.x;
  var z = trackballControls.target.z - camera.position.z;
  var shiftingVector;
  if (theKey == 39) {
    if (x < 0) {
      shiftingVector = {
        x: -z / x,
        z: 1
      };
    } else if (x > 0) {
      shiftingVector = {
        x: z / x,
        z: -1
      };
    } else {
      shiftingVector = {
        x: -1,
        z: 0
      };
    }
  } else if (theKey == 38) {
    shiftingVector = {
      x: -x,
      z: -z
    };
  } else if (theKey == 37) {
    if (x < 0) {
      shiftingVector = {
        x: z / x,
        z: -1
      };
    } else if (x > 0) {
      shiftingVector = {
        x: -z / x,
        z: 1
      };
    } else {
      shiftingVector = {
        x: 1,
        z: 0
      };
    }
  } else {
    shiftingVector = {
      x: x,
      z: z
    }
  }
  return shiftingVector;
}


/**
 * Methode, um aus einem Array aus Gebaeuden Districts zu erstellen, die nach Packagenamen sortiert sind
 * @param: data: das Array, das aus den Gebaeuden besteht
 * @param: association: die Legende
 * @return: das Objekt, das aus District besteht
 */
function createMainDistrict(data, association) {
  var district = {};
  var splitString, currentDistrict;

  var length = data.length;
  for (var i = length; i--;) {
    currentDistrict = district;
    splitString = data[i][association.name].toString().split(".");
    for (var j = 0; j < splitString.length - 1; j++) {
      if (currentDistrict[splitString[j]] == undefined) {
        currentDistrict[splitString[j]] = {};
      }
      currentDistrict = currentDistrict[splitString[j]];
    }
    if (currentDistrict.buildings == undefined) {
      currentDistrict.buildings = [data[i]];
    } else {
      currentDistrict.buildings.push(data[i]);
    }
  }
  district = getMainDistrictFromJSON(district);
  return district;
}

/**
 *rekursive Hilfsmethode, um aus dem Objekt, was in createMainDistrict erstellt wurde, ein Stadtobjekt zu erstellen
 *@params: aDistrict: ein Teil vom Objekt, was in createMainDistrict erstellt wurde
 *@return: ein Stadtobjekt
 */
function getMainDistrictFromJSON(aDistrict) {
  var toReturn = {
    buildings: []
  };
  var buildings = toReturn.buildings;
  for (var x in aDistrict) {
    if (x == "buildings") {
      var length = aDistrict.buildings.length;
      for (var i = length; i--;) {
        buildings.push(aDistrict.buildings[i]);
      }
    } else {
      buildings.push(getMainDistrictFromJSON(aDistrict[x]));
      buildings[toReturn.buildings.length - 1].name = x;
    }
  }
  return toReturn
}

/**
 * aktualisiert die alten Extremwerte, wenn man die neuen Werte breite, hoehe, farbe sieht
 * @param: width: Breite, die evtl. geupdatet werden soll
 * @param: height: Hoehe, die ggf. geupdatet werden soll
 * @param: color: Farbe, die ggf. geupdatet werden soll
 */
function updateExtrema(width, height, color) {
  if (width > extrema.maxWidth) extrema.maxWidth = width;
  if (height > extrema.maxHeight) extrema.maxHeight = height;
  if (color > extrema.maxColor) extrema.maxColor = color;
  if (width < extrema.minWidth) extrema.minWidth = width;
  if (height < extrema.minHeigth) extrema.minHeigth = height;
  if (color < extrema.minColor) extrema.minColor = color;
}



/**
 *Initialisiert das Bild, d.h. malt die Zeichenflaeche, erstellt die Kamera, setzt das Licht,
 *aktiviert das Beobachten der Mausaktivitaeten und das Zoomen, Drehen, Verschieben
 * @param: nameOfDivElement: der Name vom Div-Element
 * @param: incomingCalls: undefined oder eingehende Verbindungen, Form siehe getIncomingConnections(...)
 * @param: outgoingCalls: undefined oder ausgehende Verbindungen, Form siehe getOutgoingConnections(...)
 */
function init(nameOfDivElement, incomingCalls, outgoingCalls) {
initGlobalVariables();
	extrema = {
	  maxWidth: 0,
	  maxHeight: 0,
	  maxColor: 0,
	  maxConnections: 0,
	  maxSumOfConn: 0,
	  minWidth: Number.MAX_VALUE,
	  minHeigth: Number.MAX_VALUE,
	  minColor: Number.MAX_VALUE,
	  minConnections: Number.MAX_VALUE,
	  minSumOfConn: Number.MAX_VALUE
	};

  // Erstelle einen neuen Renderer
  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true // required to support .toDataURL()
  });

  //renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xbdbdbd); //0x222222);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //Hinzufügen von dem renderer-Element zu unserem HTML-Dokument

  renderer.domElement.id = "WebGLCanvas"+numOfCanvas;
  document.getElementById(nameOfDivElement).innerHTML = "";
  document.getElementById(nameOfDivElement).appendChild(renderer.domElement);
  scene = new THREE.Scene();

  //erstelle Kamera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
    1, 1000000);
  camera.position.set(0, 10, 30);
  setCamera(camera);

  //Lichtquellen setzen
  setLight(scene);

  raycaster = new THREE.Raycaster();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

  //Zum Zoomen, Drehen, Verschieben
  setControls();
}


/**
 * entfernt die WebGLCanvas als Dom-Element
 */
function removeWebGLCanvasFromDomElement(nameOfDivElement) {
  var myNode = document.getElementById(nameOfDivElement);
  if (myNode && document.getElementById("WebGLCanvas"+numOfCanvas)) {

    var obj;
    //Alle Objekte von der Szene löschen
    for (var i = scene.children.length - 1; i >= 0; i--) {
      obj = scene.children[i];
      scene.remove(obj);
    }
    //Das WebGL Canvas von dem DOM-Element löschen
    myNode.removeChild(document.getElementById("WebGLCanvas"+numOfCanvas));
	numOfCanvas++;
  };
}

/**
 *schaut regelmäßig, ob was passiert und updatet und zeichnet neu
 */
function animate() {
  // update
  orbitControls.update();
  trackballControls.update();
  //malt neu
  render();

  // schaut, ob was passiert ist
  animationId = requestAnimationFrame(animate);
  

}


/**
 *Methode zum Setzen der trackballControls fuer das Zoomen, Drehen, Verschieben
 */
function setControls() {
  // für das Zoomen und Verschieben
  trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
  trackballControls.minDistance = 10;
  trackballControls.noRotate = true;
  trackballControls.zoomSpeed = 1;

  //fuer das Drehen
  orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.5;
  orbitControls.enableZoom = false;
  orbitControls.rotateSpeed = 1;
  orbitControls.noPan = true;
  orbitControls.enableKeys = false;
}

/**
 *Getter fuer OrbitControls
 * @return: orbitControls
 */
function getOrbitControls() {
  return orbitControls;
}


/**
 *update vom maximalen Abstand fuer den Zoom, damit man noch die hoechsten Gebaeude sehen kann
 *@param maxDistance: der Abstand zum Koordinatenursprung, zu dem man maximal wegzoomen kann
 */
function updateControls(maxDistance) {
  trackballControls.maxDistance = maxDistance * 2.2;
}


/**
 *wenn ein Link fuer eine spezielle Ansicht aufgerufen wurde, wird diese Methode aufgerufen,
 * um die alte Ansicht (mit Kameraposition etc.) wiederherzustellen, nachdem drawCity(...) aufgerufen wurde
 * @param: das Json, das im Link gespeichert worden ist der Form
 *{"position": {"x": xCamPos, "y": yCamPos, "z": zCamPos},
 * "rotation": {"_x": xRotation, "_y": yRotation, "_z": zRotation, "_order": "XYZ" },
 * "target": { "x": xPanPos,"y": yPanPos,"z": zPanPos},
 * "leftGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 * "rightGarden": ArrayAusIDsDerGebaeudenMitAngeklicktenGaerten,
 * "scaling": { "logarithmicHeight": boolean,"logarithmicWidth": boolean,"logarithmicColor": boolean},
 * "removedBuildings": ArrayAusIDsDerGeloeschtenGebaeuden,
 * "changedLegend": {"Name": "Package","Breite": "Klassen","Höhe": "Methoden","Farbe": "Zeilen" },
 * "collID": CollectionID,
 * "_id": AnsichtsID};
 */
function setSpecificView(aJson) {
  var gui = getGui();

  var hashMap = getBuildingsHashMap();

  if (experimentalMode) {
    setScalingBooleans(aJson.scaling);
    var scaleArray = ["height", "width", "color"];
    var i = 0;
    for (var x in aJson.scaling) {
      if (aJson.scaling[x]) {
        gui.__folders["Skalierung"].__controllers[i].setValue(true);
        scale(true, scaleArray[i], scene, mainDistrict, camera, extrema);
      }
      i++;
    }
  }

  drawStoredLines(aJson);

  setChangedLegend(aJson.changedLegend);
  var myDimensions = ["Name", "Breite", "Höhe", "Farbe"];

  for (var i = 0; i < 4; i++) {
    gui.__folders["Legende"].__controllers[i].setValue(aJson.changedLegend[
      myDimensions[i]]);
  }

  incomingConnections = aJson.connections.incomingConnections;
  outgoingConnections = aJson.connections.outgoingConnections;
  highlightBuildingsConnections = aJson.connections.highlightBuildingsConnections;
  gui.__folders["Verbindungen"].__controllers[0].setValue(
    highlightBuildingsConnections);
  gui.__folders["Verbindungen"].__controllers[1].setValue(
    incomingConnections);
  gui.__folders["Verbindungen"].__controllers[2].setValue(
    outgoingConnections);

  setCameraPosForLink(camera, aJson);
}

/**
 * Hilfsmethode, um gespeicherte Linien wieder zu zeichnen
 * @param: aJson: aJson.leftGarden und aJson.rightGarden soll ein Array aus GebaeudeIDs sein, dessen Gaerten gezeichnet werden soll
 */
function drawStoredLines(aJson) {
  var hashMap = getBuildingsHashMap();
  var stringArray = ["leftGarden", "rightGarden"];
  for (var j = 0; j < stringArray.length; j++) {
    for (var i = 0; i < aJson[stringArray[j]].length; i++) {
      setGardenOn(hashMap[aJson[stringArray[j]][i]]["_" + stringArray[j]]);
    }
  }
  setClickedGardens(aJson);
}


/**
 *Getter fuer associations
 *@return: associations: die Zuordnungen
 */
function getOriginalAssociations() {
  return associations;
}


/**
 * Methode bekommt ein JSON-Objekt fuer die Verbindungen und schreibt es so um, dass man nachher besser mit arbeiten kann
 * @param: connectionData: Json der Form
 * {"connections" : [
 *    { "Ziel": GebaeudeID_1,
 *     "incomingConnections": [{"Start" : GebaeudeID_2, "Gewichtung" : g1},{"Start" : GebaeudeID_3, "Gewichtung" : g2}],
 *     "Gewichtung" : Summe_der_Verbindungen
 *    },
 *    etc.]}
 * @return neues JSON fuer Verbindungen
 */
function getIncomingConnections(connectionData) {
  var newJson = {};
  var ithConn;
  var toSubstract;
  for (var i = 0; i < connectionData.connections.length; i++) {
    ithConn = connectionData.connections[i];
    if (nameOfAllBuildings.indexOf(ithConn.Ziel) > -1) {
      toSubstract = 0;
      newJson[ithConn.Ziel] = {};
      newJson[ithConn.Ziel].connections = {};
      for (var j = 0; j < ithConn.incomingConnections.length; j++) {

        if (nameOfAllBuildings.indexOf(ithConn.incomingConnections[j].Start) >
          -1) {
          if (ithConn.incomingConnections[j].Gewichtung > 0) {
            newJson[ithConn.Ziel].connections[ithConn.incomingConnections[j].Start] =
              ithConn.incomingConnections[j].Gewichtung;
            updateConnectionExtrema(ithConn.incomingConnections[j].Gewichtung,
              "Connections");
          }
        } else {
          toSubstract = toSubstract + ithConn.incomingConnections[j].Gewichtung;
        }
      }
      newJson[ithConn.Ziel].sumOfConnections = ithConn.Gewichtung - toSubstract;
      updateConnectionExtrema(ithConn.Gewichtung, "SumOfConn");
    }
  }
  return newJson;
}

/**
 * Methode bekommt ein JSON-Objekt fuer die Verbindungen und schreibt es so um, dass man nachher besser mit arbeiten kann
 * @param: connectionData: Json der Form
 * {"connections" : [
 *    { "Ziel": GebaeudeID_1,
 *     "outgoingConnections": [{"Start" : GebaeudeID_2, "Gewichtung" : g1},{"Start" : GebaeudeID_3, "Gewichtung" : g2}],
 *     "Gewichtung" : Summe_der_Verbindungen
 *    },
 *    etc.]}
 * @return neues JSON fuer Verbindungen
 */
function getOutgoingConnections(connectionData) {
  var newJSON = {};
  var ithConn;
  var toSubstract;
  for (var i = 0; i < connectionData.connections.length; i++) {
    ithConn = connectionData.connections[i];
    toSubstract = 0;
    if (nameOfAllBuildings.indexOf(ithConn.Start) > -1) {
      newJSON[ithConn.Start] = {};
      newJSON[ithConn.Start].connections = {};
      for (var j = 0; j < ithConn.outgoingConnections.length; j++) {
        if (nameOfAllBuildings.indexOf(ithConn.outgoingConnections[j].Ziel) > -
          1) {
          if (ithConn.outgoingConnections[j].Gewichtung > 0) {
            newJSON[ithConn.Start].connections[ithConn.outgoingConnections[j].Ziel] =
              ithConn.outgoingConnections[j].Gewichtung;
          }
        } else {
          toSubstract = toSubstract + ithConn.outgoingConnections[j].Gewichtung;
        }
      }
      newJSON[ithConn.Start].sumOfConnections = ithConn.Gewichtung -
        toSubstract;
      updateConnectionExtrema(ithConn.Gewichtung, "SumOfConn");
    }
  }
  return newJSON;
}


/**
 * aktualisiert in extrema die min- bzq. maxConnections bzw. -SumOfCon
 * @param: weight: die Gewichtung von der Verbindung, die bei extrema aktualisiert werden soll
 * @param: string: "Connections" oder "SumOfConn"
 */
function updateConnectionExtrema(weight, string) {
  if (extrema["max" + string] < weight) {
    extrema["max" + string] = weight;
  }
  if (extrema["min" + string] > weight && weight > 0) {
    extrema["min" + string] = weight;
  }
}



/**
 *berechnet die Position von der Maus
 *@param: event: das Event wie Maus faehrt ueber Bildschirm
 */
function onDocumentMouseMove(event) {
  changeLinkForCurrentView(getJsonForCurrentLink());

  event.preventDefault();
  var rect = getScrollDistance(document.getElementById("WebGLCanvas"+numOfCanvas));

  if (rect) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1 - (rect.left / window
      .innerWidth) * 2;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 + (rect.top /
      window.innerHeight) * 2;
  }
}



/**
 *Eine Methode, um den Abstand von einem DivElement zum linken bzw. oberen Rand des Fensters zu bekommen
 *@param: ein DivElement
 *@return: JSON, sodass man mit JSON.left den Abstand zum linken Rand in px bekommt
 *            bzw. mit JSON.top den Abstand zum oberen Rand
 */
function getScrollDistance(divElement) {
  if (divElement) {
    var rect = divElement.getBoundingClientRect();
    if (divElement) {
      return {
        left: rect.left,
        top: rect.top
      };
    }
  }

}

/**
 *Wird ausgefuehrt, wenn man mit der Maus klickt
 */
function onDocumentMouseDown(event) {

  event.preventDefault();

  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  vector.unproject(camera);
  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects(targetList);
  // if there is one (or more) intersections
  if (intersects.length > 0 && intersects[0].material == undefined) { //prueft, dass es keine Linie ist, sondern Garten oder Gebaeude
	var i=0;
	var bool = true;
	while (i<intersects.length && bool) {
		if(intersects[i].face.numOfCanvas == numOfCanvas) {
			if (intersects[i].face.isLeftGarden != undefined) { //d.h. bei Klick auf einen Garten
			  var theGarden = getGarden(intersects[i]);
			  clickOnGarden(theGarden);
			} else {
			  var buildingID = intersects[i].object.geometry.faces[intersects[i].faceIndex].building;
			  if (buildingID != undefined) {
				var b = getBuildingsHashMap()[buildingID];
				changeBuildingInformation(
				  b[association["height"]],
				  b[association["width"]],
				  b[association["color"]],
				  b[association["name"]],
				  intersects[i]
				);
				if (outgoingConnections === true) {
				  var theGarden = b._rightGarden;
				  if (theGarden.color > 0) clickOnGarden(theGarden);
				};
				if (incomingConnections === true) {
				  var theGarden = b._leftGarden;
				  if (theGarden.color > 0) clickOnGarden(theGarden);
				};
			  }
			}
			bool = false;
	
		}
		else {
			i++;
		}
	}
  }
}

/**
 * je nachdem, ob der Garten gerade an oder aus ist, wird er aus- bzw. angeschaltet
 * @param: theGarden: der Garten, der an- bzw. ausgeschaltet werden soll
 */
function clickOnGarden(theGarden) {
  if (theGarden.on == false) {
    setGardenOn(theGarden);
  } else {
    setGardenOff(theGarden);
  }
}
