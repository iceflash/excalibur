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

    this.routerView = {};
    this.routes = {};
   
    this.makeReactive(this.data);

    //make load hook
    window.addEventListener('load', onLoadinit.bind(this));

    function onLoadinit(){
      console.log('[app]','init on load');

      //init router
      //1. set event listners
      window.addEventListener('hashchange', (event) => {
        
        this.routerView = document.querySelectorAll(`router-view`)[0];
        // get hash
        let path = Array.from(window.location.hash);
        if(path.length === 0) {
          path = '/';
        } else {
          path.splice(0,1);
          path = path.join('');
        }

        console.log('[hash]', this.routes[path]);

        // this.routerView.innerHTML = this.routes[path].render(this.routerView);
        this.routes[path].render(this.routerView);
        this.bindData();
      });

      window.location.hash = '#/';

      console.log('[app-end init]',this.data);
    }
  }
  

  bindData(){

    this.observers = {};

    //find which elements need to be reactive
    const dataEl = document.querySelectorAll(`[data-v]`);
    dataEl.forEach((vel) => {
      //subscribe for changes
      this.subscribe(vel.attributes['data-v'].value, (data) => {
        vel.textContent = data;
      });
      //set input listner (default)
      vel.addEventListener('input', (e) => {
        this.data[vel.attributes['data-v'].value] = vel.value;
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

  setRoutes(routes){

  }

  updateView(){
  }

  routerNav(path){
    
  }

}

export default App;