uniform float uHeight;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {

   float red = uHeight - (10.0 - vPosition.y) * 0.07;
   float green = 0.0;
   float blue = -vPosition.y * 0.1 * (0.5 + uHeight);

   gl_FragColor = vec4( red, green, blue, 1.0);
}
