/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var ARPrimitives =
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ARPlaneReticle = __webpack_require__(3);

var _ARPlaneReticle2 = _interopRequireDefault(_ARPlaneReticle);

var _ARPlaneReticle3 = __webpack_require__(2);

var _ARPlaneReticle4 = _interopRequireDefault(_ARPlaneReticle3);

var _ARTrackingReticle = __webpack_require__(5);

var _ARTrackingReticle2 = _interopRequireDefault(_ARTrackingReticle);

var _ARTrackingReticle3 = __webpack_require__(4);

var _ARTrackingReticle4 = _interopRequireDefault(_ARTrackingReticle3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2017 Google Inc. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the 'License');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an 'AS IS' BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// How much to increment/decrement opacity values
// in the reticle shaders while transitioning
var TRANSITION_STEP = 0.09;
// How often in milliseconds is the transition function
// executed
var TRANSITION_SPEED = 0;

var createPlaneReticle = function createPlaneReticle(size, color) {
  var geometry = new THREE.PlaneBufferGeometry(size, size);
  var material = new THREE.RawShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(color)
      },
      alpha: {
        value: 0.0
      },
      time: {
        value: 0.0
      }
    },
    vertexShader: _ARPlaneReticle2.default,
    fragmentShader: _ARPlaneReticle4.default,
    transparent: true
  });

  // Orient the geometry so it's position is flat on a horizontal surface
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));

  return new THREE.Mesh(geometry, material);
};

var createTrackingReticle = function createTrackingReticle(size, color) {
  var geometry = new THREE.PlaneBufferGeometry(size, size);
  var material = new THREE.RawShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(color)
      },
      alpha: {
        value: 1.0
      },
      time: {
        value: 0.0
      }
    },
    vertexShader: _ARTrackingReticle2.default,
    fragmentShader: _ARTrackingReticle4.default,
    transparent: true
  });

  // Orient the geometry so it's position is flat on a horizontal surface
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));

  return new THREE.Mesh(geometry, material);
};

/**
 * Class for creating a mesh that fires raycasts and lerps
 * a 3D object along the surface
 */

var ARSpotlight = function (_THREE$Object3D) {
  _inherits(ARSpotlight, _THREE$Object3D);

  /**
   * @param {VRDisplay} vrDisplay
   * @param {number} innerRadius
   * @param {number} outerRadius
   * @param {number} color
   * @param {number} easing
   */
  function ARSpotlight(vrDisplay) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.3125;
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xffffff;
    var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;

    _classCallCheck(this, ARSpotlight);

    //represent the reticle that is shown when a plane is being searched for
    var _this = _possibleConstructorReturn(this, (ARSpotlight.__proto__ || Object.getPrototypeOf(ARSpotlight)).call(this));

    _this._trackingReticle = createTrackingReticle(size, color);
    //represent the reticle that is shown when a plane is found and tracked
    _this._planeReticle = createPlaneReticle(size, color);
    _this._trackingState = false;
    _this._previousTrackingState = false;

    _this.add(_this._trackingReticle);
    _this.add(_this._planeReticle);

    _this.visible = true;

    _this.easing = easing;
    _this.applyOrientation = true;
    _this.vrDisplay = vrDisplay;
    _this.vrFrameData = new VRFrameData();
    _this._planeDir = new THREE.Vector3();
    _this.startTime = Date.now();
    return _this;
  }

  /**
   * Attempt to fire a raycast from normalized screen coordinates
   * x and y and lerp the reticle to the position.
   *
   * @param {number} x
   * @param {number} y
   */


  _createClass(ARSpotlight, [{
    key: "update",
    value: function update() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

      if (!this.vrDisplay || !this.vrDisplay.hitTest) {
        return;
      }

      this.vrDisplay.getFrameData(this.vrFrameData);
      // // Fetch the pose data from the current frame
      var pose = this.vrFrameData.pose;
      var poseOrientation = pose.orientation;
      var posePosition = pose.position;

      // Convert the pose orientation and position into
      // THREE.Quaternion and THREE.Vector3 respectively
      var ori = new THREE.Quaternion(poseOrientation[0], poseOrientation[1], poseOrientation[2], poseOrientation[3]);
      var pos = new THREE.Vector3(posePosition[0], posePosition[1], posePosition[2]);

      var dirMtx = new THREE.Matrix4();
      dirMtx.makeRotationFromQuaternion(ori);
      var push = new THREE.Vector3(0, 0, -1.0);
      push.transformDirection(dirMtx);
      pos.addScaledVector(push, 0.75);
      // Clone our cube object and place it at the camera's
      // current position
      this._trackingReticle.position.copy(pos);

      var hit = this.vrDisplay.hitTest(x, y);
      if (hit && hit.length > 0) {
        this._trackingState = true;
        THREE.ARUtils.placeObjectAtHit(this._planeReticle, hit[0], this.applyOrientation, this.easing);
      } else {
        this._trackingState = false;
      }

      if (this._trackingState !== this._previousTrackingState) {
        this._transition(this._trackingState);
      }

      this._previousTrackingState = this._trackingState;

      var elapsedMilliseconds = Date.now() - this.startTime;
      var elapsedSeconds = elapsedMilliseconds / 1000;
      this._trackingReticle.material.uniforms.time.value = elapsedSeconds;
      this._planeReticle.material.uniforms.time.value = elapsedSeconds;
    }

    /**
     * Trigger a transition between the two reticles.
     *
     * @param {boolean} isTracked
     */

  }, {
    key: "_transition",
    value: function _transition(isTracked) {
      var _this2 = this;

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      // Start transition
      this._interval = setInterval(function () {
        // Tween towards the desired state of opacity between the
        // tracking and plane reticle
        if (isTracked) {
          if (_this2._trackingReticle.material.uniforms.alpha.value > 0) {
            _this2._trackingReticle.material.uniforms.alpha.value -= TRANSITION_STEP;
          }
          if (_this2._planeReticle.material.uniforms.alpha.value < 1) {
            _this2._planeReticle.material.uniforms.alpha.value += TRANSITION_STEP;
          }
        } else {
          if (_this2._trackingReticle.material.uniforms.alpha.value < 1) {
            _this2._trackingReticle.material.uniforms.alpha.value += TRANSITION_STEP;
          }
          if (_this2._planeReticle.material.uniforms.alpha.value > 0) {
            _this2._planeReticle.material.uniforms.alpha.value -= TRANSITION_STEP;
          }
        }

        // If we've reached our end state, shut off the timer
        if (_this2._planeReticle.material.uniforms.alpha.value === (isTracked ? 1 : 0) && _this2._trackingReticle.material.uniforms.alpha.value === (isTracked ? 0 : 1)) {
          if (_this2._interval) {
            clearInterval(_this2._interval);
            _this2._interval = null;
          }
        }
      }, TRANSITION_SPEED);
    }
  }]);

  return ARSpotlight;
}(THREE.Object3D);

exports.default = ARSpotlight;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ARSpotlight = __webpack_require__(0);

var _ARSpotlight2 = _interopRequireDefault(_ARSpotlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO figure out how to export via es6 without needing
// `ARPrimitives.default` in script bundle
module.exports = { ARSpotlight: _ARSpotlight2.default }; /*
                                                          * Copyright 2017 Google Inc. All Rights Reserved.
                                                          * Licensed under the Apache License, Version 2.0 (the 'License');
                                                          * you may not use this file except in compliance with the License.
                                                          * You may obtain a copy of the License at
                                                          *
                                                          *     http://www.apache.org/licenses/LICENSE-2.0
                                                          *
                                                          * Unless required by applicable law or agreed to in writing, software
                                                          * distributed under the License is distributed on an 'AS IS' BASIS,
                                                          * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                          * See the License for the specific language governing permissions and
                                                          * limitations under the License.
                                                          */

/* eslint no-unused-vars: "off" */

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nprecision highp float;\nprecision mediump int;\n#define GLSLIFY 1\n\nuniform vec3 color;\nuniform float alpha;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\nfloat Circle( vec2 pos, float radius ) {\n  return length( pos ) - radius;\n}\n\nvoid main() {\n  //Transform texture coordinates to (-1, 1)\n  vec2 uv = vUv * 2.0 - 1.0;\n\n  //Create Spotlight Effect\n  float spot = Circle( uv, 0.5 );\n  spot = smoothstep( 0.1, 0.0, spot );\n\n  //Repeat Space\n  float interval = 0.11;\n  vec2 uvp = mod( vPosition.xz / interval, 2.0 * interval ) - interval;\n\n  float circles = Circle( uvp, 0.025 );\n  circles = smoothstep( 0.01, 0.00, circles );\n\n  gl_FragColor = vec4( color, circles * spot * alpha);\n}\n"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nprecision highp float;\nprecision mediump int;\n#define GLSLIFY 1\n\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\n\nattribute vec3 position;\nattribute vec2 uv;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\nvoid main() {\n  vec4 pos = modelMatrix * vec4(position, 1.0);\n  vPosition = pos.xyz;\n  vUv = uv;\n  gl_Position = projectionMatrix * viewMatrix * pos;\n}\n"

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nprecision highp float;\nprecision mediump int;\n#define GLSLIFY 1\n\nuniform vec3 color;\nuniform float alpha;\nuniform float time;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\n#define PI 3.141592920\n#define TWO_PI 6.2831853072\n\nfloat Circle( vec2 pos, float radius ) {\n  return length( pos ) - radius;\n}\n\nvec2 rotate(vec2 v, float a) {\n  float s = sin(a);\n  float c = cos(a);\n  mat2 m = mat2(c, -s, s, c);\n  return m * v;\n}\n\nvec2 modPolar( vec2 pos, float divisions ) {\n  float angleInc = TWO_PI / divisions;\n  float angleIncHalf = angleInc / 2.0;\n  float angle = atan( pos.y, pos.x ) + angleIncHalf;\n  float radius = length( pos );\n  angle = mod( angle, angleInc ) - angleIncHalf;\n  return radius * vec2( cos( angle ), sin( angle ) );\n}\n\nvoid main() {\n  //Transform texture coordinates to (-1, 1)\n  vec2 uv = vUv * 2.0 - 1.0;\n\n  //Create Spotlight Effect\n  float spot = Circle( uv, 0.5 );\n  spot = smoothstep( 0.2, 0.0, spot );\n\n  //Repeat Space\n  float interval = 0.11;\n  vec2 uvp = modPolar( rotate( uv, time * 2.0 ), 10.0 );\n\n  float circles = Circle( uvp - vec2( 0.5, 0.0 ), 0.0175 );\n  circles = smoothstep( 0.01, 0.00, circles );\n\n  gl_FragColor = vec4( color, circles * spot * alpha );\n}\n"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "// Copyright 2017 Google Inc. All Rights Reserved.\n// Licensed under the Apache License, Version 2.0 (the 'License');\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n// http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an 'AS IS' BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nprecision highp float;\nprecision mediump int;\n#define GLSLIFY 1\n\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\n\nattribute vec3 position;\nattribute vec2 uv;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\nvoid main() {\n  vec4 pos = modelMatrix * vec4(position, 1.0);\n  vPosition = pos.xyz;\n  vUv = uv;\n  gl_Position = projectionMatrix * viewMatrix * pos;\n}\n"

/***/ })
/******/ ]);