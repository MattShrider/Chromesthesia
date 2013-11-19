var songQueue = [];
var fileNames = [];
var currentSong = 0;
var positionMouseDown = false;

//Functions on what happens when each button is clicked
$("#LocalButton").click(function(){
	$('input[type=file]').click();
});


$("#SampleButton").click(function(){
    $("#WelcomeBanner").hide();
	loadSampleSong();
});

$("#SettingsButton").click(function(){
	$("#SettingsDialog").toggle();

});

$("#PlaySound").click(function(){
    resume();
});

$("#StopSound").click(function(){
    stop();
});

$("#ResumeSound").click(function(){
    //resume();
});

$("#NextSong").click(function(){
   nextSong();
});

$("#PreviousSong").click(function(){
   lastSong();
});

LocalSong.onchange = function(){
    $("#WelcomeBanner").hide();
    showQueue();
    for(var i = 0; i < this.files.length; i++){
        addSong(this.files[i]);
        /*
        if (songQueue.length - 1 == 0){
            loadClientSong(URL.createObjectURL(this.files[i])); 
            updateCurrentSong(currentSong);
        }    
        */
    }
   
   
   $("#WelcomeBanner").hide();
};

SongPosition.onmousedown = function(){
    positionMouseDown = true;
};

SongPosition.onmouseup = function(){
    positionMouseDown = false;
    setPosition(this.value);
};

SongVolume.onchange = function() {
    setVolume(this.value/100);
};

/* Slide to the left, and make it model (you'll have to call $.pageslide.close() to close) */
function showQueue(){
    $("#modalborder").hide();
    $("#ac-border").show();
    $.pageslide({ direction: "right", href:'#modal', modal: true });
}

function hideQueue(){
    $.pageslide.close();
    $("#modalborder").show();
}

function showACWindow(){
    $("#ac-border").hide();
    $("#modalborder").show();
    $.pageslide({ direction: "left", href:'#advance-controls', modal: true });
}

function hideACWindow(){
    $.pageslide.close();
    $("#ac-border").show();
}

function scSwitchForms(){
    $("#advance-controls #sc-auth").toggle();
    $("#advance-controls #sc-song").toggle();
}

function appendSong(index){
  $("#modal #SongQueue #SongList").append("<li id='Song" + index + "' class='Song' onclick='changeToSong("+index+");' title='Play " + fileNames[index] + "'><marquee behavior='scroll' direction='left' scrollamount='0'>" + fileNames[index] +"</marquee> </li>");
}

function togglePlayPause() {
    $('#PlaySound').toggle();
    $('#StopSound').toggle();
}

$("#sc-auth-form").on('submit', function(event){
    var authcred = $(this).serializeArray();
    var scUser = authcred[0].value
    var scPass = authcred[1].value

    $('#sc-username').val(scUser);
    $('#sc-pass').val(scPass);

    return false;
});

$("#sc-url-form").on('submit', function(event){
    var scURL = $(this).serializeArray()[0].value;
    $('#sc-url').val(scURL);
    
    return false;
});


function addSong(file){
    if ($.inArray(file.name, fileNames) !== -1)
        return;

    songQueue.push(URL.createObjectURL(file));
    fileNames.push(file.name);
    songName = file.name;
    songLocation = songQueue.length - 1;
   //$("#modal #SongQueue #SongList").append("<div class='space'></div><div id='Song" + songLocation+ "' class='Song' onclick='changeToSong("+songLocation+");' title='Play " + songName + "'>" + songName +" </div>");
}

function updateCurrentSong(queueNumber){
    $("#modal #SongQueue #SongList #Song"+currentSong).removeClass("Playing");
    currentSong = queueNumber;
    $("#SongName").html(fileNames[currentSong]);
    $("#modal  #SongQueue #SongList #Song"+queueNumber).addClass("Playing");
}
