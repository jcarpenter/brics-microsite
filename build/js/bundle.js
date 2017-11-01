/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EventEmitter = __webpack_require__(5).EventEmitter;

exports.default = new EventEmitter();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(2);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
  window.app = new _app2.default();
}

window.onload = function () {
  init();
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import Inputs from './inputs';
// import DomWrapper from './domWrapper';

// import { getCameraPosition, getCameraOrientation } from './utilities';


var _config = __webpack_require__(3);

var _config2 = _interopRequireDefault(_config);

var _desktopFallback = __webpack_require__(4);

var _desktopFallback2 = _interopRequireDefault(_desktopFallback);

var _bus = __webpack_require__(0);

var _bus2 = _interopRequireDefault(_bus);

var _rendererGL = __webpack_require__(6);

var _rendererGL2 = _interopRequireDefault(_rendererGL);

var _rendererCSS = __webpack_require__(7);

var _rendererCSS2 = _interopRequireDefault(_rendererCSS);

var _environments = __webpack_require__(8);

var _environments2 = _interopRequireDefault(_environments);

var _zenscroll = __webpack_require__(12);

var _zenscroll2 = _interopRequireDefault(_zenscroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App() {
    var _this = this;

    _classCallCheck(this, App);

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
    this.rendererGL = new _rendererGL2.default(this.container);
    this.rendererCSS = new _rendererCSS2.default(this.container);

    this.cssRoot = new THREE.Object3D();
    this.cssRoot.scale.set(0.001, 0.001, 0.001);
    this.scene.add(this.cssRoot);

    this.cssTest = new THREE.CSS3DObject(document.querySelector("#css-test"));
    // this.logo.scale.set(0.001, 0.001, 0.001);
    this.cssTest.position.set(0, 0, 0);
    this.cssRoot.add(this.cssTest);

    // Check for AR displays
    THREE.ARUtils.getARDisplay().then(function (display) {
      return _this.onGetARDisplays(display);
    });
  }

  /**
   * Executed when getARDiplays returns. Creates cameras
   * and calls `init()`
   */


  _createClass(App, [{
    key: 'onGetARDisplays',
    value: function onGetARDisplays(display) {
      if (display) {

        // If device is AR compatible, do the following:

        this.vrFrameData = new VRFrameData();
        this.vrDisplay = display;

        this.arCamera = new THREE.ARPerspectiveCamera(this.vrDisplay, 60, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);

        this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_ISO_FOV, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);
        // this.cssCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_ISO_FOV, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);

        this.vrControls = new THREE.VRControls(this.arCamera);
        this.arView = new THREE.ARView(this.vrDisplay, this.rendererGL.renderer);

        // Turn on the debugging panel
        var arDebug = new THREE.ARDebug(this.vrDisplay, this.scene, { showPlanes: false });
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
  }, {
    key: 'getCameraFov',
    value: function getCameraFov(cam) {
      if (this.vrDisplay) {

        // From the WebVR API, populate `vrFrameData` with
        // updated information for the frame; only call this here when we
        // need it as we only call this function when triggering transitions,
        // rather than calling `getFrameData` on every frame
        this.vrDisplay.getFrameData(this.vrFrameData);

        // Magic math extracts three.js-compatible FOV from device camera projection matrix.
        // Adapted from http://answers.unity3d.com/questions/770838/how-can-i-extract-the-fov-information-from-the-pro.html
        var projMat = this.vrFrameData.leftProjectionMatrix[5];
        var fov = Math.atan(1.0 / projMat) * 2.0 * THREE.Math.RAD2DEG;
        return fov;
      } else {
        return cam.fov;
      }
    }
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.currentMode = '2D';

      // Setup default, non-AR camera
      this.perspCamera.position.set(24, 24, 24);
      this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

      // Setup orbit controls
      this.orbitControls = new THREE.OrbitControls(this.perspCamera, this.rendererGL.renderer.domElement);
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
      window.addEventListener('resize', function (e) {
        return _this2.onWindowResize(e);
      }, false);
      document.addEventListener('touchmove', function (e) {
        return _this2.onTouchMove(e);
      }, { passive: false });
      _bus2.default.on('enterAR', function () {
        return _this2.onAREnter();
      });
      _bus2.default.on('exitAR', function () {
        return _this2.onARExit();
      });
      _bus2.default.on('pageLoad', function () {
        return _this2.onPageLoad();
      });

      // Setup buttons
      this.enterAr = document.querySelector('#enter-ar');
      this.enterAr.addEventListener('click', function () {
        return _bus2.default.emit('enterAR');
      });

      this.exitAr = document.querySelector('#exit-ar');
      this.exitAr.addEventListener('click', function () {
        return _bus2.default.emit('exitAR');
      });

      // Be sure to remove the `pointer-events` css property so
      // we can appropriately receive events.
      this.rendererGL.renderer.domElement.style.pointerEvents = null;
      this.rendererCSS.renderer.domElement.style.pointerEvents = 'none';
      this.rendererGL.renderer.domElement.addEventListener('touchstart', function () {
        return _this2.onCanvasClick();
      }, true);

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
      this.loader = new THREE.ColladaLoader(this.loadingManager);
      this.loader.load('models/home/home-lowResPlaceholder-1.dae', function (collada) {

        // Set all materials to DoubleSide, to compensate for flipped normals in the original model
        collada.scene.traverse(function (node) {
          if (node.material) {
            node.material.side = THREE.DoubleSide;
          }
        });

        this.model = collada.scene;
        this.group.add(this.model);

        // Fire pageLoad once model is ready
        _bus2.default.emit('pageLoad');
      }.bind(this));

      // Setup lighting
      this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      this.scene.add(this.light);

      // Create environments
      this.environments = new _environments2.default(this.scene);

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
  }, {
    key: 'hideModel',
    value: function hideModel() {
      // new TWEEN.Tween(this.model.material)
      //   .to({ opacity: 0 }, 1000)
      //   .start();
      this.model.visible = false;
    }
  }, {
    key: 'showModel',
    value: function showModel() {
      // new TWEEN.Tween(this.model.material)
      //   .to({ opacity: 1 }, 1000)
      //   .start();
      this.model.visible = true;
    }
  }, {
    key: 'animatePerspCameraPosition',
    value: function animatePerspCameraPosition(pos, target, onComplete) {
      var _this3 = this;

      new TWEEN.Tween(this.perspCamera.position).to(pos, 1000).onUpdate(function () {
        return target && _this3.perspCamera.lookAt(target);
      }).onComplete(function () {
        if (typeof onComplete === 'function') onComplete();
      }).easing(TWEEN.Easing.Quadratic.InOut).start();
    }
  }, {
    key: 'animatePerspCameraRotation',
    value: function animatePerspCameraRotation(quat) {
      new TWEEN.Tween(this.perspCamera.quaternion).to(quat, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
    }
  }, {
    key: 'animatePerspCameraFov',
    value: function animatePerspCameraFov(fov) {
      var _this4 = this;

      new TWEEN.Tween(this.perspCamera).to({ fov: fov }, 1000).onUpdate(function () {
        return _this4.perspCamera.updateProjectionMatrix();
      }).easing(TWEEN.Easing.Quadratic.InOut).start();
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

  }, {
    key: 'noscroll',
    value: function noscroll() {
      window.scrollTo(0, this.scrollTarget);
    }
  }, {
    key: 'onPageLoad',
    value: function onPageLoad() {
      this.enterAr.classList.remove("hidden");
      this.exitAr.classList.add("hidden");
      this.currentMode = '2D';
    }
  }, {
    key: 'onARExit',
    value: function onARExit() {

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
      window.scroll(0, this.scrollTarget);

      // Animate the scroll back to position the page was in before entering AR mode.
      _zenscroll2.default.toY(this.scrollOffset, 500, function () {});

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
  }, {
    key: 'onAREnter',
    value: function onAREnter() {
      var _this5 = this;

      this.enterAr.classList.add("hidden");
      this.exitAr.classList.remove("hidden");

      // Update mode
      this.currentMode = 'AR';

      // Update container styles and scroll position
      this.container.style.transition = 'height 500ms, top 500ms ';
      this.container.style.height = '100vh';

      // Store window scrollY offset, so we can scroll back to it once the user exits AR mode.
      this.scrollOffset = window.scrollY;

      // Scroll view so that top of container is flush with top of screen
      this.scrollTarget = this.container.getBoundingClientRect().top + window.scrollY;
      _zenscroll2.default.toY(this.scrollTarget, 500, function () {

        // Disable scrolling once scroll animation has finished
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';

        // Set the background color to transparent
        document.body.style.backgroundColor = 'rgba(255, 255, 255, 0)';

        // Setting overflow and height values snaps the scroll position to the top of the page, so we need to set the body scroll back to the top of the container.
        document.body.scrollTop = _this5.scrollTarget;

        // document.body.style.userSelect = 'none';
        // document.body.style.webkitUserSelect = 'none';

        _this5.hideModel();
        _this5.scene.add(_this5.reticle);
        _this5.setActiveCamera(_this5.arCamera);
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

  }, {
    key: 'toggleMode',
    value: function toggleMode() {
      if (this.currentMode !== '2D') {
        this.currentMode = '2D';
        _bus2.default.emit('enterAR');
      } else if (this.currentMode !== 'AR') {
        this.currentMode = 'AR';
        _bus2.default.emit('exitAR');
      }
    }

    // Embedded ////////////////

  }, {
    key: 'setActiveCamera',
    value: function setActiveCamera(cam) {
      this.activeCamera = cam;
    }
  }, {
    key: 'render',
    value: function render() {

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
  }, {
    key: 'onCanvasClick',
    value: function onCanvasClick() {
      if (this.vrDisplay && this.vrDisplay.hitTest && this.currentMode === 'AR') {
        var hits = this.vrDisplay.hitTest(0.5, 0.5);
        if (hits && hits.length) {
          var hit = hits[0];
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

  }, {
    key: 'onWindowResize',
    value: function onWindowResize() {
      // Update camera aspect
      this.arCamera.aspect = window.innerWidth / window.innerHeight;
      this.perspCamera.aspect = window.innerWidth / window.innerHeight;

      // Update camera project matrix
      this.arCamera.updateProjectionMatrix();
      this.perspCamera.updateProjectionMatrix();
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      if (this.currentMode === 'AR') {
        e.preventDefault();
      }
    }
  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  DESKTOP_FALLBACK: true,
  EMBEDDED: true
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DesktopFallback = function () {
  function DesktopFallback(scene, camera) {
    _classCallCheck(this, DesktopFallback);

    this.camera = camera;

    var GRID_SIZE = 6;
    var GRID_DIVISIONS = 12;
    var LIGHT = 0xCCCCCC;
    var MEDIUM = 0x999999;
    var DARK = 0x666666;

    var geometry = new THREE.SphereGeometry(50, 64, 64);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    var material = new THREE.MeshBasicMaterial({
      flatShading: true,
      map: new THREE.TextureLoader().load('images/bg-gray.jpg')
    });

    var environment = new THREE.Mesh(geometry, material);
    scene.add(environment);

    var grid = new THREE.Group();
    var floor = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, MEDIUM, MEDIUM);
    var floorOutline = new THREE.GridHelper(GRID_SIZE - 0.001, 1, DARK, DARK);
    var wallBack = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, LIGHT, LIGHT);
    var wallLeft = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, LIGHT, LIGHT);
    var wallRight = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, LIGHT, LIGHT);

    grid.position.set(0, -0.6, 0);
    floorOutline.position.set(0, 0.001, 0);
    wallBack.position.set(0, GRID_SIZE / 2, -GRID_SIZE / 2);
    wallBack.rotateX(90 * THREE.Math.DEG2RAD);
    wallLeft.position.set(-GRID_SIZE / 2, GRID_SIZE / 2, 0);
    wallLeft.rotateZ(-90 * THREE.Math.DEG2RAD);
    wallRight.position.set(GRID_SIZE / 2, GRID_SIZE / 2, 0);
    wallRight.rotateZ(90 * THREE.Math.DEG2RAD);

    // const groundPlane = new THREE.Mesh(
    //   new THREE.PlaneBufferGeometry(GRID_SIZE, GRID_SIZE),
    //   new THREE.MeshBasicMaterial({
    //     color: LIGHT,
    //     transparent: true,
    //     opacity: 0.2
    //   })
    // )
    // groundPlane.rotateX(-90 * THREE.Math.DEG2RAD)
    // groundPlane.translateY(-0.001);

    grid.add(floor);
    grid.add(floorOutline);
    grid.add(wallBack);
    grid.add(wallLeft);
    grid.add(wallRight);
    // grid.add(groundPlane);
    // scene.add(grid);

    // this.camera.rotateZ(-25 * THREE.Math.DEG2RAD);
    // this.camera.rotateY(-25 * THREE.Math.DEG2RAD);
  }

  _createClass(DesktopFallback, [{
    key: 'animateCameraForwardBack',
    value: function animateCameraForwardBack() {

      var rotate = new TWEEN.Tween(this.camera.rotation).to({
        x: [-10 * THREE.Math.DEG2RAD, 5 * THREE.Math.DEG2RAD, 0],
        y: [-30 * THREE.Math.DEG2RAD, 30 * THREE.Math.DEG2RAD, 0],
        z: [-15 * THREE.Math.DEG2RAD, 15 * THREE.Math.DEG2RAD, 0]
      }, 5000).repeat(Infinity).easing(TWEEN.Easing.Quadratic.InOut).interpolation(TWEEN.Interpolation.Bezier).start();

      var walk = new TWEEN.Tween(this.camera.position).to({ x: [-1, 1, 0], y: [1.5, 1.7, 1.5], z: [2, 3.5, 4] }, 5000).repeat(Infinity).easing(TWEEN.Easing.Quadratic.InOut).interpolation(TWEEN.Interpolation.Bezier).start();
    }
  }, {
    key: 'animateCameraSideToSide',
    value: function animateCameraSideToSide() {

      // let rotate = new TWEEN.Tween(this.camera.rotation)
      //   .to({
      //     y: [-45 * THREE.Math.DEG2RAD, 45 * THREE.Math.DEG2RAD, 0]
      //   }, 5000)
      //   .repeat(Infinity)
      //   .easing(TWEEN.Easing.Quadratic.InOut)
      //   .interpolation(TWEEN.Interpolation.Bezier)
      //   .start();

      this.camera.position.y = 1;

      var walk = new TWEEN.Tween(this.camera.position).to({ x: [-2, 2, 0] }, 10000).repeat(Infinity).easing(TWEEN.Easing.Quadratic.InOut).interpolation(TWEEN.Interpolation.Bezier).start();
    }
  }, {
    key: 'animateCameraSpinAround',
    value: function animateCameraSpinAround() {

      this.camera.rotateX(30 * THREE.Math.DEG2RAD);
      this.camera.rotateY(180 * THREE.Math.DEG2RAD);
      this.camera.rotateZ(30 * THREE.Math.DEG2RAD);

      new TWEEN.Tween(this.camera.rotation).to({
        // x: -45 * THREE.Math.DEG2RAD,
        y: -90 * THREE.Math.DEG2RAD
      }, 5000).repeat(Infinity).easing(TWEEN.Easing.Quadratic.InOut).start();
    }
  }]);

  return DesktopFallback;
}();

exports.default = DesktopFallback;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function (n) {
  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function (type) {
  var er, handler, len, args, i, listeners;

  if (!this._events) this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler)) return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++) {
      listeners[i].apply(this, args);
    }
  }

  return true;
};

EventEmitter.prototype.addListener = function (type, listener) {
  var m;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, listener) {
  if (!isFunction(listener)) throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function (type, listener) {
  var list, position, length, i;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events || !this._events[type]) return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener || isFunction(list.listener) && list.listener === listener) {
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (type) {
  var key, listeners;

  if (!this._events) return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length) {
      this.removeListener(type, listeners[listeners.length - 1]);
    }
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function (type) {
  var ret;
  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function (type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function (emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RendererGL = function () {
  function RendererGL(container) {
    var _this = this;

    _classCallCheck(this, RendererGL);

    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateSize();
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '50%';
    this.renderer.autoClear = false;
    this.renderer.domElement.style.transform = 'translate(0, -50%)';
    // this.renderer.domElement.style.border = '6px solid yellow';
    // this.renderer.domElement.style.boxSizing = 'border-box';
    this.renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.renderer.domElement);

    document.addEventListener('DOMContentLoaded', function () {
      return _this.updateSize();
    }, false);
    window.addEventListener('resize', function () {
      return _this.updateSize();
    }, false);
  }

  _createClass(RendererGL, [{
    key: 'updateSize',
    value: function updateSize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, {
    key: 'render',
    value: function render(scene, camera) {
      this.renderer.render(scene, camera);
    }
  }]);

  return RendererGL;
}();

exports.default = RendererGL;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RendererCSS = function () {
  function RendererCSS(container) {
    var _this = this;

    _classCallCheck(this, RendererCSS);

    this.container = container;
    this.renderer = new THREE.CSS3DRenderer();
    this.updateSize();
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '50%';
    this.renderer.domElement.style.transform = 'translate(0, -50%)';
    // this.renderer.domElement.style.border = '4px solid red';
    // this.renderer.domElement.style.boxSizing = 'border-box';
    // this.renderer.domElement.style.pointerEvents = 'none';
    // this.renderer.domElement.style.zIndex = 100;
    container.appendChild(this.renderer.domElement);

    document.addEventListener('DOMContentLoaded', function () {
      return _this.updateSize();
    }, false);
    window.addEventListener('resize', function () {
      return _this.updateSize();
    }, false);
  }

  _createClass(RendererCSS, [{
    key: 'updateSize',
    value: function updateSize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, {
    key: 'render',
    value: function render(scene, camera) {
      this.renderer.render(scene, camera);
    }
  }]);

  return RendererCSS;
}();

exports.default = RendererCSS;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bus = __webpack_require__(0);

var _bus2 = _interopRequireDefault(_bus);

var _mountains = __webpack_require__(9);

var _mountains2 = _interopRequireDefault(_mountains);

var _gray = __webpack_require__(10);

var _gray2 = _interopRequireDefault(_gray);

var _transparent = __webpack_require__(11);

var _transparent2 = _interopRequireDefault(_transparent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Environments = function () {
  function Environments(scene) {
    var _this = this;

    _classCallCheck(this, Environments);

    // Setup variables
    this.activeEnvironment;
    this.activeButton;

    // Setup environments
    this.gray = new _gray2.default(scene);
    this.mountains = new _mountains2.default(scene);
    this.transparent = new _transparent2.default(scene);

    // Setup buttons
    this.background1Button = document.querySelector('#background-1');
    this.background2Button = document.querySelector('#background-2');
    this.background3Button = document.querySelector('#background-3');

    this.background1Button.addEventListener('click', function () {
      return _this.load(_this.background1Button, _this.mountains);
    });
    this.background2Button.addEventListener('click', function () {
      return _this.load(_this.background2Button, _this.gray);
    });
    this.background3Button.addEventListener('click', function () {
      return _this.load(_this.background3Button, _this.transparent);
    });

    // Setup event listeners
    _bus2.default.on('pageLoad', function () {
      return _this.onPageLoad();
    });
    _bus2.default.on('enterAR', function () {
      return _this.load(_this.background3Button, _this.transparent);
    });
    _bus2.default.on('exitAR', function () {
      return _this.load(_this.background1Button, _this.mountains);
    });
  }

  _createClass(Environments, [{
    key: 'onPageLoad',
    value: function onPageLoad() {
      this.load(this.background1Button, this.mountains);
    }
  }, {
    key: 'load',
    value: function load(pressedButton, targetEnvironment) {

      // Check if targetEnvironment is different from active one...
      if (this.activeEnvironment !== targetEnvironment) {

        // Update environment
        if (this.activeEnvironment) this.activeEnvironment.unload(); // If there is an activeEnvironment, unload it. Else do nothing
        targetEnvironment.load();
        this.activeEnvironment = targetEnvironment;

        // Update buttons
        if (this.activeButton) this.activeButton.classList.remove('active'); // If there is an activeButton, remove active class. Else do nothing
        pressedButton.classList.add('active');
        this.activeButton = pressedButton;
      }
    }
  }]);

  return Environments;
}();

exports.default = Environments;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mountains = function () {
  function Mountains(scene) {
    _classCallCheck(this, Mountains);

    this.scene = scene;
    this.group = new THREE.Group();
    this.pano = new THREE.Mesh(new THREE.SphereBufferGeometry(40, 64, 64), new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('images/bg-mountains.jpg'),
      flatShading: true,
      side: THREE.BackSide
    }));
    this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    }));
    this.plane.rotation.set(1.57, 0, 0);
    // this.plane.position.set(0, 0.04, 0);
    this.group.add(this.plane);
    this.group.add(this.pano);

    // new TWEEN.Tween(this.plane.rotation)
    //   .to({ x: 2 }, 6000)
    //   // .repeat(Infinity)
    //   .start();
  }

  _createClass(Mountains, [{
    key: 'load',
    value: function load() {
      this.scene.add(this.group);
    }
  }, {
    key: 'unload',
    value: function unload() {
      this.scene.remove(this.group);
    }
  }]);

  return Mountains;
}();

exports.default = Mountains;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gray = function () {
  function Gray(scene) {
    _classCallCheck(this, Gray);

    this.scene = scene;
    this.group = new THREE.Group();
    this.pano = new THREE.Mesh(new THREE.SphereBufferGeometry(40, 64, 64), new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('images/bg-gray.jpg'),
      flatShading: true,
      side: THREE.BackSide
    }));
    this.group.add(this.pano);
  }

  _createClass(Gray, [{
    key: 'load',
    value: function load() {
      this.scene.add(this.group);
    }
  }, {
    key: 'unload',
    value: function unload() {
      this.scene.remove(this.group);
    }
  }]);

  return Gray;
}();

exports.default = Gray;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transparent = function () {
  function Transparent(scene) {
    _classCallCheck(this, Transparent);

    this.scene = scene;
    this.group = new THREE.Group();
    // this.pano = new THREE.Mesh(
    //   new THREE.SphereBufferGeometry(10, 64, 64),
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('images/bg-mountains.jpg'),
    //     shading: THREE.FlatShading,
    //     side: THREE.BackSide
    //   })
    // );
    // this.group.add(this.pano)
  }

  _createClass(Transparent, [{
    key: "load",
    value: function load() {
      this.scene.add(this.group);
      // document.html.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    }
  }, {
    key: "unload",
    value: function unload() {
      this.scene.remove(this.group);
      // document.body.style.backgroundColor = 'white';
    }
  }]);

  return Transparent;
}();

exports.default = Transparent;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Zenscroll 4.0.0
 * https://github.com/zengabor/zenscroll/
 *
 * Copyright 2015–2017 Gabor Lenard
 *
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org>
 * 
 */

/*jshint devel:true, asi:true */

/*global define, module */

(function (root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory()),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
		module.exports = factory();
	} else {
		(function install() {
			// To make sure Zenscroll can be referenced from the header, before `body` is available
			if (document && document.body) {
				root.zenscroll = factory();
			} else {
				// retry 9ms later
				setTimeout(install, 9);
			}
		})();
	}
})(undefined, function () {
	"use strict";

	// Detect if the browser already supports native smooth scrolling (e.g., Firefox 36+ and Chrome 49+) and it is enabled:

	var isNativeSmoothScrollEnabledOn = function isNativeSmoothScrollEnabledOn(elem) {
		return "getComputedStyle" in window && window.getComputedStyle(elem)["scroll-behavior"] === "smooth";
	};

	// Exit if it’s not a browser environment:
	if (typeof window === "undefined" || !("document" in window)) {
		return {};
	}

	var makeScroller = function makeScroller(container, defaultDuration, edgeOffset) {

		// Use defaults if not provided
		defaultDuration = defaultDuration || 999; //ms
		if (!edgeOffset && edgeOffset !== 0) {
			// When scrolling, this amount of distance is kept from the edges of the container:
			edgeOffset = 9; //px
		}

		// Handling the life-cycle of the scroller
		var scrollTimeoutId;
		var setScrollTimeoutId = function setScrollTimeoutId(newValue) {
			scrollTimeoutId = newValue;
		};

		/**
   * Stop the current smooth scroll operation immediately
   */
		var stopScroll = function stopScroll() {
			clearTimeout(scrollTimeoutId);
			setScrollTimeoutId(0);
		};

		var getTopWithEdgeOffset = function getTopWithEdgeOffset(elem) {
			return Math.max(0, container.getTopOf(elem) - edgeOffset);
		};

		/**
   * Scrolls to a specific vertical position in the document.
   *
   * @param {targetY} The vertical position within the document.
   * @param {duration} Optionally the duration of the scroll operation.
   *        If not provided the default duration is used.
   * @param {onDone} An optional callback function to be invoked once the scroll finished.
   */
		var scrollToY = function scrollToY(targetY, duration, onDone) {
			stopScroll();
			if (duration === 0 || duration && duration < 0 || isNativeSmoothScrollEnabledOn(container.body)) {
				container.toY(targetY);
				if (onDone) {
					onDone();
				}
			} else {
				var startY = container.getY();
				var distance = Math.max(0, targetY) - startY;
				var startTime = new Date().getTime();
				duration = duration || Math.min(Math.abs(distance), defaultDuration);
				(function loopScroll() {
					setScrollTimeoutId(setTimeout(function () {
						// Calculate percentage:
						var p = Math.min(1, (new Date().getTime() - startTime) / duration);
						// Calculate the absolute vertical position:
						var y = Math.max(0, Math.floor(startY + distance * (p < 0.5 ? 2 * p * p : p * (4 - p * 2) - 1)));
						container.toY(y);
						if (p < 1 && container.getHeight() + y < container.body.scrollHeight) {
							loopScroll();
						} else {
							setTimeout(stopScroll, 99); // with cooldown time
							if (onDone) {
								onDone();
							}
						}
					}, 9));
				})();
			}
		};

		/**
   * Scrolls to the top of a specific element.
   *
   * @param {elem} The element to scroll to.
   * @param {duration} Optionally the duration of the scroll operation.
   * @param {onDone} An optional callback function to be invoked once the scroll finished.
   */
		var scrollToElem = function scrollToElem(elem, duration, onDone) {
			scrollToY(getTopWithEdgeOffset(elem), duration, onDone);
		};

		/**
   * Scrolls an element into view if necessary.
   *
   * @param {elem} The element.
   * @param {duration} Optionally the duration of the scroll operation.
   * @param {onDone} An optional callback function to be invoked once the scroll finished.
   */
		var scrollIntoView = function scrollIntoView(elem, duration, onDone) {
			var elemHeight = elem.getBoundingClientRect().height;
			var elemBottom = container.getTopOf(elem) + elemHeight;
			var containerHeight = container.getHeight();
			var y = container.getY();
			var containerBottom = y + containerHeight;
			if (getTopWithEdgeOffset(elem) < y || elemHeight + edgeOffset > containerHeight) {
				// Element is clipped at top or is higher than screen.
				scrollToElem(elem, duration, onDone);
			} else if (elemBottom + edgeOffset > containerBottom) {
				// Element is clipped at the bottom.
				scrollToY(elemBottom - containerHeight + edgeOffset, duration, onDone);
			} else if (onDone) {
				onDone();
			}
		};

		/**
   * Scrolls to the center of an element.
   *
   * @param {elem} The element.
   * @param {duration} Optionally the duration of the scroll operation.
   * @param {offset} Optionally the offset of the top of the element from the center of the screen.
   * @param {onDone} An optional callback function to be invoked once the scroll finished.
   */
		var scrollToCenterOf = function scrollToCenterOf(elem, duration, offset, onDone) {
			scrollToY(Math.max(0, container.getTopOf(elem) - container.getHeight() / 2 + (offset || elem.getBoundingClientRect().height / 2)), duration, onDone);
		};

		/**
   * Changes default settings for this scroller.
   *
   * @param {newDefaultDuration} Optionally a new value for default duration, used for each scroll method by default.
   *        Ignored if null or undefined.
   * @param {newEdgeOffset} Optionally a new value for the edge offset, used by each scroll method by default. Ignored if null or undefined.
   * @returns An object with the current values.
   */
		var setup = function setup(newDefaultDuration, newEdgeOffset) {
			if (newDefaultDuration === 0 || newDefaultDuration) {
				defaultDuration = newDefaultDuration;
			}
			if (newEdgeOffset === 0 || newEdgeOffset) {
				edgeOffset = newEdgeOffset;
			}
			return {
				defaultDuration: defaultDuration,
				edgeOffset: edgeOffset
			};
		};

		return {
			setup: setup,
			to: scrollToElem,
			toY: scrollToY,
			intoView: scrollIntoView,
			center: scrollToCenterOf,
			stop: stopScroll,
			moving: function moving() {
				return !!scrollTimeoutId;
			},
			getY: container.getY,
			getTopOf: container.getTopOf
		};
	};

	var docElem = document.documentElement;
	var getDocY = function getDocY() {
		return window.scrollY || docElem.scrollTop;
	};

	// Create a scroller for the document:
	var zenscroll = makeScroller({
		body: document.scrollingElement || document.body,
		toY: function toY(y) {
			window.scrollTo(0, y);
		},
		getY: getDocY,
		getHeight: function getHeight() {
			return window.innerHeight || docElem.clientHeight;
		},
		getTopOf: function getTopOf(elem) {
			return elem.getBoundingClientRect().top + getDocY() - docElem.offsetTop;
		}
	});

	/**
  * Creates a scroller from the provided container element (e.g., a DIV)
  *
  * @param {scrollContainer} The vertical position within the document.
  * @param {defaultDuration} Optionally a value for default duration, used for each scroll method by default.
  *        Ignored if 0 or null or undefined.
  * @param {edgeOffset} Optionally a value for the edge offset, used by each scroll method by default. 
  *        Ignored if null or undefined.
  * @returns A scroller object, similar to `zenscroll` but controlling the provided element.
  */
	zenscroll.createScroller = function (scrollContainer, defaultDuration, edgeOffset) {
		return makeScroller({
			body: scrollContainer,
			toY: function toY(y) {
				scrollContainer.scrollTop = y;
			},
			getY: function getY() {
				return scrollContainer.scrollTop;
			},
			getHeight: function getHeight() {
				return Math.min(scrollContainer.clientHeight, window.innerHeight || docElem.clientHeight);
			},
			getTopOf: function getTopOf(elem) {
				return elem.offsetTop;
			}
		}, defaultDuration, edgeOffset);
	};

	// Automatic link-smoothing on achors
	// Exclude IE8- or when native is enabled or Zenscroll auto- is disabled
	if ("addEventListener" in window && !window.noZensmooth && !isNativeSmoothScrollEnabledOn(document.body)) {

		var isScrollRestorationSupported = "scrollRestoration" in history;

		// On first load & refresh make sure the browser restores the position first
		if (isScrollRestorationSupported) {
			history.scrollRestoration = "auto";
		}

		window.addEventListener("load", function () {

			if (isScrollRestorationSupported) {
				// Set it to manual
				setTimeout(function () {
					history.scrollRestoration = "manual";
				}, 9);
				window.addEventListener("popstate", function (event) {
					if (event.state && "zenscrollY" in event.state) {
						zenscroll.toY(event.state.zenscrollY);
					}
				}, false);
			}

			// Add edge offset on first load if necessary
			// This may not work on IE (or older computer?) as it requires more timeout, around 100 ms
			if (window.location.hash) {
				setTimeout(function () {
					// Adjustment is only needed if there is an edge offset:
					var edgeOffset = zenscroll.setup().edgeOffset;
					if (edgeOffset) {
						var targetElem = document.getElementById(window.location.href.split("#")[1]);
						if (targetElem) {
							var targetY = Math.max(0, zenscroll.getTopOf(targetElem) - edgeOffset);
							var diff = zenscroll.getY() - targetY;
							// Only do the adjustment if the browser is very close to the element:
							if (0 <= diff && diff < 9) {
								window.scrollTo(0, targetY);
							}
						}
					}
				}, 9);
			}
		}, false);

		// Handling clicks on anchors
		var RE_noZensmooth = new RegExp("(^|\\s)noZensmooth(\\s|$)");
		window.addEventListener("click", function (event) {
			var anchor = event.target;
			while (anchor && anchor.tagName !== "A") {
				anchor = anchor.parentNode;
			}
			// Let the browser handle the click if it wasn't with the primary button, or with some modifier keys:
			if (!anchor || event.which !== 1 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
				return;
			}
			// Save the current scrolling position so it can be used for scroll restoration:
			if (isScrollRestorationSupported) {
				try {
					history.replaceState({ zenscrollY: zenscroll.getY() }, "");
				} catch (e) {
					// Avoid the Chrome Security exception on file protocol, e.g., file://index.html
				}
			}
			// Find the referenced ID:
			var href = anchor.getAttribute("href") || "";
			if (href.indexOf("#") === 0 && !RE_noZensmooth.test(anchor.className)) {
				var targetY = 0;
				var targetElem = document.getElementById(href.substring(1));
				if (href !== "#") {
					if (!targetElem) {
						// Let the browser handle the click if the target ID is not found.
						return;
					}
					targetY = zenscroll.getTopOf(targetElem);
				}
				event.preventDefault();
				// By default trigger the browser's `hashchange` event...
				var onDone = function onDone() {
					window.location = href;
				};
				// ...unless there is an edge offset specified
				var edgeOffset = zenscroll.setup().edgeOffset;
				if (edgeOffset) {
					targetY = Math.max(0, targetY - edgeOffset);
					onDone = function onDone() {
						history.pushState(null, "", href);
					};
				}
				zenscroll.toY(targetY, null, onDone);
			}
		}, false);
	}

	return zenscroll;
});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map