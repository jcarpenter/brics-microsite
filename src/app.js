'use strict';

import Config from './config';
import DesktopFallback from './desktopFallback';
import bus from './bus';
import RendererGL from './rendererGL';
import RendererCSS from './rendererCSS';
// import Inputs from './inputs';
// import DomWrapper from './domWrapper';
import Environments from './environments';
// import { getCameraPosition, getCameraOrientation } from './utilities';
import zenscroll from 'zenscroll'

export default class App {
  constructor() {
    // Instantiate vr variables
    this.vrDisplay;
    this.vrFrameData;
    this.vrControls;
    this.orbitControls;
    this.arView;
    this.activeCamera;
    this.arCamera;
    this.perspCamera;
    this.cssCamera;
    this.render = this.render.bind(this);
    this.scrollOffset;
    this.scrollTarget;

    this.PERSP_CAMERA_ISO_TARGET = new THREE.Vector3(0, 1, 0);
    // this.PERSP_CAMERA_ISO_TARGET = new THREE.Vector3(0, 0.05, -1);
    this.PERSP_CAMERA_ISO_FOV = 15;

    // Create container elements
    this.container = document.querySelector("#container");
    
    // Setup scene and renderers
    this.scene = new THREE.Scene();
    this.rendererGL = new RendererGL(this.container);
    this.rendererCSS = new RendererCSS(this.container);

    this.cssRoot = new THREE.Object3D();
    this.cssRoot.scale.set(0.001, 0.001, 0.001); 
    this.scene.add(this.cssRoot);

    this.cssTest = new THREE.CSS3DObject(document.querySelector("#css-test"));
    // this.logo.scale.set(0.001, 0.001, 0.001);
    this.cssTest.position.set(0, 0, 0);
    this.cssRoot.add(this.cssTest)
    

    // Check for AR displays
    THREE.ARUtils.getARDisplay().then(display => this.onGetARDisplays(display));
  }

  /**
   * Executed when getARDiplays returns. Creates cameras
   * and calls `init()`
   */
  onGetARDisplays(display) {
    if (display) {

      // If device is AR compatible, do the following:

      this.vrFrameData = new VRFrameData();
      this.vrDisplay = display;

      this.arCamera = new THREE.ARPerspectiveCamera(
        this.vrDisplay,
        60,
        window.innerWidth / window.innerHeight,
        this.vrDisplay.depthNear,
        this.vrDisplay.depthFar
      );

      this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_ISO_FOV, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);
      // this.cssCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_ISO_FOV, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);

      this.vrControls = new THREE.VRControls(this.arCamera);
      this.arView = new THREE.ARView(this.vrDisplay, this.rendererGL.renderer);

      // Turn on the debugging panel
      let arDebug = new THREE.ARDebug(this.vrDisplay, this.scene, { showPlanes: false });
      this.container.appendChild(arDebug.getElement());

      // Create and add reticle
      this.reticle = new ARPrimitives.ARSpotlight(this.vrDisplay);
      this.scene.add(this.reticle);

      this.init();
    } else {

      // Else if device is not AR compatible, do the following:
      
      // THREE.ARUtils.displayUnsupportedMessage();

      // Setup cameras
      this.arCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_ISO_FOV, window.innerWidth / window.innerHeight, 0.1, 100);

      this.arCamera.name = "arCamera";
      this.perspCamera.name = "perspCamera";

      // Hide Enter AR button
      document.querySelector("#enter-ar").style.display = "none";

      // if (Config.DESKTOP_FALLBACK) this.desktopFallback = new DesktopFallback(this.scene, this.arCamera);
      // this.desktopFallback.animateCameraSideToSide();

      this.init();
    }
  }

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

  init() {

    this.currentMode = '2D';

    // Setup default, non-AR camera
    this.perspCamera.position.set(24, 24, 24);
    this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

    // Setup orbit controls
    this.orbitControls = new THREE.OrbitControls( this.perspCamera, this.rendererGL.renderer.domElement );
    // this.orbitControls.addEventListener( 'change', this.render() ); // remove when using animation loop
    // enable animation loop when using damping or autorotation
    // this.orbitControls.enableDamping = true;
    // this.orbitControls.dampingFactor = 0.25;
    this.orbitControls.target = this.PERSP_CAMERA_ISO_TARGET;
    this.orbitControls.enableZoom = false;
    // this.orbitControls.minDistance = 20;
    // this.orbitControls.maxDistance = 36;
    this.orbitControls.minPolarAngle = 0; // radians
    this.orbitControls.maxPolarAngle = Math.PI / 2; // radians

    // Setup event listeners
    window.addEventListener('resize', e => this.onWindowResize(e), false);
    document.addEventListener('touchmove', e => this.onTouchMove(e), { passive: false });
    bus.on('enterAR', () => this.onAREnter());
    bus.on('exitAR', () => this.onARExit());
    bus.on('pageLoad', () => this.onPageLoad());

    // Setup buttons
    this.enterAr = document.querySelector('#enter-ar');
    this.enterAr.addEventListener('click', () => bus.emit('enterAR'));

    this.exitAr = document.querySelector('#exit-ar');
    this.exitAr.addEventListener('click', () => bus.emit('exitAR'));

    // Be sure to remove the `pointer-events` css property so
    // we can appropriately receive events.
    this.rendererGL.renderer.domElement.style.pointerEvents = null;
    this.rendererCSS.renderer.domElement.style.pointerEvents = 'none';
    this.rendererGL.renderer.domElement.addEventListener('touchstart', () =>
      this.onCanvasClick(), true);

    /**
     * Setup scene elements
    */

    // Create scene root
    this.group = new THREE.Group();
    // this.group.position.set(0, 0, 0);
    // this.group.rotation.set(0, 45 * THREE.Math.DEG2RAD, 0);
    this.scene.add(this.group);

    // Setup home model
    this.model;
    this.loadingManager = new THREE.LoadingManager();
    this.loader = new THREE.ColladaLoader( this.loadingManager );
    this.loader.load('models/home/home-lowResPlaceholder-1.dae', function(collada){

      // Set all materials to DoubleSide, to compensate for flipped normals in the original model
      collada.scene.traverse( function( node ) {
        if( node.material ) {
          node.material.side = THREE.DoubleSide;
        }
      });

      this.model = collada.scene;
      this.group.add(this.model)

      // Fire pageLoad once model is ready
      bus.emit('pageLoad');

    }.bind(this));

    // Setup lighting
    this.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    this.scene.add( this.light );

    // Create environments
    this.environments = new Environments(this.scene);

    // Set active camera and start render loop
    this.setActiveCamera(this.perspCamera);
    this.render();

    // // Instantiate a loader
    // this.loader = new THREE.GLTF2Loader();

    // // Load a glTF resource
    // this.loader.load( 'models/furniture/untitled.glb', function ( gltf ) {
      
    //   this.scene.add( gltf.scene );
    //   console.log(gltf.scene);
    //   // gltf.scene.scale.set(11, 11, 11);
    //   gltf.scene.position.set(1, 1, 1);

    //   // gltf.animations; // Array&lt;THREE.AnimationClip&gt;
    //   gltf.scene;      // THREE.Scene
    //   gltf.scenes;     // Array&lt;THREE.Scene&gt;
    //   // gltf.cameras;    // Array&lt;THREE.Camera&gt;
    //   bus.emit('enterAR');
    //   bus.emit('pageLoad');

    // }.bind(this) );

    // Setup grid (optional helper)
    // const GRID_SIZE = 6;
    // const GRID_DIVISIONS = 12;
    // const MEDIUM = 0x999999;
    // if (!this.vrDisplay) {
    //   // Only create grid if on desktop
    //   this.grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, MEDIUM, MEDIUM);
    //   this.group.add(this.grid);
    // }

  }

  hideModel() {
    // new TWEEN.Tween(this.model.material)
    //   .to({ opacity: 0 }, 1000)
    //   .start();
    this.model.visible = false;
  }

  showModel() {
    // new TWEEN.Tween(this.model.material)
    //   .to({ opacity: 1 }, 1000)
    //   .start();
    this.model.visible = true;
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

  // onMagicWindowStart() {
  //   this.currentMode = 'MagicWindow';

  //   this.hideBackground();
  //   this.showPano();
  //   this.hideModel();
  //   this.scene.remove(this.reticle);

  //   // If going from 2D -> MagicWindow, animate the perspective
  //   // camera to match and switch to the AR Camera
  //   if (this.activeCamera === this.perspCamera) {
  //     this.animatePerspCameraPosition(this.arCamera.position,
  //                                     null,
  //                                     () => this.setActiveCamera(this.arCamera));
  //     this.animatePerspCameraRotation(this.arCamera.quaternion);
  //     this.animatePerspCameraFov(this.getCameraFov(this.arCamera));
  //   }
  // }

  noscroll() {
    window.scrollTo( 0, this.scrollTarget );
  }

  onPageLoad() {
    this.enterAr.classList.remove("hidden");
    this.exitAr.classList.add("hidden");
    this.currentMode = '2D';
  }

  onARExit() {

    this.enterAr.classList.remove("hidden");
    this.exitAr.classList.add("hidden");
    this.currentMode = '2D';

    // Update container styles and scroll position
    this.container.style.height = '40rem';
    this.container.style.position = 'relative';

    // Enable scrolling. This will snap the scroll to the top of the page.
    document.body.style.overflow = 'scroll';
    document.body.style.height = 'auto';

    document.body.style.backgroundColor = 'white';

    // Setting overflow and height values snaps the scroll position to the top of the page, so we need to set the window scroll back to the top of the container.
    window.scroll(0, this.scrollTarget)

    // Animate the scroll back to position the page was in before entering AR mode.
    zenscroll.toY(this.scrollOffset, 500, () => {

    });

    // If going to 2D from AR/Magic where ARCamera is used,
    // match the cameras for now
    // if (this.activeCamera !== this.perspCamera) {
    //   this.perspCamera.position.copy(this.arCamera.position);
    //   this.perspCamera.quaternion.copy(this.arCamera.quaternion);
    //   this.setActiveCamera(this.perspCamera);
    // }

    this.setActiveCamera(this.perspCamera);

    this.showModel();
    // this.showBackground();
    // this.hidePano();

    this.scene.remove(this.reticle);

    // this.animatePerspCameraPosition({ x: 0, y: 1, z: 0 }, this.group.position);
    // this.animatePerspCameraFov(this.PERSP_CAMERA_ISO_FOV);

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

  onAREnter() {

    this.enterAr.classList.add("hidden");
    this.exitAr.classList.remove("hidden");

    // Update mode
    this.currentMode = 'AR';

    // Update container styles and scroll position
    this.container.style.transition = 'height 500ms, top 500ms '
    this.container.style.height = '100vh';

    // Store window scrollY offset, so we can scroll back to it once the user exits AR mode.
    this.scrollOffset = window.scrollY;

    // Scroll view so that top of container is flush with top of screen
    this.scrollTarget = this.container.getBoundingClientRect().top + window.scrollY;
    zenscroll.toY(this.scrollTarget, 500, () => {

      // Disable scrolling once scroll animation has finished
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';

      // Set the background color to transparent
      document.body.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      
      // Setting overflow and height values snaps the scroll position to the top of the page, so we need to set the body scroll back to the top of the container.
      document.body.scrollTop = this.scrollTarget;
      
      // document.body.style.userSelect = 'none';
      // document.body.style.webkitUserSelect = 'none';

      this.hideModel();
      this.scene.add(this.reticle);
      this.setActiveCamera(this.arCamera);

    });  
  }

  // onARStart_OLD() {
  //   // Update container styles and scroll position
  //   this.container.style.transition = 'height 1000ms, top 1000ms '
  //   this.container.style.height = '100vh';

  //   // Store window scrollY offset, so we can scroll back to it once the user exits AR mode.
  //   this.scrollOffset = window.scrollY;

  //   // Scroll view so that top of container is flush with top of screen
  //   let scrollTarget = this.container.getBoundingClientRect().top + window.scrollY;
  //   zenscroll.toY(scrollTarget, 1000, () => {
  //     // Disable scrolling once scroll animation has finished
  //     document.body.style.overflow = 'hidden';
  //     // document.body.style.position = 'fixed';
  //     document.body.style.width = '100%';
  //     document.body.style.height = '100vh';
  //     document.body.style.userSelect = 'none';
  //     // document.body.style.webkitUserSelect = 'none';
  //   });

  //   this.hideModel();
  //   // this.hidePano();
  //   // this.hideBackground();
  //   this.scene.add(this.reticle);

  //   if (this.activeCamera === this.perspCamera) {
  //     this.animatePerspCameraPosition(this.arCamera.position,
  //                                     this.PERSP_CAMERA_ISO_TARGET,
  //                                     () => this.setActiveCamera(this.arCamera));
  //     this.animatePerspCameraFov(this.getCameraFov(this.arCamera));
  //   }
  // }

  toggleMode() {
    if (this.currentMode !== '2D') {
      this.currentMode = '2D';
      bus.emit('enterAR');
    } else if (this.currentMode !== 'AR') {
      this.currentMode = 'AR';
      bus.emit('exitAR');
    }
  }

  // Embedded ////////////////

  setActiveCamera(cam) {
    this.activeCamera = cam;

  }

  render() {

    if (this.vrDisplay) {

      // If device is AR-compatible (aka: if vrDisplay was populated), do the following:
      this.arView.render();

      if (this.currentMode === 'AR') {
        this.reticle.update();
      }
      // Update our perspective camera's positioning
      this.vrControls.update();

      // Update our camera projection matrix in the event that
      // the near or far planes have updated
      this.arCamera.updateProjectionMatrix();
      this.perspCamera.updateProjectionMatrix();
      // this.cssCamera.updateProjectionMatrix();

      // Render our three.js virtual scene
      this.rendererGL.renderer.clearDepth();
    }

    // this.orbitControls.update();

    TWEEN.update();
    this.arCamera.updateMatrix();
    this.perspCamera.updateMatrix();
    this.rendererGL.render(this.scene, this.activeCamera);
    this.rendererCSS.render(this.scene, this.activeCamera);
    requestAnimationFrame(this.render);
  }

  onCanvasClick() {
    if (this.vrDisplay && this.vrDisplay.hitTest && this.currentMode === 'AR') {
      const hits = this.vrDisplay.hitTest(0.5, 0.5);
      if (hits && hits.length) {
        const hit = hits[0];
        THREE.ARUtils.placeObjectAtHit(this.group, hit, true, 1);
        // Show model immediately if not already present
        // this.model.material.opacity = 1;
        this.showModel();
      }
    }
  }

  /**
   * Called on window resize.
   */
  onWindowResize() {
    // Update camera aspect
    this.arCamera.aspect = window.innerWidth / window.innerHeight;
    this.perspCamera.aspect = window.innerWidth / window.innerHeight;

    // Update camera project matrix
    this.arCamera.updateProjectionMatrix();
    this.perspCamera.updateProjectionMatrix();
  }

  onTouchMove(e) {
    if (this.currentMode === 'AR') {
      e.preventDefault();
    }
  }
}
