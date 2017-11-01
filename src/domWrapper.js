import bus from './bus';

export default class DomWrapper {
  constructor(container) {

    this.container = container;
    this.expanded = false; // variable for tracking expanded or collapsed states
    this.domWrapperScrollTop; // used to capture domWrapper scrollTop value at time of expand(), so we can go back to that value on collapse().

    // create a wrapper element
    this.domWrapper = document.createElement('div');
    this.domWrapper.id = 'domWrapper';
    this.domWrapper.style.width = '100%';
    this.domWrapper.style.height = '100vh';
    this.domWrapper.style.overflow = 'scroll';
    this.domWrapper.style.WebkitOverflowScrolling = 'touch';
    this.domWrapper.style.padding = '0';
    this.domWrapper.style.margin = '0';
    document.body.appendChild(this.domWrapper);

    // move page elements into the wrapper element
    let elements = [];

    for(var i = 0; i < document.body.children.length; i++) {
      let el = document.body.children[i];
      if (el.tagName !== 'SCRIPT' && el.id !== 'domWrapper') elements.push(el);
    }

    elements.forEach(function(el){
      this.domWrapper.appendChild(el);
    }.bind(this));

    // add event listeners

    bus.on('startMobile', () => {
      
      // enable scrolling
      this.domWrapper.style.overflow = 'scroll';

      // scroll window back to position it was in before AR mode started.
      this.domWrapper.scroll({
        top: this.domWrapperScrollTop,
        left: 0, 
        behavior: 'smooth' 
      });
    })

    bus.on('startAR', () => {
      
      // store domWrapper vertical scroll offset. We'll return to it later
      this.domWrapperScrollTop = this.domWrapper.scrollTop;
      
      // scroll window until container is flush with top of screen
      this.domWrapper.scroll({
        top: this.container.offsetTop, 
        left: 0, 
        behavior: 'smooth' 
      });

      // wait until scroll has completed, then disable scrolling
      window.setTimeout(function(){
        document.body.style.overflow = 'hidden';
        this.domWrapper.style.overflow = 'hidden';
      }, 400)
    })

    // return domWrapper element
    return this.domWrapper;
  }
}
