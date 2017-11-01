export default class RendererGL {
  constructor(container) {
    
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({alpha: true});
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

    document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
    window.addEventListener('resize', () => this.updateSize(), false);
  }

  updateSize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera)
  }
}
