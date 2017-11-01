export default class RendererCSS {
  constructor(container) {
    
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