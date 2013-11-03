uniform float uHeight;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vCameraPosition;

void main() {

   vec3 lightToFragment = vCameraPosition - vPosition;

   lightToFragment = normalize(lightToFragment);

   float dProd = max(0.0, dot(vNormal, lightToFragment));

   float red = uHeight - (10.0 - vPosition.y) * 0.07;
   float green = 0.0;
   float blue = -vPosition.y * 0.1 * (0.5 + uHeight);

   gl_FragColor = vec4( red * dProd, green, blue * dProd, 1.0);
}
