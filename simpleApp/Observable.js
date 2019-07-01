class Observable {
    
    constructor (){
        this.observers = {};
    }

    subscribe(key, observer){
        if(!this.observers[key]) this.observers[key] = [];
        this.observers[key].push(observer);
    }
    unsubscribe(key, observer){
        //TODO: Add ipmlementation
    }

    notify(key, data){
        this.observers[key].forEach(observer => observer(data));
    }
}

export default Observable;