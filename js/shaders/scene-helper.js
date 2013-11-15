/**********************************************************
 * This file will hold all of the scenes in the project.
 * A scene should be wrapped into a function (see js/scenes/scene1.js)
 *
 * Each scene should return an object with keys:
 *   renderer:  the object containing the .domElement property
 *   camera:  the camera object
 *   appendTo: a function taking inputs (domNode, width, height) which
 *          will resize the scene, and append the domElement to the domNode
 *
 *
 * Additionally, your scene shouldn't manually add itself to the window,
 * that will happen here.
 *
 * P.S. Make sure you add your scene using loadScene after you make it!
 * ********************************************************/

var container;

container = document.createElement( 'div' );
document.body.appendChild( container );
container.id = "graphics";

var sceneContainer;


var sceneArray = [];
var currentScene = -1;

function switchToScene(index){
   if (index >= sceneArray.length || index == currentScene)
      return;

   sceneIcon = sceneCont = document.getElementById('scene'+currentScene);

   sceneArray[currentScene].appendTo(sceneIcon, sceneIcon.clientWidth, sceneIcon.clientHeight);  
   console.log("Switching to scene:" + index)
   sceneArray[index].appendTo(container, window.innerWidth, window.innerHeight);

   currentScene = index;
}

function loadScene(scene){
   if ($.inArray(scene, sceneArray) != -1)
      return;

   sceneArray.push(scene);

   if (currentScene < 0){
      container.appendChild(scene.renderer.domElement);
      currentScene = 0;
   }

   loadedScene = sceneArray.length - 1;
   
   console.log("Scene " + loadedScene + " loaded");
   appendScene(loadedScene);
   if (loadedScene != 0){
      sceneCont = document.getElementById('scene'+loadedScene);
      sceneArray[sceneArray.length - 1].appendTo(sceneCont, sceneCont.width, sceneCont.height);
   }
   //TODO - Same as above, but when we load a scene, add its renderer to its thumbnail div
}

function appendScene(index){
   $('#advance-controls #scene-select').append("<div id='scene" + index + "' class='sceneIcon' onClick='switchToScene(" + index + ")'></div>");
}


loadShader = function(filepath) {
   var request = new XMLHttpRequest();
   request.open("GET", filepath, false);
   request.send();
   var returnValue = request.responseText;

   return returnValue;
}
