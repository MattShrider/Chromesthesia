var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener( 'resize', onWindowResize, false);
document.body.appendChild(renderer.domElement);
camera.position.z = 80;
var radius = 50, segments = 256, rings = 256;
var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000});
var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segemnts, rings), sphereMaterial);
scene.add(sphere);
var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(camera);
scene.add(pointLight);

function animate(){
   if(typeof songArray === 'object' && songArray.length > 0) {
      for (var x=0; x < songArray.length; x++){
         var scale = songArray[x] / 30;
         sphere.geometry.vertices[x] = (scale < 1 ? 1 : scale);
      }
   }
   sphere.geometry.vertiesNeedUpdate = true;

   renderer.render(scene,camera);
   requestAnimationFrame(function(){animate();});
};

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight);
   animate();
}

function changedControls(){
   renderer.render(scene, camera);
   console.log(camera);
}
animate();
