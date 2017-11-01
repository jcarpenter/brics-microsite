export default class Mountains {
  constructor(scene) {

    this.scene = scene;
    this.group = new THREE.Group();
    this.pano = new THREE.Mesh(
      new THREE.SphereBufferGeometry(40, 64, 64),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('images/bg-mountains.jpg'),
        flatShading: true,
        side: THREE.BackSide
      })
    );
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      })
    );
    this.plane.rotation.set(1.57, 0, 0);
    // this.plane.position.set(0, 0.04, 0);
    this.group.add(this.plane);
    this.group.add(this.pano);

    // new TWEEN.Tween(this.plane.rotation)
    //   .to({ x: 2 }, 6000)
    //   // .repeat(Infinity)
    //   .start();

  }

  load() {
    this.scene.add(this.group);
  }

  unload() {
    this.scene.remove(this.group); 
  }
}