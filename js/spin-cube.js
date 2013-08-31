
// revolutions per second
var angularSpeed = 0.2; 
var lastTime = 0;

// this function is executed on each animation frame
function animate(){
// update
var time = (new Date()).getTime();
var timeDiff = time - lastTime;
var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
cube.rotation.y += angleChange;
lastTime = time;

// render
renderer.render(scene, camera);

// request new frame
requestAnimationFrame(function(){
	animate();
});
}

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 500;

// scene
var scene = new THREE.Scene();
		
// cube
var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
cube.overdraw = true;
scene.add(cube);

// start animation
animate();
