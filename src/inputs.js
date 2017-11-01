import bus from './bus';

export default class Inputs {
  constructor() {
    
    window.addEventListener('keydown', function(e){
      if(!e.metaKey) {
        switch (e.keyCode) {
          case 49: { // 1
            bus.emit('startAR');
            handled = true;
            break;
          }
          case 50: { // 2
            bus.emit('startMobile');
            handled = true;
            break;
          }
          case 51: { // 3 —— Magic window
            bus.emit('startMagicWindow');
            handled = true;
            break;
          }
          case 52: { // 4
            // pairObject(testSphere);
            handled = true;
            break;
          }
          case 53: { // 5
            // expand();
            // decoupleObject(testSphere);
            handled = true;
            break;
          }
          case 54: { // 6
            // collapse();
            // decoupleObject(testSphere);
            handled = true;
            break;
          }
        }

        // if (handled) e.preventDefault();
      }
    })
  }
}