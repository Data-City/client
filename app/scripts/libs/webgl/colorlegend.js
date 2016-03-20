function ColorLegend(min, max) {

    var colorYellowBright = '0xFFA500';
    var colorYellowDark = '0xFF0000';
    var colorMap = [
        [0.0, colorYellowDark],
        [1.0, colorYellowBright]
    ];
    //var colorMap = [ [ 0.0, '0x0000FF' ], [ 0.2, '0x00FFFF' ], [ 0.5, '0x00FF00' ], [ 0.8, '0xFFFF00' ],  [ 1.0, '0xFF0000' ] ];
    var lut = new THREE.Lut('rainbow', 5);
    lut.addColorMap('connections', colorMap);
    lut.changeColorMap('connections');
    lut.setMin(min);
    lut.setMax(max);


    this.draw = function(scene) {
        scene.add(lut.setLegendOn({
            'layout': 'horizontal'
        }));
        var labels = lut.setLegendLabels({
            'title': 'Verbindungen',
            'ticks': 2
        });
        scene.add(labels['title']);

        for (var i = 0; i < Object.keys(labels['ticks']).length; i++) {
            scene.add(labels['ticks'][i]);
            scene.add(labels['lines'][i]);
        }
    }
}
