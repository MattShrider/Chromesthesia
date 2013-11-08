//Wrap the scene in a function to protect scope.
//The function must return the object containing the domElement

var calvinScene = (function(){

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//Scenes shouldn't manage the window
//window.addEventListener( 'resize', onWindowResize, false);


camera.position.z = 80;

var radius = 25, segments = 256, rings = 256;
var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000});
var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
scene.add(sphere);
var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(camera);
scene.add(pointLight);

var freqByteData = new Uint8Array(analyser.frequencyBinCount);
var beatCutOff = 20;
var beatTime = 30;

function animate(){
	if(typeof songArray === 'object' && songArray.length > 0) {
      for (var x=0; x < songArray.length; x++){
		analyser.getByteTimeDomainData(freqByteData);
	
		var length = freqByteData.length;
		var sum=0;
		for (var j = 0; j < length; ++j)
		{
			sum += freqByteData[j]
		}
		var aveLevel = sum / length;
		var normLevel = (aveLevel / 256) * 2;
         sphere.scale.x = normLevel;
         sphere.scale.y = normLevel;
         sphere.scale.z = normLevel;
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
           renderer.setSize( width, height);
           domNode.appendChild(renderer.domElement);
           camera.aspect = width / height;
           camera.updateProjectionMatrix();
        }
       }
})()

loadScene(calvinScene);
