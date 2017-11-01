import bus from './bus';
import Mountains from './environments/mountains';
import Gray from './environments/gray';
import Transparent from './environments/transparent';

export default class Environments {
  constructor(scene) {

    // Setup variables
    this.activeEnvironment;
    this.activeButton;

    // Setup environments
    this.gray = new Gray(scene);
    this.mountains = new Mountains(scene);
    this.transparent = new Transparent(scene);

    // Setup buttons
    this.background1Button = document.querySelector('#background-1');
    this.background2Button = document.querySelector('#background-2');
    this.background3Button = document.querySelector('#background-3');

    this.background1Button.addEventListener('click', () => this.load(this.background1Button, this.mountains));
    this.background2Button.addEventListener('click', () => this.load(this.background2Button, this.gray));
    this.background3Button.addEventListener('click', () => this.load(this.background3Button, this.transparent));

    // Setup event listeners
    bus.on('pageLoad', () => this.onPageLoad());
    bus.on('enterAR', () => this.load(this.background3Button, this.transparent));
    bus.on('exitAR', () => this.load(this.background1Button, this.mountains));
  }

  onPageLoad() {
    this.load(this.background1Button, this.mountains);
  }

  load(pressedButton, targetEnvironment) {
    
    // Check if targetEnvironment is different from active one...
    if (this.activeEnvironment !== targetEnvironment) { 

      // Update environment
      if(this.activeEnvironment) this.activeEnvironment.unload(); // If there is an activeEnvironment, unload it. Else do nothing
      targetEnvironment.load();
      this.activeEnvironment = targetEnvironment;

      // Update buttons
      if(this.activeButton) this.activeButton.classList.remove('active'); // If there is an activeButton, remove active class. Else do nothing
      pressedButton.classList.add('active');
      this.activeButton = pressedButton;
    } 
  }
}
