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
var nextLoaded = lastLoaded = false;
var bufferQueue = new Array();
var loadingBuffersUpTo = -1;
var songHistory = new Array();
var bufferIndex = -1;
var previousSongLoaded = true;

//Overload the modulo function to work with negative numbers (like it should)
Number.prototype.mod = function(n) {
   return ((this%n)+n)%n;
}


//create the audio context, there should only ever be one.
window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();

var songs = { last: { source: null,
                      buffer: null,
                      gain: context.createGain(),
                      name: "Last",
                      index: 0},
               now: { source: null,
                      buffer: null,
                      gain: context.createGain(),
                      name: "Now",
                      index: 0},
              next: { source: null,
                      buffer: null,
                      gain: context.createGain(),
                      name: "Next",
                      index: 0},
               mic: { source: null,
                      gain: context.createGain(),
                      name: "Mic",
                      enabled: false}};

var volume = context.createGain();
var analyser = context.createAnalyser();
var jsNode = context.createScriptProcessor(1024);

volume.connect(context.destination);

songs.last.gain.connect(volume);
songs.next.gain.connect(volume);
songs.now.gain.connect(volume);


analyser.smoothingTimeConstant = 0.6;
analyser.fftSize = 512;

jsNode.connect(context.destination);
analyser.connect(jsNode);

jsNode.onaudioprocess = function(e) {
   songArray = new Uint8Array(analyser.frequencyBinCount);
   analyser.getByteFrequencyData(songArray);
}

songs.last.gain.connect(analyser);
songs.next.gain.connect(analyser);
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
   
   $("#LoadingDialog").show();

   request.onload = function() {
      context.decodeAudioData(
         request.response,
         function(buffer) {
            
            if(!buffer) {
               return;
            }

            bufferQueue.push(buffer);
            if (index == 0) {
               songs.now.buffer = buffer;
               play(true);
               updateCurrentSong(0);
            }

            $("#LoadingDialog").hide();
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

   songs.now.source.disconnect(songs.now.gain);

   //do not stop if already stopped
   if (!(songs.now.source.playbackState == AudioBufferSourceNode.PLAYING_STATE))
      return;

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
      console.log(songs.now.source);
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
 SongPosition.value = positionCallback(); 
}, 1000);

//Function which is called at the end of a song.
function songEnded(){
   songAlreadyEnded = true;
   startOffset = 0;

   console.log(context.currentTime + " -- Song has ended.");
   nextSong();
}

function nextSong(){

   changeToSong((currentSong + 1).mod(songQueue.length));
   return;


   if (!nextLoaded || !lastLoaded)
      return;


   stoppedNaturally = false;

   nextLoaded = false;
   lastLoaded = true;

   console.log(context.currentTime + " -- Changing to next song");
   stop();

   songs.last.buffer = songs.now.buffer;
   songs.now.buffer = songs.next.buffer;

   updateCurrentSong((currentSong + 1).mod(songQueue.length));
   play(true, .3);

   requestSong(songQueue[(currentSong + 1).mod(songQueue.length)], songs.next);
}

function lastSong(){

   songHistory.pop();
   changeToSong(songHistory.pop());
   return;


   if (!lastLoaded || !nextLoaded)
      return;

   stoppedNaturally = false;
   lastLoaded = false;
   nextLoaded = true;

   console.log(context.currentTime + " -- Changing to last song");
   stop();

   songs.next.buffer = songs.now.buffer;
   songs.now.buffer = songs.last.buffer;

   updateCurrentSong((currentSong - 1).mod(songQueue.length));
   play(true, .3);

   requestSong(songQueue[(currentSong - 1).mod(songQueue.length)], songs.last);

}

function loadClientSong(file){
   nextLoaded = false;
   lastLoaded = false;
   console.log(context.currentTime + " -- SongTree:")
   console.log(songs);
}

function changeToSong(index){
   stop();
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
   requestSong('audio/sample.mp3', songs.now);
}
