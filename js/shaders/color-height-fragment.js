uniform float uHeight;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {

   float red = uHeight;
   float green = max(0.0, uHeight - 0.45);
   float blue = 0.45;

   gl_FragColor = vec4( red, green, blue, 1.0);
}
