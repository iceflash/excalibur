const View = {
    
    render: function(element){

        const res = `<h1>about route</h1>`;
        element.innerHTML = res;
        return res;
    },

    destroy: () =>{},
}

export default View;