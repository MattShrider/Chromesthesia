$(".DialogBox").draggable();
$( "#WelcomeBox" ).dialog({
	dialogClass: "no-close",
	width: 375,
    modal: true,
    resizable: false,
    buttons: {
    	"Load Youtube": function(){
    		$(this).dialog("close");
    		loadYoutube();
    	},
      	"Load SoundCloud": function(){
      		$(this).dialog("close");
      		loadSoundCloud();
      	},
      	"Upload Song": function(){
      		$(this).dialog("close");
      		uploadSong();
      	},
      	"Load Sample": function(){
      		$(this).dialog("close");
      		loadSample();
      	}
    }
});
/* Slide to the left, and make it model (you'll have to call $.pageslide.close() to close) */
$(".advance-controls").pageslide({ direction: "right", modal: true });


//Functions that are for the Welcome Dialog Box
function loadYoutube(){
	$( "#YoutubeLink" ).dialog({
		dialogClass: "no-close",
		width: 375,
    	modal: true,
    	resizable: false,
    	buttons: {
    		"Load": function(){
      			$(this).dialog("close");
      			
      		}
    	}
	});
}
function loadSoundCloud(){
	$( "#SoundCloudLink" ).dialog({
		dialogClass: "no-close",
		width: 375,
    	modal: true,
    	resizable: false,
    	buttons: {
    		"Load": function(){
      			$(this).dialog("close");
      			
      		}
    	}
	});
	
}
function uploadSong(){
	$( "#LocalUpload" ).dialog({
		dialogClass: "no-close",
		width: 375,
    	modal: true,
    	resizable: false,
    	buttons: {
    		"Load": function(){
      			$(this).dialog("close");
      			
      		}
    	}
	});
}
function loadSample(){
	alert("Loading Sample Song...");
}