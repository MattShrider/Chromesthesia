uniform float uHeight;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vCameraPosition;

void main() {
   vNormal = normal;
   vPosition = position;
   vCameraPosition = cameraPosition;

   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
