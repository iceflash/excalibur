class Observable {
    
    constructor (){
        this.observers = {};
    }

    subscribe(key, observer){
        if(!this.observers[key]) this.observers[key] = [];
        if(!this.observers[key].includes(observer)) this.observers[key].push(observer);
    }
    unsubscribe(key, observer){
        //TODO: Add ipmlementation
    }

    notify(key, data){
        console.log('[observable]', key, data, this.observers)
        this.observers[key].forEach(observer => observer(data));
    }
}

export default Observable;