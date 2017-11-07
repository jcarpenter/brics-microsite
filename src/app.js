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
    this.deviceType;
    this.ENTER_EXIT_TRANSITION_DURATION = 800;
    this.hemisphereLight;
    this.LIGHTING_INTENSITY_FOR_AR = 1.8;
    this.LIGHTING_INTENSITY_FOR_MOBILE_AND_DESKTOP = 1.3;
    this.model;
    this.orbitControls;
    this.PERSP_CAMERA_FOV = 15;
    this.PERSP_CAMERA_ISO_TARGET = new THREE.Vector3(0, 1, 0);
    this.perspCamera;
    this.render = this.render.bind(this);
    this.scrollOffset;
    this.scrollTarget;
    this.viewer;
    this.viewerOffsetFromTop;
    this.viewerPlaceholder;
    this.vrControls;
    this.vrDisplay;
    this.vrFrameData;
    
    // Global Draco decoder type.
    this.dracoDecoderType = {};
    this.dracoDecoderType.type = 'js';
    this.dracoLoader = new THREE.DRACOLoader('js/third_party/draco/', this.dracoDecoderType);

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
    this.splash = document.querySelector("#splash");
    
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

    // window.addEventListener('resize', e => this.onWindowResize(e), false);
    document.addEventListener('touchmove', e => this.onTouchMove(e), { passive: false });
    // bus.on('enterAR', () => this.enterAR());
    // bus.on('exitAR', () => this.exit());

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
    this.perspCamera.position.set(12, 12, 12);
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
    this.perspCamera.position.set(12, 12, 12);
    this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

    window.addEventListener('resize', () => {
      this.updateCameraAndCanvas(0);
    });
  }

  createDesktopCamera(){

    this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV, this.getContainerSize().width / this.getContainerSize().height, 0.1, 100);
    this.perspCamera.position.set(12, 12, 12);
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
    this.container.style.cursor = '-webkit-grab';

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

      this.createGrid();

      // Set all materials to DoubleSide, to compensate for flipped normals in the original model
      collada.scene.traverse( function( node ) {
        // console.log(node.name);
        if( node.material ) {
          node.material.side = THREE.DoubleSide;
        }
      });

      this.model = collada.scene;
      this.scene.add(this.model)
      let wheels_left = this.model.getObjectByName("wheels-right");
      wheels_left.position.set(0, 0, 200);
      new TWEEN.Tween(this.model.getObjectByName("wheels-right").position)
      .to({z: 0 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()

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

  createEnvironments() {
    this.environments = new Environments(this.scene);
  }

  showModel() {
    // new TWEEN.Tween(this.model.material)
    //   .to({ opacity: 1 }, 1000)
    //   .start();
    this.model.visible = true;
  }

  hideModel() {
    // new TWEEN.Tween(this.model.material)
    //   .to({ opacity: 0 }, 1000)
    //   .start();
    this.model.visible = false;
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

  enterFullscreen() {

    this.exitButton.classList.remove("hidden");
    this.currentMode = 'fullscreen';

    // We store this for later
    this.viewerOffsetFromTop = this.viewer.getBoundingClientRect().top + window.scrollY;

    // Create placeholder element. This will keep page from reflowing when we "pop out" the viewer by setting it's position to absolute
    this.viewerPlaceholder = document.createElement('div');
    this.viewerPlaceholder.id = 'placeholder';
    this.viewerPlaceholder.style.width = window.getComputedStyle(this.viewer).getPropertyValue('width');
    this.viewerPlaceholder.style.height = window.getComputedStyle(this.viewer).getPropertyValue('height');
    this.viewerPlaceholder.style.padding = window.getComputedStyle(this.viewer).getPropertyValue('padding');
    this.viewerPlaceholder.style.boxSizing = window.getComputedStyle(this.viewer).getPropertyValue('box-sizing');
    this.viewer.parentElement.insertBefore( this.viewerPlaceholder, this.viewer );
 
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
    }.bind(this));

    // The following classes animate the viewport and other elements into position
    this.viewer.classList.add('fullscreen');
    this.container.classList.add('fullscreen');
    this.enterButton.classList.add('fullscreen');

  }

  exitFullscreen() {

    this.exitButton.classList.add("hidden");
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
      // this.viewer.removeAttribute('style');
    }.bind(this));
  }

  enterAR() {

    this.exitButton.classList.remove("hidden");

    // We store this for later
    this.viewerOffsetFromTop = this.viewer.getBoundingClientRect().top + window.scrollY;

    // Create placeholder element. This will keep page from reflowing when we "pop out" the viewer by setting it's position to absolute
    this.viewerPlaceholder = document.createElement('div');
    this.viewerPlaceholder.id = 'placeholder';
    this.viewerPlaceholder.style.width = window.getComputedStyle(this.viewer).getPropertyValue('width');
    this.viewerPlaceholder.style.height = window.getComputedStyle(this.viewer).getPropertyValue('height');
    this.viewerPlaceholder.style.padding = window.getComputedStyle(this.viewer).getPropertyValue('padding');
    this.viewerPlaceholder.style.boxSizing = window.getComputedStyle(this.viewer).getPropertyValue('box-sizing');
    this.viewer.parentElement.insertBefore( this.viewerPlaceholder, this.viewer );


 
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
      this.currentMode = 'ar';
      this.hideModel();
      this.scene.add(this.reticle);
      this.setActiveCamera(this.arCamera);
      this.grid.visible = false;
      this.hemisphereLight.intensity = this.LIGHTING_INTENSITY_FOR_AR;
    }.bind(this));

    // The following classes animate the viewport and other elements into position
    this.splash.classList.add('fullscreen');
    this.viewer.classList.add('fullscreen');
    this.container.classList.add('fullscreen');
    this.enterButton.classList.add('fullscreen');

  }

  exitAR() {

    this.exitButton.classList.add("hidden");
    this.currentMode = '2d';

    // Re-enable page scrolling by removing height and overflow styles on document.documenElement
    document.documentElement.removeAttribute('style');

    let viewerCurrentPosition = window.getComputedStyle(this.viewer).getPropertyValue('top');

    // Remove the following classes to animate the viewport and other elements back to their standard positions
    this.splash.classList.remove('fullscreen');
    this.viewer.classList.remove('fullscreen');
    this.container.classList.remove('fullscreen');
    this.enterButton.classList.remove('fullscreen');

    // Tween the canvas and camera aspect ratio to match the new container size
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
    }.bind(this));

    this.setActiveCamera(this.perspCamera);
    this.showModel();
    this.scene.remove(this.reticle);

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
        THREE.ARUtils.placeObjectAtHit(this.scene, hit, true, 1);
        // Show model immediately if not already present
        // this.model.material.opacity = 1;
        this.showModel();
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
