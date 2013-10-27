var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener( 'resize', onWindowResize, false);


document.body.appendChild(renderer.domElement);

var sphere, uniforms, attributes;
attributes = {
	displacement: {	type: 'f', value: [] }
};
var noise = [];
uniforms = {
	amplitude: { type: "f", value: 1.0 },
	color:     { type: "c", value: new THREE.Color( 0xff2200 ) },
	texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "textures/water.jpg" ) },
};
uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;
var shaderMaterial = new THREE.ShaderMaterial( {
	uniforms: 		uniforms,
	attributes:     attributes,
	vertexShader:   document.getElementById( 'vertexshader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentshader' ).textContent
});
var radius = 50, segments = 128, rings = 64;
var geometry = new THREE.SphereGeometry( radius, segments, rings );
geometry.dynamic = true;

sphere = new THREE.Mesh( geometry, shaderMaterial );

var vertices = sphere.geometry.vertices;
var values = attributes.displacement.value;

for ( var v = 0; v < vertices.length; v++ ) {
	values[ v ] = 0;
	noise[ v ] = Math.random() * 5;
}
scene.add( sphere );
renderer = new THREE.WebGLRenderer( { alpha: false } );
renderer.setClearColor( 0x050505, 1 );
renderer.setSize( WIDTH, HEIGHT );

var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild( stats.domElement );
window.addEventListener( 'resize', onWindowResize, false );

scene.add(camera);

camera.position.z = 80;

function animate(){
	requestAnimationFrame( animate );
	render();
	stats.update();
}

function render() {
	var time = Date.now() * 0.01;

	sphere.rotation.y = sphere.rotation.z = 0.01 * time;

	uniforms.amplitude.value = 2.5 * Math.sin( sphere.rotation.y * 0.125 );
	uniforms.color.value.offsetHSL( 0.0005, 0, 0 );
	
	if(typeof songArray === 'object' && songArray.length > 0) {
		for (var x=0; x < songArray.length; x++){
			var scale = songArray[x] / 30;
			noise[x] += scale;
			attributes.displacement.value[x] += noise[x];
		}
		
	}

	attributes.displacement.needsUpdate = true;

	renderer.render( scene, camera );			

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	animate();
}

function changedControls(){
   renderer.render(scene, camera);
   console.log(camera);
}

animate();
