export default class Gray {
  constructor(scene) {

    this.scene = scene;
    this.group = new THREE.Group();
    this.pano = new THREE.Mesh(
      new THREE.SphereBufferGeometry(40, 64, 64),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('images/bg-gray.jpg'),
        flatShading: true,
        side: THREE.BackSide
      })
    );
    this.group.add(this.pano)

  }

  load() {
    this.scene.add(this.group);
  }

  unload() {
    this.scene.remove(this.group); 
  }
}