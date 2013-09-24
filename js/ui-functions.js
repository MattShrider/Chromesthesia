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

function fileSelected() {
	$("#WelcomeBox").hide();
	alert($("#LocalSong").val());
	$("#ControlBox").show();
}
