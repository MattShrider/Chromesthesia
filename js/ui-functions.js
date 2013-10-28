var songQueue = [];
var currentSong = 0;

//Makes Dialog Boxes Draggable
$(".DialogBox").draggable();

/* Slide to the left, and make it model (you'll have to call $.pageslide.close() to close) */
$(".advance-controls").pageslide({ direction: "right", modal: true });

$(".Close").click(function(){
	$(this).parent().hide();
	$("#ControlBox").show();
});

//Functions on what happens when each button is clicked
$("#LocalButton").click(function(){
	$('input[type=file]').click();
});

$("#RemoteButton").click(function(){
	$("#WelcomeBox").hide();
	$("#LoadRemoteDialog").show();
});

$("#RemoteSubmit").click(function(){
	$("#LoadRemoteDialog").hide();
	loadClientSong($("#RemoteURL").val());
	$("#ControlBox").show();
});

$("#RemoteCancel").click(function(){
    $("#LoadRemoteDialog").hide();
    $("#WelcomeBox").show();
});

$("#SampleButton").click(function(){
    $("#WelcomeBox").hide();
	loadSampleSong();
	$("#ControlBox").show();
});

$("#SettingsButton").click(function(){
	$("#SettingsDialog").toggle();

});

$("#WelcomeButton").click(function(){
    $("#WelcomeBox").toggle();
}); 

$("#PlaySound").click(function(){
    play();
});

$("#StopSound").click(function(){
    stop();
});

$("#ResumeSound").click(function(){
    resume();
});

$("#NextSong").click(function(){
   nextSong();
});

$("#PreviousSong").click(function(){
   lastSong();
});

LocalSong.onchange = function(){
    for(var i = 0; i < this.files.length; i++){
        addSong(this.files[i]);
        if (songQueue.length - 1 == 0){
            loadClientSong(URL.createObjectURL(this.files[i])); 
            updateCurrentSong(currentSong);
        }    
    }
   
   
   $("#WelcomeBox").hide();
   $("#ControlBox").show();
};

SongPosition.onchange = function(){
    setPosition(this.value);
};

SongVolume.onchange = function() {
    setVolume(this.value/100);
};

//Below are funtions that handle the appearance change of the UI
//They are connected to the inputs on the setting dialog window
//Body
$("#BackgroundColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBackgroundColor('body',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBackgroundColor('body',color);
    },
});

//Dialog Windows
$('#font').fontselect().change(function(){
        
          // replace + signs with spaces for css
          var font = $(this).val().replace(/\+/g, ' ');
          
          // split font into family and weight
          font = font.split(':');
          
          // set family on paragraphs 
          updateFontStyle('.DialogBox', font[0]);
        });

$("#DialogFontColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateFontColor('.DialogBox',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateFontColor('.DialogBox',color);
    },
});


$("#DialogFontSize").on('keyup change click', function () {
	updateFontSize('.DialogBox', $("#DialogFontSize").val()/2 + "px" )
	
});

$("#DialogBGColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBackgroundColor('.DialogBox',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBackgroundColor('.DialogBox',color);
    },
});

$("#DialogBorderSize").on('keyup change click', function () {
	updateBorderSize('.DialogBox', $("#DialogBorderSize").val() + "px" )
	
});
$("#DialogBorderRadius").on('keyup change click', function () {
	updateBorderRadius('.DialogBox', $("#DialogBorderRadius").val() + "px" )
	
});
$("#DialogBorderColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBorderColor('.DialogBox',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBorderColor('.DialogBox',color);
    },
});

//Dialog Title
$("#DialogTitleFontColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateFontColor('.DialogTitle',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateFontColor('.DialogTitle',color);
    },
});


$("#DialogTitleFontSize").on('keyup change click', function () {
    updateFontSize('.DialogTitle', $("#DialogTitleFontSize").val()/2 + "px" )
    
});

$("#DialogTitleBGColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBackgroundColor('.DialogTitle',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBackgroundColor('.DialogTitle',color);
    },
});

$("#DialogTitleBorderRadius").on('keyup change click', function () {
    updateBorderRadius('.DialogTitle', $("#DialogTitleBorderRadius").val() + "px" )
    
});

//Dialog Footer
$("#DialogFooterFontColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateFontColor('.DialogFooter',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateFontColor('.DialogFooter',color);
    },
});


$("#DialogFooterFontSize").on('keyup change click', function () {
    updateFontSize('.DialogFooterBox', $("#DialogFooterFontSize").val()/2 + "px" )
    
});

$("#DialogFooterBGColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBackgroundColor('.DialogFooter',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBackgroundColor('.DialogFooter',color);
    },
});

$("#DialogFooterBorderRadius").on('keyup change click', function () {
    updateBorderRadius('.DialogFooter', $("#DialogFooterBorderRadius").val() + "px" )
    
});

//Buttons
$("#ButtonFontColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateFontColor('.Button',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateFontColor('.Button',color);
    },
});


$("#ButtonFontSize").on('keyup change click', function () {
    updateFontSize('.Button', $("#ButtonFontSize").val()/2 + "px" )
    
});

$("#ButtonBGColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBackgroundColor('.Button',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBackgroundColor('.Button',color);
    },
});

$("#ButtonBorderSize").on('keyup change click', function () {
    updateBorderSize('.Button', $("#ButtonBorderSize").val() + "px" )
    
});
$("#ButtonBorderRadius").on('keyup change click', function () {
    updateBorderRadius('.Button', $("#ButtonBorderRadius").val() + "px" )
    
});
$("#ButtonBorderColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBorderColor('.Button',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBorderColor('.Button',color);
    },
});

//CLose Button
$("#CloseButtonBGColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBackgroundColor('.Close',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBackgroundColor('.Close',color);
    },
});

$("#CloseButtonBorderSize").on('keyup change click', function () {
    updateBorderSize('.Close', $("#CloseButtonBorderSize").val() + "px" )
    
});
$("#CloseButtonBorderRadius").on('keyup change click', function () {
    updateBorderRadius('.Close', $("#CloseButtonBorderRadius").val() + "px" )
    
});
$("#CloseButtonBorderColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBorderColor('.Close',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBorderColor('.Close',color);
    },
});


//Advance Settings
$("#ModalBGColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateBackgroundColor('#pageslide',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateBackgroundColor('#pageslide',color);
    },
});

$("#ModalFontColor").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showAlpha: true,
    maxPaletteSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        updateFontColor('#pageslide',color);
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
        updateFontColor('#pageslide',color);
    },
});



function updateBackgroundColor(element, color){
	$(element).css("background-color", color.toString());
}
function updateFontColor(element, color){
	$(element).css("color", color.toHexString());
}
function updateFontSize(element, size) {
	$(element).css("font-size", size  );   	
}
function updateFontStyle(element, style) {
	$(element).css("font-family", style  );   	
}
function updateBorderColor(element, color){
	$(element).css("border-color", color.toString());
}
function updateBorderSize(element, size){
	$(element).css("border-width", size  );   
}
function updateBorderRadius(element, size){
	$(element).css("border-radius", size  );   	
}

function addSong(file){
   songQueue.push(URL.createObjectURL(file));
   songName = file.name;
   songLocation = songQueue.length - 1;
   $("#modal #SongQueue #SongList").append("<div class='space'></div><div id='Song" + songLocation+ "' class='Song' onclick='loadClientSong(songQueue["+songLocation+"]);updateCurrentSong(" + songLocation + ");' title='Play " + songName + "'>" + songName +" </div>");
}

function updateCurrentSong(queueNumber){
    $("#modal #SongQueue #SongList #Song"+currentSong).removeClass("Playing");
    currentSong = queueNumber;
    $("#modal  #SongQueue #SongList #Song"+queueNumber).addClass("Playing");
}
