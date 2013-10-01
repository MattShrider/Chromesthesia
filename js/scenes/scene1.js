var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener( 'resize', onWindowResize, false);

var notes = new Array();

document.body.appendChild(renderer.domElement);

var i=0;
for (var x = 0; x < 256; x++){
   var geo = new THREE.CubeGeometry(0.5,15,3);
   var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

   var mat = new THREE.MeshBasicMaterial({color: randomColor});

   notes[x] = new THREE.Mesh(geo,mat);
   notes[x].position.x = -(256/2)*0.5+x*0.5;
   notes[x].position.y = 0;
   notes[x].position.z = 0;

   scene.add(notes[x]);
   i++;
}
scene.add(camera);

camera.position.z = 80;

function animate(){
   if(typeof songArray === 'object' && songArray.length > 0) {
      for (var x=0; x < songArray.length; x++){
         var scale = songArray[x] / 30;
         notes[x].scale.y = (scale < 1 ? 1 : scale);
      }
   }

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