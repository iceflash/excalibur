import Observable from './Observable';

/**
 * Application class
 * 
 */
class App extends Observable{

  constructor (){  
    
    super();
    //app data (will be reactive)
    this.data = {
      field: '',
    };
   
    this.makeReactive(this.data);

    //make load hook
    window.addEventListener('load', onLoadinit.bind(this));

    function onLoadinit(){
      console.log('[app]','init on load');
      this.bindData();
      console.log('[app]',this.data);
    }
  }
  

  bindData(){
    //find which elements need to be reactive
    const dataEl = document.querySelectorAll(`[data-v]`);
    dataEl.forEach((vel) => {
      //subscribe for changes
      this.subscribe(vel.attributes['data-v'].value, (data) => {
        vel.textContent = data;
      });
    });
  }

  /**
   * 
   */
  makeReactive(obj) {
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let v = obj[key];
        //set setter & getters, on change emmits event
        const that = this;
        Object.defineProperty(obj, key, {
          get() {return v},
          set(newV) { 
            v = newV;
            // console.log('[set]',key);
            that.notify(key, newV);
          }
        })
      }
    }
  }

  updateView(){
  }

}

export default App;