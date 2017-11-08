'use strict';

// import Config from './config';
// import DesktopFallback from './desktopFallback';
import bus from './bus';
import RendererGL from './rendererGL';
// import RendererCSS from './rendererCSS';
// import Inputs from './inputs';
// import DomWrapper from './domWrapper';
// import Environments from './environments';
// import { getCameraPosition, getCameraOrientation } from './utilities';
import zenscroll from 'zenscroll'

export default class App {
  constructor() {

    this.activeCamera;
    this.arCamera;
    this.arView;
    this.container;
    // this.cssCamera;
    this.currentMode;
    this.currentModelBuildStep = 0;
    this.deviceType;
    this.grid;
    this.hemisphereLight;
    this.model;
    this.modelElements = [];
    this.orbitControls;
    this.perspCamera;
    this.render = this.render.bind(this);
    this.shadow;
    this.scrollOffset;
    this.scrollTarget;
    this.viewer;
    this.viewerOffsetFromTop;
    this.viewerPlaceholder;
    this.vrControls;
    this.vrDisplay;
    this.vrFrameData;
    
    this.ENTER_EXIT_TRANSITION_DURATION = 800;
    this.LIGHTING_INTENSITY_FOR_AR = 1.5;
    this.LIGHTING_INTENSITY_FOR_MOBILE_AND_DESKTOP = 1.3;
    this.MODEL_TIMING_MULTIPLIER = 1;
    this.MODEL_NORMAL_SCALE = 0.01;
    this.MODEL_SMALL_SCALE = 0.0025;
    this.PERSP_CAMERA_FOV = 15;
    this.PERSP_CAMERA_ISO_TARGET = new THREE.Vector3(0, 1, 0);

    // Global Draco decoder type.
    // this.dracoDecoderType = {};
    // this.dracoDecoderType.type = 'js';
    // this.dracoLoader = new THREE.DRACOLoader('js/third_party/draco/', this.dracoDecoderType);

    // Check for AR displays
    THREE.ARUtils.getARDisplay().then(display => {
      this.vrDisplay = display;
      this.init();
    });
  }

  init() {

    this.currentMode = 'default';
    this.createScene();

    if (this.isARDevice()) {
      this.setDeviceType("ar");
      this.createArCameras();
      // this.showElement(document.querySelector("#enter-ar"));

    } else if (this.isMobileDevice()) {
      this.setDeviceType("mobile");
      this.createMobileCamera();
      // this.hideElement(document.querySelector("#enter-ar"));

    } else {
      this.setDeviceType("desktop");
      this.createDesktopCamera();
      // this.hideElement(document.querySelector("#enter-ar"));
    }

    this.createEnterButton();
    this.createModel();
    this.createLights();
    // this.createEnvironments();
    this.setActiveCamera(this.perspCamera);
    this.render();
  }

  createScene() {

    // Create container elements
    this.container = document.querySelector("#container");
    this.viewer = document.querySelector("#viewer");
    
    // Setup scene and renderers
    this.scene = new THREE.Scene();
    this.rendererGL = new RendererGL(this.container);
    // this.rendererCSS = new RendererCSS(this.container);

    // Set `pointer-events` to none so we can appropriately receive events.
    // this.rendererGL.renderer.domElement.style.pointerEvents = 'auto';
    // this.rendererCSS.renderer.domElement.style.pointerEvents = 'none';
    this.rendererGL.renderer.domElement.addEventListener('click', () =>
      this.onCanvasClick(), true);

    // Create scene root group
    // this.group = new THREE.Group();
    // this.scene.add(this.group);

    // Setup CSS root element
    // this.cssRoot = new THREE.Object3D();
    // this.cssRoot.scale.set(0.001, 0.001, 0.001); 
    // this.scene.add(this.cssRoot);

    // this.cssTest = new THREE.CSS3DObject(document.querySelector("#css-test"));
    // this.logo.scale.set(0.001, 0.001, 0.001);
    // this.cssTest.position.set(0, 0, 0);
    // this.cssRoot.add(this.cssTest)
    
    // Setup buttons
    
    this.enterButton = document.querySelector('#enterButton');
    this.enterButton.addEventListener('click', () => this.enter());

    this.exitButton = document.querySelector('#exitButton');
    this.exitButton.addEventListener('click', () => this.exit());

    this.nextStepButton = document.querySelector('#nextStepButton');
    this.nextStepButton.addEventListener('click', () => this.showNextModelPiece());

    // window.addEventListener('resize', e => this.onWindowResize(e), false);
    document.addEventListener('touchmove', e => this.onTouchMove(e), { passive: false });
    // bus.on('enterAR', () => this.enterAR());
    // bus.on('exitAR', () => this.exit());

    // Setup keyboard convenience function (for testing only)
    window.addEventListener('keydown', function(e){
      if ((!e.metaKey) || (!e.metaKey)) {
        switch (e.keyCode) {
          case 49: { // 1
            this.animateInFullModel();
            break;
          }
          case 50: { // 2
            this.showNextModelPiece();
            break;
          }
        }
      }
    }.bind(this));
  }

  setDeviceType(type) {
    this.deviceType = type;
    console.log(this.deviceType);
  }

  isARDevice() {
    if (this.vrDisplay) return true;
  }

  isMobileDevice() {
    // Taken from https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  };

  hideModelLoadingIndicator() {
    this.loadingIndicator = document.querySelector("#modelLoadingIndicator");
    this.loadingIndicator.classList.add('hidden');
  }

  hideElement(element) {
    element.classList.add("hidden");
  };

  showElement(element) {
    element.classList.remove("hidden");
  };

  getContainerSize() {

    let w = window.getComputedStyle(this.container).getPropertyValue('width').split("px")[0];
    let h = window.getComputedStyle(this.container).getPropertyValue('height').split("px")[0];

    return {
      width: w,
      height: h
    }
  }

  setActiveCamera(cam) {
    this.activeCamera = cam;
  }

  updateCameraAndCanvas(duration = 800) {

    new TWEEN.Tween({placeholder: 0})
      .to({placeholder: 0}, duration)
      .onUpdate(() => {
        this.rendererGL.updateSize();
        this.perspCamera.aspect = this.getContainerSize().width / this.getContainerSize().height;
        this.perspCamera.updateProjectionMatrix();
      })
      .start();
  }

  createEnterButton() {

    let label = document.querySelector('#enterLabel');
    let icon = document.querySelector('#enterIcon');
    
    if (this.deviceType == 'ar') {
      label.innerHTML = 'Build in AR';
      icon.style.backgroundImage = 'url(../images/icon-ar.svg)'
    }
    else if (this.deviceType == 'mobile') {
      label.innerHTML = 'Build it now';
      icon.style.backgroundImage = 'url(../images/icon-fullscreen.svg)'
    }
    else if (this.deviceType == 'desktop') {
      label.innerHTML = 'Build it now';
      icon.style.backgroundImage = 'url(../images/icon-fullscreen.svg)'
    }
  }

  createArCameras() {
      
    this.vrFrameData = new VRFrameData();

    this.arCamera = new THREE.ARPerspectiveCamera(
      this.vrDisplay,
      60,
      window.innerWidth / window.innerHeight,
      this.vrDisplay.depthNear,
      this.vrDisplay.depthFar
    );

    this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV - 5, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);
    this.perspCamera.position.set(12, 12, -12);
    this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

    window.addEventListener('resize', () => {
      this.updateCameraAndCanvas(0);
    });

    this.updateCameraAndCanvas(0);

    // this.cssCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);

    this.vrControls = new THREE.VRControls(this.arCamera);
    this.arView = new THREE.ARView(this.vrDisplay, this.rendererGL.renderer);

    // Turn on the debugging panel
    // let arDebug = new THREE.ARDebug(this.vrDisplay, this.scene, { showPlanes: false });
    // this.container.appendChild(arDebug.getElement());

    // Create and add reticle
    this.reticle = new ARPrimitives.ARSpotlight(this.vrDisplay);
    this.scene.add(this.reticle);
  }

  createMobileCamera() {

    this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV, this.getContainerSize().width / this.getContainerSize().height, 0.1, 100);
    this.perspCamera.position.set(12, 12, -12);
    this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

    window.addEventListener('resize', () => {
      this.updateCameraAndCanvas(0);
    });
  }

  createDesktopCamera(){

    this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV, this.getContainerSize().width / this.getContainerSize().height, 0.1, 100);
    this.perspCamera.position.set(12, 12, -12);
    this.orbitControls = new THREE.OrbitControls( this.perspCamera, this.rendererGL.renderer.domElement );
    // Enable animation loop when using damping or autorotation
    this.orbitControls.autoRotate = true;
    this.orbitControls.autoRotateSpeed = 2.0;
    // this.orbitControls.enableDamping = true;
    // this.orbitControls.dampingFactor = 0.25;
    this.orbitControls.target = this.PERSP_CAMERA_ISO_TARGET;
    this.orbitControls.enableZoom = false;
    // this.orbitControls.minDistance = 20;
    // this.orbitControls.maxDistance = 36;
    this.orbitControls.minPolarAngle = 0; // radians
    this.orbitControls.maxPolarAngle = Math.PI / 2; // radians
    this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

    window.addEventListener('resize', () => {
      this.updateCameraAndCanvas(0);
    });
  }

  createModel() {
    
    /*
      this.dracoLoader.load( 'models/sphere.drc', geometry => {

        let mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('models/sphere.mtl', materials => {

          console.log("Test");
          materials.preload();
          // console.log(materials);
          let mat = materials.materials.test;
          console.log(mat);
          // // this.loadModel(mat);

          this.createGrid();
          geometry.computeVertexNormals();

          let material = new THREE.MeshNormalMaterial();
          let mesh = new THREE.Mesh( geometry, mat );
          mesh.geometry.applyMatrix( new THREE.Matrix4().makeScale(0.0001, 0.0001, 0.0001) );
          // mesh.castShadow = true;
          // mesh.receiveShadow = true;
          
          mesh.traverse(node => {
            if( node.material ) {
              node.material.side = THREE.DoubleSide;
            }
          })

          console.log(mesh);

          this.model = mesh;
          this.scene.add( this.model );
          // this.model.scale.set(0.1, 0.1, 0.1);

        });
      });
    */

    this.loadingManager = new THREE.LoadingManager();
    this.loader = new THREE.ColladaLoader( this.loadingManager );
    this.loader.load('models/jeep.dae', function(collada){

      // Set all materials to DoubleSide, to compensate for mis-aligned normals in the original model
      collada.scene.traverse( function( node ) {
        if( node.material ) {
          node.material.side = THREE.DoubleSide;
        }
      });

      this.model = collada.scene;
      this.scene.add(this.model)
      
      // Create grid and drop shadow
      this.createGrid();
      this.createShadow();

      // Create variables for the pieces
      this.wheels_left = this.model.getObjectByName("wheels-left");
      this.wheels_right = this.model.getObjectByName("wheels-right");
      this.engine = this.model.getObjectByName("engine");
      this.storage = this.model.getObjectByName("storage");
      this.seats = this.model.getObjectByName("seats");
      this.grill = this.model.getObjectByName("grill");
      this.roof = this.model.getObjectByName("roof");
      this.axles = this.model.getObjectByName("axles");
      this.base = this.model.getObjectByName("base");
      this.mirrors = this.model.getObjectByName("mirrors");
      this.doors = this.model.getObjectByName("doors");
      this.modelElements.push(this.shadow, this.wheels_left, this.wheels_right, this.engine, this.storage, this.seats, this.grill, this.roof, this.axles, this.base, this.mirrors, this.doors);

      // Call build model once scene is ready
      this.animateInFullModel();

      // Hide the model loading indicator
      this.hideModelLoadingIndicator();

      // Fire pageLoad once model is ready
      // bus.emit('pageLoad');

    }.bind(this));
  }

  createLights() {
    this.hemisphereLight = new THREE.HemisphereLight( 0xF5F5F5, 0x1F1F1F, this.LIGHTING_INTENSITY_FOR_MOBILE_AND_DESKTOP );
    this.scene.add( this.hemisphereLight );
  }

  createGrid() {
    const GRID_SIZE = 5;
    const GRID_DIVISIONS = 10;
    const MEDIUM = 0xBABABA;
    this.grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, MEDIUM, MEDIUM);
    this.scene.add(this.grid);
  }

  createShadow() {
    
    this.shadow = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(260, 360),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('../images/jeep-shadow.png'),
        side: THREE.DoubleSide,
        opacity: 1,
        transparent: true,
      })
    );
    this.shadow.translateY(4);
    this.shadow.rotateX(90 * THREE.Math.DEG2RAD)
    this.model.add(this.shadow)
  }

  showModel() {
    this.model.visible = true;
  }

  hideModel() {
    this.model.visible = false;
  }

  showGrid() {
    this.grid.visible = true;
  }

  hideGrid() {
    this.grid.visible = false;
  }

  enter() {
    if (this.deviceType === 'ar') {
      this.enterAR();
    } else if (this.deviceType === 'mobile' || this.deviceType === 'desktop') {
      this.enterFullscreen();
    }
  }

  exit() {
    if (this.currentMode === 'ar') {
      this.exitAR();
    } else if (this.currentMode === 'fullscreen') {
      this.exitFullscreen();
    }
  }

  showShadow (delay = 0) {
    let element = this.shadow;
    element.material.opacity = 0;
    new TWEEN.Tween(element.material)
      .to({opacity: 1}, 500)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showWheelsLeft (delay = 0) {
    let element = this.wheels_left;
    element.position.set(-0, 0, -75);
    new TWEEN.Tween(element.position)
      .to({z: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showWheelsRight (delay = 0) {
    let element = this.wheels_right;
    element.position.set(0, 0, 75);
    new TWEEN.Tween(element.position)
      .to({z: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showEngine (delay = 0) {
    let element = this.engine;
    element.position.set(0, 150, 0);
    new TWEEN.Tween(element.position)
      .to({y: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showStorage (delay = 0) {
    let element = this.storage;
    element.position.set(0, 150, 0);
    new TWEEN.Tween(element.position)
      .to({y: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showSeats (delay = 0) {
    let element = this.seats;
    element.position.set(0, 100, 0);
    new TWEEN.Tween(element.position)
      .to({y: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showGrill (delay = 0) {
    let element = this.grill;
    element.position.set(100, 0, 0);
    new TWEEN.Tween(element.position)
      .to({x: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showRoof (delay = 0) {
    let element = this.roof;
    element.position.set(0, 150, 0);
    new TWEEN.Tween(element.position)
      .to({y: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showAxles (delay = 0) {
    let element = this.axles;
    element.position.set(0, 100, 0);
    new TWEEN.Tween(element.position)
      .to({y: 0}, 500)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Bounce.Out)
      .start();
  }

  showBase (delay = 0) {
    let element = this.base;
    element.position.set(0, 100, 0);
    new TWEEN.Tween(element.position)
      .to({y: 0}, 500)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Bounce.Out)
      .start();
  }

  showMirrors (delay = 0) {
    let element = this.mirrors;
    element.position.set(-25, 0, 0);
    new TWEEN.Tween(element.position)
      .to({x: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  showDoors (delay = 0) {
    let element = this.doors;
    element.position.set(-25, 0, 0);
    new TWEEN.Tween(element.position)
      .to({x: 0}, 800)
      .onStart(() => element.visible = true)
      .delay(delay * this.MODEL_TIMING_MULTIPLIER)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  }

  hideAllModelPieces() {
    for (var i = 0; i < this.modelElements.length; i++) {
      this.modelElements[i].visible = false;
    }
  }

  showAllModelPieces() {
    for (var i = 0; i < this.modelElements.length; i++) {
      this.modelElements[i].visible = true;
      this.modelElements[i].position.set(0, 0, 0);
    }
  }

  dropModelIntoARMode() {
    this.showModel();

    // Reza's code for getting the rotation right
    let x = this.arCamera.position.x - this.model.position.x;
    let z = this.arCamera.position.z - this.model.position.z;
    let angle = Math.atan2(x, z);
    this.model.rotation.set(0, angle + 110 * THREE.Math.DEG2RAD, 0);
    this.model.updateMatrixWorld(true);

    this.currentModelBuildStep = 0;
    this.showNextModelPiece();
  }

  animateInFullModel() {
    
    // Start by hiding all the pieces
    this.hideAllModelPieces();

    //Animate in the individual pieces. Pass in delay argument to stagger as desired 
    this.showShadow(50);
    this.showBase(50);
    this.showAxles(50);
    this.showWheelsLeft(50);
    this.showWheelsRight(50);

    this.showEngine(600);
    this.showStorage(800);
    this.showSeats(800);
    this.showGrill(1000);

    this.showRoof(1250);

    this.showMirrors(1550);
    this.showDoors(1550);1
  }

  showNextModelPiece() {

    switch(this.currentModelBuildStep) {
      case 0: {
        this.hideAllModelPieces();
        this.showShadow();
        this.showBase();
        this.showAxles();
        this.showWheelsLeft();
        this.showWheelsRight();
        this.currentModelBuildStep++
        break;
      }
      case 1: {
        this.showEngine();
        this.showStorage();
        this.showSeats();
        this.currentModelBuildStep++
        break;
      }
      case 2: {
        this.showGrill();
        this.showRoof();
        this.currentModelBuildStep++
        break;
      }
      case 3: {
        this.showMirrors();
        this.showDoors();
        this.currentModelBuildStep = 0;
        break;
      }
    }

  }

  createViewerPlaceholder() {

    this.viewerPlaceholder = document.createElement('div');
    this.viewerPlaceholder.id = 'placeholder';
    this.viewerPlaceholder.style.width = window.getComputedStyle(this.viewer).getPropertyValue('width');
    this.viewerPlaceholder.style.height = window.getComputedStyle(this.viewer).getPropertyValue('height');
    this.viewerPlaceholder.style.margin = window.getComputedStyle(this.viewer).getPropertyValue('margin');
    this.viewerPlaceholder.style.padding = window.getComputedStyle(this.viewer).getPropertyValue('padding');
    this.viewerPlaceholder.style.boxSizing = window.getComputedStyle(this.viewer).getPropertyValue('box-sizing');
    this.viewer.parentElement.insertBefore( this.viewerPlaceholder, this.viewer );

  }


  enterFullscreen() {

    this.exitButton.classList.remove("hidden");
    this.nextStepButton.classList.remove("hidden");
    this.currentMode = 'fullscreen';

    // We store this for later
    this.viewerOffsetFromTop = this.viewer.getBoundingClientRect().top + window.scrollY;

    // Create placeholder element. This will keep page from reflowing when we "pop out" the viewer by setting it's position to absolute
    this.createViewerPlaceholder();

    // Prevent page scrolling by setting overflow and hidden values on documentElement
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    // Setting these three values "pops" the viewer out of the page flow without the user noticing.
    // The key is setting "top" value to equal the viewer's Y position relative to viewport top, then setting position absolute.
    this.viewer.style.position = 'absolute';

    // Tweens the canvas and camera aspect ratio to match the new container size
    this.updateCameraAndCanvas();

    let transition = this.viewer.animate([
      {top: String(this.viewerOffsetFromTop + 'px')},
      {top: String(window.scrollY + 'px')}
    ], {
      duration: this.ENTER_EXIT_TRANSITION_DURATION,
      easing: 'ease'
    });

    transition.addEventListener('finish', function() {
      this.viewer.style.top = String(window.scrollY + 'px');
      this.currentModelBuildStep = 0;
      this.showNextModelPiece();
    }.bind(this));

    // The following classes animate the viewport and other elements into position
    this.viewer.classList.add('fullscreen');
    this.container.classList.add('fullscreen');
    this.enterButton.classList.add('fullscreen');

  }

  exitFullscreen() {

    this.exitButton.classList.add("hidden");
    this.nextStepButton.classList.add("hidden");
    this.currentMode = '2d';

    // Re-enable page scrolling by removing height and overflow styles on document.documenElement
    document.documentElement.removeAttribute('style');

    let viewerCurrentPosition = window.getComputedStyle(this.viewer).getPropertyValue('top');

    // Remove the following classes to animate the viewport and other elements back to their standard positions
    this.viewer.classList.remove('fullscreen');
    this.container.classList.remove('fullscreen');
    this.enterButton.classList.remove('fullscreen');

    // Tweens the canvas and camera aspect ratio to match the new container size
    this.updateCameraAndCanvas();

    let transition = this.viewer.animate([
      {top: viewerCurrentPosition},
      {top: String(this.viewerOffsetFromTop + 'px')}
    ], {
      duration: this.ENTER_EXIT_TRANSITION_DURATION,
      easing: 'ease'
    });

    transition.addEventListener('finish', function() {
      this.viewerPlaceholder.remove();
      this.viewer.style.position = 'relative';
      this.viewer.style.top = 0;
      this.showAllModelPieces();
    }.bind(this));
  }

  enterAR() {

    this.exitButton.classList.remove("hidden");
    this.nextStepButton.classList.remove("hidden");

    // We store this for later
    this.viewerOffsetFromTop = this.viewer.getBoundingClientRect().top + window.scrollY;

    // Create placeholder element. This will keep page from reflowing when we "pop out" the viewer by setting it's position to absolute
    this.createViewerPlaceholder();
 
    // Prevent page scrolling by setting overflow and hidden values on documentElement
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    // Setting these three values "pops" the viewer out of the page flow without the user noticing.
    // The key is setting "top" value to equal the viewer's Y position relative to viewport top, then setting position absolute.
    this.viewer.style.position = 'absolute';

    // Hide model and elements before starting transition
    this.hideGrid();
    this.hideModel();
    this.model.scale.set(this.MODEL_SMALL_SCALE, this.MODEL_SMALL_SCALE, this.MODEL_SMALL_SCALE);

    // Tweens the canvas and camera aspect ratio to match the new container size
    this.updateCameraAndCanvas();

    // new TWEEN.Tween(this.model.scale)
    //   .to({x: this.MODEL_SMALL_SCALE, y: this.MODEL_SMALL_SCALE, z: this.MODEL_SMALL_SCALE}, 800)
    //   .start()
    // this.model.scale.set(this.MODEL_SMALL_SCALE, this.MODEL_SMALL_SCALE, this.MODEL_SMALL_SCALE);

    let transition = this.viewer.animate([
      {top: String(this.viewerOffsetFromTop + 'px')},
      {top: String(window.scrollY + 'px')}
    ], {
      duration: this.ENTER_EXIT_TRANSITION_DURATION,
      easing: 'ease'
    });

    transition.addEventListener('finish', function() {
      this.currentModelBuildStep = 0;
      this.viewer.style.top = String(window.scrollY + 'px');
      this.currentMode = 'ar';
      this.scene.add(this.reticle);
      this.setActiveCamera(this.arCamera);
      this.hemisphereLight.intensity = this.LIGHTING_INTENSITY_FOR_AR;
      this.container.classList.add("transparent");
    }.bind(this));

    // The following classes animate the viewport and other elements into position
    this.viewer.classList.add('fullscreen');
    this.container.classList.add('fullscreen');
    this.enterButton.classList.add('fullscreen');

  }

  exitAR() {

    this.exitButton.classList.add("hidden");
    this.nextStepButton.classList.add("hidden");
    this.currentMode = '2d';

    // Re-enable page scrolling by removing height and overflow styles on document.documenElement
    document.documentElement.removeAttribute('style');

    let viewerCurrentPosition = window.getComputedStyle(this.viewer).getPropertyValue('top');

    // Remove the following classes to animate the viewport and other elements back to their standard positions
    this.viewer.classList.remove('fullscreen');
    this.container.classList.remove('fullscreen');
    this.enterButton.classList.remove('fullscreen');

    // Tween the canvas and camera aspect ratio to match the new container size
    this.updateCameraAndCanvas();

    // Reset model position and scale, reset lighting intensity, and show grid.
    this.model.position.set(0, 0, 0);
    this.model.rotation.set(0, 0, 0);
    this.model.scale.set(this.MODEL_NORMAL_SCALE, this.MODEL_NORMAL_SCALE, this.MODEL_NORMAL_SCALE);
    this.hemisphereLight.intensity = this.LIGHTING_INTENSITY_FOR_MOBILE_AND_DESKTOP;
    this.showGrid();
    this.container.classList.remove("transparent");
    this.scene.remove(this.reticle);

    let transition = this.viewer.animate([
      {top: viewerCurrentPosition},
      {top: String(this.viewerOffsetFromTop + 'px')}
    ], {
      duration: this.ENTER_EXIT_TRANSITION_DURATION,
      easing: 'ease'
    });

    transition.addEventListener('finish', function() {
      this.setActiveCamera(this.perspCamera);
      this.viewerPlaceholder.remove();
      this.viewer.style.position = 'relative';
      this.viewer.style.top = 0;
      this.showModel();
      this.animateInFullModel();
      // this.showAllModelPieces();
    }.bind(this));

    // this.animatePerspCameraPosition({ x: 0, y: 1, z: 0 }, this.group.position);
    // this.animatePerspCameraFov(this.PERSP_CAMERA_FOV);

    // Tween group to 2D-mode position/rotation
    // new TWEEN.Tween(this.group.position)
    //   .to({x: 0, y: 0, z: -1}, 1000)
    //   .easing(TWEEN.Easing.Quadratic.InOut)
    //   .start();

    // new TWEEN.Tween(this.group.rotation)
    //   .to({x: 0, y: 45 * THREE.Math.DEG2RAD, z: 0}, 1000)
    //   .easing(TWEEN.Easing.Quadratic.InOut)
    //   .start();
  }










  onCanvasClick() {

    if (this.vrDisplay && this.vrDisplay.hitTest && this.currentMode === 'ar') {
      const hits = this.vrDisplay.hitTest(0.5, 0.5);
      if (hits && hits.length) {
        const hit = hits[0];
        if (this.currentModelBuildStep == 0) {
          THREE.ARUtils.placeObjectAtHit(this.model, hit, 1, false);
          this.dropModelIntoARMode();
        }
      }
    }
  }

  onTouchMove(e) {
    if (this.currentMode === 'ar') {
      e.preventDefault();
    }
  }

  requestAnimationFrame(cb) {
    return this.vrDisplay ? this.vrDisplay.requestAnimationFrame(cb) : requestAnimationFrame(cb);
  } 

  render() {

    TWEEN.update();

    if (this.deviceType == 'ar') {
      
      if (this.currentMode == 'ar') {
        this.arView.render();
        this.reticle.update();
        this.vrControls.update(); // Updates perspective camera's positioning
        // this.model.rotation.y += 0.01;
      }
      
      // Update camera projection matrix in case near/far planes have changed
      this.arCamera.updateProjectionMatrix();
      // this.perspCamera.updateProjectionMatrix();
      // this.cssCamera.updateProjectionMatrix();
      this.arCamera.updateMatrix();
      this.rendererGL.renderer.clearDepth();
    }

    else if (this.deviceType == 'mobile') {

    }

    else if (this.deviceType == 'desktop') {
      this.orbitControls.update();
    }
    
    this.perspCamera.updateMatrix();
    this.rendererGL.render(this.scene, this.activeCamera);
    // this.rendererCSS.render(this.scene, this.activeCamera);
    this.requestAnimationFrame(this.render);

  }
















  /*======== OLD ========= */

  // Not currently used, and can potentially be deleted

  getCameraFov(cam) {
    if (this.vrDisplay) {

      // From the WebVR API, populate `vrFrameData` with
      // updated information for the frame; only call this here when we
      // need it as we only call this function when triggering transitions,
      // rather than calling `getFrameData` on every frame
      this.vrDisplay.getFrameData(this.vrFrameData);

      // Magic math extracts three.js-compatible FOV from device camera projection matrix.
      // Adapted from http://answers.unity3d.com/questions/770838/how-can-i-extract-the-fov-information-from-the-pro.html
      let projMat = this.vrFrameData.leftProjectionMatrix[5];
      let fov = Math.atan(1.0 / projMat ) * 2.0 * THREE.Math.RAD2DEG;
      return fov;
    } else {
      return cam.fov;
    }
  }

  animatePerspCameraPosition(pos, target, onComplete) {
    new TWEEN.Tween(this.perspCamera.position)
      .to(pos, 1000)
      .onUpdate(() => target && this.perspCamera.lookAt(target))
      .onComplete(() => {
        if (typeof onComplete === 'function') onComplete();
      })
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  animatePerspCameraRotation(quat) {
    new TWEEN.Tween(this.perspCamera.quaternion)
      .to(quat, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  animatePerspCameraFov(fov) {
    new TWEEN.Tween(this.perspCamera)
      .to({ fov }, 1000)
      .onUpdate(() => this.perspCamera.updateProjectionMatrix())
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  // toggleMode() {
  //   if (this.currentMode !== '2D') {
  //     this.currentMode = '2D';
  //     bus.emit('enterAR');
  //   } else if (this.currentMode !== 'AR') {
  //     this.currentMode = 'AR';
  //     bus.emit('exitAR');
  //   }
  // }




}
