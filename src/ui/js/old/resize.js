"use strict";

ui.resize = function() {
	ui.screenWidth = document.body.clientWidth;
	ui.screenHeight = document.body.clientHeight;
	ui.gridColsWidth = ui.screenWidth - ui.filesWidth;
	ui.gridColsHeight = ui.dom.tracks.clientHeight;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.timeline.update();
	ui.tracksBg.update();
};
