function init() {
	//Globals
	var globalTimer = 0;
	
	//Scene
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(0x2d2d2d);
	

	//Camera
	//										 fov                  dimension ratio          ncp  fcp    (near/far clipping planes)
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
	camera.position.z = 1;
	camera.fov = 22.36;
	
	window.addEventListener("resize",function(){
		renderer.setSize(window.innerWidth,window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});
	
	//Renderer
	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.shadowMapEnabled = true;
	
	document.body.appendChild(renderer.domElement);
	
	//Controls
	controls = new THREE.TrackballControls(camera);
	
	//Load Objects
	var loader = new THREE.ObjectLoader();

	loader.load(
		// resource URL
		"models/player.json",

		// onLoad callback
		function (obj) {
			scene.add(obj);
		},

		// onProgress callback
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},

		// onError callback
		function ( err ) {
			console.error( 'An error happened' );
		}
	);		

	//Lighting
	var globalLight = new THREE.AmbientLight("#222222",2.66);
	scene.add(globalLight);
	
	var sunlight = new THREE.DirectionalLight("#ffffff", 1);
	sunlight.position.x = -9.0;
	sunlight.position.y = 8.3;
	sunlight.position.z = 6.5;
	sunlight.castShadow = true;
	sunlight.shadow.radius = 2;
	sunlight.shadowMapWidth = 2048;
	sunlight.shadowMapHeight = 2048;
	scene.add(sunlight);

	
	function tick() {
		globalTimer++;
		controls.update();  	
	}
	
	function render() {
		renderer.render(scene,camera);
	}
	
	function gameLoop() {
		tick();
		render();
		
		requestAnimationFrame(gameLoop);
	}

	gameLoop();
}