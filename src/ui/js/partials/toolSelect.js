"use strict";

ui.tool.select = {
	init: function() {
		ui.dom.squareSelection.remove();
	},
	mousedown: function( e ) {
		var smpobj = e.target.smpobj;

		if ( !e.shiftKey ) {
			waFwk.do( "unselectAllSamples" );
		}
		if ( smpobj ) {
			ui.tool.select._smpDown = smpobj;
			ui.tool.select._smpDownSelected = e.shiftKey ? !smpobj.selected : true;
			smpobj.userData.select( ui.tool.select._smpDownSelected );
		}
	},
	mouseup: function( e ) {
		var that = ui.tool.select,
			elRect = ui.dom.squareSelection;

		if ( elRect.parentNode ) {
			if ( that._smpSelected.length > 0 ) {
				that._smpSelected.forEach( function( smp ) {
					delete smp.userData._selectionId;
				} );
				waFwk.do( "selectSamples", that._smpSelected.slice() );
				that._smpSelected.length = 0;
			}
			elRect.remove();
			elRect.style.top = "-1000000px";
		} else if ( that._smpDown ) {
			waFwk.do( that._smpDownSelected
				? "selectSamples" : "unselectSamples",
				[ that._smpDown ] );
			that._smpDown = null;
		}
	},
	mousemove: function( e ) {
		var that = ui.tool.select,
			elRect = ui.dom.squareSelection;

		if ( elRect.parentNode ) {
			var track = ui.grid.getTrackByPageY( ui.mousemovePageY ),
				trackId = track ? track.id : 0,
				trackMin = Math.min( that._trackId, trackId ),
				trackMax = Math.max( that._trackId, trackId ),
				beat = Math.max( 0, ui.mousemoveBeat ),
				beatMin = Math.min( ui.mousedownBeat, beat ),
				beatMax = Math.max( ui.mousedownBeat, beat );

			waFwk.sampleGroup.samples.forEach( function( smp ) {
				if ( trackMin <= smp.track.id && smp.track.id <= trackMax ) {
					var beatB,
						beatA = smp.when,
						src = smp.source,
						dur = smp.duration != null ? smp.duration : src.duration;

					if ( !src.samples ) {
						dur *= waFwk.bpm / 60;
					}
					beatB = beatA + dur;
					if ( ( beatMin <= beatA && beatA < beatMax ) ||
						( beatMin < beatB && beatB <= beatMax ) ||
						( beatA <= beatMin && beatMax <= beatB )
					) {
						if ( !smp.selected && !smp.userData._selectionId ) {
							smp.userData._selectionId = that._selectionId;
							smp.userData.select( true );
							that._smpSelected.push( smp );
						}
						return;
					}
				}
				if ( smp.userData._selectionId === that._selectionId ) {
					delete smp.userData._selectionId;
					smp.userData.select( false );
					that._smpSelected.splice( that._smpSelected.indexOf( smp ), 1 );
				}
			} );
			elRect.style.width = ( beatMax - beatMin ) + "em";
			elRect.style.height = ( trackMax - trackMin + 1 ) * ui.trackHeight + "px";
			elRect.style.left = beatMin + "em";
			elRect.style.top = trackMin * ui.trackHeight + "px";
		} else if ( 5 < Math.max(
			Math.abs( ui.mousemovePageX - ui.mousedownPageX ),
			Math.abs( ui.mousemovePageY - ui.mousedownPageY )
		) ) {
			that._smpDown = null;
			that._dragging = true;
			that._trackId = ui.grid.getTrackByPageY( ui.mousedownPageY ).id;
			ui.dom.gridcontent.appendChild( elRect );
			++that._selectionId;
		}
	},

	// private:
	_smpSelected: [],
	_selectionId: 0
};
