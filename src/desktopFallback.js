export default class DesktopFallback {
  constructor(scene, camera) {
    
    this.camera = camera;

    const GRID_SIZE = 6;
    const GRID_DIVISIONS = 12;
    const LIGHT = 0xCCCCCC;
    const MEDIUM = 0x999999;
    const DARK = 0x666666;

    const geometry = new THREE.SphereGeometry(50, 64, 64);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    
    const material = new THREE.MeshBasicMaterial({
      flatShading: true,
      map: new THREE.TextureLoader().load('images/bg-gray.jpg')
    });
    
    const environment = new THREE.Mesh(geometry, material);
    scene.add(environment);

    const grid = new THREE.Group();
    const floor = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, MEDIUM, MEDIUM);
    const floorOutline = new THREE.GridHelper(GRID_SIZE - 0.001, 1, DARK, DARK);
    const wallBack = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, LIGHT, LIGHT);
    const wallLeft = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, LIGHT, LIGHT);
    const wallRight = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, LIGHT, LIGHT);

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

  animateCameraForwardBack() {

    let rotate = new TWEEN.Tween(this.camera.rotation)
      .to({
        x: [-10 * THREE.Math.DEG2RAD, 5 * THREE.Math.DEG2RAD, 0], 
        y: [-30 * THREE.Math.DEG2RAD, 30 * THREE.Math.DEG2RAD, 0], 
        z: [-15 * THREE.Math.DEG2RAD, 15 * THREE.Math.DEG2RAD, 0]
      }, 5000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .interpolation(TWEEN.Interpolation.Bezier)
      .start();

    let walk = new TWEEN.Tween(this.camera.position)
      .to({x:[-1, 1, 0], y:[1.5, 1.7, 1.5], z:[2, 3.5, 4]}, 5000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .interpolation(TWEEN.Interpolation.Bezier)
      .start();
  }

  animateCameraSideToSide() {

    // let rotate = new TWEEN.Tween(this.camera.rotation)
    //   .to({
    //     y: [-45 * THREE.Math.DEG2RAD, 45 * THREE.Math.DEG2RAD, 0]
    //   }, 5000)
    //   .repeat(Infinity)
    //   .easing(TWEEN.Easing.Quadratic.InOut)
    //   .interpolation(TWEEN.Interpolation.Bezier)
    //   .start();

    this.camera.position.y = 1;

    let walk = new TWEEN.Tween(this.camera.position)
      .to({x:[-2, 2, 0]}, 10000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .interpolation(TWEEN.Interpolation.Bezier)
      .start();
  }

  animateCameraSpinAround() {

    this.camera.rotateX(30 * THREE.Math.DEG2RAD);
    this.camera.rotateY(180 * THREE.Math.DEG2RAD);
    this.camera.rotateZ(30 * THREE.Math.DEG2RAD);

    new TWEEN.Tween(this.camera.rotation)
      .to({
        // x: -45 * THREE.Math.DEG2RAD,
        y: -90 * THREE.Math.DEG2RAD
      }, 5000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }
}