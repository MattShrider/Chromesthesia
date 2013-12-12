var christianScene = (function(){

    var scene, camera, renderer, controls, miniBlock;
    //getRandomColor();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30,window.innerWidth / window.innerHeight, 1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener( 'resize', onWindowResize, false);

    miniBlock = new Array();

    document.body.appendChild(renderer.domElement);

    var cubicUnit = 27;
    var rowColumnSize = Math.pow(cubicUnit, (1 / 3));
    //var rowColumnSize = 3;
    var i = 0;
    for (var x = 0; x < rowColumnSize * 2; x += 2){
        var j = 0;
        miniBlock[i] = new Array();

        for (var y = 0; y < rowColumnSize * 2; y += 2)
        {	
            var geometry = new THREE.CubeGeometry(1, 1, 1);
            //var randomColor = getRandomColor();
            // var material = new THREE.MeshBasicMaterial({color: getRandomColor()});

            var randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });

            var material = new THREE.MeshBasicMaterial({ color: randomColor });

            miniBlock[i][j] = new THREE.Mesh (geometry, material);
            miniBlock[i][j].position = new THREE.Vector3(x, y, 0);
	
            scene.add(miniBlock[i][j]);

            miniBlock[i][j] = new THREE.Mesh(geometry, material);
            if (!(x == 2 && y == 2))
                miniBlock[i][j].position = new THREE.Vector3(x, y, -4);

            scene.add(miniBlock[i][j]);

            miniBlock[i][j] = new THREE.Mesh(geometry, material);
            miniBlock[i][j].position = new THREE.Vector3(x, y, -8);

            scene.add(miniBlock[i][j]);

            j++;
        }
   
        i++;
    }

    scene.add(camera);
    camera.position.z = 80;

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', animate);

    for (var i = 0; i < 7; i++)
    {
        controls.pan(new THREE.Vector3(1, 0, 0));
        controls.pan(new THREE.Vector3(0, 1, 0));
    }

    function animate() {	
        if (typeof songArray === 'object' && songArray.length > 0)
        {
            var k = 0;
            for (var i = 0; i < miniBlock.length; i++)
            {
                for (var j = 0; j < miniBlock[i].length; j++)
                {
                    var scale = songArray[k] / 30;
                    miniBlock[i][j].scale.z = (scale < 1 ? 1 : scale);
                    k += (k < songArray.length ? 1 : 0);
                }
            }
        }

        controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(function(){animate();});
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize (window.innerWidth, window.innerHeight);
        animate();
    }

    function changedControls() {
        renderer.render(scene, camera);
        console.log(camera);
    }

    /* getRandomCOlor is a function written by Anatoliy and Christophe,
     * members of StackOverFlow.com.
     */
    /*function getRandomColor() { 
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }
    */


    animate();

    return {renderer: renderer,
        camera: camera,
        appendTo: function (domNode, width, height) {
            domNode.appendChild(renderer.domElement);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }
})()

loadScene(christianScene);