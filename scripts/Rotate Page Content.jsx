var doc = app.activeDocument;

function main() {
    var sprdCnt = doc.spreads.length;

    var rotate180 = app.transformationMatrices.add({counterclockwiseRotationAngle:180});

    var myDialog = app.dialogs.add ({name: "Rotate Page Content", canCancel: true});
    with(myDialog){
        with(dialogColumns.add()) {
            with(borderPanels.add()){
                with(dialogColumns.add()) {
                    with(dialogRows.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({staticLabel: "Spreads"});
                        }
                    }
                    with(dialogRows.add()) {
                        with(dialogColumns.add()) {
                            var spreadRangeStart = integerEditboxes.add({editValue: 1});
                        }
                        with(dialogColumns.add()) {
                            staticTexts.add({staticLabel: " — "});
                        }
                        with(dialogColumns.add()) {
                            var spreadRangeEnd = integerEditboxes.add({editValue: sprdCnt});
                        }
                    }
                }
            }
            with(dialogRows.add()) {
                with(dialogColumns.add()) {
                    var rearrangeSpreadsCheckbox = checkboxControls.add({staticLabel: "Reorder Spreads", checkedState: true});
                }
            }
        }
    }

    //Show the dialog box.
    var myResult = myDialog.show() ;

    //If the user clicked OK, display one message;
    //if they clicked Cancel, display a different message.
    if (myResult == true) {

        var sprdStart = spreadRangeStart.editValue;
        var sprdEnd = spreadRangeEnd.editValue;

        // put validation things here
        if(sprdStart > 0 && sprdEnd <= sprdCnt) {
            for(var i = (sprdStart - 1); i < sprdEnd; i++) {
                var sprd = doc.spreads[i];
                var sprdPgs = sprd.pages;

                // alert(sprdPgs.length);

                if (sprdPgs.length > 1) {
                    var sprdAnchor = [[0,0], CoordinateSpaces.SPREAD_COORDINATES];
                    for (k = 0; k < sprd.pageItems.length; k++) {
                        transformFunc(sprd.pageItems[k], CoordinateSpaces.SPREAD_COORDINATES, sprdAnchor, rotate180);
                    }
                } else {
                    var pageWidth = sprdPgs[0].bounds[3];

                    alert(pageWidth);

                    var pageWidthHalved = pageWidth / 2;
                    alert(String(pageWidthHalved));
                    var pageDir = sprdPgs[0].side == PageSideOptions.LEFT_HAND;
                    var pageAnchor = [[(pageDir?-pageWidthHalved:pageWidthHalved),0], CoordinateSpaces.SPREAD_COORDINATES];

                    for (var k = 0; k < sprd.pageItems.length; k++) {
                        var pgItem = sprd.pageItems[k];
                        transformFunc(sprd.pageItems[k], CoordinateSpaces.SPREAD_COORDINATES, pageAnchor, rotate180);
                    }
                }
            }
        rearrangeSpreads(sprdStart, sprdEnd);
        } else {
            alert("Invalid range, please try again.");
        }   
    }
    else{
        // alert ("You clicked the Cancel button.");
    }
    //Remove the dialog box from memory.
    myDialog.destroy();

}

function transformFunc(item, space, anchorPoint, transformMatrix) {
    item.transform(space, anchorPoint, transformMatrix);
}

function rearrangeSpreads(rangeStart, rangeEnd) {

    if (rangeEnd - rangeStart > 0) {
        for(var i = 0; i < rangeEnd - rangeStart; i++) {
            var moveSprd = doc.spreads[rangeStart + i];
            var trgtSprd = doc.spreads[rangeEnd - i];

            // alert(moveSprd, ", ", trgtSprd);

            moveSprd.move(LocationOptions.AFTER, );
        }
    }
}

// Wraps in doScript so the entire action can be undone in 1 step
app.doScript(main,ScriptLanguage.JAVASCRIPT,[],UndoModes.ENTIRE_SCRIPT,'main');
// main();