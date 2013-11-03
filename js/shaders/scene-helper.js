loadShader = function(filepath) {
   var request = new XMLHttpRequest();
   request.open("GET", filepath, false);
   request.send();
   var returnValue = request.responseText;

   return returnValue;
}
