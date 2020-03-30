var player;
var land;
var keys = {};
var pivot = {};
var demoDir = false;
var gravity;
var lastGravityFrame = -1;
var globalTimer = 0;

function init() {
	//Variables
	
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
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaOutput = true;
	
	document.body.appendChild(renderer.domElement);
	
	//Controls
	//controls = new THREE.TrackballControls(camera);
	
	//Load Objects
	var loader = new THREE.ObjectLoader();

	//Load player
	loader.load(
		// resource URL
		"models/player.json",

		// onLoad callback
		function (obj) {
			obj.position.y = 1;
			player = obj;
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
	
	//Load button
	loader.load(
		// resource URL
		"models/button.json",

		// onLoad callback
		function (obj) {
			obj.position.x = -1;
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
	
	//Load land
	loader.load(
		// resource URL
		"models/land.json",

		// onLoad callback
		function (obj) {
			obj.position.y -= 19.5;
			land = obj;
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

	
	//Render and control loop
	function tick() {
		globalTimer++;
		//controls.update();  	
	}
	
	document.addEventListener("keydown", function (e) {keys[e.which] = true;}, false);
	document.addEventListener("keyup", function (e) {keys[e.which] = false;}, false);
	
	function keyControl() {
		var moved = false;
		if (keys[87] || keys[38]) { //up
			
		}		
		if (keys[83] || keys[40]) { //down
			
		}
		if (keys[65] || keys[37]) { //left
			moveLeft(0.07);
			moved = true;
		}

		if (keys[68] || keys[39]) { //right
			moveRight(0.07);
			moved = true;
		}
		
		try {
			if (!moved && Object.keys(keys).length > 0 && rad2deg(player.rotation.z) % 90 != 0) {
				if (lastGravityFrame != globalTimer-1) {
					gravity = 0.003;
				}
				
				if (rad2deg(player.rotation.z) > 0) {
					if (rad2deg(player.rotation.z) > 45) {
						moveLeft(gravity);
					} else {
						moveRight(gravity);
					}
				} else {
					if (rad2deg(player.rotation.z) > -45) {
						moveLeft(gravity);
					} else {
						moveRight(gravity);
					}
				}
				
				lastGravityFrame = globalTimer;
				gravity += 0.003;
			}
		} catch (e) {}
	}
	
	function moveLeft(delta) {
		try {
			if (rad2deg(player.rotation.z) % 90 == 0) {
				pivot.x = player.position.x - 0.5;
				pivot.y = player.position.y - 0.5;
			}
		
			if (player.rotation.z < 0) {
				player.rotation.z += deg2rad(90);
			}
		
			player.rotation.z += delta;
			
			if (rad2deg(player.rotation.z) > 90) {
				if (player.position.x < pivot.x) {
					delta = deg2rad(90)-player.rotation.z-delta;
					player.rotation.z = deg2rad(0);
					player.position.y = Math.round(player.position.y);
					player.position.x = Math.round(player.position.x);
				} else {
					player.rotation.z-=deg2rad(90);
				}
				
			} else {
				newPos = rotate_pivot(pivot.x,pivot.y,delta,{x:player.position.x,y:player.position.y});
				player.position.x = newPos.x;
				player.position.y = newPos.y;
			}
		} catch (e) {}
	}
	
	function moveRight(delta) {
		try {
			if (rad2deg(player.rotation.z) % 90 == 0) {
				pivot.x = player.position.x + 0.5;
				pivot.y = player.position.y - 0.5;
			}
			
			if (player.rotation.z > 0) {
				player.rotation.z -= deg2rad(90);
			}
			
			player.rotation.z -= delta;
			
			if (rad2deg(player.rotation.z) < -90) {
				if (player.position.x > pivot.x) {
					delta = player.rotation.z;
					player.rotation.z = deg2rad(0);
					player.position.y = Math.round(player.position.y);
					player.position.x = Math.round(player.position.x);
				} else {
					player.rotation.z+=deg2rad(90);
				}
				
			} else {
				newPos = rotate_pivot(pivot.x,pivot.y,-delta,{x:player.position.x,y:player.position.y});
				player.position.x = newPos.x;
				player.position.y = newPos.y;
			}
		} catch (e) {}
	}
	
	function rotate_pivot(cx,cy,angle,p) {
		s = Math.sin(angle);
		c = Math.cos(angle);

		// translate point back to origin:
		p.x -= cx;
		p.y -= cy;

		// rotate point
		xnew = p.x * c - p.y * s;
		ynew = p.x * s + p.y * c;

		// translate point back:
		p.x = xnew + cx;
		p.y = ynew + cy;
		return p;
	}
	
	function moveCamera() {
		try { 
			camera.position.x = player.position.x;
			camera.position.y = player.position.y+2.5;
			camera.position.z = 6;
			camera.rotation.x = deg2rad(-25);
			camera.rotation.y = 0;
			camera.rotation.z = 0;
			land.position.x = player.position.x;
		} catch (e) {}
	}
	
	function render() {
		renderer.render(scene,camera);
	}
	
	function gameLoop() {
		keyControl();
		
		try {
			document.getElementsByClassName("log")[0].innerHTML = "Player Rotation Z: "+rad2deg(player.rotation.z);	
		
			if (Object.keys(keys).length == 0) {
				if (demoDir) {
					moveRight(0.07);
				} else {
					moveLeft(0.07);
				}
				
				if (player.position.x > 5) {
					demoDir = false;
				}
				if (player.position.x < -5) {
					demoDir = true;
				}
			}
		} catch (e) {}
		
		tick();
		moveCamera();
		render();
		
		requestAnimationFrame(gameLoop);
	}

	gameLoop();
	
	//Support
	function rad2deg(rad) {
		return rad * (180/Math.PI);
	}
	function deg2rad(deg) {
		return deg * (Math.PI/180);
	}
}