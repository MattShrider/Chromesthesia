//From http://srchea.com/blog/2013/05/experimenting-with-web-audio-api-three-js-webgl/
var context;
var source, sourceJs;
var url;
var songArray = new Array();
var request;
var startTime = 0;
var startOffset = 0;
var stoppedNaturally = false;
var songAlreadyEnded = false;
var songPercent;
var bufferQueue = new Array();
var loadingBuffersUpTo = -1;
var songHistory = new Array();
var bufferIndex = -1;
var previousSongLoaded = true;
var filterArray = new Array();

//Overload the modulo function to work with negative numbers (like it should)
Number.prototype.mod = function(n) {
   return ((this%n)+n)%n;
}


//create the audio context, there should only ever be one.
window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();

var songs = { 
               now: { source: null,
                      buffer: null,
                      gain: context.createGain(),
                      name: "Now",
                      index: 0},
               mic: { source: null,
                      gain: context.createGain(),
                      name: "Mic",
                      enabled: false}};

var volume = context.createGain();
var analyser = context.createAnalyser();
var jsNode = context.createScriptProcessor(1024);

volume.connect(context.destination);

songs.now.gain.connect(volume);


analyser.smoothingTimeConstant = 0.6;
analyser.fftSize = 512;

jsNode.connect(context.destination);
analyser.connect(jsNode);

jsNode.onaudioprocess = function(e) {
   songArray = new Uint8Array(analyser.frequencyBinCount);
   analyser.getByteFrequencyData(songArray);
}

songs.now.gain.connect(analyser);

setVolume(.3);

console.log(songs);

/*
 * The following block is for Microphone stuff.
 * This doesn't work yet, but its the groundwork for next sprint.
 */
/*
songs.mic.gain.connect(volume);
navigator.webkitGetUserMedia({audio: true}, function(stream) {
   songs.mic.source = context.createMediaStreamSource(stream);
   songs.mic.source.connect(volume);
}, function(e) {
   console.log("Error with loading microphone", e);});
*/



/*
 * This function should take a url (either remote or local) and read the file as an binaryarray (music)
 * TODO - have a system for multiple requests in sequence, either stopping previous or merging into channels.
*/
function requestSong(url, index){
   if (index <= loadingBuffersUpTo)
      return;
   if (!previousSongLoaded)
      return;
   previousSongLoaded = false;

   console.log("New request for index: " + index);
   loadingBuffersUpTo = index;

   request = new XMLHttpRequest();
   request.open('GET', url, true);
   request.responseType = "arraybuffer";
   
   $("#LoadingIcon").show();

   request.onload = function() {
      context.decodeAudioData(
         request.response,
         function(buffer) {
            
            if(!buffer) {
               return;
            }

            appendSong(index);
            bufferQueue.push(buffer);
            if (index == 0) {
               songs.now.buffer = buffer;
               play(true);
               updateCurrentSong(0);
            }

            $("#LoadingIcon").hide();
            previousSongLoaded = true;


         },
         function(error) {
         }
      );
   };

   //call the onload function
   request.send();
};

//take the current source node and play its song
function play(force, delay) {

   if (currentSong != songHistory[songHistory.length - 1])
      songHistory.push(currentSong);
   console.log(songHistory);

   delay = typeof delay !== 'undefined' ? delay : 0;

   //do not play if it is already playing
   if (songs.now.source && songs.now.source.playbackState == AudioBufferSourceNode.PLAYING_STATE && !force)
      return;

   if (songs.now.buffer){

      songs.now.source = context.createBufferSource();
      songs.now.source.buffer = songs.now.buffer;

      songs.now.source.connect(songs.now.gain);

      songs.now.source.start(context.currentTime + delay)
      startTime = context.currentTime + delay;

      if (!stoppedNaturally)
         playAfterStop();

      stoppedNaturally = true;
      songAlreadyEnded = false;
      startOffset = 0;
      console.log(context.currentTime +" -- Started playing with offset: " + startOffset + " and delay: " + delay);
      console.log(songs.now.source);
   }
}

//this stops a song, and destroys the node, this is the exact same as pausing.
function stop() {
   //no source to stop
   if (!songs.now.source)
      return;

   //do not stop if already stopped
   if (!(songs.now.source.playbackState == AudioBufferSourceNode.PLAYING_STATE))
      return;

   stopAfterPlay();
   songs.now.source.stop(0);
   stoppedNaturally = false;
   songAlreadyEnded = false;
   startOffset += context.currentTime - startTime;
   console.log(context.currentTime +" -- Stopped playing: ");

   console.log(songs.now.source);
}

//resume playing from a last playing offset
function resume() {
   //do not play if it is already playing
   if (songs.now.source && songs.now.source.playbackState == AudioBufferSourceNode.PLAYING_STATE)
      return;

   if (songs.now.buffer){
      songs.now.source = context.createBufferSource();
      songs.now.source.buffer = songs.now.buffer;

      songs.now.source.connect(songs.now.gain);

      songs.now.source.start(0, startOffset);

      if (!stoppedNaturally)
         playAfterStop();

      stoppedNaturally = true;
      songAlreadyEnded = false;
      startTime = context.currentTime;
      console.log(context.currentTime +" -- Started playing with offset: " + startOffset);
      console.log(songs.now.source);
   }
}

//Multiplies the volume by the gain, 0 = off, 1 = normal, 2 = double loud
function setVolume(gain) {
   if (volume){
      volume.gain.value = gain;
      console.log(context.currentTime +" -- Volume set to " + gain);
   }
}

//Change the current time of the track to a percentage (0 to 1)
function setPosition(percentage) {

   if (songs.now.buffer){
      songs.now.source.stop(0);

      songs.now.source = context.createBufferSource();
      songs.now.source.buffer = songs.now.buffer;

      songs.now.source.connect(songs.now.gain);

      //create an offset from the duration times percentage, where percentage is between 0 and 1
      position = songs.now.source.buffer.duration * (percentage < 0 ? 0 : percentage > 1 ? 1 : percentage);

      //we still have to set the offset, incase they stop/resume
      startOffset = position;
      songs.now.source.start(0, startOffset);
      stoppedNaturally = true;
      songAlreadyEnded = false;
      startTime = context.currentTime;
      console.log(context.currentTime +" -- Moved song to time: " + position);
   }
}

//Returns the current position of the song (as a percentage 0.0-1.0)  This function is called once
//every second, which can be used to set the position slider.
function positionCallback() {

   if (songs.now.source && songs.now.source.playbackState == AudioBufferSourceNode.PLAYING_STATE){
      songPercent = (context.currentTime - startTime + startOffset) / songs.now.source.buffer.duration;
   }
   else if (songs.now.source && songs.now.source.playbackState != AudioBufferSourceNode.PLAYING_STATE){
      if (stoppedNaturally){
         songPercent = 0.0;
         if (!songAlreadyEnded) songEnded();
      }
      else {
         songPercent = startOffset / songs.now.source.buffer.duration;
      }
   }
   else 
      songPercent = 0;

   console.log(context.currentTime + " -- Time Callback: " + songPercent);


   loadNewSongs();
   return songPercent;
}
setInterval(function(){
   if (!positionMouseDown){
      SongPosition.value = positionCallback(); 
   }
}, 1000);

//event called after the song has started playing after it was stopped
function playAfterStop(){
   console.log(context.currentTime + " -- Song started playing");

   //Call a function which should make the pause button visible
   togglePlayPause();
}

function stopAfterPlay(){
   console.log(context.currentTime + " -- Song just paused");

   //Call a function which should make the play button visible
   togglePlayPause();
}


//Function which is called at the end of a song.
function songEnded(){
   songAlreadyEnded = true;
   startOffset = 0;

   console.log(context.currentTime + " -- Song has ended.");
   nextSong();
}

function nextSong(){

   changeToSong((currentSong + 1).mod(songQueue.length));

}

function lastSong(){

   songHistory.pop();
   changeToSong(songHistory.pop());

}

function changeToSong(index){
   stop();

   if (bufferQueue.length == 0)
      return;

   console.log("changing to song " + index);

   if (index < bufferQueue.length) {
      songs.now.buffer = bufferQueue[index];
      updateCurrentSong(index);
   }
   else {
      songs.now.buffer = bufferQueue[0];
      updateCurrentSong(0);
   }

   play(true);
}

function loadNewSongs(){
   if (bufferQueue.length >= songQueue.length)
      return;

   for (var i = bufferQueue.length; i < songQueue.length; i++){
      requestSong(songQueue[i],i);
   }


}

function loadSampleSong(){
   var xhr = new XMLHttpRequest();
   xhr.open('GET', 'audio/sample.mp3', true);
   xhr.responseType = 'blob';

   xhr.onload = function(e) {
      if (this.status == 200) {
         // Note: .response instead of .responseText
         var blob = new Blob([this.response], {type: 'audio/mp3'});
         blob.name = "Sample Song";
         addSong(blob)
      }
   };

   xhr.send();
}

function appendAudioNode(){
   var type = $("#mod-" + filterArray.length).data('type');
   var freqSlider = $("#mod-" + filterArray.length + " .frequency");
   var qSlider = $("#mod-" + filterArray.length + " .q");
   var gainSlider = $("#mod-" + filterArray.length + " .gain");
   var filterNode = context.createBiquadFilter();

   switch (type){
      case "allpass": filterNode.type = filterNode.ALLPASS;
            break;
      case "bandpass": filterNode.type = filterNode.BANDPASS;
            break;
      case "highpass": filterNode.type = filterNode.HIGHPASS;
         break;
      case "lowpass": filterNode.type = filterNode.LOWPASS;
            break;
      case "lowshelf": filterNode.type = filterNode.LOWSHELF;
            break;
      case "highshelf": filterNode.type = filterNode.HIGHSHELF;
            break;
      case "notch": filterNode.type = filterNode.NOTCH;
         break;
      case "peaking": filterNode.type = filterNode.PEAKING;
         break;
   }

   filterNode.connect(volume);
   filterNode.connect(analyser);

   var filterObject = {
      freqSlider: freqSlider,
      qSlider: qSlider,
      gainSlider: gainSlider,
      filterNode: filterNode
   };
   filterArray.push(filterObject);
   console.log(context.currentTIme + " -- Adding Filter" );

   if (filterArray.length > 1){
      filterArray[filterArray.length - 2].filterNode.disconnect();
      filterArray[filterArray.length - 2].filterNode.connect(filterNode);
   } else {
      songs.now.gain.disconnect();
      songs.now.gain.connect(filterNode);
   }
}

function removeAudioNode(){
   if (filterArray.length < 1) return;

   var removedFilter = filterArray.pop();
   console.log(context.currentTIme + " -- Removing Last Filter" );
   removedFilter.filterNode.disconnect();

   if (filterArray.length > 0){
      filterArray[filterArray.length - 1].filterNode.disconnect();
      filterArray[filterArray.length - 1].filterNode.connect(analyser);
      filterArray[filterArray.length - 1].filterNode.connect(volume);
   } else {
      songs.now.gain.disconnect();
      songs.now.gain.connect(analyser);
      songs.now.gain.connect(volume);
   }

}

function modifyFilter(index){
   if (filterArray.length < 1) return;

   var node = filterArray[index];
   console.log(context.currentTime + " -- Modifying Biquad Filter: " + node);
   node.filterNode.frequency.value = node.freqSlider.val();
   if (node.qSlider.length != 0) {
      node.filterNode.Q.value = node.qSlider.val();

   }
   if (node.gainSlider.length != 0) {
      node.filterNode.gain.value = node.gainSlider.val();
   }

}
