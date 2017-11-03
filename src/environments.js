import bus from './bus';
import Mountains from './environments/mountains';
import Gray from './environments/gray';
import Transparent from './environments/transparent';

export default class Environments {
  constructor(scene) {

    // Setup variables
    this.activeEnvironment;

    // Setup environments
    this.gray = new Gray(scene);
    this.transparent = new Transparent(scene);

    // Setup event listeners
    bus.on('pageLoad', () => this.onPageLoad());
    bus.on('enterAR', () => this.load(this.transparent));
    bus.on('exitAR', () => this.load(this.gray));
  }

  onPageLoad() {
    this.load(this.gray);
  }

  load(targetEnvironment) {
    
    // Check if targetEnvironment is different from active one...
    if (this.activeEnvironment !== targetEnvironment) { 

      // Update environment
      if(this.activeEnvironment) this.activeEnvironment.unload(); // If there is an activeEnvironment, unload it. Else do nothing
      targetEnvironment.load();
      this.activeEnvironment = targetEnvironment;
    } 
  }
}
