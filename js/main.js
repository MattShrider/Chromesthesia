//From http://srchea.com/blog/2013/05/experimenting-with-web-audio-api-three-js-webgl/
var context;
var source, sourceJs;
var analyser;
var buffer;
var url;
var songArray = new Array();
var request;
 
//create the audio context, there should only ever be one.
context = new window.webkitAudioContext();

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
               sourceJs = context.createJavaScriptNode(2048);
               sourceJs.buffer = buffer;
               sourceJs.connect(context.destination);
               analyser = context.createAnalyser();
               analyser.smoothingTimeConstant = 0.6;
               analyser.fftSize = 512;
   
               if (source) {
                  source.noteOff(0);
               }

               source = context.createBufferSource();
               source.buffer = buffer;
               source.connect(analyser);
               analyser.connect(sourceJs);
               source.connect(context.destination);
   
               sourceJs.onaudioprocess = function(e) {
                  songArray = new Uint8Array(analyser.frequencyBinCount);
                  analyser.getByteFrequencyData(songArray);
               };

               $("#LoadingDialog").hide();
   
               //The song has been fully loaded now
               play();
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
function play() {
   if (source)
      source.noteOn(0);
}

//we will have to "remember" where the song was and just play the node again.
function pause() {
   source.noteOff(0);
}

//this stops a song, and destroys the node
function stop() {
   if (source)
      source.noteOff(0);
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
