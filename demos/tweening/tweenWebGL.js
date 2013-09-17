function animate(){
   

   renderer.render(scene,camera);
   requestAnimationFrame(function(){
      animate();
   });
   TWEEN.update();
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 500;

var scene = new THREE.Scene();

var cube = new THREE.Mesh(
      new THREE.CubeGeometry(100,100,100),
      new THREE.MeshNormalMaterial());
scene.add(cube);

var position = {x:0, y:0};
var tween = new TWEEN.Tween(position)
   .to( {y: -100},4000)
   .easing( TWEEN.Easing.Elastic.Out )
   .onUpdate( function() {
      cube.position.y = this.y;
   } )
   .delay(1000)

var resetTween = new TWEEN.Tween(position) 
   .to({x:0, y:0}, 6000)
   .easing( TWEEN.Easing.Cubic.Out)
   .onUpdate( function() {
      cube.position.x = this.x;
      cube.position.y = this.y;
   })
   .delay(1000)

tween.chain(resetTween);
resetTween.chain(tween);

tween.start();

animate();
