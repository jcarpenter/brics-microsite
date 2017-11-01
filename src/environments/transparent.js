export default class Transparent {
  constructor(scene) {

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

  load() {
    this.scene.add(this.group);
    // document.html.style.backgroundColor = 'rgba(255, 255, 255, 0)';
  }

  unload() {
    this.scene.remove(this.group);
    // document.body.style.backgroundColor = 'white';
  }
}