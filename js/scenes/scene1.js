//Author: Matthew Shrider
//Wrap the scene in a function to protect scope.
//The function must return the object containing the domElement

var frequencyScene = (function(){

var scene = new THREE.Scene();
var width = 210;
var height = 110;
//var camera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, 1, 1000);
var camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

//Scenes shouldn't manage the window
//window.addEventListener( 'resize', onWindowResize, false);

var notes = new Array();

var uniformsArray = [];
var i=0;
for (var x = 0; x < 256; x++){
   var geo = new THREE.CubeGeometry(0.5,15,3);
   var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

   uniformsArray.push({
      uHeight: {type: "f", value: 1.0},
      uTime: {type: "f", value: context.currentTime}
                      });

   var mat = new THREE.ShaderMaterial({

      uniforms: uniformsArray[x],
      vertexShader: loadShader("js/shaders/color-height-vertex.js"),
      fragmentShader: loadShader("js/shaders/color-height-fragment.js")
      
   });

   notes[x] = new THREE.Mesh(geo,mat);
   notes[x].position.x = -(256/2)*0.5+x*0.5;
   notes[x].position.y = 0;
   notes[x].position.z = 0;
   notes[x].scale.y = 0.1;


   scene.add(notes[x]);
   i++;
}
scene.add(camera);

camera.position.z = 80;
//camera.position.z = 4;
function animate(){
   if(typeof songArray === 'object' && songArray.length > 0) {
      for (var x=0; x < songArray.length; x++){
            var max = 1;
            var scale = songArray[x] / 40;
            if (songs.now.source && songs.now.source.playbackState == AudioBufferSourceNode.PLAYING_STATE){
               if (scale > max)
                  max = scale;
               notes[x].scale.y = (scale < 0.08 ? 0.08 : scale);
               scale = scale / max;
               uniformsArray[x].uHeight.value = (scale > 1.0 ? 1.0 : scale);
            }
            uniformsArray[x].uTime.value = context.currentTime;
         }
   }


   renderer.render(scene,camera);
   requestAnimationFrame(function(){animate();});
};

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight);
}

function changedControls(){
   renderer.render(scene, camera);
   console.log(camera);
}

animate();
   return {renderer: renderer,
           camera: camera,
           appendTo: function(domNode, width, height){
                  domNode.appendChild(renderer.domElement);
                  renderer.setSize( width, height );
                  camera.aspect = width / height;
                  camera.updateProjectionMatrix();
           }};
})()

loadScene(frequencyScene);
