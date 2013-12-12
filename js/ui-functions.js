var songQueue = [];
var fileNames = [];
var modifierArray = [];
var currentSong = 0;
var positionMouseDown = false;

//Functions on what happens when each button is clicked
$("#LocalButton").click(function() {
    $('input[type=file]').click();
});


$("#SampleButton").click(function() {
    $("#WelcomeBanner").hide();
    loadSampleSong();
});

$("#SettingsButton").click(function() {
    $("#SettingsDialog").toggle();

});

$("#PlaySound").click(function() {
    resume();
});

$("#StopSound").click(function() {
    stop();
});

$("#ResumeSound").click(function() {
    //resume();
});

$("#NextSong").click(function() {
    nextSong();
});

$("#PreviousSong").click(function() {
    lastSong();
});

$("#SoundModifier").click(function() {
    if($("#soundModifiers").is(":hidden")){
        showSoundMod();
    }
    else {
        hideSoundMod();
    }
});

$("#AddMod").click(function(){
    pushSoundMod($("#soundModifiers #ModSelect option:selected").val());
});

$("#DelMod").click(function(){
    popSoundMod();
});

LocalSong.onchange = function() {
    $("#WelcomeBanner").hide();
    showQueue();
    for (var i = 0; i < this.files.length; i++) {
        addSong(this.files[i]);
    }

    $("#WelcomeBanner").hide();
};

SongPosition.onmousedown = function() {
    positionMouseDown = true;
};

SongPosition.onmouseup = function() {
    positionMouseDown = false;
    setPosition(this.value);
};

SongVolume.onchange = function() {
    setVolume(this.value / 100);
};

/* Slide to the left, and make it model (you'll have to call $.pageslide.close() to close) */

function showQueue() {
    $("#modalborder").hide();
    $("#ac-border").show();
    $.pageslide({
        direction: "right",
        href: '#modal',
        modal: true
    });
}

function hideQueue() {
    $.pageslide.close();
    $("#modalborder").show();
}

function showACWindow() {
    $("#ac-border").hide();
    $("#modalborder").show();
    $.pageslide({
        direction: "left",
        href: '#advance-controls',
        modal: true
    });
}

function hideACWindow() {
    $.pageslide.close();
    $("#ac-border").show();
}

function scSwitchForms() {
    $("#advance-controls #sc-auth").toggle();
    $("#advance-controls #sc-song").toggle();
}

function appendSong(index) {
    $("#modal #SongQueue #SongList").append("<li id='Song" + index + "' class='Song' onclick='changeToSong(" + index + ");' title='Play " + fileNames[index] + "'><marquee behavior='scroll' direction='left' scrollamount='0'>" + fileNames[index] + "</marquee> </li>");
}

function togglePlayPause() {
    $('#PlaySound').toggle();
    $('#StopSound').toggle();
}

function showSoundMod(){
    $("#soundModifiers").show();
    var newHeight = window.innerHeight - ((window.innerHeight * .1) + 50);
    $("#pageslide").css("height", newHeight);
}

function hideSoundMod(){
    $("#soundModifiers").hide();
    $("#pageslide").css("height", "90%");
}

function pushSoundMod(type){
    var num = $('#soundModifiers #modifier-array .soundMod').length;
    switch(parseInt(type)){
        case 2:
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='highpass'>" + createSoundModuleInternal('HighPass', 2) + "</div>");
            break;
        case 3:
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='bandpass'>" + createSoundModuleInternal('BandPass', 2) + "</div>");
            break;
        case 4:
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='lowshelf'>" + createSoundModuleInternal('LowShelf', 3) + "</div>");
            break;
        case 5:
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='highshelf'>" + createSoundModuleInternal('HighShelf', 3) + "</div>");
            break;
        case 6:
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='peaking'>" + createSoundModuleInternal('Peaking', 1) + "</div>");
            break;
        case 7:
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='notch'>" + createSoundModuleInternal('Notch', 2) + "</div>");
            break;
        case 8:
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='allpass'>" + createSoundModuleInternal('AllPass', 2) + "</div>");
            break;
        default: // Case 1
            $("#soundModifiers #modifier-array").append("<div id='mod-"+num+"' class='soundMod' data-type='lowpass'>" + createSoundModuleInternal('LowPass', 2) + "</div>");
    }
    appendAudioNode();
}

function popSoundMod(){
    $("#soundModifiers #modifier-array .soundMod:last-child").remove();
    removeAudioNode();
}

function createSoundModuleInternal(title,type){
    var num = $('#soundModifiers #modifier-array .soundMod').length;
    switch(type){
        case 2:
            //No Gain Slider
            return '<div class="mod-title">' + title + '</div><div class="mod-params"><input type="range" class="frequency Slider" min="100" max="24000" step="10" onchange="modifyFilter(' + num + ')" value="350" title="Frequency" style="width: 40%;"><input type="range" class="q Slider" min=".001" max="100" step="5" onchange="modifyFilter(' + num + ')" value="1" title="Q" style="width: 40%;"></div>';
            break;
        case 3:
            //No Q Slider
            return '<div class="mod-title">' + title + '</div><div class="mod-params"><input type="range" class="frequency Slider" min="100" max="24000" step="10" onchange="modifyFilter(' + num + ')" value="350" title="Frequency" style="width: 40%;"><input type="range" class="gain Slider" min="-40" max="40" step="1" onchange="modifyFilter(' + num + ')" value="1" title="Gain" style="width: 40%;"></div>';
            break;
        default:
            //All 3 Sliders
            return '<div class="mod-title">' + title + '</div><div class="mod-params"><input type="range" class="frequency Slider" min="100" max="24000" step="10" onchange="modifyFilter(' + num + ')" value="350" title="Frequency" style="width: 26%;"><input type="range" class="q Slider" min=".001" max="100" step="5" onchange="modifyFilter(' + num + ')" value="1" title="Q" style="width: 26%;"><input type="range" class="gain Slider" min="-40" max="40" step="1" onchange="modifyFilter(' + num + ')" value="1" title="Gain" style="width: 26%;"></div>';
    }
}

$("#sc-auth-form").on('submit', function(event) {
    var authcred = $(this).serializeArray();
    var scUser = authcred[0].value
    var scPass = authcred[1].value

    $('#sc-username').val(scUser);
    $('#sc-pass').val(scPass);

    return false;
});

$("#sc-url-form").on('submit', function(event) {
    var scURL = $(this).serializeArray()[0].value;
    $('#sc-url').val(scURL);

    return false;
});


function addSong(file) {
    if ($.inArray(file.name, fileNames) !== -1)
        return;

    songQueue.push(URL.createObjectURL(file));
    fileNames.push(file.name);
    songName = file.name;
    songLocation = songQueue.length - 1;
    //$("#modal #SongQueue #SongList").append("<div class='space'></div><div id='Song" + songLocation+ "' class='Song' onclick='changeToSong("+songLocation+");' title='Play " + songName + "'>" + songName +" </div>");
}

function updateCurrentSong(queueNumber) {
    $("#modal #SongQueue #SongList #Song" + currentSong).removeClass("Playing");
    currentSong = queueNumber;
    $("#SongName").html(fileNames[currentSong]);
    $("#modal  #SongQueue #SongList #Song" + queueNumber).addClass("Playing");
}
