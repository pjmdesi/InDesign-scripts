// This script adds a rectangle to the artboard for each swatch selected in the swatches panel.
// This was made for the purposes of easily producing a style guide containing swatch colors to be used in other applications such as Sketch and Figma.

var doc = app.activeDocument;
var selSwa = doc.swatches.getSelected();
var swaCnt = selSwa.length

addRects();

function addRects() {
    if (swaCnt > 1) {
        var rect;
        var swLayer = doc.layers.add()
        for (i=0;i<swaCnt;i++) {
    
            rect = swLayer.pathItems.rectangle(50,50+(i*50),40,40);
    
            rect.filled = true;
            rect.fillColor = selSwa[i].color;
            rect.name = selSwa[i].name
        }
    }
}