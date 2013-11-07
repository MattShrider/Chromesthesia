/**********************************************************
 * This file will hold all of the scenes in the project.
 * A scene should be wrapped into a function (see js/scenes/scene1.js)
 *
 * Each scene should return an object with keys:
 *   renderer:  the object containing the .domElement property
 *   camera:  the camera object
 *   resize: a function which will resize the scene taking parameters (width, height)
 *
 *
 * Additionally, your scene shouldn't manually add itself to the window,
 * that will happen here.
 *
 * P.S. Make sure you add your scene using loadScene after you make it!
 * ********************************************************/

var sceneArray = [];
var currentScene = -1;

function switchToScene(index){
   if (index >= sceneArray.length)
      return;

   document.body.appendChild(sceneArray[index].renderer.domElement);

   //TODO - This needs to move the domElement of the current scene to a div somewhere (see below)
   //$('someDiv' + currentScene).appendChild(sceneArray[currentScene].renderer.domElement);
   sceneArray[index].resize(window.innerWidth, window.innerHeight);
   //sceneArray[currentScene].resize( replace This with, the size of the div );

   currentScene = index;
}

function loadScene(scene){
   sceneArray.push(scene);

   if (currentScene < 0){
      document.body.appendChild(scene.renderer.domElement);
      currentScene = 0;
   }

   //$('someDiv' + sceneArray.length - 1).appendChild(scene.renderer.domElement);
   //TODO - Same as above, but when we load a scene, add its renderer to its thumbnail div
}

loadShader = function(filepath) {
   var request = new XMLHttpRequest();
   request.open("GET", filepath, false);
   request.send();
   var returnValue = request.responseText;

   return returnValue;
}
