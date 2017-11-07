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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(1);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
  window.app = new _app2.default();
}

window.onload = function () {
  init();
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import Config from './config';
// import DesktopFallback from './desktopFallback';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import RendererCSS from './rendererCSS';
// import Inputs from './inputs';
// import DomWrapper from './domWrapper';
// import Environments from './environments';
// import { getCameraPosition, getCameraOrientation } from './utilities';


var _bus = __webpack_require__(2);

var _bus2 = _interopRequireDefault(_bus);

var _rendererGL = __webpack_require__(4);

var _rendererGL2 = _interopRequireDefault(_rendererGL);

var _zenscroll = __webpack_require__(5);

var _zenscroll2 = _interopRequireDefault(_zenscroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App() {
    var _this = this;

    _classCallCheck(this, App);

    this.activeCamera;
    this.arCamera;
    this.arView;
    this.container;
    // this.cssCamera;
    this.currentMode;
    this.deviceType;
    this.viewer;
    this.orbitControls;
    this.PERSP_CAMERA_FOV = 15;
    this.PERSP_CAMERA_ISO_TARGET = new THREE.Vector3(0, 1, 0);
    this.perspCamera;
    this.render = this.render.bind(this);
    this.scrollOffset;
    this.scrollTarget;
    this.ENTER_EXIT_TRANSITION_DURATION = 800;
    this.viewerOffsetFromTop;
    this.viewerPlaceholder;
    this.vrControls;
    this.vrDisplay;
    this.vrFrameData;

    // Check for AR displays
    THREE.ARUtils.getARDisplay().then(function (display) {
      _this.vrDisplay = display;
      _this.init();
    });
  }

  _createClass(App, [{
    key: 'init',
    value: function init() {

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
  }, {
    key: 'createScene',
    value: function createScene() {
      var _this2 = this;

      // Create container elements
      this.container = document.querySelector("#container");
      this.viewer = document.querySelector("#viewer");
      this.splash = document.querySelector("#splash");

      // Setup scene and renderers
      this.scene = new THREE.Scene();
      this.rendererGL = new _rendererGL2.default(this.container);
      // this.rendererCSS = new RendererCSS(this.container);

      // Set `pointer-events` to none so we can appropriately receive events.
      // this.rendererGL.renderer.domElement.style.pointerEvents = 'auto';
      // this.rendererCSS.renderer.domElement.style.pointerEvents = 'none';
      this.rendererGL.renderer.domElement.addEventListener('click', function () {
        return _this2.onCanvasClick();
      }, true);

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
      this.enterButton.addEventListener('click', function () {
        return _this2.enter();
      });

      this.exitButton = document.querySelector('#exitButton');
      this.exitButton.addEventListener('click', function () {
        return _this2.exit();
      });

      // window.addEventListener('resize', e => this.onWindowResize(e), false);
      document.addEventListener('touchmove', function (e) {
        return _this2.onTouchMove(e);
      }, { passive: false });
      // bus.on('enterAR', () => this.enterAR());
      // bus.on('exitAR', () => this.exit());
    }
  }, {
    key: 'setDeviceType',
    value: function setDeviceType(type) {
      this.deviceType = type;
      console.log(this.deviceType);
    }
  }, {
    key: 'isARDevice',
    value: function isARDevice() {
      if (this.vrDisplay) return true;
    }
  }, {
    key: 'isMobileDevice',
    value: function isMobileDevice() {
      // Taken from https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
      return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1;
    }
  }, {
    key: 'hideElement',
    value: function hideElement(element) {
      element.classList.add("hidden");
    }
  }, {
    key: 'showElement',
    value: function showElement(element) {
      element.classList.remove("hidden");
    }
  }, {
    key: 'getContainerSize',
    value: function getContainerSize() {

      var w = window.getComputedStyle(this.container).getPropertyValue('width').split("px")[0];
      var h = window.getComputedStyle(this.container).getPropertyValue('height').split("px")[0];

      return {
        width: w,
        height: h
      };
    }
  }, {
    key: 'setActiveCamera',
    value: function setActiveCamera(cam) {
      this.activeCamera = cam;
    }
  }, {
    key: 'updateCameraAndCanvas',
    value: function updateCameraAndCanvas() {
      var _this3 = this;

      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;


      new TWEEN.Tween({ placeholder: 0 }).to({ placeholder: 0 }, duration).onUpdate(function () {
        _this3.rendererGL.updateSize();
        _this3.perspCamera.aspect = _this3.getContainerSize().width / _this3.getContainerSize().height;
        _this3.perspCamera.updateProjectionMatrix();
      }).start();
    }
  }, {
    key: 'createArCameras',
    value: function createArCameras() {
      var _this4 = this;

      this.vrFrameData = new VRFrameData();

      this.arCamera = new THREE.ARPerspectiveCamera(this.vrDisplay, 60, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);

      this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV - 5, window.innerWidth / window.innerHeight, this.vrDisplay.depthNear, this.vrDisplay.depthFar);
      this.perspCamera.position.set(12, 12, 12);
      this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

      window.addEventListener('resize', function () {
        _this4.updateCameraAndCanvas(0);
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
  }, {
    key: 'createMobileCamera',
    value: function createMobileCamera() {
      var _this5 = this;

      this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV, this.getContainerSize().width / this.getContainerSize().height, 0.1, 100);
      this.perspCamera.position.set(12, 12, 12);
      this.perspCamera.lookAt(this.PERSP_CAMERA_ISO_TARGET);

      window.addEventListener('resize', function () {
        _this5.updateCameraAndCanvas(0);
      });
    }
  }, {
    key: 'createDesktopCamera',
    value: function createDesktopCamera() {
      var _this6 = this;

      this.perspCamera = new THREE.PerspectiveCamera(this.PERSP_CAMERA_FOV, this.getContainerSize().width / this.getContainerSize().height, 0.1, 100);
      this.perspCamera.position.set(12, 12, 12);
      this.orbitControls = new THREE.OrbitControls(this.perspCamera, this.rendererGL.renderer.domElement);
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

      window.addEventListener('resize', function () {
        _this6.updateCameraAndCanvas(0);
      });
    }
  }, {
    key: 'createModel',
    value: function createModel() {

      this.model;
      this.loadingManager = new THREE.LoadingManager();
      this.loader = new THREE.ColladaLoader(this.loadingManager);
      this.loader.load('models/jeep.dae', function (collada) {

        this.createGrid();

        // Set all materials to DoubleSide, to compensate for flipped normals in the original model
        collada.scene.traverse(function (node) {
          if (node.material) {
            node.material.side = THREE.DoubleSide;
          }
        });

        this.model = collada.scene;
        this.scene.add(this.model);

        // Fire pageLoad once model is ready
        _bus2.default.emit('pageLoad');
      }.bind(this));
    }
  }, {
    key: 'createLights',
    value: function createLights() {
      this.light = new THREE.HemisphereLight(0xF5F5F5, 0x1F1F1F, 1.3);
      this.scene.add(this.light);
    }
  }, {
    key: 'createGrid',
    value: function createGrid() {
      var GRID_SIZE = 5;
      var GRID_DIVISIONS = 10;
      var MEDIUM = 0xBABABA;
      this.grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, MEDIUM, MEDIUM);
      this.scene.add(this.grid);
    }
  }, {
    key: 'createEnvironments',
    value: function createEnvironments() {
      this.environments = new Environments(this.scene);
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
    key: 'hideModel',
    value: function hideModel() {
      // new TWEEN.Tween(this.model.material)
      //   .to({ opacity: 0 }, 1000)
      //   .start();
      this.model.visible = false;
    }
  }, {
    key: 'enter',
    value: function enter() {
      if (this.deviceType === 'ar') {
        this.enterAR();
      } else if (this.deviceType === 'mobile' || this.deviceType === 'desktop') {
        this.enterFullscreen();
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      if (this.currentMode === 'ar') {
        this.exitAR();
      } else if (this.currentMode === 'fullscreen') {
        this.exitFullscreen();
      }
    }
  }, {
    key: 'enterFullscreen',
    value: function enterFullscreen() {

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
      this.viewer.parentElement.insertBefore(this.viewerPlaceholder, this.viewer);

      // Prevent page scrolling by setting overflow and hidden values on documentElement
      document.documentElement.style.overflowY = 'hidden';
      document.documentElement.style.height = '100vh';

      // Setting these three values "pops" the viewer out of the page flow without the user noticing.
      // The key is setting "top" value to equal the viewer's Y position relative to viewport top, then setting position absolute.
      this.viewer.style.position = 'absolute';

      // Tweens the canvas and camera aspect ratio to match the new container size
      this.updateCameraAndCanvas();

      var transition = this.viewer.animate([{ top: String(this.viewerOffsetFromTop + 'px') }, { top: String(window.scrollY + 'px') }], {
        duration: this.ENTER_EXIT_TRANSITION_DURATION,
        easing: 'ease'
      });

      transition.addEventListener('finish', function () {
        this.viewer.style.top = String(window.scrollY + 'px');
      }.bind(this));

      // The following classes animate the viewport and other elements into position
      this.viewer.classList.add('fullscreen');
      this.container.classList.add('fullscreen');
      this.enterButton.classList.add('fullscreen');
    }
  }, {
    key: 'exitFullscreen',
    value: function exitFullscreen() {

      this.exitButton.classList.add("hidden");
      this.currentMode = '2d';

      // Re-enable page scrolling by removing height and overflow styles on document.documenElement
      document.documentElement.removeAttribute('style');

      var viewerCurrentPosition = window.getComputedStyle(this.viewer).getPropertyValue('top');

      // Remove the following classes to animate the viewport and other elements back to their standard positions
      this.viewer.classList.remove('fullscreen');
      this.container.classList.remove('fullscreen');
      this.enterButton.classList.remove('fullscreen');

      // Tweens the canvas and camera aspect ratio to match the new container size
      this.updateCameraAndCanvas();

      var transition = this.viewer.animate([{ top: viewerCurrentPosition }, { top: String(this.viewerOffsetFromTop + 'px') }], {
        duration: this.ENTER_EXIT_TRANSITION_DURATION,
        easing: 'ease'
      });

      transition.addEventListener('finish', function () {
        this.viewerPlaceholder.remove();
        this.viewer.style.position = 'relative';
        this.viewer.style.top = 0;
        // this.viewer.removeAttribute('style');
      }.bind(this));
    }
  }, {
    key: 'enterAR',
    value: function enterAR() {

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
      this.viewer.parentElement.insertBefore(this.viewerPlaceholder, this.viewer);

      // Prevent page scrolling by setting overflow and hidden values on documentElement
      document.documentElement.style.overflowY = 'hidden';
      document.documentElement.style.height = '100vh';

      // Setting these three values "pops" the viewer out of the page flow without the user noticing.
      // The key is setting "top" value to equal the viewer's Y position relative to viewport top, then setting position absolute.
      this.viewer.style.position = 'absolute';

      // Tweens the canvas and camera aspect ratio to match the new container size
      this.updateCameraAndCanvas();

      var transition = this.viewer.animate([{ top: String(this.viewerOffsetFromTop + 'px') }, { top: String(window.scrollY + 'px') }], {
        duration: this.ENTER_EXIT_TRANSITION_DURATION,
        easing: 'ease'
      });

      transition.addEventListener('finish', function () {
        this.viewer.style.top = String(window.scrollY + 'px');
        this.currentMode = 'ar';
        this.hideModel();
        this.scene.add(this.reticle);
        this.setActiveCamera(this.arCamera);
        this.grid.visible = false;
      }.bind(this));

      // The following classes animate the viewport and other elements into position
      this.splash.classList.add('fullscreen');
      this.viewer.classList.add('fullscreen');
      this.container.classList.add('fullscreen');
      this.enterButton.classList.add('fullscreen');
    }
  }, {
    key: 'exitAR',
    value: function exitAR() {

      this.exitButton.classList.add("hidden");
      this.currentMode = '2d';

      // Re-enable page scrolling by removing height and overflow styles on document.documenElement
      document.documentElement.removeAttribute('style');

      var viewerCurrentPosition = window.getComputedStyle(this.viewer).getPropertyValue('top');

      // Remove the following classes to animate the viewport and other elements back to their standard positions
      this.splash.classList.remove('fullscreen');
      this.viewer.classList.remove('fullscreen');
      this.container.classList.remove('fullscreen');
      this.enterButton.classList.remove('fullscreen');

      // Tween the canvas and camera aspect ratio to match the new container size
      this.updateCameraAndCanvas();

      var transition = this.viewer.animate([{ top: viewerCurrentPosition }, { top: String(this.viewerOffsetFromTop + 'px') }], {
        duration: this.ENTER_EXIT_TRANSITION_DURATION,
        easing: 'ease'
      });

      transition.addEventListener('finish', function () {
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
  }, {
    key: 'onCanvasClick',
    value: function onCanvasClick() {

      if (this.vrDisplay && this.vrDisplay.hitTest && this.currentMode === 'ar') {
        var hits = this.vrDisplay.hitTest(0.5, 0.5);
        if (hits && hits.length) {
          var hit = hits[0];
          THREE.ARUtils.placeObjectAtHit(this.scene, hit, true, 1);
          // Show model immediately if not already present
          // this.model.material.opacity = 1;
          this.showModel();
        }
      }
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      if (this.currentMode === 'ar') {
        e.preventDefault();
      }
    }
  }, {
    key: 'requestAnimationFrame',
    value: function (_requestAnimationFrame) {
      function requestAnimationFrame(_x) {
        return _requestAnimationFrame.apply(this, arguments);
      }

      requestAnimationFrame.toString = function () {
        return _requestAnimationFrame.toString();
      };

      return requestAnimationFrame;
    }(function (cb) {
      return this.vrDisplay ? this.vrDisplay.requestAnimationFrame(cb) : requestAnimationFrame(cb);
    })
  }, {
    key: 'render',
    value: function render() {

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
      } else if (this.deviceType == 'mobile') {} else if (this.deviceType == 'desktop') {
        this.orbitControls.update();
      }

      this.perspCamera.updateMatrix();
      this.rendererGL.render(this.scene, this.activeCamera);
      // this.rendererCSS.render(this.scene, this.activeCamera);
      this.requestAnimationFrame(this.render);
    }

    /*======== OLD ========= */

    // Not currently used, and can potentially be deleted

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
    key: 'animatePerspCameraPosition',
    value: function animatePerspCameraPosition(pos, target, onComplete) {
      var _this7 = this;

      new TWEEN.Tween(this.perspCamera.position).to(pos, 1000).onUpdate(function () {
        return target && _this7.perspCamera.lookAt(target);
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
      var _this8 = this;

      new TWEEN.Tween(this.perspCamera).to({ fov: fov }, 1000).onUpdate(function () {
        return _this8.perspCamera.updateProjectionMatrix();
      }).easing(TWEEN.Easing.Quadratic.InOut).start();
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


  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EventEmitter = __webpack_require__(3).EventEmitter;

exports.default = new EventEmitter();

/***/ }),
/* 3 */
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
/* 4 */
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
    this.renderer.domElement.style.left = '50%';
    this.renderer.domElement.style.top = '50%';
    this.renderer.autoClear = false;
    this.renderer.domElement.style.transform = 'translate(-50%, -50%)';
    // this.renderer.domElement.style.border = '6px solid yellow';
    // this.renderer.domElement.style.boxSizing = 'border-box';
    // this.renderer.domElement.style.pointerEvents = 'none';
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

      var w = window.getComputedStyle(this.container).getPropertyValue('width').split("px")[0];
      var h = window.getComputedStyle(this.container).getPropertyValue('height').split("px")[0];
      this.renderer.setSize(w, h);
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
/* 5 */
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