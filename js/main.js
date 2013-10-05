//From http://srchea.com/blog/2013/05/experimenting-with-web-audio-api-three-js-webgl/
var context;
var source, sourceJs;
var gainNode;
var analyser;
var songBuffer;
var url;
var songArray = new Array();
var request;
var startTime = 0;
var startOffset = 0;
var stoppedNaturally = false;
var songAlreadyEnded = false;
var songPercent;
 
//create the audio context, there should only ever be one.
window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();

/*
 * This function should take a url (either remote or local) and read the file as an binaryarray (music)
 * TODO - have a system for multiple requests in sequence, either stopping previous or merging into channels.
*/
function requestSong(url){
   request = new XMLHttpRequest();
   request.open('GET', url, true);
   request.responseType = "arraybuffer";
   
   $("#LoadingDialog").show();
   //When a requested file is loaded, decode it as audio and play it.  Also, create an analyser for it.
   request.onload = function() {
      context.decodeAudioData(
         request.response,
         function(buffer) {
               
               if(!buffer) {
                  // Error decoding file data
                  return;
               }
               songBuffer = buffer;

               gainNode = context.createGain();
               sourceJs = context.createScriptProcessor(2048);
               analyser = context.createAnalyser();
               analyser.smoothingTimeConstant = 0.6;
               analyser.fftSize = 512;
   
               if (source) {
                  source.stop(0);
               }

               sourceJs.onaudioprocess = function(e) {
                  songArray = new Uint8Array(analyser.frequencyBinCount);
                  analyser.getByteFrequencyData(songArray);
               };

               $("#LoadingDialog").hide();
   
               //The song has been fully loaded now

               startTime = 0;
               startOffset = 0;
               setVolume(.3);
               play(true);
         },
         function(error) {
               // Decoding error
         }
      );
   };

   //call the onload function
   request.send();
};

//take the current source node and play its song
function play(force) {
   //do not play if it is already playing
   if (source && source.playbackState == AudioBufferSourceNode.PLAYING_STATE && !force)
      return;

   if (songBuffer){
      sourceJs.buffer = songBuffer;
      sourceJs.connect(context.destination);

      source = context.createBufferSource();
      source.buffer = songBuffer;

      source.connect(analyser);
      analyser.connect(sourceJs);
      source.connect(gainNode);
      gainNode.connect(context.destination);

      source.start(0);
      stoppedNaturally = true;
      songAlreadyEnded = false;
      startTime = context.currentTime;
      startOffset = 0;
      console.log(context.currentTime +" -- Started playing with offset: " + startOffset);
      console.log(source);
   }
}

//this stops a song, and destroys the node, this is the exact same as pausing.
function stop() {
   //no source to stop
   if (!source)
      return;

   //do not stop if already stopped
   if (!(source.playbackState == AudioBufferSourceNode.PLAYING_STATE))
      return;

   source.stop(0);
   stoppedNaturally = false;
   songAlreadyEnded = false;
   startOffset += context.currentTime - startTime;
   console.log(context.currentTime +" -- Stopped playing: ");

   console.log(source);
}

//resume playing from a last playing offset
function resume() {
   //do not play if it is already playing
   if (source && source.playbackState == AudioBufferSourceNode.PLAYING_STATE)
      return;

   if (songBuffer){
      sourceJs.buffer = songBuffer;
      sourceJs.connect(context.destination);

      source = context.createBufferSource();
      source.buffer = songBuffer;

      source.connect(analyser);
      analyser.connect(sourceJs);
      source.connect(gainNode);
      gainNode.connect(context.destination);

      source.start(0, startOffset);
      stoppedNaturally = true;
      songAlreadyEnded = false;
      startTime = context.currentTime;
      console.log(context.currentTime +" -- Started playing with offset: " + startOffset);
      console.log(source);
   }
}

//Multiplies the volume by the gain, 0 = off, 1 = normal, 2 = double loud
function setVolume(gain) {
   if (gainNode ){
      gainNode.gain.value = gain;
      console.log(context.currentTime +" -- Volume set to " + gain);
   }
}

//Change the current time of the track to a percentage (0 to 1)
function setPosition(percentage) {

   if (songBuffer){
      source.stop(0);
      sourceJs.buffer = songBuffer;
      sourceJs.connect(context.destination);

      source = context.createBufferSource();
      source.buffer = songBuffer;

      source.connect(analyser);
      analyser.connect(sourceJs);
      source.connect(gainNode);
      gainNode.connect(context.destination);

      //create an offset from the duration times percentage, where percentage is between 0 and 1
      position = source.buffer.duration * (percentage < 0 ? 0 : percentage > 1 ? 1 : percentage);

      //we still have to set the offset, incase they stop/resume
      startOffset = position;
      source.start(0, startOffset);
      stoppedNaturally = true;
      songAlreadyEnded = false;
      startTime = context.currentTime;
      console.log(context.currentTime +" -- Moved song to time: " + position);
      console.log(source);
   }
}

//Returns the current position of the song (as a percentage 0.0-1.0)  This function is called once
//every second, which can be used to set the position slider.
function positionCallback() {

   if (source && source.playbackState == AudioBufferSourceNode.PLAYING_STATE){
      songPercent = (context.currentTime - startTime + startOffset) / source.buffer.duration;
   }
   else if (source && source.playbackState != AudioBufferSourceNode.PLAYING_STATE){
      if (stoppedNaturally){
         songPercent = 0.0;
         if (!songAlreadyEnded) songEnded();
      }
      else {
         songPercent = startOffset / source.buffer.duration;
      }
   }
   else 
      songPercent = 0;

   console.log(context.currentTime + " -- Time Callback: " + songPercent);
   return songPercent;
}
setInterval(positionCallback, 1000);

//Function which is called at the end of a song.
function songEnded(){
   songAlreadyEnded = true;
   startOffset = 0;

   console.log(context.currentTime + " -- Song has ended.");

}


function loadClientSong(file){
   requestSong(file);
}

function loadRemoteSong(url){
   requestSong(url);
}

function loadSampleSong(){
   requestSong('audio/sample.mp3');
}
