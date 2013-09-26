$(".DialogBox").draggable();

/* Slide to the left, and make it model (you'll have to call $.pageslide.close() to close) */
$(".advance-controls").pageslide({ direction: "right", modal: true });
$(".Close").click(function(){
	$(this).parent().hide();
	$("#ControlBox").show();
});

$("#LocalButton").click(function(){
	$('input[type=file]').click();
});

$("#RemoteButton").click(function(){
	$("#WelcomeBox").hide();
	$("#LoadRemoteDialog").show();
});

$("#RemoteSubmit").click(function(){
	$("#LoadRemoteDialog").hide();
	alert($("#RemoteURL").val());
	$("#ControlBox").show();
});

$("#SampleButton").click(function(){
	alert("Sample Song Load goes here...")
	$("#ControlBox").show();
});

$("#testButton").click(function(){
	$("#SettingsDialog").show();

});

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

$('#font').fontselect().change(function(){
        
          // replace + signs with spaces for css
          var font = $(this).val().replace(/\+/g, ' ');
          
          // split font into family and weight
          font = font.split(':');
          
          // set family on paragraphs 
          updateFontStyle('.DialogBox', font[0]);
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

function fileSelected() {
	$("#WelcomeBox").hide();
	alert($("#LocalSong").val());
	$("#ControlBox").show();
}

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